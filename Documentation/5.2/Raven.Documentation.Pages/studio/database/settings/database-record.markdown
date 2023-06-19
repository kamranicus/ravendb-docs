﻿# Database Record
---

{NOTE: }

* The Database Record document contains the database settings and configuration 

* It is always up to date with the latest database state & tasks

* Every node in the cluster has a copy of this document and will perform its tasks accordingly

* The Database Record is Not editable

* In this page:  
  * [The Database Record](../../../studio/database/settings/database-record#the-database-record)  
  * [The Database Record Fields](../../../studio/database/settings/database-record#the-database-record-fields)  
{NOTE/}

---

{PANEL: The Database Record}

![Figure 1. Database Record](images/database-record-1.png "The Database Record for database 'db1'")

{PANEL/}

{PANEL: The Database Record Fields}

| - | - |
| `DatabaseName` | The database name as defined when created. <br/> See [Create Database](../../../studio/database/create-new-database/general-flow) |
| `Disabled` | True or false. <br/> Can be modified in [Databases View](../../../studio/database/databases-list-view#database-actions) |
| `Encrypted` | True or false, defined when the database is created. <br/> See [Create Database - Encrypted](../../../studio/database/create-new-database/encrypted) |
| `Topology` | The current Database Group Topology. <br/> Can be managed in [Database Group Topology](../../../studio/database/settings/manage-database-group) |
| `Indexes` | The current indexes defined in the database. <br/> Can be managed in [Indexes](../../../studio/database/indexes/indexes-list-view) |
| `AutoIndexes` | The current auto-indexes that exist in the database. <br/> Can be managed in [Auto-Indexes](../../../studio/database/indexes/indexes-list-view) |
| `Settings` | Server configuration, <br/> As set in the [settings.json file](../../../server/configuration/configuration-options) |
| `Revisions` | Documents revisions configuration. <br/> Can be set in [Document Revisions](../../../server/extensions/revisions) |
| `Expiration` | Documents expiration configuration. <br/> Can be set in [Document Expiration](../../../studio/database/settings/document-expiration) |
| `PeriodicBackups` | Current Backup tasks configured. <br/> Can be managed in [Backup Task](../../../studio/database/tasks/backup-task) |
| `ExternalReplications` | Current External Replicaton tasks configured. <br/>Can be managed in [External Replication Task](../../../studio/database/tasks/ongoing-tasks/external-replication-task) |
| `RavenConnectionStrings` | RavenDB connection strings that are defined for usage with RavenDB ETL tasks and External Replication and Hub/Sink Replication tasks. <br/> See [RavenDB Connection Strings](../../../client-api/operations/maintenance/connection-strings/add-connection-string) |
| `SqlConnectionStrings` | SQL connection strings that are defined for usage with SQL ETL task. ||
| `RavenEtls` | Current RavenDB ETL tasks configured. <br/> Can be managed in [RavenDB ETL Task](../../../studio/database/tasks/ongoing-tasks/ravendb-etl-task) |
| `SqlEtls` | Current SQL ETL tasks configured. <br/> Can be managed in [SQL ETL Task](../../../server/ongoing-tasks/etl/sql) |
| `Client` | The database Client Configuration. <br/> As set in [Database Client Configuration](../../../studio/database/settings/client-configuration-per-database) |
| `DeletionInProgress` | A list of nodes that are currently in the process of deleting this database |
| `DeletionInProgressChangeVector` | The _change-vector_ that accompanies a _Delete Database_ command that is issued by the Cluster Observer when supervising the database replication factor after a partition scenario. <br/> Relevant only for a node that has come back from a Rehab state after a partition occurred, in order to update the other nodes in the database group with database content updates that occurred on this node at partition time. |
| `ConflictSolverConfig` | Conflict Resolution configuration. <br/> Can be set in [Conflict Resolution](../../../studio/database/settings/conflict-resolution) |
| `Etag` | The _etag_ of the Database Record document - representing only the changes to the database record document itself. <br/> (Not to be confused with the database _Last Document Etag_ - <br/> See [Database Stats](../../../studio/database/databases-list-view#database-stats)) |

{NOTE Fields that are _not_ defined will _not_ show in this view /}
{PANEL/}
