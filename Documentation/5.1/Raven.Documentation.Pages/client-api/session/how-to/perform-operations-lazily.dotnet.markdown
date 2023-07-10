# How to Perform Operations Lazily

---

{NOTE: }

* **Defining a lazy operation** allows deferring the execution of the operation until it is needed.  

* Multiple pending lazy operations can be executed together, see below. 

* In this page:
   * [Operations that can be executed lazily](../../../client-api/session/how-to/perform-operations-lazily#operations-that-can-be-executed-lazily)  
      * [Load entities](../../../client-api/session/how-to/perform-operations-lazily#loadEntities)  
      * [Load entities with include](../../../client-api/session/how-to/perform-operations-lazily#loadWithInclude)  
      * [Load entities starting with](../../../client-api/session/how-to/perform-operations-lazily#loadStartingWith)
      * [Conditional load](../../../client-api/session/how-to/perform-operations-lazily#conditionalLoad)
      * [Run query](../../../client-api/session/how-to/perform-operations-lazily#runQuery)
      * [Get revisions](../../../client-api/session/how-to/perform-operations-lazily#getRevisions)  
      * [Get compare-exchange value](../../../client-api/session/how-to/perform-operations-lazily#getCompareExchange)     
   * [Execute all pending lazy operations](../../../client-api/session/how-to/perform-operations-lazily#execute-all-pending-lazy-operations)  

{NOTE/}

{PANEL: Operations that can be executed lazily}

{NOTE: }
<a id="loadEntities" /> __Load entities__

* [Load](../../../client-api/session/loading-entities#load) loads a document entity from the database into the session.  
  Loading entities can be executed __lazily__.   

{CODE lazy_Load@ClientApi\Session\HowTo\Lazy.cs /}
{NOTE/}

{NOTE: }
<a id="loadWithInclude" /> __Load entities with include__

* [Load with include](../../../client-api/session/loading-entities#load-with-includes) loads both the document and the specified related document.    
  Loading entities with include can be executed __lazily__.

{CODE-TABS}
{CODE-TAB:csharp:Lazy_load_with_include lazy_LoadWithInclude@ClientApi\Session\HowTo\Lazy.cs /}
{CODE-TAB:csharp:The_document lazy_productClass@ClientApi\Session\HowTo\Lazy.cs /}
{CODE-TABS/}
{NOTE/}

{NOTE: }
<a id="loadStartingWith" /> __Load entities starting with__

* [LoadStartingWith](../../../client-api/session/loading-entities#loadstartingwith) loads entities whose ID starts with the specified prefix.  
  Loading entities with a common prefix can be executed __lazily__.

{CODE lazy_LoadStartingWith@ClientApi\Session\HowTo\Lazy.cs /}
{NOTE/}

{NOTE: }
<a id="conditionalLoad" /> __Conditional load__

* [ConditionalLoad](../../../client-api/session/loading-entities#conditionalload) logic is: 
  * If the entity is already loaded to the session:  
    no server call is made, the tracked entity is returned.    
  * If the entity is Not already loaded to the session:  
    the document will be loaded from the server only if the change-vector provided to the method is older than the one in the server
    (i.e. if the document in the server is newer).
  * Loading entities conditionally can be executed __lazily__.  

{CODE lazy_ConditionalLoad@ClientApi\Session\HowTo\Lazy.cs /}
{NOTE/}

{NOTE: }
<a id="runQuery" /> __Run query__

* A Query can be executed __lazily__.  
  Learn more about running queries lazily in [lazy queries](../../../client-api/session/querying/how-to-perform-queries-lazily).

{CODE lazy_Query@ClientApi\Session\HowTo\Lazy.cs /}
{NOTE/}

{NOTE: }
<a id="getRevisions" /> __Get revisions__

* All methods for [getting revisions](../../../client-api/session/revisions/loading#revisions-loading-revisions) and their metadata can be executed __lazily__.

{CODE lazy_Revisions@ClientApi\Session\HowTo\Lazy.cs /}
{NOTE/}

{NOTE: }
<a id="getCompareExchange" /> __Get compare-exchange value__

* [Getting compare-exchange](../../../client-api/session/cluster-transaction#get-compare-exchange-lazily) values can be executed __lazily__.

{CODE lazy_CompareExchange@ClientApi\Session\HowTo\Lazy.cs /}
{NOTE/}

{PANEL/}

{PANEL: Execute all pending lazy operations}

* Use `ExecuteAllPendingLazyOperations` to execute **all** pending lazy operations at once. 

{CODE lazy_ExecuteAllPendingLazyOperations@ClientApi\Session\HowTo\Lazy.cs /}

{PANEL/}

## Related Articles

### Session

- [How to Perform Queries Lazily](../../../client-api/session/querying/how-to-perform-queries-lazily)
- [Cluster Transaction - Overview](../../../client-api/session/cluster-transaction)
