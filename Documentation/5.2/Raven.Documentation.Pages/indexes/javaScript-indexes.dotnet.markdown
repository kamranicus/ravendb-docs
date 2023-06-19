# Indexes: JavaScript Indexes
---

{NOTE: }

* This feature was created for users who want to create a static index and prefer JavaScript over C#.  

* JavaScript indexes can be defined with a User/Read-Write certificate, whereas C# static indexes 
  require User/Admin certificate or higher.  

* To ensure that only database admins can create JavaScript indexes, 
  you can configure JavaScript index creation with **Admin only privileges** by setting 
  [Indexing.Static.RequireAdminToDeployJavaScriptIndexes](../server/configuration/indexing-configuration#indexing.static.requireadmintodeployjavascriptindexes)
  configuration to `true`.

* All other capabilities and features of RavenDB JavaScript indexes are the same as in RavenDB [C# indexes](../indexes/indexing-basics).   

* In this page:
  * [Creating  JavaScript index](../indexes/javascript-indexes#creating--javascript-index)
  * [Map index](../indexes/javascript-indexes#map-index)
  * [Multi map index](../indexes/javascript-indexes#multi-map-index)
  * [Map-Reduce index](../indexes/javascript-indexes#map-reduce-index)

{NOTE/}

## Creating  JavaScript index

If we want to create JavaScript index we need to create an instance of our class that inherits 
from `AbstractJavaScriptIndexCreationTask`.   
`AbstractJavaScriptIndexCreationTask` inherits from [AbstractIndexCreationTask](../indexes/creating-and-deploying#Using-AbstractIndexCreationTask)

{CODE javaScriptindexes_1@Indexes\JavaScript.cs /}

## Map index

`Map` indexes, sometimes referred to as simple indexes, contain one (or more) mapping functions that indicate which fields from the documents should be indexed. 
They indicate which documents can be searched by which fields.

{CODE-BLOCK:csharp}
   map(<collection-name>, function (document){
        return {
            // indexed properties go here e.g:
            // Name: document.Name
        };
    })
{CODE-BLOCK/}

### Example I - Simple map index

{CODE javaScriptindexes_6@Indexes\JavaScript.cs /}

### Example II - Map index with additional sources

{CODE indexes_2@Indexes\JavaScript.cs /}

Read more about [map indexes here](../indexes/map-indexes).

## Multi map index

Multi-Map indexes allow you to index data from multiple collections

### Example

{CODE multi_map_5@Indexes\JavaScript.cs /}

Read more about [multi-map indexes here](../indexes/map-reduce-indexes).

## Map-Reduce index
Map-Reduce indexes allow you to perform complex aggregations of data.
The first stage, called the map, runs over documents and extracts portions of data according to the defined mapping function(s).
Upon completion of the first phase, reduction is applied to the map results and the final outcome is produced.

{CODE-BLOCK:csharp}
   groupBy(x => {map properties})
        .aggregate(y => {
            return {
                // indexed properties go here e.g:
                // Name: y.Name
            };
        })
{CODE-BLOCK/}

### Example I

{CODE map_reduce_0_0@Indexes\JavaScript.cs /}

### Example II

{CODE map_reduce_3_0@Indexes\JavaScript.cs /}

Read more about [map-reduce indexes here](../indexes/map-reduce-indexes).

{INFO:Information}
Supported JavaScript version : ECMAScript 5.1
{INFO/}

## Related Articles

### Indexes

- [Indexing Related Documents](../indexes/indexing-related-documents)
- [Map Indexes](../indexes/map-indexes)
- [Map-Reduce Indexes](../indexes/map-reduce-indexes)
- [Creating and Deploying Indexes](../indexes/creating-and-deploying)

### Querying

- [Query Overview](../client-api/session/querying/how-to-query)
- [Querying an Index](../indexes/querying/query-index)
