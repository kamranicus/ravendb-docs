# Querying: Sorting

## Basics

Starting from RavenDB 4.0, the server will determine possible sorting capabilities automatically from the indexed value, but sorting will **not be applied** until you request it by using the appropriate methods. The following queries will not return ordered results:

{CODE-TABS}
{CODE-TAB:csharp:Query sorting_1_1@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:DocumentQuery sorting_1_2@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:Index sorting_1_4@Indexes\Querying\Sorting.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Products/ByUnitsInStock' 
where UnitsInStock > 10
{CODE-TAB-BLOCK/}
{CODE-TABS/}

To start sorting, we need to request to order by some specified index field. In our case we will order by `UnitsInStock` in descending order:

{CODE-TABS}
{CODE-TAB:csharp:Query sorting_2_1@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:DocumentQuery sorting_2_2@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:Index sorting_1_4@Indexes\Querying\Sorting.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Products/ByUnitsInStock' 
where UnitsInStock > 10
order by UnitsInStock as long desc
{CODE-TAB-BLOCK/}
{CODE-TABS/}

{INFO:Forcing ordering type}

By default, `OrderBy` methods will determine `OrderingType` from the property path expression (e.g. `x => x.UnitsInStock` will result in `OrderingType.Long` because property type is an integer), but a different ordering can be forced by passing `OrderingType` explicitly to one of the `OrderBy` methods.

{CODE-TABS}
{CODE-TAB:csharp:Query sorting_8_1@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:DocumentQuery sorting_8_2@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:Index sorting_1_4@Indexes\Querying\Sorting.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Products/ByUnitsInStock' 
where UnitsInStock > 10
order by UnitsInStock desc
{CODE-TAB-BLOCK/}
{CODE-TABS/}

{INFO/}

## Ordering by Score

When a query is issued, each index entry is scored by Lucene (you can read more about Lucene scoring [here](http://lucene.apache.org/core/3_3_0/scoring.html)).  
This value is available in metadata information of the resulting query documents under `@index-score` (the higher the value, the better the match).  
To order by this value you can use the `OrderByScore` or the `OrderByScoreDescending` methods:

{CODE-TABS}
{CODE-TAB:csharp:Query sorting_4_1@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:DocumentQuery sorting_4_2@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:Index sorting_1_4@Indexes\Querying\Sorting.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Products/ByUnitsInStock' 
where UnitsInStock > 10
order by score()
{CODE-TAB-BLOCK/}
{CODE-TABS/}

## Chaining Orderings

It is also possible to chain multiple orderings of the query results. 
You can sort the query results first by some specified index field (or by the `@index-score`), then sort all the equal entries by some different index field (or the `@index-score`).  
This can be achived by using the `ThenBy` (`ThenByDescending`) and `ThenByScore` (`ThenByScoreDescending`) methods.

{CODE-TABS}
{CODE-TAB:csharp:Query sorting_4_3@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:Index sorting_1_5@Indexes\Querying\Sorting.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Products/ByUnitsInStockAndName' 
where UnitsInStock > 10
order by UnitsInStock, score(), Name desc
{CODE-TAB-BLOCK/}
{CODE-TABS/}

## Random Ordering

If you want to randomize the order of your results each time the query is executed, use the `RandomOrdering` method (API reference [here](../../client-api/session/querying/how-to-customize-query#randomordering)):

{CODE-TABS}
{CODE-TAB:csharp:Query sorting_3_1@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:DocumentQuery sorting_3_2@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:Index sorting_1_4@Indexes\Querying\Sorting.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Products/ByUnitsInStock' 
where UnitsInStock > 10
order by random()
{CODE-TAB-BLOCK/}
{CODE-TABS/}

## Ordering When a Field is Searchable

When sorting must be done on field that is [Searchable](../../indexes/using-analyzers), due to [Lucene](https://lucene.apache.org/) limitations sorting on such a field is not supported. To overcome this, create another field that is not searchable and sort by it.

{CODE-TABS}
{CODE-TAB:csharp:Query sorting_6_1@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:DocumentQuery sorting_6_2@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:Index sorting_6_4@Indexes\Querying\Sorting.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Products/ByName/Search' 
where search(Name, 'Louisiana')
order by NameForSorting desc
{CODE-TAB-BLOCK/}
{CODE-TABS/}

## AlphaNumeric Ordering

Sometimes when ordering strings, it doesn't make sense to use the default lexicographic ordering.    

For example, "Abc9" will come after "Abc10" because if treated as single characters, 9 is greater than 1.   

If you want digit characters in a string to be treated as numbers and not as text, you should use alphanumeric ordering. In that case, when comparing "Abc10" to "Abc9", the digits 1 and 0 will be treated as the number 10 which will be considered greater than 9.

To order in this mode you can pass the `OrderingType.AlphaNumeric` type into `OrderBy` or `OrderByDescending`:   

{CODE-TABS}
{CODE-TAB:csharp:Query sorting_7_1@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:DocumentQuery sorting_7_2@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:Index sorting_1_4@Indexes\Querying\Sorting.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Products/ByUnitsInStock ' 
where UnitsInStock > 10
order by Name as alphanumeric
{CODE-TAB-BLOCK/}
{CODE-TABS/}

## Spatial Ordering

If your data contains geographical locations, you might want to sort the query result by distance from a given point.

This can be achieved by using the `OrderByDistance` and `OrderByDistanceDescending` methods (API reference [here](../../client-api/session/querying/how-to-query-a-spatial-index#orderbydistance)):

{CODE-TABS}
{CODE-TAB:csharp:Query sorting_9_1@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:DocumentQuery sorting_9_2@Indexes\Querying\Sorting.cs /}
{CODE-TAB:csharp:Index sorting_9_3@Indexes\Querying\Sorting.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Events/ByCoordinates'
where spatial.within(Coordinates, spatial.circle(500, 30, 30))
order by spatial.distance(spatial.point(Latitude, Longitude), spatial.point(32.1234, 23.4321))
{CODE-TAB-BLOCK/}
{CODE-TABS/}

## Creating a Custom Sorter

Lucene also allows you to create your own custom sorters. Create a sorter that inherits from the Lucene class 
[FieldComparator](https://lucenenet.apache.org/docs/3.0.3/df/d91/class_lucene_1_1_net_1_1_search_1_1_field_comparator.html), and send it to the 
server using the `PutSortersOperation`:  

{CODE-TABS}
{CODE-TAB:csharp:PutSortersOperation custom_1@Indexes/Querying/Sorting.cs/}
{CODE-TAB:csharp:SorterDefinition custom_2@Indexes/Querying/Sorting.cs/}
{CODE-TABS/}
<br/>
### Example

{CODE:csharp custom_3@Indexes/Querying/Sorting.cs/}

## Related Articles

#### Client API

- [Query Overview](../../client-api/session/querying/how-to-query)

### Indexes

- [Indexing Basics](../../indexes/indexing-basics)
- [Sorting & Collation](../../indexes/sorting-and-collation)

### Querying

- [Query an Index](../../indexes/querying/query-index)
- [Filtering](../../indexes/querying/filtering)
- [Paging](../../indexes/querying/paging)
- [Spatial](../../indexes/querying/spatial)
