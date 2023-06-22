﻿# Configure Revisions Operation

---

{NOTE: }

* Use `ConfigureRevisionsOperation` to apply the following [revisions configuration](../../../../studio/database/settings/document-revisions#revisions-configuration) to the database:  
  * __Default configuration__ - applies to all document collections.  
  * __Collection-specific configurations__ - override the default settings for these collections.  
  * To apply a configuration for conflict document revisions see [configure conflict revisions](../../../../document-extensions/revisions/client-api/operations/conflict-revisions-configuration).  

* The configuration passed to this operation will __REPLACE__ the current revisions configuration in the database.  
  To __MODIFY__ existing configuration, fetch the current configuration from the database record first.  

* After applying the configuration,  
  revisions are created and purged for a document whenever the document is created, modified, or deleted.  

* To create a revision when there is no configuration defined (or enabled) see: [force revision creation](../../../../document-extensions/revisions/overview#force-revision-creation)

* By default, the operation will be applied to the [default database](../../../../client-api/setting-up-default-database).  
  To operate on a different database see [switch operations to different database](../../../../client-api/operations/how-to/switch-operations-to-a-different-database).  

* In this page:  
  * [Replace configuration](../../../../document-extensions/revisions/client-api/operations/configure-revisions#replace-configuration)  
  * [Modify configuration](../../../../document-extensions/revisions/client-api/operations/configure-revisions#modify-configuration)  
  * [Syntax](../../../../document-extensions/revisions/client-api/operations/configure-revisions#syntax)  

{NOTE/}

---

{PANEL: Replace configuration}

* In this example, we create a new `RevisionsConfiguration` for the database.  
  If revisions configuration already exists in the database - it will be __replaced__.

{CODE:nodejs replace_configuration@document-extensions\revisions\client-api\operations\configureRevisions.js /}

{PANEL/}

{PANEL: Modify configuration}

* In this example, we fetch the existing revisions configuration from the database record and __modify__ it.   

{CODE:nodejs modify_configuration@document-extensions\revisions\client-api\operations\configureRevisions.js /}

{PANEL/}

{PANEL: Syntax}

{CODE:nodejs syntax_1@document-extensions\revisions\client-api\operations\configureRevisions.js /}

| Parameter | Type | Description |
| - | - | - |
| __configuration__ | `RevisionsConfiguration` | The revisions configuration to apply |

{CODE:nodejs syntax_2@document-extensions\revisions\client-api\operations\configureRevisions.js /}

| Property | Type | Description |
| - | - | - |
| __defaultConfig__ | `RevisionsCollectionConfiguration` | Optional default settings that apply to any collection Not specified in `collections`. |
| __collections__ | `Dictionary<string, RevisionsCollectionConfiguration>` | A Dictionary of collection-specific configurations<br>The `keys` are the collection names<br>The `values` are the corresponding configurations.<br>Overrides the default settings for the collections defined. |

{CODE:nodejs syntax_3@document-extensions\revisions\client-api\operations\configureRevisions.js /}

<a id="revisions-collection-configuration-object" />

| Property | Type | Description |
| - | - | - |
| __minimumRevisionsToKeep__ | `number` | <ul><li>This number of revisions will be kept per document.</li><li>Older revisions exceeding this number will be purged upon the next document modification.<li> __Default__ : `null` = no limit </li></ul> |
| __minimumRevisionAgeToKeep__ | `string` | <ul><li>Limit the number of revisions kept per document by their age.</li><li>Revisions that are older than this time will be purged upon the next document modification.</li><li> __Default__ : `null` = no age limit</li><ul> |
| __maximumRevisionsToDeleteUponDocumentUpdate__ | `number` | <ul><li>The maximum number of revisions to delete upon each document modification.</li><li> __Default__ : `null` = no limit,<br> all revisions that pend purging will be deleted.</li></ul> |
| __purgeOnDelete__ | `boolean` | <ul><li>`false` ( __Default__ ) - Revisions of a deleted document are moved to the [Revisions Bin](../../../../studio/database/document-extensions/revisions#revisions-bin).</li><li>`true` - When a document is deleted all its revisions are also deleted.</li></ul> |
| __disabled__ | `boolean` | <ul><li>`false` ( __Default__ ) - Revisions will be created and purged according to the configuration.</li><li>`true` - No revisions will be created or purged.</li></ul> |

{PANEL/}

## Related Articles

### Document Extensions

* [Document Revisions Overview](../../../../document-extensions/revisions/overview)  
* [Revert Revisions](../../../../document-extensions/revisions/revert-revisions)  
* [Revisions and Other Features](../../../../document-extensions/revisions/revisions-and-other-features)  

### Client API

* [Revisions: API Overview](../../../../document-extensions/revisions/client-api/overview)  
* [Session: Loading Revisions](../../../../document-extensions/revisions/client-api/session/loading)  
* [Session: Including Revisions](../../../../document-extensions/revisions/client-api/session/including)  
* [Session: Counting Revisions](../../../../document-extensions/revisions/client-api/session/counting)  
* [What Is a Collection](../../../../client-api/faq/what-is-a-collection)
* [What Are Operations](../../../../client-api/operations/what-are-operations)
* [Switch Operation Database](../../../../client-api/operations/how-to/switch-operations-to-a-different-database)
* [Setting Up a Default Database](../../../../client-api/setting-up-default-database)

### Studio

* [Settings: Document Revisions](../../../../studio/database/settings/document-revisions)  
* [Document Extensions: Revisions](../../../../studio/database/document-extensions/revisions)  
* [Manage Database Group](../../../../studio/database/settings/manage-database-group)
