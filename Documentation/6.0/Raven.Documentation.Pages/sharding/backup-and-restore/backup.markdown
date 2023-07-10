﻿# Sharding: Backup
---

{NOTE: }

* Sharded databases are backed up using user-defined periodic 
  [backup tasks](../../server/ongoing-tasks/backup-overview).  

* Shards can store backup files **locally** (each shard using its 
  own node machine storage) and/or **remotely** (all shards sending 
  backup files to a common remote destination like an AWS S3 bucket).  

* Both [Full](../../server/ongoing-tasks/backup-overview#full-backup) 
  and [Incremental](../../server/ongoing-tasks/backup-overview#incremental-backup) 
  backups can be created for a sharded database.  

* A [logical](../../server/ongoing-tasks/backup-overview#logical-backup) 
  backup **can** be created for a sharded database and restored into either 
  a sharded or a non-sharded database.  

* A [snapshot](../../server/ongoing-tasks/backup-overview#snapshot) 
  backup **cannot** be created for a sharded database.  

* A manual [one-time](../../studio/database/tasks/backup-task#manually-creating-one-time-backups) 
  backup **can** be created for a sharded database.  

* In this page:  
  * [Backup](../../sharding/backup-and-restore/backup#backup)  
     * [Sharded and Non-Sharded Backup Tasks](../../sharding/backup-and-restore/backup#sharded-and-non-sharded-backup-tasks)  
     * [Backup Storage: Local and Remote](../../sharding/backup-and-restore/backup#backup-storage-local-and-remote)  
     * [Backup Files Extension and Structure](../../sharding/backup-and-restore/backup#backup-files-extension-and-structure)  
     * [Backup Type](../../sharding/backup-and-restore/backup#backup-type)  
     * [Backup Scope](../../sharding/backup-and-restore/backup#backup-scope)  
     * [Naming Convention](../../sharding/backup-and-restore/backup#naming-convention)  
     * [Server-Wide Backup](../../sharding/backup-and-restore/backup#server-wide-backup)  
     * [Example](../../sharding/backup-and-restore/backup#example)  
  * [Backup Options Summary](../../sharding/backup-and-restore/backup#backup-options-summary)  

{NOTE/}

---

{PANEL: Backup}

## Sharded and Non-Sharded Backup Tasks

From a user's perspective, backing up a sharded database is done by 
defining and running **a single backup task**, just like it is done 
with a non-sharded database.  

Behind the scenes, though, each shard backs up its own slice of the 
database independently from other shards.  

Distributing the backup responsibility between the shards allows 
RavenDB to speed up the backup process and keep backup files in 
manageable proportions no matter what the overall database size is.  

### Non-Sharded DB Backup Tasks

* A complete replica of the database is kept by each cluster node.  
* Any node can therefore be made 
  [responsible](../../server/clustering/distribution/highly-available-tasks#responsible-node) 
  for backups by the cluster.  
* The responsible node runs the backup task periodically to create 
  a backup of the entire database.  
  
### Sharded DB Backup Tasks

* Each shard hosts a unique part of the database, so no single node 
  can create a backup of the entire database.  
* After a user defines a backup task, RavenDB automatically creates 
  one backup task per shard, based on the user-defined task.  
  This operation is automatic and requires no additional actions 
  from the user.  
* Each shard appoints [one of its nodes](../../sharding/overview#shard-replication) 
  responsible for the execution of the shard's backup task.  
* Each shard backup task can keep the shard's database 
  locally (on the shard machine), and/or remotely (on one 
  or more cloud destinations).  
* A backup task can store backups on multiple destinations, 
  e.g. locally, on an S3 bucket, and on an Azure blob.  
* To [restore](../../sharding/backup-and-restore/restore) 
  the entire database, the restore process is provided with 
  the locations of the backup folders used by all shards.  
* When restoring the database, the user doesn't have to restore 
  all shard backups. It is possible, for example, to restore only 
  one of the shards. Using this flexibility, a sharded database 
  can easily be split into several databases.  

## Backup Storage: Local and Remote

Backup files can be stored locally and remotely.  
Find a code example [here](../../sharding/backup-and-restore/backup#example).  

* **Local Backup**  
  A shard's backup task may keep backup data locally, 
  using the node's local storage.  

    [Restoring](../../sharding/backup-and-restore/restore#section-2) 
    backup files that were stored locally requires the user to provide 
    the restore process with the location of the backup folder on each 
    shard's node.  

* **Remote location**  
  Backups can also be kept remotely. All shards will transfer 
  the backup files to a common location, using one of the currently 
  supported platforms:  
   * Azure Blob Storage  
   * Amazon S3 Storage  
   * Google Cloud Platform  

    [Restoring](../../sharding/backup-and-restore/restore#section-2) 
    backup files that were stored remotely requires the user to provide 
    the restore process with each shard's backup folder location.  

## Backup Files Extension and Structure

backup files use the same internal structure as the `.ravendbdump` 
files that [Studio](../../studio/database/tasks/export-database) 
and [Smuggler](../../client-api/smuggler/what-is-smuggler) 
create when **exporting** data.  
It is therefore possible to not only [restore](../../sharding/backup-and-restore/restore) 
but also **import** backup files using [studio](../../studio/database/tasks/import-data/import-data-file) 
and [smuggler](../../client-api/smuggler/what-is-smuggler#import).  
Read more about this feature [here](../../sharding/import-and-export#import).  


{NOTE: }
Backed-up data includes both 
[database-level and cluster-level content](../../server/ongoing-tasks/backup-overview#backup-contents).  
{NOTE/}

## Backup Type

A shard backup task can create a 
[Logical backup](../../server/ongoing-tasks/backup-overview#logical-backup) 
only.  

A [Snapshot](../../server/ongoing-tasks/backup-overview#snapshot) 
backup **cannot** be created for a sharded database.  

`Logical` backups created for a sharded database can be restored into 
both sharded and non-sharded databases.  

## Backup Scope

A shard backup task can create 
a [Full backup](../../server/ongoing-tasks/backup-overview#full-backup) 
with the entire content of the shard, or an 
[Incremental Backup](../../server/ongoing-tasks/backup-overview#incremental-backup) 
with just the difference between the current database data and the last backed-up data.  

## Naming Convention

* Backup files created for a sharded database generally follow the same naming 
  [convention](../../server/ongoing-tasks/backup-overview#backup-name-and-folder-structure) 
  as non-sharded database backups.  

* Each shard keeps its backup files in a folder whose name consists of:  
   * **Date and Time** (when the folder was created)  
   * **Database Name**  
   * `$` symbol  
   * **Shard Number**  

      The backup folders for a 3-shard database named "Books", 
      for example, can be named:  
      `2023-02-05-16-17.Books$0` for shard 0  
      `2023-02-05-16-17.Books$1` for shard 1  
      `2023-02-05-16-17.Books$2` for shard 2  

## Server-Wide Backup

[Server-wide backup](../../client-api/operations/maintenance/backup/backup#server-wide-backup) 
backs up all the databases hosted by the cluster, by creating a backup 
task for each database and executing all tasks at a scheduled time.  

* A server-wide backup will create backups for both non-sharded **and** 
  sharded databases.  
* To create a backup for an entire sharded database, the operation will 
  define and execute a backup task for each shard, behaving as if it was 
  defined manually.  

## Example

The backup task that we define here is similar to the task we 
would define for a non-sharded database. As part of a sharded 
database, however, this task will be re-defined automatically 
by the orchestrator for each shard.  
{CODE backup_remote_destinations@Sharding\ShardingBackupAndRestore.cs /}

{PANEL/}

{PANEL: Backup Options Summary}

| Option | Available on a Sharded Database | Comment |
| -------------------- | --------------- | --------------------- |
| Store backup files created by shards in **local shard machine storage** | **Yes** | Shards can store the backups they create locally. |
| Store backup files of sharded databases [remotely](../../sharding/backup-and-restore/backup#backup-storage-local-and-remote) | **Yes** | Shards can store the backups they create on remote S3, Azure, or Google Cloud destinations. |
| Create [Full](../../server/ongoing-tasks/backup-overview#full-backup) backups for sharded databases | **Yes** |  |
| Create [Incremental](../../server/ongoing-tasks/backup-overview#incremental-backup) backups for sharded databases | **Yes** |  |
| Create [Logical](../../server/ongoing-tasks/backup-overview#logical-backup) backups for sharded databases | **Yes** |  |
| Create [Snapshot](../../server/ongoing-tasks/backup-overview#snapshot) backups for sharded databases | **No** | Snapshot backups CANNOT be created for (nor restored to) sharded databases. |
| Create **periodic backup tasks** for sharded databases | **Yes** |  |
| Run a manual [one-time](../../studio/database/tasks/backup-task#manually-creating-one-time-backups) backup operation on a sharded database | **Yes** |  |
| Include sharded databases in a [server-wide backup operation](../../sharding/backup-and-restore/backup#server-wide-backup) | **Yes** | A server-wide backup operation will create backups for all databases, including the sharded ones. |

{PANEL/}

## Related articles

### Client API
- [Smuggler](../../client-api/smuggler/what-is-smuggler)  
- [Server-Wide Backup](../../client-api/operations/maintenance/backup/backup#server-wide-backup)  

### Server
- [Backup Overview](../../server/ongoing-tasks/backup-overview)  
- [External Replication](../../server/ongoing-tasks/external-replication)  
- [Responsible Node](../../server/clustering/distribution/highly-available-tasks#responsible-node)  

### Sharding
- [Export Data](../../sharding/import-and-export#export)  
- [Import Data](../../sharding/import-and-export#import)  
- [Creating a Sharded DB](../../sharding/administration/studio-admin#creating-a-sharded-database)  

### Studio
- [One-Time Backup](../../studio/database/tasks/backup-task#manually-creating-one-time-backups)  

