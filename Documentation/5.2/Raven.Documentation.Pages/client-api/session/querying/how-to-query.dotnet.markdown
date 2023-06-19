# Query Overview

---

{NOTE: }

* Queries in RavenDB can be written with either of the following:
    * __LINQ__ - when querying with the session's `Query` method.  
    * __Low-level API__ - when querying with the session's  `DocumentQuery` method.  
    * __RQL__:  
        * when querying with the session's `RawQuery` method.  
        * when querying from the [Query view](../../../studio/database/queries/query-view) in Studio.  

* Queries defined with `Query` or `DocumentQuery` are translated by the RavenDB client to [RQL](../../../client-api/session/querying/what-is-rql)  
  when sent to the server.

---

* All queries in RavenDB use an __index__ to provide results, even when you don't specify one.  
  Learn more [below](../../../client-api/session/querying/how-to-query#queries-always-provide-results-using-an-index).

* Queries that do Not specify which index to use are called __Dynamic Queries__.  
  This article displays examples of dynamic queries only.  
  For examples showing how to query an index see [querying an index](../../../indexes/querying/query-index).

---

* The entities returned by the query are 'loaded' and __tracked__ by the [Session](../../../client-api/session/what-is-a-session-and-how-does-it-work).  
  Entities will Not be tracked when:  
    * Query returns a [projection](../../../client-api/session/querying/how-to-project-query-results)  
    * Tracking is [disabled](../../../client-api/session/configuration/how-to-disable-tracking#disable-tracking-query-results)  

* Query results are __cached__ by default. To disable query caching see [NoCaching](../../../client-api/session/querying/how-to-customize-query#nocaching).

* Queries are timed out after a configurable time period.  See [query timeout](../../../server/configuration/database-configuration#databases.querytimeoutinsec).

---

* In this page:
  * [Queries always provide results using an index](../../../client-api/session/querying/how-to-query#queries-always-provide-results-using-an-index)  
  * [Session.Query](../../../client-api/session/querying/how-to-query#session.query)  
  * [Session.Advanced.DocumentQuery](../../../client-api/session/querying/how-to-query#session.advanced.documentquery)  
  * [Session.Advanced.RawQuery](../../../client-api/session/querying/how-to-query#session.advanced.rawquery)
  * [Custom methods and extensions for LINQ](../../../client-api/session/querying/how-to-query#custom-methods-and-extensions-for-linq)  
  * [Syntax](../../../client-api/session/querying/how-to-query#syntax)  

{NOTE/}

---

{PANEL: Queries always provide results using an index} 

* Queries always use an index to provide fast results regardless of the size of your data.  

* When a query reaches a RavenDB instance, the instance calls its __query optimizer__ to analyze the query  
  and determine which index should be used to retrieve the requested data.
 
* Indexes allow to provide query results without scanning the entire dataset each and every time.  
  Learn more about indexes in [indexes overview](../../../studio/database/indexes/indexes-overview). 

{INFO: }
We differentiate between the following __3 query scenarios__.  
For each scenario, a different index type will be used.
{INFO/}

{NOTE: }

<a id="indexQuery" /> 
__1. Query an existing index__:

*  __Query type__: Index query  
   __Index used__: Static-index  

* You can specify which __STATIC-index__ the query will use.

* Static indexes are defined by the user, as opposed to auto-indexes that are created by the server  
  when querying a collection with some filtering applied. See [Static-index vs Auto-index](../../../studio/database/indexes/indexes-overview#auto-indexes--vs--static-indexes).  
  

* Example RQL: &nbsp; `from index "Employees/ByFirstName" where FirstName == "Laura"`  
  See more examples in [querying an index](../../../indexes/querying/query-index).

{NOTE/}

{NOTE: }

<a id="dynamicQuery" /> 
__2. Query a collection - with filtering__:  

*  __Query type__: Dynamic Query  
   __Index used__: Auto-index  

* When querying a collection without specifying an index and with some filtering condition  
  (other than just the document ID) the query-optimizer will analyze the query to see if an __AUTO-index__  
  that can answer the query already exists, i.e. an auto-index on the collection queried with index-fields that match those queried.  

* If such auto-index (Not a static one...) is found, it will be used to fetch the results.  

* Else, if no relevant auto-index is found,  
  the query-optimizer will create a new auto-index with fields that match the query criteria.  
  At this time, and only at this time, the query will wait for the auto-indexing process to complete.  
  Subsequent queries that target this auto-index will be served immediately.  

* Note: if there exists an auto-index that is defined on the collection queried  
  but is indexing a different field than the one queried on,  
  then the query-optimizer will create a new auto-index that merges both the  
  fields from the existing auto-index and the new fields queried.

* Once the newly created auto-index is done indexing the data,  
  the old auto-index is removed in favor of the new one.

* Over time, an optimal set of indexes is generated by the query optimizer to answer your queries.

* Example RQL: &nbsp; `from Employees where FirstName == "Laura"`  
  See more examples [below](../../../client-api/session/querying/how-to-query#session.query).

---

* Note: Counters and Time series are an exception to this flow.  
  Dynamic queries on counters and time series values don't create auto-indexes.  
  However, a static-index can be defined on [Time series](../../../document-extensions/timeseries/indexing) and [Counters](../../../document-extensions/counters/indexing).

{NOTE/}

{NOTE: }

<a id="collectionQuery" /> 
__3. Query a collection - query full collection | query by ID__:  
 
* __Query type__: Full collection Query  
  __Index used__: The raw collection (internal storage indexes)  

* Full collection query:

  * When querying a collection without specifying an index and with no filtering condition,  
    then all documents from the specified collection are returned.

  * RavenDB uses the raw collection documents in its __internal storage indexes__ as the source for this query.  
    No auto-index is created.
   
  * Example RQL: &nbsp; `from Employees`

* Query by document ID:
 
  * When querying a collection only by document ID or IDs,  
    then similar to the full collection query, no auto-index is created.  
  
  * RavenDB uses the raw collection documents as the source for this query.  

  * Example RQL: &nbsp; `from Employees where id() == "employees/1-A"`  
    See more examples [below](../../../client-api/session/querying/how-to-query#session.query).

{NOTE/}

{PANEL/}

{PANEL: Session.Query}

* The simplest way to issue a query is by using the session's `Query` method which supports LINQ.  
  Both the LINQ method syntax and the LINQ query syntax are supported.  

* The following examples show __dynamic queries__ that do not specify which index to use.  
  Please refer to [querying an index](../../../indexes/querying/query-index) for other examples.

* Querying can be enhanced using these [extension methods](../../../client-api/session/querying/how-to-query#custom-methods-and-extensions-for-linq).
 
{NOTE: }

__Query collection - no filtering__ 

{CODE-TABS}
{CODE-TAB:csharp:Method-syntax query_1_1@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB:csharp:Method-syntax-async query_1_2@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB:csharp:Query-syntax query_1_3@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB:csharp:Query-syntax-async query_1_4@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB-BLOCK:sql:RQL}
// This RQL is a Full Collection Query
// No auto-index is created since no filtering is applied

from "Employees"
{CODE-TAB-BLOCK/}
{CODE-TABS/}

{NOTE/}

{NOTE: }

__Query collection - by ID__

{CODE-TABS}
{CODE-TAB:csharp:Method-syntax query_2_1@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB:csharp:Method-syntax-async query_2_2@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB:csharp:Query-syntax query_2_3@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB:csharp:Query-syntax-async query_2_4@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB-BLOCK:sql:RQL}
// This RQL queries the 'Employees' collection by ID
// No auto-index is created when querying only by ID

from "Employees" where id() == "employees/1-A"
{CODE-TAB-BLOCK/}
{CODE-TABS/}

{NOTE/}

{NOTE: }

__Query collection - with filtering__ 

{CODE-TABS}
{CODE-TAB:csharp:Method-syntax query_3_1@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB:csharp:Method-syntax-async query_3_2@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB:csharp:Query-syntax query_3_3@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB:csharp:Query-syntax-async query_3_4@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB-BLOCK:sql:RQL}
// Query collection - filter by document field

// An auto-index will be created if there isn't already an existing auto-index
// that indexes the requested field

from "Employees" where FirstName == "Robert"
{CODE-TAB-BLOCK/}
{CODE-TABS/}

{NOTE/}

{NOTE: }

__Query collection - with paging__ 

{CODE-TABS}
{CODE-TAB:csharp:Method-syntax query_4_1@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB:csharp:Method-syntax-async query_4_2@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB:csharp:Query-syntax query_4_3@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB:csharp:Query-syntax-async query_4_4@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB-BLOCK:sql:RQL}
// Query collection - page results
// No auto-index is created since no filtering is applied

from "Products" limit 5, 10 // skip 5, take 10
{CODE-TAB-BLOCK/}
{CODE-TABS/}

{NOTE/}

{PANEL/}

{PANEL: Session.Advanced.DocumentQuery}

* `DocumentQuery` provides a full spectrum of low-level querying capabilities,  
   giving you more flexibility and control when making complex queries.

* Below is a simple _DocumentQuery_ usage.  
  For a full description and more examples see:  
    * [What is a document query](../../../client-api/session/querying/document-query/what-is-document-query)
    * [Query -vs- DocumentQuery](../../../client-api/session/querying/document-query/query-vs-document-query)

__Example__:

{CODE-TABS}
{CODE-TAB:csharp:Sync query_5_1@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB:csharp:Async query_5_2@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB-BLOCK:sql:RQL}
// Query collection - filter by document field

// An auto-index will be created if there isn't already an existing auto-index
// that indexes the requested field

from "Employees" where FirstName = "Robert"
{CODE-TAB-BLOCK/}
{CODE-TABS/}

{PANEL/}

{PANEL: Session.Advanced.RawQuery}

* Queries defined with [Query](../../../client-api/session/querying/how-to-query#session.query) or [DocumentQuery](../../../client-api/session/querying/how-to-query#session.advanced.documentquery) are translated by the RavenDB client to [RQL](../../../client-api/session/querying/what-is-rql)  
  when sent to the server.

* The session also gives you a way to express the query directly in RQL using the `RawQuery` method.

__Example__:

{CODE-TABS}
{CODE-TAB:csharp:Sync query_6_1@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TAB:csharp:Async query_6_2@ClientApi\Session\Querying\HowToQuery.cs /}
{CODE-TABS/}

{PANEL/}

{PANEL: Custom methods and extensions for LINQ}

Available custom methods and extensions for the session's [Query](../../../client-api/session/querying/how-to-query#session.query) method:

- [AggregateBy](../../../client-api/session/querying/how-to-perform-a-faceted-search)
- AnyAsync
- CountAsync
- [CountLazily](../../../client-api/session/querying/how-to-perform-queries-lazily)
- [Customize](../../../client-api/session/querying/how-to-customize-query)
- FirstAsync
- FirstOrDefaultAsync
- [GroupByArrayValues](../../../client-api/session/querying/how-to-perform-group-by-query#by-array-values)
- [GroupByArrayContent](../../../client-api/session/querying/how-to-perform-group-by-query#by-array-content)
- [Include](../../../client-api/how-to/handle-document-relationships)
- [Intersect](../../../client-api/session/querying/how-to-use-intersect)
- [Lazily](../../../client-api/session/querying/how-to-perform-queries-lazily)
- [LazilyAsync](../../../client-api/session/querying/how-to-perform-queries-lazily)
- [MoreLikeThis](../../../client-api/session/querying/how-to-use-morelikethis)
- [OfType](../../../client-api/session/querying/how-to-project-query-results#oftype-(as)---simple-projection)
- OrderByDistance
- OrderByDistanceDescending
- OrderByScore
- OrderByScoreDescending
- [ProjectInto](../../../client-api/session/querying/how-to-project-query-results)
- [Search](../../../client-api/session/querying/how-to-use-search)
- SingleAsync
- SingleOrDefaultAsync
- [Spatial](../../../client-api/session/querying/how-to-query-a-spatial-index)
- [Statistics](../../../client-api/session/querying/how-to-get-query-statistics)
- [SuggestUsing](../../../client-api/session/querying/how-to-work-with-suggestions)
- ToListAsync
- ToArrayAsync

{PANEL/}

{PANEL: Syntax}

{CODE syntax@ClientApi\Session\Querying\HowToQuery.cs /}

| Parameter | Type | Description |
| - | - | - |
| __T__ | object | <ul><li>The type of entity that represents the collection queried</li></ul> |
| __TIndexCreator__ | string | <ul><li>The index class type</li></ul> |
| __collectionName__ | string | <ul><li>Name of a collection to query</li><li>No need to provide this param when specifying `T`</li><li>Specify the collection name when querying a collection that is created<br> on the fly, i.e. when querying [Artifical Documents](../../../studio/database/indexes/create-map-reduce-index#saving-map-reduce-results-in-a-collection-(artificial-documents))</li><li>Mutually exclusive with _indexName_</li></ul> |
| __indexName__ | string | <ul><li>Name of index to query</li><li>Mutually exclusive with _collectionName_</li></ul> |
| __isMapReduce__ | string | <ul><li>Whether querying a map-reduce index</li></ul> |

| Return Value | |
| - | - |
| `IRavenQueryable`<br>`IDocumentQuery`<br>`IRawDocumentQuery` | Instances exposing additional query methods and [extensions](../../../client-api/session/querying/how-to-query#custom-methods-and-extensions-for-linq) |
 
{PANEL/}

## Related Articles

### Session

- [How to Project Query Results](../../../client-api/session/querying/how-to-project-query-results)
- [How to Stream Query Results](../../../client-api/session/querying/how-to-stream-query-results)
- [What is a Document Query](../../../client-api/session/querying/document-query/what-is-document-query)

### Querying

- [Querying an Index](../../../indexes/querying/query-index)
- [Filtering](../../../indexes/querying/filtering)
- [Paging](../../../indexes/querying/paging)
- [Sorting](../../../indexes/querying/sorting)
- [Projections](../../../indexes/querying/projections)

### Indexes

- [What are Indexes](../../../indexes/what-are-indexes)  
- [Indexing Basics](../../../indexes/indexing-basics)
- [Map Indexes](../../../indexes/map-indexes)
