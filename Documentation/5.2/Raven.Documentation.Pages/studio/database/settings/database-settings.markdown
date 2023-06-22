﻿# Database Settings

---

{NOTE: }

* The **Database Settings View** lists all the database and server configuration keys & values.  

* Only the **database scope** configuration keys can be edited from this view.  
  Configuration keys that relate only to the **server scope** are edited in the 
  [`settings.json` file](../../../server/configuration/configuration-options#settings.json) 
  and can only be viewed here.  

* After editing & saving a configuration key, the change does not take effect 
  until the database is [reloaded](../../../studio/database/settings/database-settings#how-to-reload-the-database).  

{WARNING: Warning}
Do not modify the database settings unless you are an expert and know what you're doing.  
{WARNING/}

* In this page:  
  * [View Database Settings](../../../studio/database/settings/database-settings#view-database-settings)  
  * [Edit Database Settings](../../../studio/database/settings/database-settings#edit-database-settings)  
      * [Database Settings View with Pending Values](../../../studio/database/settings/database-settings#database-settings-view-with-pending-values)  
  * [How to Reload the Database](../../../studio/database/settings/database-settings#how-to-reload-the-database)  

{NOTE/}

---

{PANEL: View Database Settings}

![Figure 1: Database Settings View](images/database-settings-1.png "Figure 1: Database Settings View")

1. Navigate to **Settings > Database Settings**.  
2. Type a keyword here to filter the configuration keys.  
3. Click on **Edit** to access the database setting editing view. [See next section](../../../studio/database/settings/database-settings#edit-database-settings).  
4. This column lists the **Configuration Keys**.  
    * A 'yellow' entry is a key whose value was customized by the user.  
    * A 'green' entry is a key holding a default value that was not modified.  
5. This column shows the **Effective Value** for each key.  
   It is the current value of the key - either the default value or a customized value if modified by the user.  
6. This column indicates the value's **Origin**:  
    * **Default** - This is the default value, no customized value was set.  
    * **Server** - Value is configured in the settings.json file (customized by the user), overriding the default settings.  
    * **Database** - Value is configured in the database record (customized by the user), overriding the server & default settings.  

{PANEL/}

{PANEL: Edit Database Settings }

* Only the **database scope** configuration keys can be edited from this view.  
  Configuration keys that relate only to the **server scope** are edited in the 
  [`settings.json` file](../../../server/configuration/configuration-options#settings.json) 
  and can only be viewed here.  

* Once you save the changes made in this view, all modifications are saved into the 
  [database record](../../../studio/database/settings/database-record).  
  However, in order for those changes to be in effect, the database must be reloaded.  
  See [How to Reload the Database](../../../studio/database/settings/database-settings#how-to-reload-the-database).  

![Figure 2: Edit Database Settings](images/database-settings-2.png "Figure 2: Edit Database Settings")

1. Type a keyword here to filter the configuration keys.  
2. For easier navigation, the configuration keys are divided into **Categories** 
   according to the related RavenDB feature.  
3. This column lists the **Configuration Keys** in the selected Category.  
4. This column lists the current **Value** set for the key.  
5. The lock icon indicates that this key is server scoped and can not be modified here.  
   It can be edited only from the [`settings.json` file](../../../server/configuration/configuration-options#settings.json) 
   located in your RavenDB executable folder.  
6. Toggle to override the current value of this key.  
7. Use the edit box to customize the value.  
8. Click **Set default** to display the default value of this key in the edit box.  
   This default value will override the current value.  
9. Save the changes made to the settings.  
   All changes will immediately be written to the database record.  
   However, in this view, the changes will appear as pending and will not be in effect until the 
   database is reloaded.  
   See [How to Reload the Database](../../../studio/database/settings/database-settings#how-to-reload-the-database).  

### Database Settings View with Pending Values

![Figure 3: Database Settings with Pending Values](images/database-settings-3.png "Figure 3: Database Settings with Pending Values")

After editing the configuration keys and saving your changes, the main database settings 
view slightly changes.  

1. The Effective Value column now becomes **Effective Value in Use**.  
   It is the key value that is currently being used (not the new customized value).  
2. The Origin column is replaced with the **Pending Value** column.  
   This shows your new customized value.  
   This pending value will be applied and replace the Effective Value once the database is reloaded.  

{PANEL/}

{PANEL: How to Reload the Database}

There are a few ways to reload a database:  

1. Restart RavenDB on all nodes.  
   The database settings configuration will become effective for each node that is restarted.

2. Execute the [toggle database state](../../../client-api/operations/server-wide/toggle-databases-state) operation from the Client API.  

3. Disable and then re-enable the database from the [Database List View](../../../studio/database/databases-list-view) in the Studio, see image below.  
   This will reload the database on all the cluster nodes immediately.

![Figure 4: How to Reload the Database](images/database-settings-4.png "Figure 3: How to Reload the Database")

1. Navigate to the **Database List View**.  
2. Click **Disable** to disable the database. This makes the database inaccessible and halts 
   all processes such as indexing. Once the database is disabled, this button changes to **Enable**. 
   Click on it again to enable the database.  

{PANEL/}

## Related Articles  

### Studio  

- [Database Record](../../../studio/database/settings/database-record)  
- [Database List View](../../../studio/database/databases-list-view)  

### Server  

- [Configuration Options](../../../server/configuration/configuration-options)  
