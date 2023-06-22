﻿# Backup & Restore: <br> Frequently Asked Questions  
---

{NOTE: }

* In this page:  
  * [Is there a one-time backup?](../../../../client-api/operations/maintenance/backup/faq#is-there-a-one-time-backup)  
  * [How do I create a backup of my cluster, not just one database?](../../../../client-api/operations/maintenance/backup/faq#how-do-i-create-a-backup-of-my-cluster-not-just-one-database)  
  * [How should the servers' time be set in a multi-node cluster?](../../../../client-api/operations/maintenance/backup/faq#how-should-the-servers-time-be-set-in-a-multi-node-cluster)  
  * [Is an External Replication a good substitute for a backup task?](../../../../client-api/operations/maintenance/backup/faq#is-an-external-replication-task-a-good-substitute-for-a-backup-task)  
  * [Can I simply copy the database folder contents whenever I need to create a backup?](../../../../client-api/operations/maintenance/backup/faq#can-i-simply-copy-the-database-folder-contents-whenever-i-need-to-create-a-backup)  
  * [Does RavenDB automatically delete old backups?](../../../../client-api/operations/maintenance/backup/faq#does-ravendb-automatically-delete-old-backups)  
  * [Are there any locations that backup files should NOT be stored at?](../../../../client-api/operations/maintenance/backup/faq#are-there-any-locations-that-backup-files-should-not-be-stored-at)  
  * [What happens when a backup process fails before it is completed?](../../../../client-api/operations/maintenance/backup/faq#what-happens-when-a-backup-process-fails-before-completion)  

{NOTE/}

---

{PANEL: FAQ}

###Is there a one-time backup?

Yes. Although [backup is a vital ongoing task](../../../../studio/database/tasks/backup-task#periodic-backup-creation) and is meant to back your data up continuously, 
you can also use [one-time manual backups](../../../../studio/database/tasks/backup-task#manually-creating-one-time-backups) 
(e.g. before upgrading or other maintenance).  

* You can also use [Smuggler](../../../../client-api/smuggler/what-is-smuggler#what-is-smuggler) as an equivalent of a full backup for a single [export](../../../../client-api/smuggler/what-is-smuggler#export) operation.  

---

###How do I create a backup of my cluster, not just one database?  

You can run a [server-wide ongoing backup](../../../../studio/server/server-wide-backup) 
which backs up each of the databases in your cluster.  
What does it back up? Both binary "Snapshot" and json "Backup" types of backup tasks 
save the entire [database record](../../../../studio/database/settings/database-record) including: 

* Database contents
* Document extensions (attachments, counters, and time-series)
* Indexes (json Backup saves only the index definitions, while Snapshot saves fully built indexes)
* Revisions
* Conflict configurations
* Identities
* Compare-exchange items
* Ongoing tasks (Ongoing backup, ETL, Subscription, and Replication tasks)  

**Cluster configuration and nodes setup** can be [re-created](../../../../start/getting-started#installation--setup) 
and databases can be [restored from backup](../../../../studio/database/create-new-database/from-backup).  

**To prevent downtime while rebuilding**, you can [replicate your database](../../../../studio/database/tasks/ongoing-tasks/hub-sink-replication/overview) 
so that there is a live version available to distribute the workload and act as a failover.  
[Is an External Replication a good substitute for a backup task?](../../../../client-api/operations/maintenance/backup/faq#is-an-external-replication-task-a-good-substitute-for-a-backup-task)  

---

###How should the servers' time be set in a multi-node cluster?

The backup task runs on schedule according to the executing server's local time.  
It is recommended that you set all nodes to the same time. This way, backup files' 
time-signatures are consistent even when the backups are created by different nodes.  

---

###Is an External Replication task a good substitute for a backup task?  

Although [External Replication](../../../../studio/database/tasks/ongoing-tasks/external-replication-task) 
and [Backup](../../../../client-api/operations/maintenance/backup/backup) 
are both ongoing tasks that create a copy of your data, they have different aims and behavior.  

For example, replication tasks don't allow you to retrieve data from a history/restore point after mistakes, 
but they do create a live copy that can be used as a failover and they can distribute the workload.  
See [Backup Task -vs- External Replication Task](../../../../studio/database/tasks/backup-task#backup-task--vs--replication-task).  

---

###Can I simply copy the database folder contents whenever I need to create a backup?  

Simply copying the database folder of a live database will probably create corrupted data in the backup.  
Creating an [ongoing backup task](../../../../client-api/operations/maintenance/backup/backup) is a one-time operation. 
There really is no reason to do it manually again and again.  
There really is no reason to do it manually again and again. Properly backing up provides: 

* **Up-to-date backups** by incrementally and frequently updating changes in the data.  
* **The creation of a reliable point-in-time freeze** of backed-up data that can be used in case of mistaken deletes or patches.  
* **The assurance of ACID compliance** for backed up data during interactions with the file system.  

---

###Does RavenDB automatically delete old backups?  

You can configure RavenDB to delete old backups with the `RetentionPolicy` feature.  
If you enable it, RavenDB will delete backups after the `TimeSpan` that you set.  
By default, `RetentionPolicy` is disabled.  

Learn how to change the [Retention Policy via the RavenDB Studio](../../../../studio/database/tasks/backup-task#retention-policy).  
Learn how to change the [Retention Policy via API](../../../../client-api/operations/maintenance/backup/backup#backup-retention-policy).

---

###Are there any locations that backup files should NOT be stored at?  

It is recommended **not to store backups on the same drive as your database** data files, 
since both the database and the backups would be exposed to the same risks.  

* Disk space can run low as backups start piling up unless you [set your retention policy for backups](../../../../client-api/operations/maintenance/backup/faq#does-ravendb-automatically-delete-old-backups).
* There are many [options for backup locations](../../../../studio/database/tasks/backup-task#destination).  
* We recommend creating ongoing backups in two different types of locations (cloud and local machine).  
  You can store your backups in multiple locations by setting up one [on-going backup task](../../../../studio/database/tasks/backup-task) 
  with multiple destinations.  

---

###What happens when a backup process fails before completion?  

While in progress, the backup content is written to an **.in-progress* file on disk.  

* Once **backup is complete**, the file is renamed to its correct final name.  
* If the backup process **fails before completion**, the **.in-progress* file remains on disk.  
  This file will not be used in any future Restore processes.  
  If the failed process was an incremental-backup task, any future incremental backups will 
  continue from the correct place before the file was created so that the backup is consistent with the source.  

{PANEL/}

## Related Articles  
###Server  
- [Backup Overview](../../../../server/ongoing-tasks/backup-overview)

###Client API  
- [Backup](../../../../client-api/operations/maintenance/backup/backup)  
- [Restore](../../../../client-api/operations/maintenance/backup/restore)  
- [Encrypted-Backup : Create & Restore](../../../../client-api/operations/maintenance/backup/encrypted-backup)  
- [What Is Smuggler](../../../../client-api/smuggler/what-is-smuggler)  

###Studio  
- [The Backup Task](../../../../studio/database/tasks/backup-task)  
- [Create Database: from Backup](../../../../studio/database/create-new-database/from-backup)  
- [Create a Database: General Flow](../../../../studio/database/create-new-database/general-flow)  
- [Create a Database: Encrypted](../../../../studio/database/create-new-database/encrypted)  

###Security  
- [Database Encryption](../../../../server/security/encryption/database-encryption)  
- [Security Overview](../../../../server/security/overview)  
- [Authentication and Certification](../../../../server/security/authentication/certificate-configuration)  

###Migration  
- [Migration](../../../../migration/server/data-migration)   
