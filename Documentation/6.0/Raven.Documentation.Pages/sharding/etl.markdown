﻿# Sharding: ETL
---

{NOTE: }

* From a user's point of view, ETL usage on a sharded RavenDB database 
  is similar to its usage on a non-sharded database, including unchanged 
  syntax and support for the same list of destinations.  
* Most changes are meant to remain behind the scenes and allow the 
  transition to a sharded database to be seamless.  
* A user defines an ETL task once.  
  As the shards detect that a task was defined, each shard defines 
  its own local ETL task, based on the user's settings.  
* Resharding may result in the transfer of some documents more than 
  once to the ETL destination. It is the user's responsibility to 
  [detect and handle](../sharding/etl#etl-and-resharding) such duplicates.  
* ETL tasks information is available [per database and per shard](../sharding/etl#retrieving-shard-specific-etl-task-info).  

* In this page:  
  * [ETL](../sharding/etl#etl)  
     * [Sharded and Non-Sharded ETL Tasks](../sharding/etl#sharded-and-non-sharded-etl-tasks)  
     * [Non-Sharded Database ETL Tasks](../sharding/etl#non-sharded-database-etl-tasks)  
     * [Sharded Database ETL Tasks](../sharding/etl#sharded-database-etl-tasks)  
  * [ETL and Resharding](../sharding/etl#etl-and-resharding)  
  * [ETL Queries](../sharding/etl#etl-queries)  
  * [Retrieving Shard-Specific ETL Task Info](../sharding/etl#retrieving-shard-specific-etl-task-info)  

{NOTE/}

---

{PANEL: ETL}

## Sharded and Non-Sharded ETL Tasks

From a user's point of view, creating an ongoing ETL process is 
done by defining and running **a single ETL task**, just like it 
is done under a non-sharded database.  

Behind the scenes, though, each shard defines and uses its own 
ETL task to send data from its database to the ETL destination 
independently from other shards.  

Distributing the ETL responsibility between the shards allows 
RavenDB to keep its ETL destination updated with data additions 
and modifications no matter how large the overall database gets.  

### Non-Sharded Database ETL Tasks

* A complete replica of the database is kept by each cluster node.  
* Any node can therefore be made 
  [responsible](../server/clustering/distribution/highly-available-tasks#responsible-node) 
  for ETL by the cluster.  
* The responsible node runs the ETL task periodically to update 
  the ETL destination with any data changes.  
  
### Sharded Database ETL Tasks

* Each shard hosts a unique dataset, so no single node can 
  monitor the entire database.  
* When a user defines an ETL task, either via Studio or 
  using API commands like `PutConnectionStringOperation` 
  and `AddEtlOperation`, the change made in the database 
  record triggers each shard to create an ETL task of 
  its own, based on the user-defined task.  
  This creation of multiple ETL tasks, one per shard, is 
  automatic and requires no additional actions from the user.  
* Each shard appoints [one of its nodes](../sharding/overview#shard-replication) 
  responsible for the execution of the shard's ETL task.  
* The shards' ETL tasks behave just like an ETL task of 
  a non-sharded database would, **E**xtractng relevant 
  data from the shard's database, **T**ransforming it using 
  a user-defined script, and **L**oading it to the destination.  
* If the responsible node fails a failover scenario will start, 
  another shard node will be made responsible for the task, 
  and the transfer will continue from the point of failure.  

{PANEL/}

{PANEL: ETL Queries}

Queries used by an ETL task's transform script on a sharded 
database are basically no different than queries executed over 
a non-sharded database.  
However, as some querying features are 
[not yet implemented](../sharding/querying#unsupported-querying-features) 
on a sharded database (e.g. loading a document that resides 
on a different shard will fail) and others behave a little 
differently than their non-sharded equivalents (e.g. 
[filer](../sharding/querying#filtering-results-in-a-sharded-database)), 
it is recommended to read the pages dedicated to [indexing](../sharding/indexing) 
and [querying](../sharding/querying) on a sharded database.  

{PANEL/}

{PANEL: ETL and Resharding}

It may happen that an ETL task would send the same data more than once.  
One scenario that would make this happen is resharding: a document can 
be sent from one shard by the shard's ETL task, resharded, and then 
sent again to the ETL destination by its new shard's ETL task.  

Some ETL destinations will store duplicate incoming documents instead 
of their former copies. Others, like OLAP and [Queue ETL](../server/ongoing-tasks/etl/queue-etl/overview) 
destinations, will **Not** automatically recognize such events.  
It is the user's responsibility to verify that the loaded documents 
are handled as expected when they arrive.  

{NOTE: }
OLAP helps users detect duplications using `lastModified`, see a more 
thorough discussion of this [here](../studio/database/tasks/ongoing-tasks/olap-etl-task#transform-scripts) 
and relevant code samples [here](../server/ongoing-tasks/etl/olap#athena-examples).  
{NOTE/}

{PANEL/}

{PANEL: Retrieving Shard-Specific ETL Task Info}

* The [GetOngoingTaskInfoOperation](../server/ongoing-tasks/general-info#get-ongoing-task-info-operation) 
  store operation can be used on a non-sharded database to retrieve a task's information.  

* `GetOngoingTaskInfoOperation` can also be used on a sharded database.  
   * **Get Task Info Per Database**  
     Run `GetOngoingTaskInfoOperation` using `store.Maintenance.Send` 
     to retrieve information regarding the basic task defined by the user.  
     The information includes the task's name and ID.  
   * **Get Task Info Per Shard**  
     Run `GetOngoingTaskInfoOperation` using `store.Maintenance.ForShard(x).Send`, 
     where x is the shard number, to retrieve information about the selected 
     shard's task.  
     Much more information is available here, including details of the 
     responsible and mentor nodes.  
     {CODE get-shard-specific-info@Sharding\ShardingETL.cs /}  

{PANEL/}

## Related articles

### ETL
- [ETL Basics](../server/ongoing-tasks/etl/basics)  
- [OLAP ETL: Studio](../studio/database/tasks/ongoing-tasks/olap-etl-task#transform-scripts)  
- [OLAP ETL: Samples](../server/ongoing-tasks/etl/olap#athena-examples)  
- [Queue ETL](../server/ongoing-tasks/etl/queue-etl/overview)  

### Sharding
- [Shard Replication](../sharding/overview#shard-replication)  

### Server
- [Responsible Node](../server/clustering/distribution/highly-available-tasks#responsible-node)  
