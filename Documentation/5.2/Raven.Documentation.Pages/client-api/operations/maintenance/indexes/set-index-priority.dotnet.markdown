# Set Index Priority Operation

---

{NOTE: }

* In RavenDB, each index has its own dedicated thread for all indexing work.  
  By default, RavenDB prioritizes processing requests over indexing,  
  so indexing threads start with a lower priority than request-processing threads.  

* Use `SetIndexesPriorityOperation` to increase or lower the index thread priority.  

* __Indexes scope__:  
  Index priority can be set for both static and auto indexes.  

* __Nodes scope__:  
  The priority will be updated on all nodes in the database group.

* Setting the priority can also be done from the [indexes list view](../../../../studio/database/indexes/indexes-list-view#indexes-list-view---actions) in the Studio.  

* In this page:
    * [Index priority](../../../../client-api/operations/maintenance/indexes/set-index-priority#index-priority)
    * [Set priority - single index](../../../../client-api/operations/maintenance/indexes/set-index-priority#set-priority---single-index)
    * [Set priority - multiple indexes](../../../../client-api/operations/maintenance/indexes/set-index-priority#set-priority---multiple-indexes)
    * [Syntax](../../../../client-api/operations/maintenance/indexes/set-index-priority#syntax)

{NOTE/}

---

{PANEL: Index priority}

Setting the priority will affect the indexing thread priority at the operating system level:  

| Priority value | Indexing thread priority<br> at OS level | |
| - | - | - |
| __Low__ | Lowest | <ul><li>Having the `Lowest` priority at the OS level, indexes will run only when there's a capacity for them, when the system is not occupied with higher-priority tasks.</li><li>Requests to the database will complete faster.<br>Use when querying the server is more important to you than indexing.</li></ul> |
| __Normal__ (default) | Below normal | <ul><li>Requests to the database are still preferred over the indexing process.</li><li>The indexing thread priority at the OS level is `Below normal`<br>while Requests processes have a `Normal` priority.</li></ul> |
| __High__ | Normal | <ul><li>Requests and Indexing will have the same priority at the OS level.</li></ul> |

{PANEL/}

{PANEL: Set priority - single index}

{CODE-TABS}
{CODE-TAB:csharp:Sync set_priority_single@ClientApi\Operations\Maintenance\Indexes\SetPriority.cs /}
{CODE-TAB:csharp:Async set_priority_single_async@ClientApi\Operations\Maintenance\Indexes\SetPriority.cs /}
{CODE-TABS/}

{PANEL/}

{PANEL: Set priority - multiple indexes}

{CODE-TABS}
{CODE-TAB:csharp:Sync set_priority_multiple@ClientApi\Operations\Maintenance\Indexes\SetPriority.cs /}
{CODE-TAB:csharp:Async set_priority_multiple_async@ClientApi\Operations\Maintenance\Indexes\SetPriority.cs /}
{CODE-TABS/}

{PANEL/}

{PANEL: Syntax}

{CODE syntax_1@ClientApi\Operations\Maintenance\Indexes\SetPriority.cs /}

| Parameters | | |
| - | - | - |
| **indexName** | string | Index name for which to change priority |
| **priority** | `IndexingPriority` | Priority to set |
| **parameters** | `SetIndexesPriorityOperation.Parameters` | List of indexes + Priority to set.<br>An exception is thrown if any of the specified indexes do not exist. |

{CODE syntax_2@ClientApi\Operations\Maintenance\Indexes\SetPriority.cs /}

{CODE syntax_3@ClientApi\Operations\Maintenance\Indexes\SetPriority.cs /}

{PANEL/}

## Related Articles

### Indexes

- [What are Indexes](../../../../indexes/what-are-indexes)
- [Creating and Deploying Indexes](../../../../indexes/creating-and-deploying)

### Server

- [Index Administration](../../../../indexes/index-administration)

### Operations

- [How to Change Index Lock Mode](../../../../client-api/operations/maintenance/indexes/set-index-lock)
