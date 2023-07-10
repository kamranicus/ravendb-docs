# Customize Query

---

{NOTE: }

* The following query customization methods that are available for the __.NET client__ under `IDocumentQueryCustomization` 
  are also available in the __Node.js client__.

* These methods can be used for both a dynamic-query and an index-query.

* Note:  
  A [query](../../../client-api/session/querying/how-to-query) can also be customized on the Store or Session level by subscribing to the `beforeQuery` event.  
  Learn more in [Subscribing to Events](../../../client-api/session/how-to/subscribe-to-events).

* Customization methods available:

  - [on ("beforeQueryExecuted")](../../../client-api/session/querying/how-to-customize-query#on-("beforequeryexecuted"))
  - [on ("afterQueryExecuted")](../../../client-api/session/querying/how-to-customize-query#on-("afterqueryexecuted"))
  - [noCaching](../../../client-api/session/querying/how-to-customize-query#nocaching)
  - [noTracking](../../../client-api/session/querying/how-to-customize-query#notracking)
  - [projectionBehavior](../../../client-api/session/querying/how-to-customize-query#projectionbehavior)
  - [randomOrdering](../../../client-api/session/querying/how-to-customize-query#randomordering)
  - [timings](../../../client-api/session/querying/how-to-customize-query#timings)
  - [waitForNonStaleResults](../../../client-api/session/querying/how-to-customize-query#waitfornonstaleresults)

{NOTE/}

---

{PANEL: on ("beforeQueryExecuted")}

* Use `on("beforeQueryExecuted")` to customize the query just before it is executed.

{NOTE: }

__Example__

{CODE-TABS}
{CODE-TAB:nodejs:Query customize_1_0@ClientApi\Session\Querying\howToCustomize.js /}
{CODE-TAB:nodejs:Index index_1@ClientApi\Session\Querying\howToCustomize.js /}
{CODE-TABS/}

{NOTE/}

{NOTE: }

__Syntax__

{CODE:nodejs customize_1_1@ClientApi\Session\Querying\howToCustomize.js /}

| Parameters       | Type            | Description                                                                                                                           |
|------------------|-----------------|---------------------------------------------------------------------------------------------------------------------------------------|
| __eventHandler__ | (query) => void | A callback method that is invoked when the `beforeQueryExecuted` event is emitted.<br>The passed query param is of type `IndexQuery`. |

{NOTE/}

{PANEL/}

{PANEL: on ("afterQueryExecuted")}

* Use `on("afterQueryExecuted")` to access the raw query result after it is executed.

{NOTE: }

__Example__

{CODE:nodejs customize_2_0@ClientApi\Session\Querying\howToCustomize.js /}

{NOTE/}

{NOTE: }

__Syntax__

{CODE:nodejs customize_2_1@ClientApi\Session\Querying\howToCustomize.js /}

| Parameters               | Type                  | Description                                                                                                                            |
|--------------------------|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| __eventHandler__ | (queryResult) => void | A callback method that is invoked when the `afterQueryExecuted` event is emitted.<br> The passed query param is of type `QueryResult`. |

{NOTE/}

{PANEL/}

{PANEL: noCaching}
 
* By default, query results are cached.

* You can use the `noCaching` customization to disable query caching.

{NOTE: }

__Example__

{CODE:nodejs customize_3_0@ClientApi\Session\Querying\howToCustomize.js /}

{NOTE/}

{NOTE: }

__Syntax__

{CODE:nodejs customize_3_1@ClientApi\Session\Querying\howToCustomize.js /}

{NOTE/}

{PANEL/}

{PANEL: noTracking}

* By default, the [Session](../../../client-api/session/what-is-a-session-and-how-does-it-work) tracks all changes made to all entities that it has either loaded, stored, or queried for.

* You can use the `noTracking` customization to disable entity tracking.

* See [disable entity tracking](../../../client-api/session/configuration/how-to-disable-tracking) for all other options.

{NOTE: }

__Example__

{CODE:nodejs customize_4_0@ClientApi\Session\Querying\howToCustomize.js /}

{NOTE/}

{NOTE: }

__Syntax__

{CODE:nodejs customize_4_1@ClientApi\Session\Querying\howToCustomize.js /}

{NOTE/}

{PANEL/}

{PANEL: projectionBehavior}

* By default, when [querying an index](../../../indexes/querying/query-index), and projecting query results  
  (projecting means the query returns only specific document fields instead of the full document)  
  then the server will try to retrieve the fields' values from the fields [stored in the index](../../../indexes/storing-data-in-index).

* If the index does Not store those fields then the fields' values will be retrieved from the documents store.

* Use the `selectFields` method to customize and modify this behavior for the specified fields.

* Note:  
  Entities resulting from a projecting query are Not tracked by the session.  
  Learn more about projections in:  
    * [Projections](../../../indexes/querying/projections)
    * [How to project query results](../../../client-api/session/querying/how-to-project-query-results)

{NOTE: }

__Example__

{CODE-TABS}
{CODE-TAB:nodejs:Query customize_5_0@ClientApi\Session\Querying\howToCustomize.js /}
{CODE-TAB:nodejs:Index index_2@ClientApi\Session\Querying\howToCustomize.js /}
{CODE-TABS/}

{NOTE/}

{NOTE: }

__Syntax__

{CODE:nodejs customize_5_1@ClientApi\Session\Querying\howToCustomize.js /}

| Parameters             | Type     | Description                                                    |
|------------------------|----------|----------------------------------------------------------------|
| __properties__         | string[] | Fields' names for which to fetch values                        |
| __projectionClass__    | object   | The projected results class                                    |
| __projectionBehavior__ | string   | The requested projection behavior, see available options below |

* `Default`  
  Retrieve values from the stored index fields when available.  
  If fields are not stored then get values from the document.
* `FromIndex`  
  Retrieve values from the stored index fields when available.  
  A field that is not stored in the index is skipped.
* `FromIndexOrThrow`  
  Retrieve values from the stored index fields when available.  
  An exception is thrown if the index does not store the requested field.
* `FromDocument`  
  Retrieve values directly from the documents store.  
  A field that is not found in the document is skipped.
* `FromDocumentOrThrow`  
  Retrieve values directly from the documents store.  
  An exception is thrown if the document does not contain the requested field.

{NOTE/}

{PANEL/}

{PANEL: randomOrdering}

* Use `RandomOrdering` to order the query results randomly.

{NOTE: }

__Example__

{CODE:nodejs customize_6_0@ClientApi\Session\Querying\howToCustomize.js /}

{NOTE/}

{NOTE: }

__Syntax__

{CODE:nodejs customize_6_1@ClientApi\Session\Querying\howToCustomize.js /}

| Parameters | Type   | Description                                                                                            |
|------------|--------|--------------------------------------------------------------------------------------------------------|
| __seed__   | string | Order the search results randomly using this seed. <br> Useful when executing repeated random queries. |

{NOTE/}

{PANEL/}

{PANEL: timings}

* Use `Timings` to get detailed stats of the time spent by the server on each part of the query.

* The timing statistics will be included in the query results.

* Learn more in [how to include query timings](../../../client-api/session/querying/debugging/query-timings).

{NOTE: }

__Example__

{CODE:nodejs customize_7_0@ClientApi\Session\Querying\howToCustomize.js /}

{NOTE/}

{NOTE: }

__Syntax__

{CODE:nodejs customize_7_1@ClientApi\Session\Querying\howToCustomize.js /}

| Parameters | Type | Description |
| - |----------------| - |
| __timings__ | `QueryTimings` | An _out_ param that will be filled with the timings results |

| `QueryTimings` |  |  |
| - |-----------------------------------|---------------------------------------------------|
| __DurationInMs__ | long | Total duration |
| __Timings__ | IDictionary<string, QueryTimings> | Dictionary with _QueryTimings_ info per time part |


{NOTE/}

{PANEL/}

{PANEL: waitForNonStaleResults}

* All queries in RavenDB provide results using an index, even when you don't specify one.  
  See detailed explanation in [Queries always provide results using an index](../../../client-api/session/querying/how-to-query#queries-always-provide-results-using-an-index).

* Use `waitForNonStaleResults` to instruct the query to wait for non-stale results from the index.

* A `TimeoutException` will be thrown if the query is not able to return non-stale results within the specified  
  (or default) timeout.

* Learn more about stale results in [stale indexes](../../../indexes/stale-indexes).

{NOTE: }

__Example__

{CODE:nodejs customize_8_0@ClientApi\Session\Querying\howToCustomize.js /}

{NOTE/}

{NOTE: }

__Syntax__

{CODE:nodejs customize_8_1@ClientApi\Session\Querying\howToCustomize.js /}

| Parameters      | Type   | Description                                                                           |
|-----------------|--------|---------------------------------------------------------------------------------------|
| **waitTimeout** | number | Time (ms) to wait for an index to return non-stale results.<br>Default is 15 seconds. |

{NOTE/}

{PANEL/}

## Related Articles

### Session

- [How to Query](../../../client-api/session/querying/how-to-query)
- [How to Subscribe to Events](../../../client-api/session/how-to/subscribe-to-events)

### Configuration

- [Conventions](../../../client-api/configuration/conventions)
- [Querying](../../../client-api/configuration/querying)

### Indexes

- [Stale Indexes](../../../indexes/stale-indexes)  
