# Query for Suggestions

---

{NOTE: }

* Given a string term, the Suggestion feature will offer __similar terms__ from your data.

* Word similarities are found using string distance algorithms.

* Examples in this article demonstrate getting suggestions with a __dynamic-query__.  
  For getting suggestions with an __index-query__ see [query for suggestions with index](../../../indexes/querying/suggestions).

---

* In this page:

    * Overview:
        * [What are terms](../../../client-api/session/querying/how-to-work-with-suggestions#what-are-terms)
        * [When to use suggestions](../../../client-api/session/querying/how-to-work-with-suggestions#when-to-use-suggestions)
      
    * Examples:
        * [Suggest terms - for single term](../../../client-api/session/querying/how-to-work-with-suggestions#suggest-terms---for-single-term)
        * [Suggest terms - for multiple terms](../../../client-api/session/querying/how-to-work-with-suggestions#suggest-terms---for-multiple-terms)
        * [Suggest terms - for multiple fields](../../../client-api/session/querying/how-to-work-with-suggestions#suggest-terms---for-multiple-fields)
        * [Suggest terms - customize options and display name](../../../client-api/session/querying/how-to-work-with-suggestions#suggest-terms---customize-options-and-display-name)
      
    * [The auto-index terms in Studio](../../../client-api/session/querying/how-to-work-with-suggestions#the-auto-index-terms-in-studio)
    * [Syntax](../../../client-api/session/querying/how-to-work-with-suggestions#syntax)

{NOTE/}

---

{PANEL: What are terms}

* All queries in RavenDB use an index - learn more about that [here](../../../client-api/session/querying/how-to-query#queries-always-provide-results-using-an-index).  
  Whether making a dynamic query which generates an auto-index or using a static index,  
  the data from your documents is 'broken' into __terms__ that are kept in the index.  

* This tokenization process (what terms will be generated) depends on the analyzer used,    
  various analyzers differ in the way they split the text stream. Learn more in [Analyzers](../../../indexes/using-analyzers).

* The terms can then be queried to retrieve matching documents that contain them.

{PANEL/}

{PANEL: When to use suggestions}

Querying for suggestions is useful in the following scenarios:

  * __When query has no results__:

      * When searching for documents that match some condition on a given string term,  
        if the term is misspelled then you will Not get any results.  
        You can then ask RavenDB to suggest similar terms that do exist in the index.

      * The suggested terms can then be used in a new query to retrieve matching documents,  
        or simply presented to the user asking what they meant to query.

  * __When looking for alternative terms__:

      * When simply searching for additional alternative terms for a term that does exist.  

{WARNING: }

The resulting suggested terms will Not include the term for which you search,  
they will only contain the similar terms.

{WARNING/}

{PANEL/}

{PANEL: Suggest terms - for single term}

Consider this example:  
Based on the __Northwind sample data__, the following query has no resulting documents,  
as no document in the Products collection contains the term `chaig` in its `Name` field.

{CODE:nodejs suggest_1@ClientApi\Session\Querying\workWithSuggestions.js /}

* Executing the above query will generate the auto-index `Auto/Products/ByName`.  
  This auto-index will contain a list of all available terms from the document field `Name`.  
  The generated terms are visible in the Studio - see image [below](../../../client-api/session/querying/how-to-work-with-suggestions#the-auto-index-terms-in-studio).

* If you suspect that the term `chaig` in the query criteria is written incorrectly,   
  you can ask RavenDB to suggest __existing terms__ that are similar to `chaig`, as follows:.  

{CODE-TABS}
{CODE-TAB:nodejs:Query suggest_2@ClientApi\Session\Querying\workWithSuggestions.js /}
{CODE-TAB-BLOCK:sql:RQL}
// Query for terms from field 'Name' that are similar to 'chaig'
from "Products"
select suggest(Name, "chaig")
{CODE-TAB-BLOCK/}
{CODE-TABS/}

{CODE:nodejs suggest_3@ClientApi\Session\Querying\workWithSuggestions.js /}

{PANEL/}

{PANEL: Suggest terms - for multiple terms}

{CODE-TABS}
{CODE-TAB:nodejs:Query suggest_4@ClientApi\Session\Querying\workWithSuggestions.js /}
{CODE-TAB-BLOCK:sql:RQL}
// Query for terms from field 'Name' that are similar to 'chaig' OR 'tof'
from "Products" select suggest(Name, $p0)
{ "p0" : ["chaig", "tof"] }
{CODE-TAB-BLOCK/}
{CODE-TABS/}

{CODE:nodejs suggest_5@ClientApi\Session\Querying\workWithSuggestions.js /}

{PANEL/}

{PANEL: Suggest terms - for multiple fields}

{CODE-TABS}
{CODE-TAB:nodejs:Query suggest_6@ClientApi\Session\Querying\workWithSuggestions.js /}
{CODE-TAB-BLOCK:sql:RQL}
// Query for suggested terms from field 'Name' and field 'Contact.Name'
from "Companies"
select suggest(Name, "chop-soy china"), suggest(Contact.Name, "maria larson")
{CODE-TAB-BLOCK/}
{CODE-TABS/}

{CODE:nodejs suggest_7@ClientApi\Session\Querying\workWithSuggestions.js /}

{PANEL/}

{PANEL: Suggest terms - customize options and display name}

{CODE-TABS}
{CODE-TAB:nodejs:Query suggest_8@ClientApi\Session\Querying\workWithSuggestions.js /}
{CODE-TAB-BLOCK:sql:RQL}
// Query for suggested terms - customize options and display name
from "Products"
select suggest(
    Name,
    'chaig',
    '{ "Accuracy" : 0.4, "PageSize" : 5, "Distance" : "JaroWinkler", "SortMode" : "Popularity" }'
) as "SomeCustomName"
{CODE-TAB-BLOCK/}
{CODE-TABS/}

{CODE:nodejs suggest_9@ClientApi\Session\Querying\workWithSuggestions.js /}

{PANEL/}

{PANEL: The auto-index terms in Studio}

Based on the Northwind sample data, these are the terms generated for index `Auto/Products/ByName`:

![Figure 1. Auto-index terms](images/auto-index-terms.png "Terms generated for index Auto/Products/ByName")

1. __The field name__ - derived from the document field that was used in the dynamic-query.  
   In this example the field name is `Name`.

2. __The terms__ generated from the data that the Products collection documents have in their `Name` field.

{PANEL/}

{PANEL: Syntax}

__Suggest using__:

{CODE:nodejs syntax_1@ClientApi\Session\Querying\workWithSuggestions.js /}

| Parameter   | Type                | Description                                                                     |
|-------------|---------------------|---------------------------------------------------------------------------------|
| __action__  | `(builder) => void` | Builder function with a fluent API that constructs a `SuggestionBase` instance. |

__Builder operations__:

{CODE:nodejs syntax_2@ClientApi\Session\Querying\workWithSuggestions.js /}

| Parameter       | Type       | Description                                                                                        |
|-----------------|------------|----------------------------------------------------------------------------------------------------|
| __fieldName__   | `string`   | The index field in which to search for similar terms                                               |
| __term__        | `string`   | The term for which to get suggested similar terms                                                  |
| __terms__       | `string[]` | List of terms for which to get suggested similar terms                                             |
| __displayName__ | `string`   | A custom name for the suggestions result (optional).                                               |
| __options__     | `object`   | Non-default suggestion options to use in the operation (optional).<br>See available options below. |

__Suggestions options__:

| Option       | Type      | Description                                                                                                                                                 |
|--------------|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| __pageSize__ | `number`  | <ul><li>Maximum number of suggested terms that will be returned</li><li>Default is <strong>15</strong></li></ul>                                            |
| __distance__ | `string`  | <ul><li>String distance algorithm to use</li><li>`None` / `Levenshtein` / `JaroWinkler` / `NGram`</li><li>Default is <strong>Levenshtein</strong></li></ul> |
| __accuracy__ | `number ` | <ul><li>Suggestion accuracy</li><li>Default is <strong>0.5</strong></li></ul>                                                                              |
| __sortMode__ | `string`  | <ul><li>Indicates the order by which results are returned</li><li>`None` / `Popularity`</li><li>Default is <strong>Popularity</strong></li></ul>            |

{PANEL/}

## Related Articles

### Session

- [How to Query](../../../client-api/session/querying/how-to-query)

### Indexes

- [Query for suggestions with index](../../../indexes/querying/suggestions)
