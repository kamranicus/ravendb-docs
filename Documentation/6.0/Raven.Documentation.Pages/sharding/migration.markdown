﻿# Sharding: Migration
---

{NOTE: }

When [it's time](../sharding/overview#when-should-sharding-be-used) 
to move on to a sharded database, data can be migrated from the existing 
database to the new one in several ways.  

* The data can be [exported](../sharding/import-and-export#export) 
  from the original database into a RavenDB dump file and then 
  [imported](../sharding/import-and-export#import) from the file 
  into the new sharded database.  
* **Import** can also be used with [backups](../sharding/backup-and-restore/backup) 
  prepared for non-sharded databases, to add their contents into 
  an existing sharded database.  
* An [external replication task](../sharding/external-replication) 
  can maintain a live replica of a non-sharded database on a sharded 
  destination database, as backup or as part of a gradual deployment 
  of the replica.  

* In this page:  
  * [Export & Import](../sharding/migration#export-&-import)  
  * [Backup](../sharding/migration#backup)  
  * [External Replication](../sharding/migration#external-replication)  

{NOTE/}

---

{PANEL: Export & Import}

Export is a **one-time operation** that dumps the current contents 
of the database into a `.ravendbdump` file.  
The exported dump file of either a sharded or a non-sharded database 
can then be [imported](../sharding/import-and-export#import) into 
a sharded database, that will distribute the data between its shard.  

* Exporting can be done via [code](../client-api/smuggler/what-is-smuggler#export) 
  or [Studio](../studio/database/tasks/export-database).  
* Importing can be done via [code](../client-api/smuggler/what-is-smuggler#import) 
  or [Studio](../studio/database/tasks/import-data/import-data-file).  
* Read about export and import in a sharded database [here](../sharding/import-and-export).  

* Data can also be 
  [imported from backup files](../sharding/import-and-export#importing-data-from-backup-files).  
  A backup of a non-sharded database **can** be imported into an existing sharded database.  
  The imported data will be added to the sharded database and distributed between the shards.  
  {NOTE: }
  Note that this opposes [restoring](../sharding/backup-and-restore/restore) 
  a non-sharded database, which can only create a new non-sharded database 
  but **not** create a sharded database or add its data to an existing database.  
  {NOTE/}
   
{PANEL/}

{PANEL: Backup}

RavenDB backups are **periodic operations**, implemented by 
[ongoing tasks](../server/ongoing-tasks/backup-overview) 
that routinely save either a full copy of the database or 
an incremental delta of data changes made since the last backup.  

To migrate data from a non-sharded database to a sharded one, 
backup files made for a non-sharded database can be 
[imported](../sharding/import-and-export#importing-data-from-backup-files) 
into a new or an existing sharded database.  

{NOTE: }
A backup created for a non-sharded database **cannot** be 
[restored](../sharding/backup-and-restore/restore) as a sharded database.  
The data can be migrated into a sharded database only by importing it.  
{NOTE/}

{PANEL/}

{PANEL: External Replication}

[External replication](../server/ongoing-tasks/external-replication) 
is an **ongoing task** that keeps a live replica of its database's data 
on another database.  
The task keeps the two databases in sync by updating the destination 
database with any deletion, addition, or modification made in the 
origin database's data.  

An external replication task can run on a non-sharded database, 
and [create a live replica of its data on a sharded database](../sharding/external-replication#non-sharded-database-to-sharded-database).  
The destination (sharded) database will distribute incoming data 
among its shards.  
The sharded database can be kept and tested in a controlled environment 
as long as necessary, as the original database keeps on serving its users. 
When all is ready, the new database can be moved into production.  

{NOTE: }
A live replica created using external replication includes all documents 
and document extensions, but **not** server and cluster level features like 
indexes and compare exchange entries. Find the full list [here](../server/ongoing-tasks/external-replication#general-information-about-external-replication-task).  
{NOTE/}

{PANEL/}

## Related articles

### Sharding
- [Create Database](../sharding/administration/studio-admin#creating-a-sharded-database)  
- [Export](../sharding/import-and-export#export)  
- [Import](../sharding/import-and-export#import)  
- [Backup](../sharding/backup-and-restore/backup)  
- [Restore](../sharding/backup-and-restore/restore)  
- [Restore From File](../sharding/import-and-export#importing-data-from-a--file)  
- [Restore From Backup](../sharding/import-and-export#importing-data-from-backup-files)  
- [External Replication](../sharding/external-replication)  

### Client API
- [Smuggler](../client-api/smuggler/what-is-smuggler)  
