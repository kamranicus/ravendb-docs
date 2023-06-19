# Create a Database: From Backup
---

{NOTE: }

Backups can be easily restored using RavenDB Studio.  

* In this page:  
  * [New Database From Backup - Studio Databases View](../../../studio/database/create-new-database/from-backup#new-database-from-backup---studio-databases-view)  
  * [New Database From Backup - Studio Backups View](../../../studio/database/create-new-database/from-backup#new-database-from-backup---studio-backups-view)  
  * [Backup Source Configuration](../../../studio/database/create-new-database/from-backup#backup-source-configuration)  
  * [Setting Up High Availability After Restoration](../../../studio/database/create-new-database/from-backup#setting-up-high-availability-after-restoration)  
  * [Importing Backups into a Sharded Database](../../../studio/database/create-new-database/from-backup#importing-backups-into-a-sharded-database)  

{NOTE/}

---

{PANEL: New Database From Backup - Studio Databases View}

![Figure 1. Create New Database From Backup](images/new-database-from-backup-1.png "Create New Database From Backup")

 1. Click on the **Databases** tab in the Studio.  
 2. Click the down arrow on the **New database** button.  
 3. Select **New database from backup**  

{PANEL/}

{PANEL: New Database From Backup - Studio Backups View}
Another way to access the New Database From Backup interface is via the Studio Backups view.

![Figure 1. Create New Database From Backup](images/backup-task-view1.png "Create New Database From Backup")

1. Click the **Tasks** tab and select **Backups**.
2. Click the **Restore a database from a backup** button.

{PANEL/}

{PANEL: Backup Source Configuration}

![Figure 2. Backup Source Configuration](images/new-database-from-backup-2.png "Backup Source Configuration")

1. [**Name** your new database](../../../studio/database/create-new-database/general-flow#2.-database-name).  

2. **Source**  
   Select the source server type to see the fields necessary to access the backup
   * If you use an [Amazon S3](https://aws.amazon.com/s3/) custom host:
     ![ForcePathStyle](images/studio-force-path-style.png "ForcePathStyle")
      * a- **Use a custom S3 host**  
        Toggle to provide a custom server URL.  
      * b- **Force path style**  
        Toggle to change the default S3 bucket [path convention](https://aws.amazon.com/blogs/aws/amazon-s3-path-deprecation-plan-the-rest-of-the-story/) on your custom Amazon S3 host.  


3. **Backup Directory**  
   Select the file location that you set when you [created your backup](../../../studio/database/tasks/backup-task).  
    * If your source is a cloud-based database, you will likely need to enter credentials and passwords as well as location.  

4. **Disable ongoing tasks after restore**  
   Disabling will likely require [ongoing tasks](../../../studio/database/tasks/ongoing-tasks/general-info) to be created again.  

5. **Skip indexes**  
   Skipping [indexes](../../../indexes/what-are-indexes) will require your indexes to be built anew.  

6. **Restore Point** 
   Choose the backup version which will populate your new, restored database.  
   * **Snapshot** backup type includes fully built indexes which makes restoring the database faster.  
   * **Full** or **Incremental** types include index definitions from which the new indexes will be built.  
   
{NOTE: }
#### Setting Up High Availability After Restoration 

The backup will be restored only on the current node after restoration.  
To create a database group of at least 3 nodes this database can be added to other nodes 
using the "Add node" button in the [Manage group](../../../studio/database/settings/manage-database-group#database-group-topology---actions) 
Studio view.

{NOTE/}
{PANEL/}

{PANEL: Importing Backups into a Sharded Database}

* The backup of a non-sharded database **cannot** be restored as a new sharded database.  
* The backup of a non-sharded database **can**, however, be imported into an existing sharded database.  
  Read more about this option [here](../../../sharding/migration#backup).  

{PANEL/}


## Related Articles

### Studio Articles
- [Create a Database: General Flow](../../../studio/database/create-new-database/general-flow)  
- [Create a Database: Encrypted](../../../studio/database/create-new-database/encrypted)  
- [The Backup Task](../../../studio/database/tasks/backup-task)  

### Client Articles
- [Database Backup](../../../client-api/operations/maintenance/backup/backup)  
- [Database Restore](../../../client-api/operations/maintenance/backup/restore)  
- [`RestoreBackupOperation`](../../../client-api/operations/server-wide/restore-backup)  
- [Smuggler](../../../client-api/smuggler/what-is-smuggler)  

### Server Articles
- [Backup Overview](../../../server/ongoing-tasks/backup-overview)  

### Migration Articles
- [Migration](../../../migration/server/data-migration)  
- [Migrate to a Sharded DB](../../../sharding/migration)  
