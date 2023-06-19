﻿# Incremental Time Series: Overview

---

{NOTE: }

* **Incremental Time Series** are [time series](../../../document-extensions/timeseries/overview) 
  whose values are designated to function as counters.  
  
* Similar to Counters, an incremental-time-series value can be increased/decreased by some 
  delta on any node.  
  Each node manages and stores its own accumulated local changes per value.  

* Simultaneous updates to the same value from multiple nodes/clients do not cause any conflict.  
  The value's total contents is simply the accumulation of that value's contents stored per-cluster node 
  for the same timestamp.  

* Incremental Time series can be created and managed using dedicated [API methods](../../../document-extensions/timeseries/incremental-time-series/client-api/session/overview) 
  and via [Studio](../../../studio/database/document-extensions/time-series#incremental-time-series).  

* In this page:  
  * [What are Incremental Time Series and Why Use Them](../../../document-extensions/timeseries/incremental-time-series/overview#what-are-incremental-time-series-and-why-use-them)  
  * [Incremental Time Series -vs- Non-incremental Time Series](../../../document-extensions/timeseries/incremental-time-series/overview#incremental-time-series--vs--non-incremental-time-series)  
  * [Incremental Time Series Structure](../../../document-extensions/timeseries/incremental-time-series/overview#incremental-time-series-structure)  

  

{NOTE/}

---

{PANEL: What are Incremental Time Series and Why Use Them}

* **A Time Series That Counts**  
  Many scenarios require us to continuously update a counter, and yet keep track of 
  the changes made to its value over time.  
  [Counters](../../../document-extensions/counters/overview) let us count, but not keep track of changes.  
  [Time series](../../../document-extensions/timeseries/overview) let us record changes over time, 
  but are not designated for counting.  
  Incremental time series allow us to easily achieve both goals, by permitting clients 
  to **use entry values as counters, while storing their modifications over time in an evolving time series**.  
   {NOTE: Use Case}
   A web page admin can store the ongoing number of downloads made by visitors in an 
   incremental time series.  
   In addition to recording the number of downloads over time, the number of downloads 
   per timestamp can be incremented as needed.  
   The number of downloads can be queried at any time for hourly or daily changes over 
   the passing week or month, and a graph of the results can be plotted using Studio or any other tool.  
   {NOTE/}

* **Parallel Modification**  
  * An incremental time series entry can be **modified by multiple clients without conflict**.  
  * A node handling a request to increment a value stores the value's new contents locally.  
    This contents replicates to all other nodes but does not override this value's contents on 
    the other nodes.  
    Instead, **per timestamp, each node stores an incremental time series entry composed of 
    the value's contents per node**.  
  * When querying a time series, you can retrieve the **total** value contents, 
    accumulated from the per-node values, or get the **distinct** values per-node.  

     {NOTE: Use Case}
     A real-life scenario that makes good use of this feature is a bunch of traffic cameras 
     installed in different directions of a large road intersection, counting passing cars.  
     Each camera reports to its own cluster node, and the cluster collects the data into 
     a single time series. Each time series entry contains data from all nodes.  
     An admin can then query both the accumulated values, counting all cars passing through 
     the junction at any given moment, and each camera's data separately for a detailed look 
     at its side of the junction.  
     {NOTE/}


{PANEL/}

{PANEL:  Incremental Time Series -vs- Non-incremental Time Series}

* **Name Convention**  
   * Non-incremental:  
     Any name can be used, as long as it doesn't start with the dedicated incremental prefix.  
   * Incremental:  
     Name must start with `INC:` (can be either upper or lower case).  

* **General Usage**  
   * Non-incremental:  
     Record data over time with no intention of changing the stored values.  
     i.e. once stored, Heartrates or Stock prices values need no alteration.  
   * Incremental:  
     Record data over time and allow to increase/decrease each value per timestamp.  

* **Modified values & Replication**  
   * Non-incremental:  
     A value that is modified on one node is replicated to other nodes and will 
     replace the existing value's contents on the other nodes.  
     Upon concurrent updates for the same timestamp, the highest value from all 
     nodes takes over the value's contents.  
   * Incremental:  
     A request to increase a value contains the **delta** by which the value is to be 
     increased or decreased.  
     A node handling such request stores the value's new contents locally.  
     This contents replicates to all other nodes but doesn't override this value's 
     contents on the other nodes.  
     Instead, **per timestamp, each node stores an incremental time series entry 
     that is composed of the value's contents per node**.  

* **Tag per Entry**  
   * Non-incremental:  
     Any tag can be set by the user per entry.  
   * Incremental:  
     The user cannot set a tag per entry.  
     The entry's tag is set by the server for inner usage only and is composed of the 
     Node tag and the database ID.  

* **Rollup Policies**  
   * Non-incremental:  
     Rollup policies can be created for speedy filtering and size reduction in the original series.  
   * Incremental:  
     Rollup policies can be created as above.  
     However, the resulting rollup time series is non incremental.  
     It can be handled via [TimeSeriesFor](../../../document-extensions/timeseries/client-api/session/append#timeseriesfor.append), not 
     [IncrementalTimeSeriesFor](../../../document-extensions/timeseries/incremental-time-series/client-api/session/overview#methods), 
     and its values can no longer be [Incremented](../../../document-extensions/timeseries/incremental-time-series/client-api/session/increment).  

{PANEL/}

{PANEL: Incremental Time Series Structure}

* The basic structure and behavior of incremental time series are similar 
  to those of [non-incremental time series](../../../document-extensions/timeseries/overview#time-series-data).  
* An incremental time series is attached to a document just like a non-incremental 
  time series is.  
  In Studio, incremental time series are even accessed through the 
  familiar [Time Series View](../../..//studio/database/document-extensions/time-series#creating-a-new-incremental-time-series-by-creating-its-first-entry).  
* An incremental time series is divided into segments and entries the same way 
  a non-incremental time series is.  
* The main structural difference is incremental time series' capacity to store multiple 
  per-node values in a single entry and manage them separately.  
* Each entry is assigned a single unique timestamp.  
  However, when different nodes update the same value at the same timestamp, the entries 
  stored on those nodes will be assigned with the same timestamp.  
* The number of values that can be stored per incremental time series entry 
  remains 32, but since each entry contains all values stored on all nodes the 
  entry's size may be much larger.  

{PANEL/}

## Related articles

**Client API**  
[Time Series API Overview](../../../document-extensions/timeseries/client-api/overview)  

**Studio Articles**  
[Studio Time Series Management](../../../studio/database/document-extensions/time-series)  

**Querying and Indexing**  
[Time Series Querying](../../../document-extensions/timeseries/querying/overview-and-syntax)  
[Time Series Indexing](../../../document-extensions/timeseries/indexing)  

**Policies**  
[Time Series Rollup and Retention](../../../document-extensions/timeseries/rollup-and-retention)  

