﻿# Ongoing Tasks: OLAP ETL

---

{NOTE: }

* The **OLAP ETL task** creates an ETL process from a RavenDB database to a variety of destinations that 
are especially useful for conducting OLAP. These destinations currently include:  
  * [Amazon S3](https://aws.amazon.com/s3/)
  * [Amazon Glacier](https://aws.amazon.com/glacier/)
  * [Microsoft Azure](https://azure.microsoft.com/)
  * [Google Cloud Platform](https://cloud.google.com/)
  * File Transfer Protocol
  * Local storage

* The data is encoded in the [Apache Parquet format](https://parquet.apache.org/docs), 
an alternative to CSV that is much faster to query. Unlike CSV, Parquet groups the data according to its 
column (by field) instead of by row (by document).  

* In this page:  
  * [Client API](../../../server/ongoing-tasks/etl/olap#client-api)  
  * [Transform Script](../../../server/ongoing-tasks/etl/olap#transform-script)  
  * [Athena Examples](../../../server/ongoing-tasks/etl/olap#athena-examples)  

{NOTE/}

---

{PANEL: Client API}

Creating an OLAP ETL task through the client is very similar to creating a RavenDB or SQL ETL task. 
All cases use [the `AddEtlOperation`](../../../client-api/operations/maintenance/etl/add-etl). For 
OLAP you will need an `OlapEtlConfiguration` which itself needs an `OlapConnectionString`. Their 
configuration options are listed below.  

This is an example of a basic OLAP ETL creation operation:  

{CODE add_olap_etl@ClientApi\Operations\AddEtl.cs /}

#### `OlapEtlConfiguration`

| Property | Type | Description |
| - | - | - |
| `RunFrequency` | `string` | Takes a [cron expression](https://docs.oracle.com/cd/E12058_01/doc/doc.1014/e12030/cron_expressions.htm) which determines how often the server will execute the ETL process. |
| `CustomPartitionValue` | `string` | A value that can be used as a partition name in multiple scripts. See [below](../../../server/ongoing-tasks/etl/olap#the-custom-partition-value). |
| `OlapTables` | `List<OlapEtlTable>` | List of naming configurations for individual tables. See more details below. |

#### `OlapConnectionString`

The OLAP connection string contains the configurations for each destination of the ETL task.  

| Property | Description |
| - | - |
| `LocalSettings` | Settings for storing the data locally. |
| `S3Settings` | Settings for an AWS S3 bucket. |
| `GlacierSettings` | Settings for an AWS Glacier. |
| `AzureSettings` | Settings for Azure. |
| `GoogleCloudSettings` | Settings for Google Cloud Platform. |
| `FTPSettings` | Settings for File Transfer Protocol. |

{NOTE: ETL Destination Settings}
<br/>
This is the list of different settings objects that the `OlapConnectionString` object can contain.  

#### `LocalSettings`

| Property | Type | Description |
| - | - | - |
| `FolderPath` | `string` | Path to local folder. If this property is not set, the data is saved to the location specified in [the setting `Storage.TempPath`](../../../server/configuration/storage-configuration#storage.temppath). If _that_ setting has no value, the data is instead saved to the location specified in [the setting `CoreConfiguration.DataDirectory`](../../../server/configuration/core-configuration#datadir). |

#### `FtpSettings`

| Property | Type | Description |
| - | - | - |
| `Url` | `string` | The FTP URL |
| `Port` | `int` | The FTP port |
| `UserName` | `string` | The username used for authentication |
| `Password` | `string` | Authentication password |
| `CertificateFileName` | `string` | The name of your local certificate file |
| `CertificateAsBase64` | `string` | The certificate in base 64 format |

#### `S3Settings`

| Property | Type | Description |
| - | - | - |
| `AwsAccessKey` | `string` | Main certificate for the AWS server |
| `AwsSecretKey` | `string` | Encryption certificate for the AWS server |
| `AwsSessionToken` | `string` | AWS session token |
| `AwsRegionName` | `string` | The AWS server region |
| `BucketName` | `string` | The name of the S3 bucket that is the destination for this ETL |
| `CustomServerUrl` | `string` | The custom URL to the S3 bucket, if you have one |
| `RemoteFolderName` | `string` | Name of the destination folder within the S3 bucket |
| `ForcePathStyle` | `bool` | Change the default S3 bucket path convention on custom S3 server|

#### `GlacierSettings`

| Property | Type | Description |
| - | - | - |
| `AwsAccessKey` | `string` | Main certificate for the AWS server |
| `AwsSecretKey` | `string` | Encryption certificate for the AWS server |
| `AwsSessionToken` | `string` | AWS session token |
| `AwsRegionName` | `string` | The AWS server region |
| `VaultName` | `string` | The name of your AWS Glacier vault |
| `RemoteFolderName` | `string` | Name of the destination folder within the Glacier |

#### `AzureSettings`

| Property | Type | Description |
| - | - | - |
| `StorageContainer` | `string` | Microsoft Azure Storage container name |
| `RemoteFolderName ` | `string` | Path to remote Azure folder |
| `AccountName` | `string` | The name of your Azure account |
| `AccountKey` | `string` | Your Azure account key |
| `SasToken` | `string` | Your SaS token for authentication |

#### `GoogleCloudSettings`

| Property | Type | Description |
| - | - | - |
| `BucketName` | `string` | Google cloud storage bucket name |
| `RemoteFolderName` | `string` | Path to remote bucket folder |
| `GoogleCredentialsJson` | `string` | Authentication credentials to your Google Cloud Storage |

{NOTE/}

#### `OlapEtlTable`

Optional, more detailed naming configuration.  

| Property | Type | Description |
| - | - | - |
| `TableName` | `string` | The name of the table. This should usually be the name of the source collection. |
| `DocumentIdColumn` | `string` | A name for the id column of the table. Default: "_id" |

#### ETL Run Frequency

Unlike other ETL tasks, OLAP ETL operates only in batches at regular intervals, rather than triggering a 
new round every time a document updates.  
If a document has been updated after ETL (even if updated data has not actually been loaded) they are 
distinguished by `_lastModifiedTime`, the value of the `last-modified` field in a document's 
metadata in unix time. This field appears as another column in the destination tables.  

{PANEL/}

{PANEL: Transform Script}

Transformation scripts are similar to those in the RavenDB ETL and SQL ETL tasks - see more about this in 
[ETL Basics](../../../server/ongoing-tasks/etl/basics#transform). The major difference is that data output 
by the ETL task can be divided into folders and child folders called _partitions_. Querying the data usually involves scanning 
the entire folder, so there is an efficiency advantage to dividing the data into more folders.  

#### The `key` Parameter

As with other ETL tasks, the method that loads an entry to its destination is `loadTo<folder name>()`, 
but unlike the other ETL tasks, the method takes two parameters: the entry itself, and an additional 'key'. 
This `key` determines how many partitions there are and what their names are.  

{CODE-BLOCK: javascript}
loadTo<folder name>(key, object)
{CODE-BLOCK/}

The method's name determines the name of the parent folder that the method outputs to. If you want to output 
data to a folder called "Sales", use the method `loadToSales()`. The parameter key determines the names of 
one or more layers of child folders that contain the actual destination table.  

The actual value that you pass as the `key` for `loadTo<folder name>()` is one of two methods:  

* `partitionBy()` - creates one or more child folders (one inside the other).  
* `noPartition()` - creates no child folders.  

The child folders created by OLAP ETL are considered a sort of 'virtual column' of the destination table. 
This just means that all child folder names have this format: `[virtual column name]=[partition value]`, 
i.e. two strings separated by a `=`. The default virtual column name is `_partition`.  

`partitionBy()` can take one or more folder names in the following ways:  

* **`partitionBy(key)`** - takes a partition value and uses the default virtual column 
name `_partition`. The partition value can be a string, number, date, etc.
* **`partitionBy(['name', key])`** - takes a virtual column name and a partition value as an array of size two.  
* **`partitonBy(['name1', key1], ['name2', key2], ... )`** - takes multiple arrays of size two, each with a virtual 
column name and a partition value. Each pair represents a child folder of the preceding pair.  

Here are examples of possible values for `partitionBy()`, and the resulting folder names:  

{CODE-BLOCK: javascript}
loadToMyFolder(
    partitionBy('one'),
    object
)
//Loads the data to /MyFolder/_partition=one/

loadToMyFolder(
    partitionBy(['month', 'August']),
    object
)
//Loads the data to /MyFolder/month=August/

loadToMyFolder(
    partitionBy(['month', 'August'], ['day', '22'], ['hour', '17']),
    object
)
//Loads the data to /MyFolder/month=August/day=22/hour=17

loadToMyFolder(
    partitionBy(this.Company),
    object
)
// Loads the data to e.g. /MyFolder/_partition=Apple

loadToMyFolder(
    partitionBy(['month', new Date(this.OrderedAt).getMonth()]),
    obj
)
//Loads the data to e.g. /MyFolder/month=8
{CODE-BLOCK/}

#### The Custom Partition Value

The custom partition value is a string value that can be set in the 
[`OlapEtlConfiguration` object](../../../server/ongoing-tasks/etl/olap#section). This value can be 
referenced in the transform script as `$customPartitionValue`. This setting gives you another way 
to distinguish data from different ETL tasks that use the same transform script.  

Suppose you want to create multiple OLAP ETL tasks that all use the same transform script and 
connection string. All the tasks will output to the same destination folders, but suppose you 
want to be able to indicate which data came from which task. This custom partition value gives 
you a simple way to achieve this: all the tasks can run the same script, and each script can 
output the data to a destination folder with the name determined by that task's custom partition 
value setting.  

{CODE-BLOCK: javascript}
partitionBy(['source_ETL_task', $customPartitionValue])
{CODE-BLOCK/}

In the case of multiple partitions, the custom partition value can be used more than once, and it 
can appear anywhere in the folder structure.  

#### Script Example

{CODE script@Server\OngoingTasks\ETL\OlapETL.cs /}

{PANEL/}

{PANEL: Athena Examples}

Athena is a SQL query engine in the AWS environment that can both read directly from S3 buckets and 
output to S3 buckets.  

Here are a few examples of queries you can run in Athena. But first, you need to configure the 
destination for your query results: go to settings, and under "query result location" input the path 
to your preferred bucket. [Read more here](https://docs.aws.amazon.com/athena/latest/ug/querying.html#query-results-specify-location-console)

Create a `monthly_sales` table from parquet data stored in s3:
{CODE-BLOCK: sql}
CREATE EXTERNAL TABLE mydatabase.monthly_sales (
    `_id` string,
    `Qty` int,
    `Product` string,
    `Cost` int,
    `_lastModifiedTime` int
)
PARTITIONED BY (`dt` string)
STORED AS parquet
LOCATION 's3://ravendb-test/olap/tryouts/data/Sales'
{CODE-BLOCK/}

Load all partitions:
{CODE-BLOCK: sql}
MSCK REPAIR TABLE monthly_sales
{CODE-BLOCK/}

Select everything in the table:
{CODE-BLOCK: sql}
select *
from monthly_sales
{CODE-BLOCK/}

Select specific fields:
{CODE-BLOCK: sql}
select _id orderId, qty quantity, product, cost
from monthly_sales
{CODE-BLOCK/}

Filter based on product name:
{CODE-BLOCK: sql}
select *
from monthly_sales
where product = 'Products/2'
{CODE-BLOCK/}

Filter based on date (this is where partitioning adds efficiency - only the relevant folders are scanned):
{CODE-BLOCK: sql}
select *
from monthly_sales
where dt >= '2020-01-01' and dt <= '2020-02-01'
{CODE-BLOCK/}

From all items sold, select the maximum cost (price) per *order*:
{CODE-BLOCK: sql}
select _id orderId, max(cost) cost
from monthly_sales
group by _id
{CODE-BLOCK/}

Querying for the most recent version in an append-only table:
e.g. select everything in the table, and in case we have duplicates (multiple rows with the same id)
- only take the most recent version (the one with the highest _lastModifiedTime):
{CODE-BLOCK: sql}
SELECT DISTINCT o.*
FROM monthly_orders o
INNER JOIN
   (SELECT _id,
        MAX(_lastModifiedTime) AS latest
   FROM monthly_orders
   GROUP BY  _id) oo
   ON o._id = oo._id
       AND o._lastModifiedTime = oo.latest
{CODE-BLOCK/}

#### Apache Parquet

Parquet is an open-source text-based file format. Like [ORC](https://orc.apache.org/), columns are stored together 
instead of rows being stored together (the same fields from multiple documents, rather than 
whole documents). This makes queries more efficient.  

{PANEL/}

## Related Articles

### ETL

- [ETL Basics](../../../server/ongoing-tasks/etl/basics)
- [SQL ETL Task](../../../server/ongoing-tasks/etl/sql)
- [RavenDB ETL Task](../../../server/ongoing-tasks/etl/raven)

### Client API

- [How to Add ETL](../../../client-api/operations/maintenance/etl/add-etl)
- [How to Update ETL](../../../client-api/operations/maintenance/etl/update-etl)
- [How to Reset ETL](../../../client-api/operations/maintenance/etl/reset-etl)

### Studio

- [Define OLAP ETL Task in Studio](../../../studio/database/tasks/ongoing-tasks/olap-etl-task)
