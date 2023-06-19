# Cluster: Cluster-Wide Transactions
---

{NOTE: }

* Cluster transactions are a way to ensure that certain operations will favor consistency over availability in the CAP theorem.  
* Code examples and client API can be found [here](../../client-api/session/saving-changes#transaction-mode---cluster-wide).

* In this page:
  * [Why Cluster Wide Transactions](../../server/clustering/cluster-transactions#why-cluster-wide-transactions)
  * [How Cluster Transactions Work](../../server/clustering/cluster-transactions#how-cluster-transactions-work) described by the flow of a cluster transaction request example.
  * [Cluster Transactions Properties](../../server/clustering/cluster-transactions#cluster-transactions-properties)
  * [Concurrent Cluster Wide and Single-Node Transactions](../../server/clustering/cluster-transactions#concurrent-cluster-wide-and-single-node-transactions)
  * [Failure Modes in Cluster Wide Transactions](../../server/clustering/cluster-transactions#failure-modes-in-cluster-wide-transactions)
  * [Debug Cluster Wide Transactions](../../server/clustering/cluster-transactions#debug-cluster-wide-transactions)

{NOTE/}

---

{PANEL: Why Cluster Wide Transactions}

Usually, RavenDB uses the multi-master model and applies a transaction on a single node first then asynchronously replicates the data to other
members in the cluster. This ensures that even in the presence of network partitions or hard failures, RavenDB can 
accept writes and safely keep them.  

The downside of the multi-master model is that certain error modes can cause two clients to try to modify the same set of documents 
on two different database nodes. 
That can cause [Conflicts](../../server/clustering/replication/replication-conflicts) and make it hard to provide certain guarantees to the application. 
For example, ensuring the uniqueness of a user's email in a distributed cluster. Just checking for the existence of the email is not sufficient. 
Perhaps two clients may be talking to separate database nodes and both of them check that the user does not exist. 
They will both create what will end up as a duplicate user.  

To handle this (and similar) scenarios, RavenDB offers the cluster-wide transaction feature. It allows you to explicitly state that you want
a particular interaction with the database to favor consistency over availability to ensure that changes are going to be applied in an
identical manner across the cluster even in the presence of failures and network partitions.  

In order to ensure that, RavenDB requires that a cluster-wide transaction will be accepted by at least a majority of the voting nodes in 
the cluster. If it is not able to do so, the cluster-wide transaction will fail.

For the rest of this document we are going to refer to single-node transactions, applied on a single node and then disseminated using async
replication vs. cluster-wide transactions that are accepted by a majority of the nodes in the cluster and then applied on each of them.

{PANEL/}

{PANEL: How Cluster Transactions Work}

1. A request sent from the client via [SaveChanges()](../../client-api/session/saving-changes) will generate a [Raft Command](../../server/clustering/rachis/consensus-operations#implementation-details) 
   and the server will wait for a consensus on it.
2. When consensus is achieved, each node will validate the compare-exchange values first.  
   If this fails, the entire session transaction is rolled back. From the nature of the [Raft consensus algorithm](../../server/clustering/rachis/what-is-rachis#what-is-raft-?) 
   the cluster-wide transaction should either _eventually_ be accepted on _all_ nodes or fail on _all_ of them. 
3. Once the validation has passed, the request is stored on the local cluster state machine of every node and is 
   processed asynchronously by the relevant database.
4. The relevant database notices that it has pending cluster transactions and starts to execute them.  
   Since order matters, a failure at this stage will halt the cluster transaction execution until it is fixed.  
   The possible failure modes for this scenario are listed below.  
5. Every document that has been added by the cluster transaction gets the `RAFT:int64-sequential-number` [Change Vector](../../server/clustering/replication/change-vector) 
   and will have priority if a conflict arises between that document and a document from a regular transaction.   
6. After the database has executed the requested transaction, a response is returned to the client.
   * Upon success, the client receives the transaction's [Raft Index](../../server/clustering/rachis/consensus-operations#raft-index) 
     which will be added to any future requests.  Performing an operation against any other node will wait 
     for that index to be applied first, ensuring order of operations.
7. In the background, the [Cluster Observer](../../server/clustering/distribution/cluster-observer) tracks the completed cluster transactions 
   and removes the local cluster-state-machine only when it has been successfully committed on _all_ of the database nodes.

{PANEL/}

{PANEL: Cluster Transactions Properties}

The Cluster transaction feature enables RavneDB to perform consistent cluster-wide ACID transactions. It can be composed of two optional parts:  

1. [Compare Exchange](../../client-api/operations/compare-exchange/overview) values, which will be validated and executed by the cluster.
   {INFO: }
   Compare exchange key/value pairs can be created and managed explicitly in your code.  
   Starting from RavenDB 5.2, they can also be created and managed automatically by RavenDB.  
   Compare exchange entries that are automatically administered by RavenDB are called 
   **Atomic Guards**, read more about them [here](../../client-api/session/cluster-transaction/atomic-guards).  
   {INFO/}
2. Store/Delete operations on documents, which are executed by the database nodes after the transaction has been accepted.

**Atomicity**  
After having a quorum for the cluster transaction request by raft and a successful concurrency check 
of the compare exchange values, the transaction is guaranteed to be executed.
Failure during the quorum or the concurrency check will roll back the entire session transaction,  
while failure during the commit of the documents will halt any further cluster transactions execution on the database 
until that failure is remedied (failure mode for the documents commits are described later [here](../../server/clustering/cluster-transactions#failure-modes-in-cluster-wide-transactions)).

**Consistency**  
Is guaranteed on the requested node. The node will complete the request only when the transaction is completed 
and the documents are persisted on the node. The response to the client will contain the cluster transaction [Raft Index](../../server/clustering/rachis/consensus-operations#raft-index). 
It will be added to any future requests in order to ensure that the node has committed that transaction before serving the client. 

**Durability**  
Once the transaction has been accepted, it is guaranteed to run on all the database's nodes, even in the case of system 
(or even cluster-wide) restarts or failures.

{PANEL/}

{PANEL: Concurrent Cluster Wide and Single-Node Transactions}

### Case 1: Multiple concurrent cluster transactions  

Optimistic concurrency for cluster-wide transactions is handled using the compare-exchange feature. 
The transaction compare-exchange operations are validated and if they can't be executed because the compare-exchange values 
have changed since the transaction was initiated, the entire session transaction is aborted and an error is returned to the client.

Optimistic concurrency at the document level is _not_ supported for cluster-wide transactions. 
Compare-exchange operations should be used to ensure consistency in that regard. Concurrent cluster-wide transactions are guaranteed 
to appear as if they are run one at a time (`serializable` isolation level). 

Cluster-wide transactions may only contain `PUT` / `DELETE` commands. This is required to ensure that we can apply the transaction 
to each of the database nodes without regard to the current node state.

{INFO If the concurrency check of the compare exchange has passed, the transaction will proceed and will be committed on all the database nodes. /}

---

### Case 2: Concurrent cluster and non-cluster transaction

When mixing cluster-wide transactions and single-node transactions, you need to be aware of the rules RavenDB uses to 
resolve conflicts between them.

Documents changed by the **cluster wide transactions will always have precedence** in such a conflict and will overwrite changes 
made in a single node transaction. It is common to use cluster-wide transactions for certain high-value operations such as 
the creation of a new user, sale of a product with a limited inventory, etc., and use single-node transactions for the common case.

A single node transaction that operates on data that has been modified by a cluster-wide transaction will operate as usual, as the cluster-wide
transaction has already been applied (either directly on the node or via [replication](../../server/clustering/replication/replication)) 
the cluster-wide transaction will not be executed again.

[Replication](../../server/clustering/replication/replication-conflicts) will try to synchronize the data, so in order to avoid conflicts 
every document that was modified under the cluster transaction will receive the special `RAFT:int64-sequential-number` 
[Change Vector](../../server/clustering/replication/change-vector) and the special flag `FromClusterTx` which ensures precedence 
over a regular change vector.

---

### Case 3: Cluster transaction with an External incoming replication

While the internal replication with the cluster is discussed in the previous case, the case where two clusters are connected via 
external replication is a bit different.

The logic of documents that were changed by a cluster transaction versus documents that were changed by a regular transaction stays the same. 
However, in the case where a conflict is on a document that was changed by both a local cluster transaction and a remote cluster transaction, 
the local one will have precedence. Furthermore, the `FromClusterTx` flag will be removed, which means that on the next conflict the local 
is no longer treated as modified by a cluster-wide transaction.

{PANEL/}

{PANEL: Failure Modes in Cluster Wide Transactions}

### No majority

A cluster-wide transaction can operate only within a functional cluster. 
Thus, if no consensus was acquired for the cluster transaction by the majority of the nodes or currently there is no leader, 
the transaction will be rolled back.

---

### Concurrency issues for compare-exchange operations

Acquiring a consensus doesn't mean the acceptance of the transaction. Once the consensus is acquired, each node does a 
concurrency check on the compare-exchange values. If the concurrency check fails, the transaction will be rolled back.  

---

### Failure to apply transaction on database nodes

Once the transaction has passed the compare-exchange concurrency check, the transaction is guaranteed to be committed.
Any failure at this stage must be remedied.

| Failure | How to fix it |
| ----- | ----- |
| Out of disk space | Freeing space will fix the problem and allow cluster transactions to be committed. |
| Creation/Deletion of a document with a different collection | Deleting the document from the other collection |

{WARNING The execution of cluster transactions on the database will be stopped until these types of failures are fixed. /}

{PANEL/}

{PANEL: Debug Cluster Wide Transactions}

To view the current state of the cluster transactions that are waiting to be completed by all of the database nodes can be found at:

| URL | Type | Permission |
| --- | --- | --- |
|`/databases/*/admin/debug/cluster/txinfo` | `GET` | `DatabaseAdmin` |

Parameters

| Name | Type | Description |
| --- | --- | --- |
|`from` (optional) | `long` (default: 0)| Get cluster transactions from the raft change vector index. |
|`take` (optional) | `int` (default: `int.MaxValue`) | The number of cluster transaction to show. |

{PANEL/}

## Related Articles

### Client API
- [Compare Exchange: Overview](../../client-api/operations/compare-exchange/overview)
- [Atomic Guards](../../client-api/session/cluster-transaction/atomic-guards)

### Session
- [Cluster Transaction Overview](../../client-api/session/cluster-transaction/overview)
- [Cluster-Wide vs Single-Node Transactions](../../client-api/session/cluster-transaction/overview#cluster-wide-transaction-vs.-single-node-transaction)

### Server
- [Cluster-Wide Transactions ACIDity](../../server/clustering/cluster-transactions#cluster-transaction-properties)

<br/>

## Code Walkthrough

- [Create CmpXchg Item](https://demo.ravendb.net/demos/csharp/compare-exchange/create-compare-exchange)

