﻿# Indexing Performance

* To help analyze consumption of system resources and optimize indexes, this Studio view tracks all of your indexes.  
  It shows the activities, resource usage, and performance of each index over time.  
* You can see what happens during each indexing batch, including errors if there are any.  
* Each stage of an indexing process is represented graphically by a colored stripe to show the length of time elapsed.  
* Hovering over various indexing stages shows detailed statistics about the resource usage and performance of each stage.  
* You can export an interactive snapshot of the indexing statistics to a colleague or to RavenDB technical support.  


In this page:  

* [Indexing Performance View](../../../studio/database/indexes/indexing-performance#indexing-performance-view)
* [Types of Index Tracks](../../../studio/database/indexes/indexing-performance#types-of-index-tracks)
* [Index Statistics View](../../../studio/database/indexes/indexing-performance#index-statistics-view)
* [Common Indexing Issues](../../../studio/database/indexes/indexing-performance#common-indexing-issues)
  - [Resource Exhaustion](../../../studio/database/indexes/indexing-performance#resource-exhaustion)
  - [Low Memory](../../../studio/database/indexes/indexing-performance#low-memory)
  - [Concurrent Processing of Too Many Indexes](../../../studio/database/indexes/indexing-performance#concurrent-processing-of-too-many-indexes)
  - [LoadDocument Misuse](../../../studio/database/indexes/indexing-performance#loaddocument-misuse)


  
---

{PANEL: Indexing Performance View }

![Indexing Performance View](images/indexing-performance-overview.png "Indexing Performance View")

1. **Indexes tab**  
   Click to reveal the Studio indexing options.  
2. **Indexing Performance**  
   Select to see the Indexing Performance view.  
3. **Current Database**  
   Make sure that this is the database that you want to analyze.  
4. **Filter**  
   Write keywords from the index names (such as which collection or specifications) to see only indexes with these keywords in the definition.  
5. **Expand All**  
   Click to see the details of all index tracks at once.  
6. **Export**  
   Click to download an interactive snapshot of the indexing statistics so that you can send it to RavenDB technical support.  
7. **Import**  
   Click to upload and analyze an interactive snapshot that was sent to you.  
8. **General Timeline**  
   * Spikes and elevated plateaus show when the indexes were active.  
   * Vertical lines show time-lapses until a batch process started.  
   * The red area represents the area that is zoomed in below. Enlarge or shrink it to zoom in and out below.  
9. **Auto/Orders/ByOrderedAt** (Expanded Track)  
   * This is one of the various types of indexes that is tracked in time.  
     * Clicking the index title expands the track (as seen in the **Auto/Orders/ByOrderedAt** image above) to show index [batch process details](../../../studio/database/indexes/indexing-performance#index-statistics-view).  
     * Varying index types have different processes and they may index different volumes of data, so the graphs are likely to differ from one another.
     * Each colored stripe shows the duration of a stage in the batch process.  
     * Hovering over each stripe shows [detailed statistics](../../../studio/database/indexes/indexing-performance#index-statistics-view) about each stage.  
10. **Vertical line**  
    Each verticle purple line shows that there was a time-lapse in the timeline before a batch process started.  

{PANEL/}

---

{PANEL: Types of Index Tracks}

![Index Types](images/index-types.png "Index Types")

 1. [**Auto (Dynamic) Indexes**](../../../indexes/creating-and-deploying#auto-indexes)  
     * [Auto (Dynamic) indexes](../../../indexes/creating-and-deploying#auto-indexes) are identified by the naming prefix `Auto/` 
       then the collection name and filtration terms requested in the query.  
     * When RavenDB processes a query, it scans for an existing index that will properly answer the query.  
       If none exists, it automatically creates an [index based on the query](https://ravendb.net/articles/speeding-up-your-application-with-an-automatic-index).  
     * If there is an auto-index that partially answers the query, RavenDB's Query Optimizer may improve that index with the new query requirement, 
       then removes any newly-obsolete indexes.  
     * The query optimizer analyzes the set of queries you make to your database and generates the optimal set of indexes to answer those queries. 
       Changes in your queries also trigger changes in the indexes on your database as they adjust to the new requirements.  
       Dynamic indexing automatically adapts to changes and optimizations in your application, thus increasing agility.  
 2. [**Static Indexes (Defined Explicitly by Developers)**](../../../indexes/creating-and-deploying#static-indexes)  
    [Static Indexes](../../../indexes/creating-and-deploying) can be created and edited explicitly by database admins and operators. 
     * Static indexes do not have a naming prefix, but instead start with the name that was given to them when the index was defined manually.  
     * Although they do not change dynamically whenever your clients' query needs change, you can program more complex functions into them, such as calculations, etc.  
     * See the following articles to learn the API for defining:  
       - [Map indexes](../../../indexes/map-indexes): Shows how to define which fields from the documents should be indexed.  
       - [Multi-map indexes](../../../indexes/multi-map-indexes): Shows how to map a second collection in the same index.  
       - [Map-reduce indexes](../../../indexes/map-reduce-indexes): Shows how to create complex aggregations of data that is 
         stored and updated inside the index, improving querying performance.  
       - [Fanout indexes](../../../indexes/fanout-indexes): Shows how to define indexes that output multiple entries per document.  

 3. **ReplacementOf**  
    * Temporary prefix of index that is rebuilding after definition changes are saved.  
    * When an existing index definition is changed, RavenDB uses the old version until the new version is completely built, then saves the old definition in the [index history](../../../studio/database/indexes/index-history).  
      Until the new version completely replaces the old, the two are in a state called [side-by-side indexing](../../../studio/database/indexes/indexes-list-view#index-list-view---side-by-side-indexing).

{INFO: Editing an Index in the Studio}
Click the following links to learn more about defining indexes via the Studio:  

- [Map Index](../../../studio/database/indexes/create-map-index)  
- [Multi-Map Index](../../../studio/database/indexes/create-multi-map-index)  
- [Map-Reduce Index](../../../studio/database/indexes/create-map-reduce-index)  

{INFO/}

{PANEL/}

---

{PANEL: Index Statistics View}

* When expanding index tracks, zoom in on batches to see how long each stage took to process.  
* Some stages are very short.  Zoom in further with the mouse scroller to see stages that happen quickly.  
* When an index track is expanded, we see 4-5 rows of colored stripes. 
  * The top row is the entire indexing process.
  * The following rows are breakdowns of what happened in each stage above.  
* Hover over these colored stripes to see detailed statistics about each stage.  

#### Details of Indexing Stages

![Indexing Stages Statistics](images/indexing-stage-statistics.png "Indexing Stages Statistics")

1. **Indexing** (total batch process)  
 * **Duration**  
    The amount of time this batch process took to complete.  
      * This is an example of RavenDB building a new auto-index, thus it took ~ 295 ms to process 830 documents.  
        The second time this index was run, it took ~1ms because the index was already built.  
        To get a more accurate rate, we would need a larger sample size of documents.  
 * **Input Count**  
    The number of index entries that were scanned.  
 * **Output Count**  
    The number of index entries that the index returned from the data store.  
 * **Failed Count**  
    The number of index entries that the index failed to process.  
 * **Success Count**  
    The number of index entries that the index succeeded to process.  
 * **Documents Size**  
    Total size of the documents returned from the data store.  
 * **Average Document Size**  
    The average size of each document that was returned.  
 *  **Managed Allocation Size**  
 * **Processed Data Speed**  
     The speed at which the data was processed.  
 * **Document Processing Speed**  
     The number of documents per second.  
       * As the auto-index was built, it processed at a speed of ~2,814 documents per second.  
         The second time this index was run, it processed ~830,000 documents per second.  
         Again, to get a more accurate rate, we would need a larger sample size of documents.  
2. **Map** stage/s (applies index definition/s)
 * **Duration**  
    The amount of time this batch process took to complete.  
 * **Batch status**  
    There are a number of possible batch status messages.  They fall into two main categories.  
     - **No more documents to index**  
       The batch managed to cover all of the documents needed.  
     - **(Name of the method used to create a batch stop)**  
       There are a number of configurations that break up large batch processes into smaller batches to prevent exhausting system resources.  
       While these batch stops prevent system exhaustion, they also point to potential opportunities to optimize your indexes.  
       These situations are discussed in the section on [common indexing issues](../../../studio/database/indexes/indexing-performance#common-indexing-issues)
3. **Storage** stages  
     The amount of time it took to read or write the data to disk.  
      * If this stage takes a long time after the index is already built, it may reveal a hardware problem.
4. **Lucene** stages  
   Lucene stages show how long it took to store the information in the [Lucene](https://lucene.apache.org/core/) search engine.


   

{PANEL/}

---

{PANEL: Common Indexing Issues}

Indexing can be a taxing operation on CPU resources.  

There are a number of [configurations](../../../server/configuration/indexing-configuration) that efficiently use 
batch stops to break up huge batch processes into smaller batches to prevent exhausting resources.  
If a configuration is specific to an index, it can be [set in the Studio](../../../studio/database/indexes/create-map-index#configuration).  
If it is a server-wide only configuration, it must be set in the server's [settings.json](../../../server/configuration/configuration-options#settings.json).  

While they prevent system exhaustion, batch stops also point to potential **opportunities to optimize** your indexes.  
 
Batch stops break up processes into smaller batches when  

  - An index is processing a [dataset that is too large](../../../studio/database/indexes/indexing-performance#resource-exhaustion) for your system resources.  
  - The index definition requires a complex Linq process (in Java - Stream API process) that can exhaust your resources.  
  - [Low memory](../../../studio/database/indexes/indexing-performance#low-memory) resources for indexing process on local machines or burstable cloud instances.  
  - [Too many concurrent index processes](../../../studio/database/indexes/indexing-performance#concurrent-processing-of-too-many-indexes) are exhausting your system resources.  
  - The [LoadDocument](../../../studio/database/indexes/indexing-performance#loaddocument-misuse) method is misused.  

---

#### Resource Exhaustion

Some indexes are responsible for a huge dataset and/or have very complex, demanding definitions.  
To prevent resource exhaustion, RavenDB can break up large batches into smaller ones.  
You can configure [batch stops](../../../studio/database/indexes/indexing-performance#common-indexing-issues) with the following methods:

- [Indexing.MapTimeoutInSec](../../../server/configuration/indexing-configuration#indexing.maptimeoutinsec)  
    Number of seconds after which mapping will end even if there is more to map.  
- [Indexing.MapTimeoutAfterEtagReachedInMin](../../../server/configuration/indexing-configuration#indexing.maptimeoutafteretagreachedinmin)  
    This will only be applied if we pass the last [etag](../../../glossary/etag) in collection that we saw when batch was started.  
- [Indexing.MapBatchSize](../../../server/configuration/indexing-configuration#indexing.mapbatchsize)  
    Maximum number of documents to be processed by the index per indexing batch.  

---

#### Low Memory 

* [Low Memory](../../../server/configuration/memory-configuration#memory.lowmemorylimitinmb) resources can slow down your system and result in [batch stops](../../../studio/database/indexes/indexing-performance#common-indexing-issues). 
   * **On a local machine**  
     * You can upgrade your hardware, divide the work onto more machines in a cluster, and/or optimize your indexes.  
     * Until then, there are a number of [indexing configurations](../../../server/configuration/indexing-configuration#indexing.mapbatchsize) that you can configure
      to break up processes into smaller batches. 
  * **Cloud server**  
    Your indexing process will continue until it is finished, but will be broken up into smaller batches and continue when enough CPU credits accumulate.  
    This can happen on [basic](../../../cloud/cloud-instances#basic-grade-production-cluster)-level cloud instances.  
     * Unless you're running a [production cloud tier](../../../cloud/cloud-instances#a-production-cloud-cluster) with CPU priority of [standard](../../../cloud/cloud-instances#standard-grade-production-cluster) 
    or [Performance](../../../cloud/cloud-instances#performance-grade-production-cluster), your cluster is [burstable and subject to throttling](../../../cloud/cloud-overview#budget-credits-and-throttling).  
    This means that you have CPU credits with limits.  If you have reached your credit limit, RavenDB will wait until you've 
    accumulated enough credits to run another batch process.  
    This causes indexing to seem slow.  
     * On a cloud instance, you can [upgrade](../../../cloud/portal/cloud-portal-products-tab) your instance, [scale](../../../cloud/cloud-scaling), 
      [externally replicate](../../../studio/database/tasks/ongoing-tasks/external-replication-task) to new instances, and/or optimize your indexes.  

---

#### Concurrent Processing of Too Many Indexes

- [Limit concurrent index processes](../../../server/configuration/indexing-configuration#indexing.maxnumberofconcurrentlyrunningindexes) - 
  RavenDB can handle multiple index processes at the same time, but if there are too many, it will exhaust the system resources and cause a 
  noticeable slow-down.  The `Indexing.MaxNumberOfConcurrentlyRunningIndexes` method enables you to have many indexes without exhausting resources by allowing you to set
  the number of concurrent index processes.  

---

#### LoadDocument Misuse

- [Indexing referenced/related data](https://ravendb.net/learn/inside-ravendb-book/reader/4.0/10-static-indexes-and-other-advanced-options#indexing-referenced-data)
  can be useful (even in a NoSql database) when developers need to pull information from different documents into an indexing process.  The `LoadDocument` method
  creates a relationship between the two documents and ensures that whenever the referenced document is updated, the referencing documents will be re-indexed to 
  stay current with the new details.  
   - `LoadDocument` is a useful feature, but problems arise if a large number of documents reference a single document (or a small set of them) that is frequently changed. 
     If frequent changes are made to this document, all the documents referencing it will also need to be reindexed. 
     In other words, the amount of work that an index has to do because 
     of a single document frequently changing can be extremely large and may cause delays in indexing.  
      - The high IO demands in this situation can then cause further problems such as longer request duration and cluster instability.
      - Sometimes, `LoadDocument` misuse is caused by trying to apply relational modeling approaches to document-based databases.  
        If you're accustomed to relational data modeling, you can learn about effective [document modeling](https://ravendb.net/learn/inside-ravendb-book/reader/4.0/3-document-modeling) in the "Inside RavenDB" book.  





{PANEL/}

## Related Articles

### Indexes
- [Map Indexes](../../../indexes/map-indexes)
- [Multi-Map Indexes](../../../indexes/multi-map-indexes)
- [Map-Reduce Indexes](../../../indexes/map-reduce-indexes)
- [Querying and Indexing in RavenDB](https://ravendb.net/learn/inside-ravendb-book/reader/4.0/9-querying-in-ravendb)
- [Working with RavenDB Indexes](https://ravendb.net/learn/inside-ravendb-book/reader/4.0/12-working-with-indexes)

### Studio
- [Indexes: Overview](../../../studio/database/indexes/indexes-overview)
- [Index List View](../../../studio/database/indexes/indexes-list-view)
- [Create Map Index](../../../studio/database/indexes/create-map-index)
- [Create Multi-Map Index](../../../studio/database/indexes/create-multi-map-index)
- [Map-Reduce Visualizer](../../../studio/database/indexes/map-reduce-visualizer)
