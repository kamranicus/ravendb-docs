# Indexes: Map Indexes
---

{NOTE: }

`Map` indexes, sometimes referred to as simple indexes, contain one (or more) mapping functions that indicate which fields from the documents should be indexed. They indicate which documents can be searched by which fields. 

These **mapping functions** are **LINQ-based functions** or  **JavaScript functions** (when using JavaScript indexes)  and can be considered the **core** of indexes.

### What Can be Indexed

You can:

- [Index single fields](../indexes/map-indexes#index-single-fields)
- [Combine multiple fields](../indexes/map-indexes#combine-multiple-fields)
- [Index partial field data](../indexes/map-indexes#index-partial-field-data)
- [Filter data within fields](../indexes/map-indexes#filter-data-within-fields)
- [Index nested data](../indexes/map-indexes#index-nested-data)
- [Index fields from related documents](../indexes/indexing-related-documents)
- [Index multiple collections](../indexes/indexing-polymorphic-data#multi-map-indexes)
- [Aggregate data with Map-Reduce](../indexes/map-reduce-indexes)
- [Run calculations and store the results in the index to reduce query time](https://demo.ravendb.net/demos/csharp/static-indexes/store-fields-in-index)
- [Configure whether to index a document if the specified fields are `null`](../indexes/map-indexes#configure-whether-to-index-a-document-if-the-specified-fields-are-null)

{NOTE/}

---

{PANEL: Index single fields}

Let's create an index that will help us search for `Employees` by their `FirstName`, `LastName`, or both.

* First, let's create an index called `Employees/ByFirstAndLastName`  
   {NOTE: }
   Note: The naming separator character "`_`" in your code will become "/" in the index name.  
   In the following sample, "`Employees_ByFirstAndLastName`" will become "Employees/ByFirstAndLastName" in your indexes list.
   {NOTE/}

{CODE-TABS}
{CODE-TAB:csharp:LINQ-syntax indexes_1@Indexes/Map.cs /}
{CODE-TAB:csharp:JavaScript-syntax javaScriptindexes_1@Indexes/JavaScript.cs /}
{CODE-TABS/}

You might notice that we're passing `Employee` as a generic parameter to `AbstractIndexCreationTask`. This gives our indexing function a strongly-typed syntax. If you are not familiar with `AbstractIndexCreationTask`, you can read [this](../indexes/creating-and-deploying) article before proceeding.

- The next step is to create the indexing function itself. This is done by setting the `Map` property with our function in a **parameterless constructor**.

{CODE-TABS}
{CODE-TAB:csharp:LINQ-Query-syntax indexes_2@Indexes/Map.cs /}
{CODE-TAB:csharp:LINQ-Method-syntax indexes_3@Indexes/Map.cs /}
{CODE-TAB:csharp:JavaScript-syntax javaScriptindexes_2@Indexes/JavaScript.cs /}
{CODE-TABS/}

- The final step is to [deploy it](../indexes/creating-and-deploying) to the server 
  and issue a query using the session [Query](../client-api/session/querying/how-to-query) method.  
  To query an index, the name of the index must be called by the query.  
  If the index isn't called, RavenDB will either use or create an [auto index](../indexes/creating-and-deploying#auto-indexes).

{CODE-TABS}
{CODE-TAB:csharp:Query indexes_4@Indexes/Map.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Employees/ByFirstAndLastName'
where FirstName = 'Robert'
{CODE-TAB-BLOCK/}
{CODE-TABS/}

Our final index looks like:

{CODE-TABS}
{CODE-TAB:csharp:LINQ-syntax indexes_6@Indexes/Map.cs /}
{CODE-TAB:csharp:JavaScript-syntax javaScriptindexes_6@Indexes/JavaScript.cs /}
{CODE-TABS/}

{INFO:Field Types}

Please note that indexing capabilities are detected automatically from the returned field type from the indexing function. 

For example, if our `Employee` will have a property called `Age` that is an `integer` then the following indexing function...

{CODE-TABS}
{CODE-TAB-BLOCK:csharp:LINQ-syntax}
from employee in docs.Employees
select new
{
	Age = employee.Age
}
{CODE-TAB-BLOCK/}
{CODE-TAB-BLOCK:csharp:JavaScript-syntax}
map('Employees', function(employee)
{
    return {
        Age : employee.Age
    };
})
{CODE-TAB-BLOCK/}
{CODE-TABS/}



...grants us the capability to issue numeric queries (**return all the Employees whose Age is more than 30**). 

Changing the `Age` type to a `string` will take that capability away from you. The easiest example would be to issue `.ToString()` on the `Age` field...

{CODE-TABS}
{CODE-TAB-BLOCK:csharp:LINQ-syntax}
from employee in docs.Employees
select new
{
	Age = employee.Age.ToString()
}
{CODE-TAB-BLOCK/}
{CODE-TAB-BLOCK:csharp:JavaScript-syntax}
map('Employees', function(employee)
{
    return {
        Age : employee.Age.toString()
    };
})
{CODE-TAB-BLOCK/}
{CODE-TABS/}

{INFO/}

{WARNING: Convention}

You will probably notice that in the `Studio`, this function is a bit different from the one defined in the `Employees_ByFirstAndLastName` class:

{CODE-BLOCK:csharp}
from employee in docs.Employees
select new
{
	FirstName = employee.FirstName,
	LastName = employee.LastName
}
{CODE-BLOCK/}

The part you should pay attention to is `docs.Employees`. This syntax indicates from which collection a server should take the documents for indexing. In our case, documents will be taken from the `Employees` collection. To change the collection, you need to change `Employees` to the desired collection name or remove it and leave only `docs` to index **all documents**.

{WARNING/}

{PANEL/}

{PANEL: Combine multiple fields}

Since each index contains a LINQ function, you can combine multiple fields into one.

### Example I
Index definition:  
{CODE-TABS}
{CODE-TAB:csharp:LINQ-syntax indexes_7@Indexes/Map.cs /}
{CODE-TAB:csharp:JavaScript-syntax javaScriptindexes_7@Indexes/JavaScript.cs /}
{CODE-TABS/}
  
Query the index:  
{CODE-TABS}
{CODE-TAB:csharp:Query indexes_8@Indexes/Map.cs /}
{CODE-TAB:csharp:DocumentQuery indexes_9@Indexes/Map.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Employees/ByFullName'
where FullName = 'Robert King'
{CODE-TAB-BLOCK/}
{CODE-TABS/}

### Example II

{INFO: Information}

In this example, the index field `Query` combines all values from various Employee fields into one. 
The default Analyzer on fields is changed to enable `Full-Text Search` operations. The matches no longer need to be exact.

You can read more about analyzers and `Full-Text Search` [here](../indexes/using-analyzers).

{INFO/}

Index definition: 
{CODE-TABS}
{CODE-TAB:csharp:LINQ-syntax indexes_1_6@Indexes/Map.cs /}
{CODE-TAB:csharp:JavaScript-syntax javaScriptindexes_1_6@Indexes/JavaScript.cs /}
{CODE-TABS/}

Query the index:  
{CODE-TABS}
{CODE-TAB:csharp:Query indexes_1_7@Indexes/Map.cs /}
{CODE-TAB:csharp:DocumentQuery indexes_1_8@Indexes/Map.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Employees/Query'
where search(Query, 'John Doe')
{CODE-TAB-BLOCK/}
{CODE-TABS/}

{PANEL/}

{PANEL: Index partial field data}

Imagine that you would like to return all employees that were born in a specific year. 
You can do it by indexing `Birthday` from `Employee`, then specify the year in `Birthday` as you query the index:  

Index definition:  
{CODE-TABS}
{CODE-TAB:csharp:LINQ-syntax indexes_1_2@Indexes/Map.cs /}
{CODE-TAB:csharp:JavaScript-syntax javaScriptindexes_1_2@Indexes/JavaScript.cs /}
{CODE-TABS/}
  
Query the index:  
{CODE-TABS}
{CODE-TAB:csharp:Query indexes_5_1@Indexes/Map.cs /}
{CODE-TAB:csharp:DocumentQuery indexes_5_2@Indexes/Map.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Employees/ByBirthday '
where Birthday between '1963-01-01' and '1963-12-31T23:59:59.9990000'
{CODE-TAB-BLOCK/}
{CODE-TABS/}

RavenDB gives you the ability **to extract field data and to index by it**. A different way to achieve our goal will look as follows:  

Index definition:  
{CODE-TABS}
{CODE-TAB:csharp:LINQ-syntax indexes_1_0@Indexes/Map.cs /}
{CODE-TAB:csharp:JavaScript-syntax javaScriptindexes_1_0@Indexes/JavaScript.cs /}
{CODE-TABS/}

Query the index:  
{CODE-TABS}
{CODE-TAB:csharp:Query indexes_6_1@Indexes/Map.cs /}
{CODE-TAB:csharp:DocumentQuery indexes_6_2@Indexes/Map.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Employees/ByYearOfBirth'
where YearOfBirth = 1963
{CODE-TAB-BLOCK/}
{CODE-TABS/}

{PANEL/}

{PANEL: Filter data within fields}

In the examples above, `where` is used in the query to filter the results.  
If you consistently want to filter with the same filtering conditions, 
you can use `where` in the index definition to narrow the index terms that the query must scan.  

This can save query-time but narrows the terms available to query.

### Example I

For logic that has to do with special import rules that only apply to the USA  
`where` can be used to filter the Companies collection `Address.Country` field.  
Thus, we only index documents `where company.Address.Country == "USA"` . 

Index definition (LINQ Syntax):
{CODE indexes_1_6@Indexes\Map.cs /}

Query the index:
{CODE-TABS}
{CODE-TAB:csharp:Query indexes_query_1_6@Indexes\Map.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Companies_ByAddress_Country'
{CODE-TAB-BLOCK/}
{CODE-TABS/}

### Example II

Imagine a seed company that needs to categorize its customers by latitude-based growing zones.  

They can create a different index for each zone and filter their customers in the index with  
`where (company.Address.Location.Latitude > 20 && company.Address.Location.Latitude < 50)` .

Index definition (LINQ Syntax):
{CODE indexes_1_7@Indexes\Map.cs /}

Query the index:
{CODE-TABS}
{CODE-TAB:csharp:Query indexes_query_1_7@Indexes\Map.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Companies_ByAddress_Latitude'
{CODE-TAB-BLOCK/}
{CODE-TABS/}

{PANEL/}  


{PANEL: Index nested data}

If your document contains nested data, e.g. `Employee` contains `Address`, you can index on its fields by accessing them directly in the index. Let's say that we would like to create an index that returns all employees that were born in a specific `Country`:  

Index definition:  
{CODE-TABS}
{CODE-TAB:csharp:LINQ-syntax indexes_1_4@Indexes/Map.cs /}
{CODE-TAB:csharp:JavaScript-syntax javaScriptindexes_1_4@Indexes/JavaScript.cs /}
{CODE-TABS/}

Query the index:  
{CODE-TABS}
{CODE-TAB:csharp:Query indexes_7_1@Indexes/Map.cs /}
{CODE-TAB:csharp:DocumentQuery indexes_7_2@Indexes/Map.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Employees/ByCountry'
where Country = 'USA'
{CODE-TAB-BLOCK/}
{CODE-TABS/}

If a document relationship is represented by the document's ID, you can use the `LoadDocument` method to retrieve such a document. More about it can be found [here](../indexes/indexing-related-documents).

{PANEL/}

{PANEL: Index fields from related documents}

Read the article dedicated to [indexing related documents](../indexes/indexing-related-documents).

{PANEL/}

{PANEL: Aggregate data with Map-Reduce}

Read the article dedicated to [Map-Reduce indexes](../indexes/map-reduce-indexes).

{PANEL/}

{PANEL: Index multiple collections}

Read the article dedicated to [Multi-Map indexes](../indexes/indexing-polymorphic-data#multi-map-indexes).

{PANEL/}

{PANEL: Configure whether to index a document if the specified fields are `null`}

By default, indexes will not index a document that contains none of the specified fields. This behavior can be changed 
using the [Indexing.IndexEmptyEntries](../server/configuration/indexing-configuration#indexing.indexemptyentries) 
configuration option.  

The option [Indexing.IndexMissingFieldsAsNull](../server/configuration/indexing-configuration#indexing.indexmissingfieldsasnull) 
determines whether missing fields in documents are indexed with the value `null`, or not indexed at all.  

{PANEL/}

## Related Articles

### Indexes
- [Indexing Related Documents](../indexes/indexing-related-documents)
- [Map-Reduce Indexes](../indexes/map-reduce-indexes)
- [Creating and Deploying Indexes](../indexes/creating-and-deploying)

### Querying
- [Query Overview](../client-api/session/querying/how-to-query)
- [Querying an Index](../indexes/querying/query-index)

### Studio
- [Create Map Index](../studio/database/indexes/create-map-index)

---

### Code Walkthrough

- [Static Indexes Overview](https://demo.ravendb.net/demos/csharp/static-indexes/static-indexes-overview)
- [Map Index](https://demo.ravendb.net/demos/csharp/static-indexes/map-index)
- [Map-Reduce Index](https://demo.ravendb.net/demos/csharp/static-indexes/map-reduce-index)
- [Project Index Results](https://demo.ravendb.net/demos/csharp/static-indexes/project-index-results)
- [Store Fields in Index](https://demo.ravendb.net/demos/csharp/static-indexes/store-fields-in-index)

