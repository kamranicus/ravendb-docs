# Session: Querying: How to Project Query Results

Instead of pulling full documents in query results you can just grab some pieces of data from documents. You can also transform the projected
results. The projections are defined in LINQ with the usage of:

- [Select](../../../client-api/session/querying/how-to-project-query-results#select)  
- [SelectFields](../../../client-api/session/querying/how-to-project-query-results#selectfields)  
- [ProjectInto](../../../client-api/session/querying/how-to-project-query-results#projectinto)  
- [OfType (As)](../../../client-api/session/querying/how-to-project-query-results#oftype-(as)---simple-projection)  

{PANEL:Select}

The most common way to perform a query with projection is to use the `Select` method. You can specify what fields from a document you want to retrieve and even provide complex expression.

### Example I - Projecting Individual Fields of the Document

{CODE-TABS}
{CODE-TAB:csharp:Sync projections_1@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Async projections_1_async@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from Companies
select Name, Address.City as City, Address.Country as Country
{CODE-TAB-BLOCK/}
{CODE-TABS/}

### Example II - Projecting Arrays and Objects

{CODE-TABS}
{CODE-TAB:csharp:Sync projections_2@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Async projections_2_async@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from Orders
select ShipTo, Lines[].ProductName as Products
{CODE-TAB-BLOCK/}
{CODE-TABS/}

### Example III - Projection with Expression

{CODE-TABS}
{CODE-TAB:csharp:Sync projections_3@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Async projections_3_async@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from Employees as e
select {
    FullName : e.FirstName + " " + e.LastName
}
{CODE-TAB-BLOCK/}
{CODE-TABS/}

### Example IV - Projection with `let`

{CODE-TABS}
{CODE-TAB:csharp:Sync projections_12@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Async projections_12_async@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB-BLOCK:sql:RQL}
declare function output(e) {
	var format = function(p){ return p.FirstName + " " + p.LastName; };
	return { FullName : format(e) };
}
from Employees as e select output(e)
{CODE-TAB-BLOCK/}
{CODE-TABS/}

### Example V - Projection with Calculation

{CODE-TABS}
{CODE-TAB:csharp:Sync projections_4@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Async projections_4_async@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from Orders as o
select {
    Total : o.Lines.reduce(
        (acc , l) => acc += l.PricePerUnit * l.Quantity, 0)
}
{CODE-TAB-BLOCK/}
{CODE-TABS/}

### Example VI - Projection Using a Loaded Document

{CODE-TABS}
{CODE-TAB:csharp:Sync projections_5@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Async projections_5_async@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from Orders as o
load o.Company as c
select {
	CompanyName: c.Name,
	ShippedAt: o.ShippedAt
}
{CODE-TAB-BLOCK/}
{CODE-TABS/}

### Example VII - Projection with Dates

{CODE-TABS}
{CODE-TAB:csharp:Sync projections_6@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Async projections_6_async@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from Employees as e 
select { 
    DayOfBirth : new Date(Date.parse(e.Birthday)).getDate(), 
    MonthOfBirth : new Date(Date.parse(e.Birthday)).getMonth() + 1,
    Age : new Date().getFullYear() - new Date(Date.parse(e.Birthday)).getFullYear() 
}
{CODE-TAB-BLOCK/}
{CODE-TABS/}

### Example VIII - Projection with Raw JavaScript Code

{CODE-TABS}
{CODE-TAB:csharp:Sync projections_7@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Async projections_7_async@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from Employees as e 
select {
    Date : new Date(Date.parse(e.Birthday)), 
    Name : e.FirstName.substr(0,3)
}
{CODE-TAB-BLOCK/}
{CODE-TABS/}

### Example IX - Projection with Metadata

{CODE-TABS}
{CODE-TAB:csharp:Sync projections_13@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Async projections_13_async@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from Employees as e 
select {
     Name : e.FirstName, 
     Metadata : getMetadata(e)
}
{CODE-TAB-BLOCK/}
{CODE-TABS/}

{PANEL/}

{PANEL:SelectFields}

The `SelectFields` method can only be used with the [Document Query](../../../client-api/session/querying/document-query/what-is-document-query). 
It has two overloads:

{CODE-BLOCK: csharp}
// 1) By array of fields
IDocumentQuery<TProjection> SelectFields<TProjection>(params string[] fields);
// 2) By projection type
IDocumentQuery<TProjection> SelectFields<TProjection>();
{CODE-BLOCK/}

1) The fields of the projection are specified as a `string` array of field names. It also takes the type of the projection as 
a generic parameter.  

{CODE-TABS}
{CODE-TAB:csharp:Sync selectFields@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Async selectFields_async@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Index projections_9@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Class projections_9_class@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Companies/ByContact'
select Name, Phone
{CODE-TAB-BLOCK/}
{CODE-TABS/}

2) The projection is defined by simply passing the projection type as the generic parameter.  

{CODE-TABS}
{CODE-TAB:csharp:Sync selectFields_2@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Async selectFields_2_async@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Index projections_9@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Class projections_9_class@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Companies/ByContact'
select Name, Phone
{CODE-TAB-BLOCK/}
{CODE-TABS/}

#### Projection Behavior

The `SelectFields` methods can also take a `ProjectionBehavior` parameter, which 
determines whether the query should retrieve indexed data or directly retrieve 
document data, and what to do when the data can't be retrieved. Learn more 
[here](../../../client-api/session/querying/how-to-customize-query#projectionbehavior).  

{CODE-BLOCK: csharp}
IDocumentQuery<TProjection> SelectFields<TProjection>(ProjectionBehavior projectionBehavior,
                                                      params string[] fields);

IDocumentQuery<TProjection> SelectFields<TProjection>(ProjectionBehavior projectionBehavior);
{CODE-BLOCK/}

{PANEL/}

{PANEL:ProjectInto}

This extension method retrieves all public fields and properties of the type given in generic and uses them to perform projection to the requested type.
You can use this method instead of using `Select` together with all fields of the projection class.

### Example

{CODE-TABS}
{CODE-TAB:csharp:Sync projections_8@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Async projections_8_async@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB-BLOCK:sql:RQL}
from index 'Companies/ByContact' 
select Name, Phone
{CODE-TAB-BLOCK/}
{CODE-TAB:csharp:Index projections_9@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Class projections_9_class@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}

{CODE-TABS/}

{PANEL/}

{PANEL:OfType (As) - simple projection}

`OfType` or `As` is a client-side projection. The easiest explanation of how it works is to take the results that the server returns and map them to given type. This may become useful when querying an index that contains fields that are not available in mapped type.

### Example

{CODE-TABS}
{CODE-TAB:csharp:Sync projections_10@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Async projections_10_async@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TAB:csharp:Index projections_11@ClientApi\Session\Querying\HowToProjectQueryResults.cs /}
{CODE-TABS/}

{PANEL/}

{NOTE Projected entities (even named types) are not tracked by the session. /}

{NOTE If the projected fields are stored inside the index itself (`FieldStorage.Yes` in the index definition), then the query results will be created directly from there instead of retrieving documents in order to project. /}

## Related Articles

### Session

- [Query Overview](../../../client-api/session/querying/how-to-query)
- [How to Stream Query Results](../../../client-api/session/querying/how-to-stream-query-results)

### Querying

- [Querying an Index](../../../indexes/querying/query-index)
- [Projections](../../../indexes/querying/projections)

### Server

- [JavaScript Engine](../../../server/kb/javascript-engine)  
