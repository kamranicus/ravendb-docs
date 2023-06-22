# Include Revisions

---

{NOTE: }

* Document revisions can be [included](../../../../client-api/how-to/handle-document-relationships#includes) in results when:  
  * __Making a query__ (`Session.Query` / `Session.Advanced.RawQuery`)
  * __Loading a document__ (`Session.Load`) from the server  

* The revisions to include can be specified by:
  * __Creation time__
  * __Change vector__

* In this page:
  * [Overview:](../../../../document-extensions/revisions/client-api/session/including#overview)
      * [Why include revisions](../../../../document-extensions/revisions/client-api/session/including#why-include)
      * [Including by creation time](../../../../document-extensions/revisions/client-api/session/including#include-by-time)
      * [Including by change vector](../../../../document-extensions/revisions/client-api/session/including#include-by-change-vector)
  * [Include revisions:](../../../../document-extensions/revisions/client-api/session/including#include-revisions-when-loading-document)  
      * [When Loading document](../../../../document-extensions/revisions/client-api/session/including#include-revisions-when-loading-document)
      * [When making a Query](../../../../document-extensions/revisions/client-api/session/including#include-revisions-when-making-a-query)
      * [When making a Raw Query](../../../../document-extensions/revisions/client-api/session/including#include-revisions-when-making-a-raw-query)
  * [Syntax](../../../../document-extensions/revisions/client-api/session/including#syntax)
  * [Patching the revision change vector](../../../../document-extensions/revisions/client-api/session/including#patching-the-revision-change-vector)

{NOTE/}

---

{PANEL: Overview}

{NOTE: }

<a id="why-include" /> __Why include revisions__:

---

* Including revisions may be useful, for example, when an auditing application loads or queries for a document.  
  The document's past revisions can be included with the document to make the document's history available for instant inspection.  

* Once loaded to the session, there are no additional trips to the server when accessing the revisions.  
  [Getting](../../../../document-extensions/revisions/client-api/session/loading) a revision that was included with the document will retrieve it directly from the session.  
  This also holds true when attempting to include revisions but none are found.

{NOTE/}

{NOTE: }

<a id="include-by-time" /> __Including by Creation Time__:

---

* You can include a single revision by specifying its creation time, see examples below.

* You can pass local time or UTC, either way the server will  convert it to UTC.  

* __If the provided time matches__ the creation time of a document revision, this revision will be included.

* __If no exact match is found__, then the first revision that precedes the specified time will be returned.

{NOTE/}

{NOTE: }

<a id="include-by-change-vector" /> __Including by Change Vector__:

---

* Each time a document is modified, its [Change Vector](../../../../server/clustering/replication/change-vector) is updated.  

* When a revision is created,  
  the revision's change vector is the change vector of the document at the time of the revision's creation.  

* To include single or multiple document revisions by their change vectors:   

  * When modifying the document, store its updated change vector in a property in the document.  
    Can be done by [patching](../../../../document-extensions/revisions/client-api/session/including#patching-the-revision-change-vector) the document from the Client API or from the Studio.  
  
  * Specify the __path__ to this property when including the revisions, see examples below.  
  
  * e.g.:  
    Each time an employee's contract document is modified (e.g. when their salary is raised),  
    you can add the current change vector of the document to a dedicated property in the document.  
    Whenever the time comes to re-evaluate an employee's terms and their contract is loaded,  
    its past revisions can be easily included with it by their change vectors.

{NOTE/}

{PANEL/}

{PANEL: Include revisions when Loading document}

__Include a revision by Time__

{CODE-TABS}
{CODE-TAB:csharp:Sync include_1@DocumentExtensions\Revisions\ClientAPI\Session\Including.cs /}
{CODE-TAB:csharp:Async include_1_async@DocumentExtensions\Revisions\ClientAPI\Session\Including.cs /}
{CODE-TABS/}

---

__Include revisions by Change Vector__

{CODE-TABS}
{CODE-TAB:csharp:Sync include_2@DocumentExtensions\Revisions\ClientAPI\Session\Including.cs /}
{CODE-TAB:csharp:Async include_2_async@DocumentExtensions\Revisions\ClientAPI\Session\Including.cs /}
{CODE-TABS/}

<a id="sample-document" />
{CODE sample_document@DocumentExtensions\Revisions\ClientAPI\Session\Including.cs /}

{PANEL/}

{PANEL: Include revisions when making a Query}

__Include revisions by Time__

{CODE-TABS}
{CODE-TAB:csharp:Sync include_3@DocumentExtensions\Revisions\ClientAPI\Session\Including.cs /}
{CODE-TAB:csharp:Async include_3_async@DocumentExtensions\Revisions\ClientAPI\Session\Including.cs /}
{CODE-TABS/}

---

__Include revisions by Change Vector__

{CODE-TABS}
{CODE-TAB:csharp:Sync include_4@DocumentExtensions\Revisions\ClientAPI\Session\Including.cs /}
{CODE-TAB:csharp:Async include_4_async@DocumentExtensions\Revisions\ClientAPI\Session\Including.cs /}
{CODE-TABS/}

* See the _Contract_ class definition [above](../../../../document-extensions/revisions/client-api/session/including#sample-document). 

{PANEL/}

{PANEL: Include revisions when making a Raw Query}

* Use `include revisions` in your RQL when making a raw query.   

* Pass either the revision creation time or the path to the document property containing the change vector(s),  
  RavenDB will figure out the parameter type passed and include the revisions accordingly.  

* Aliases (e.g. `from Users as U`) are Not supported by raw queries that include revisions.

---

__Include revisions by Time__

{CODE-TABS}
{CODE-TAB:csharp:Sync include_5@DocumentExtensions\Revisions\ClientAPI\Session\Including.cs /}
{CODE-TAB:csharp:Async include_5_async@DocumentExtensions\Revisions\ClientAPI\Session\Including.cs /}
{CODE-TABS/}

---

__Include revisions by Change Vector__

{CODE-TABS}
{CODE-TAB:csharp:Sync include_6@DocumentExtensions\Revisions\ClientAPI\Session\Including.cs /}
{CODE-TAB:csharp:Async include_6_async@DocumentExtensions\Revisions\ClientAPI\Session\Including.cs /}
{CODE-TABS/}

* See the _Contract_ class definition [above](../../../../document-extensions/revisions/client-api/session/including#sample-document).

{PANEL/}

{PANEL: Syntax}

{CODE syntax@DocumentExtensions\Revisions\ClientAPI\Session\Including.cs /}

| Parameters | Type | Description |
| - | - | - |
| __before__ | `DateTime` | <ul><li>Creation time of the revision to be included.</li><li>Pass local time or UTC.<br>The server will convert the param to UTC.</li><li>If no revision was created at this time then the first revision that precedes it is returned.</li></ul> |
| __path__ | `Expression<Func<T, string>>` | <ul><li>The path to the document property that contains<br> __a single change vector__ of the revision to be included.</li></ul> |
| __path__ | `Expression<Func<T, IEnumerable<string>>>` | <ul><li>The path to the document property that contains<br> __an array of change vectors__ of the revisions to be included.</li></ul> |

| Return value | |
| - | - |
| `TBuilder` | <ul><li>When __loading__ a document:<br>A builder object that is used to build the include part in the Load request.</il><li>When __querying__ for a document:<br>A builder object that is used to build the include part in the Query RQL expression.</li><li>Can be used in chaining.</li></ul> |

{PANEL/}

{PANEL: Patching the revision change vector}

* To include revisions when making a query or a raw query,  
  you need to specify the path to the document property that contains the revision change vector(s).  

* The below example shows how to get and patch a revision change vector to a document property.  

{CODE-TABS}
{CODE-TAB:csharp:Sync include_7@DocumentExtensions\Revisions\ClientAPI\Session\Including.cs /}
{CODE-TAB:csharp:Async include_7_async@DocumentExtensions\Revisions\ClientAPI\Session\Including.cs /}
{CODE-TABS/}

* See the _Contract_ class definition [above](../../../../document-extensions/revisions/client-api/session/including#sample-document).

{PANEL/}

## Related Articles

### Document Extensions

* [Document Revisions Overview](../../../../document-extensions/revisions/overview)  
* [Revert Revisions](../../../../document-extensions/revisions/revert-revisions)  
* [Revisions and Other Features](../../../../document-extensions/revisions/revisions-and-other-features)  

### Client API

* [Revisions: API Overview](../../../../document-extensions/revisions/client-api/overview)  
* [Operations: Configuring Revisions](../../../../document-extensions/revisions/client-api/operations/configure-revisions)  
* [Session: Loading Revisions](../../../../document-extensions/revisions/client-api/session/loading)  
* [Session: Counting Revisions](../../../../document-extensions/revisions/client-api/session/counting)  

### Studio

* [Settings: Document Revisions](../../../../studio/database/settings/document-revisions)  
* [Document Extensions: Revisions](../../../../studio/database/document-extensions/revisions)  
