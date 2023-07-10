# Indexing Spatial Data

---

{NOTE: }

* Documents that contain spatial data can be queried by spatial queries that employ geographical criteria.  
  You have two options:  

  * __Dynamic spatial query__  
    Either make a dynamic spatial query on a collection (see [how to make a spatial query](../client-api/session/querying/how-to-make-a-spatial-query)).  
    An auto-index will be created by the server.  
  
  * __Spatial index query__  
    Or, index your documents' spatial data in a static-index ( __described in this article__ ),  
    and then make a spatial query on this index (see [query a spatial index](../indexes/querying/spatial)).

* In this page:
  * [Create index with spatial field](../indexes/indexing-spatial-data#create-index-with-spatial-field)
  * [Customize coordinate system and strategy](../indexes/indexing-spatial-data#customize-coordinate-system-and-strategy)
  * [Spatial indexing strategies](../indexes/indexing-spatial-data#spatial-indexing-strategies)

{NOTE/}

---

{PANEL: Create index with spatial field}

* Use `createSpatialField` to index spatial data in a static-index.

* You can then retrieve documents based on geographical criteria when making a spatial query on this index-field.

* A spatial index can also be defined from the [Studio](../studio/database/indexes/create-map-index#spatial-field-options). 

{NOTE: }

__Exmaple__:

{CODE-TABS}
{CODE-TAB:nodejs:Indexing_coordinates spatial_index_1@Indexes\spatialIndexes.js /}
{CODE-TAB:nodejs:Indexing_WKT spatial_index_2@Indexes\spatialIndexes.js /}
{CODE-TABS/}

{NOTE/}

{NOTE: }

__Syntax__:

{CODE:nodejs spatial_syntax_1@Indexes\spatialIndexes.js /}

| Parameters | Type     | Description                |
|------------|----------|----------------------------|
| __lat__    | `number` | Latitude coordinate        |
| __lng__    | `number` | Longitude coordinate       |
| __wkt__    | `string` | Shape in WKT string format |

{NOTE/}

{PANEL/}

{PANEL: Customize coordinate system and strategy}

* For each spatial index-field, you can specify the __coordinate system__ and __strategy__ to be used  
  during indexing and when processing the data at query time.

* RavenDB supports both the `Geography` and `Cartesian` systems with the following strategies:

  * Geography system:
      * BoundingBox
      * GeoHashPrefixTree
      * QuadPrefixTree

  * Cartesian system:
      * BoundingBox
      * QuadPrefixTree

* __By default__, the `GeoHashPrefixTree` strategy is used with `GeoHashLevel` set to __9__.  
  Use the `spatial` method to modify this setting.

* The performance cost of spatial indexing is directly related to the tree level chosen.  
  Learn more about each strategy [below](../indexes/indexing-spatial-data#spatial-indexing-strategies).

* Note: Modifying the strategy after the index has been created & deployed will trigger the re-indexing.

{NOTE: }

__Exmaple__:

{CODE:nodejs spatial_index_3@Indexes\spatialIndexes.js /}

{NOTE/}

{NOTE: }

__Syntax__:

{CODE:nodejs spatial_syntax_2@Indexes\spatialIndexes.js /}

{CODE-TABS}
{CODE-TAB:nodejs:GeographySpatialOptionsFactory spatial_syntax_3@Indexes\spatialIndexes.js /}
{CODE-TAB:nodejs:CartesianSpatialOptionsFactory spatial_syntax_4@Indexes\spatialIndexes.js /}
{CODE-TABS/}

| Parameters            | Type            | Description                                       |
|-----------------------|-----------------|---------------------------------------------------|
| __circleRadiusUnits__ | `string`        | "Kilometers" or "Miles"                           |
| __maxTreeLevel__      | `number`        | Controls precision level                          |
| __bounds__            | `SpatialBounds` | Coordinates for the cartesian quadPrefixTreeIndex |

{NOTE/}

{PANEL/}

{PANEL: Spatial indexing strategies}

{NOTE: BoundingBox}

* The bounding box strategy is the simplest.  
  Given a spatial shape, such as a point, circle, or polygon, the shape's bounding box is computed  
  and the spatial coordinates (minX, minY, maxX, maxY) that enclose the shape are indexed.

* When making a query,  
  RavenDB translates the query criteria to the same bounding box system used for indexing. 

* Bounding box strategy is cheaper at indexing time and can produce quick queries,  
  but that's at the expense of the level of accuracy you can get.  

* Read more about bounding box [here](https://en.wikipedia.org/wiki/Minimum_bounding_rectangle).

{NOTE/}

{NOTE: GeoHashPrefixTree}

* Geohash is a latitude/longitude representation system that describes Earth as a grid with 32 cells, assigning an alphanumeric character to each grid cell. 
  Each grid cell is further divided into 32 smaller chunks, and each chunk has an alphanumeric character assigned as well, and so on.

* E.g. The location of 'New York' in the United States is represented by the following geohash: [DR5REGY6R](http://geohash.org/dr5regy6r) 
  and it represents the `40.7144 -74.0060` coordinates. 
  Removing characters from the end of the geohash will decrease the precision level.

* The `maxTreeLevel` determines the length of the geohash used for the indexing, which in turn affects accuracy. 
  By default, it is set to __9__, providing a resolution of approximately 2.5 meters.

* More information about geohash uses, decoding algorithm, and limitations can be found [here](https://en.wikipedia.org/wiki/Geohash).

__Geohash precision values__:

| Level | E-W Distance at Equator | N-S Distance at Equator |
|:----- |:------------------------|:------------------------|
| 12    | ~3.7cm                  | ~1.8cm                  |
| 11    | ~14.9cm                 | ~14.9cm                 |
| 10    | ~1.19m                  | ~0.60m                  |
| **9** | **~4.78m**              | **~4.78m**              |
| 8     | ~38.2m                  | ~19.1m                  |
| 7     | ~152.8m                 | ~152.8m                 |
| 6     | ~1.2km                  | ~0.61km                 |
| 5     | ~4.9km                  | ~4.9km                  |
| 4     | ~39km                   | ~19.6km                 |
| 3     | ~157km                  | ~157km                  |
| 2     | ~1252km                 | ~626km                  |
| 1     | ~5018km                 | ~5018km                 |

{NOTE/}

{NOTE: QuadPrefixTree}

* The QuadTree represents Earth as a grid consisting of four cells (also known as buckets).
  Similar to GeoHash, each cell is assigned a letter, and is recursively divided into four more cells, creating a hierarchical structure. 

* By default, the precision level (`maxTreeLevel`) for QuadPrefixTree is __23__.

* More information about QuadTree can be found [here](https://en.wikipedia.org/wiki/Quadtree).

__Quadtree precision values__:

| Level | Distance at Equator |
|:-------|:-------------------|
| 30     | ~4cm               |
| 29     | ~7cm               |
| 28     | ~15cm              |
| 27     | ~30cm              |
| 26     | ~60cm              |
| 25     | ~1.19m             |
| 24     | ~2.39m             |
| **23** | **~4.78m**         |
| 22     | ~9.56m             |
| 21     | ~19.11m            |
| 20     | ~38.23m            |
| 19     | ~76.23m            |
| 18     | ~152.92m           |
| 17     | ~305.84m           |
| 16     | ~611.67m           |
| 15     | ~1.22km            |
| 14     | ~2.45km            |
| 13     | ~4.89km            |
| 12     | ~9.79km            |
| 11     | ~19.57km           |
| 10     | ~39.15km           |
| 9      | ~78.29km           |
| 8      | ~156.58km          |
| 7      | ~313.12km          |
| 6      | ~625.85km          |
| 5      | ~1249km            |
| 4      | ~2473km            |
| 3      | ~4755km            |
| 2      | ~7996km            |
| 1      | ~15992km           |

{NOTE/}

{PANEL/}

## Remarks

{INFO: }

Distance by default is measured in __kilometers__.

{INFO/}

## Related Articles

### Client API

- [How to make a spatial query](../client-api/session/querying/how-to-make-a-spatial-query)

### Indexes

- [Query a spatial index](../indexes/querying/spatial)

### Studio

- [Spatial query view](../studio/database/queries/spatial-queries-map-view) 
