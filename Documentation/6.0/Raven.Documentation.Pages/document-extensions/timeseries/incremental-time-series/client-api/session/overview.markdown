﻿# Session: Overview

---


{NOTE: }

* Incremental Time Series can be created and managed using a set of 
  [session](../../../../../client-api/session/what-is-a-session-and-how-does-it-work) 
  API methods, whose functionality is mostly identical to that of 
  [non-incremental time series session methods](../../../../../document-extensions/timeseries/client-api/overview#available-time-series-session-methods).  

* The incremental time series uses the 
  [Increment](../../../../../document-extensions/timeseries/incremental-time-series/client-api/session/increment) 
  method to -  
   * Create a new time series,  
   * Create a new time series entry,  
   * and Increase a value by some delta.  

* In this page:  
  * [Session API Methods](../../../../../document-extensions/timeseries/incremental-time-series/client-api/session/overview#session-api-methods)  
     * [IncrementalTimeSeriesFor Methods](../../../../../document-extensions/timeseries/incremental-time-series/client-api/session/overview#methods)  
     * [Additional Session Methods](../../../../../document-extensions/timeseries/incremental-time-series/client-api/session/overview#additional-session-methods)  
{NOTE/}

---

{PANEL: Session API Methods}

---

### `IncrementalTimeSeriesFor` Methods

The `IncrementalTimeSeriesFor` class provides useful incremental time series 
session API methods, including [Increment](../../../../../document-extensions/timeseries/incremental-time-series/client-api/session/increment), 
[Get](../../../../../document-extensions/timeseries/incremental-time-series/client-api/session/get), 
and [Delete](../../../../../document-extensions/timeseries/incremental-time-series/client-api/session/delete).  

To use it -  

* Open a session  
* Create an instance of `IncrementalTimeSeriesFor` and pass it:  
    * An explicit document ID,  
      -or-  
      An [entity tracked by the session](../../../../../client-api/session/loading-entities), 
      e.g. a document object returned from [session.Query](../../../../../client-api/session/querying/how-to-query) 
      or from [session.Load](../../../../../client-api/session/loading-entities#load).  
    * The time series name.  
      The name **must** begin with "INC:" (can be upper or lower case) to identify the time series as incremental.  
* Call an `IncrementalTimeSeriesFor` method  
* Call `session.SaveChanges` for the action to take place.  


---

### Additional Session Methods

Additional session API methods handle incremental time series the 
same way they do non-incremental time series, allowing you to -  

* [Include](../../../../../document-extensions/timeseries/client-api/session/include/overview) incremental time series,  
* [Patch](../../../../../document-extensions/timeseries/client-api/session/patch) incremental time series,  
* and [Query](../../../../../document-extensions/timeseries/client-api/session/querying) incremental time series.  


{PANEL/}

## Related articles

**Time Series Overview**  
[Time Series Overview](../../../../../document-extensions/timeseries/overview)  

**Studio Articles**  
[Studio Time Series Management](../../../../../studio/database/document-extensions/time-series)  

**Querying and Indexing**  
[Time Series Querying](../../../../../document-extensions/timeseries/querying/overview-and-syntax)  
[Time Series Indexing](../../../../../document-extensions/timeseries/indexing)  

**Policies**  
[Time Series Rollup and Retention](../../../../../document-extensions/timeseries/rollup-and-retention)  
