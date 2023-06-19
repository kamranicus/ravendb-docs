﻿# Import from CSV

RavenDB can import CSV data files into .json document databases.  
Because some CSV files are formatted differently, the RavenDB Studio enables you to configure the CSV import by specifying the type of CSV  
 
* Fields delimiter (comma, semi-colon, tab, or space) 
* Text qualifier (double or single quote)
* How to handle whitespace  

In this page: 

* [What is CSV](../../../../studio/database/tasks/import-data/import-from-csv#what-is-csv)  
* [How should I format my documents as CSV](../../../../studio/database/tasks/import-data/import-from-csv#how-should-i-format-my-documents-as-csv)  
* [How to Import a CSV via RavenDB Studio](../../../../studio/database/tasks/import-data/import-from-csv#how-to-import-a-csv-via-ravendb-studio)  

{PANEL: }

## What is CSV

A Comma-Separated Values (CSV) file is a delimited text file that typically uses a comma to separate values ([from Wikipedia](https://en.wikipedia.org/wiki/Comma-separated_values)).  

The first line of a CSV file defines the column headers in a table or the keys in a .json document.  

{PANEL/}

{PANEL: }

## How should I format my documents as CSV

RavenDB uses JSON format for storing documents, thus the CSV lines representing documents should have a specific format. 
There are three types of properties in JSON: 

- Primitive: values that are numbers, strings, or booleans  
- Nested Object: where the value of the property is a JSON object  
- Array: an array of values that can either be primitives, nested objects, or arrays  

Let's look at a sample JSON document:
{CODE-BLOCK:json}
{
    "Name": "Import from CSV",
    "NestedObject": {
        "Name": "Inner Object"
    },
    "ArrayObject": [
        1,
        2,
        3,
        4
    ],
    "@metadata": {
        "@collection": "Samples"
    }
}
{CODE-BLOCK/}

The `Name` property is a primitive and should appear unescaped in the CSV like so: 

{CODE-BLOCK:json}
Name
Import from CSV
{CODE-BLOCK/}

The `NestedObject` property is a nested JSON object and as such should be decomposed into multiple properties - one for each nested property.  
The decomposition rule goes as follows:  
[`the name of the parent property`].[`name of the inner object property`]  
like so:  

{CODE-BLOCK:json}
NestedObject.Name
Inner Object
{CODE-BLOCK/}

The import process will combine properties with the same prefix back into one JSON object.  

The `ArrayObject` property is an array and as such contains multiple values. These should be escaped as a string like so:  

{CODE-BLOCK:json}
ArrayObject
"[1,2,3,4]"
{CODE-BLOCK/}

The last thing we need in order for an import to work is to add the `collection` property. If we don't, the name of the collection will derive from the CSV file name.

{CODE-BLOCK:json}
@metadata.@collection
Samples
{CODE-BLOCK/}

If we want to import the document with a specific `id` we need to include an `@id` property too. 

{CODE-BLOCK:json}
@id
Samples/1-A
{CODE-BLOCK/} 

The complete CSV line should look like this:  

{CODE-BLOCK:json}
@id,Name,NestedObject.Name,ArrayObject,@metadata.@collection
Samples/1-A,Import from CSV,Inner Object,"[1,2,3,4]",Samples
{CODE-BLOCK/} 

{NOTE: }

Note that the first line of a .csv file applies to the header rows.  
It names the column headers in a table, but in a .json document, it names the key properties.  

{NOTE/}

{PANEL/}

{PANEL: }

## How to Import a CSV via RavenDB Studio

Now that we've got a valid CSV file we can import it to RavenDB.  

![Figure 1. Import CSV file](images/import-from-CSV-studio-view.png "Import CSV file")

1. **Tasks** tab.  
   Click to see task options.  
2. **Import Data**.  
   Select to see import options.  
3. **Current database**  
   Make sure that you are importing into the correct database.  
4. **From CSV File**  
   Select to open the Import from CSV interface.  
5. **Import from File**  
   Select the file to import.  
6. **Import to Collection**  
   Name the [collection](../../../../client-api/faq/what-is-a-collection) where the file will be imported. 
   If you don't choose a name, RavenDB will use the CSV file name. 
   When running an [RQL](../../../../client-api/session/querying/what-is-rql) query, the code `from` often refers to 
   the collection that contains the desired document.  
7. **CSV options**  
  Define CSV formatting configurations.  Make sure they match the source .csv file.  
   * **Fields Delimiter**  
     Comma is the standard default.  Some CSVs separate fields with semi-colons, spaces or tabs instead.  
   * **Text Qualifier**  
     Double quote is the standard default. Some CSVs use single quotation marks instead.  
     Commas or other field delimiters will be ignored inside the chosen text qualifier (quotation marks).  
   * **Whitespace**  
     CSV data is meant to be clean of white spaces because in strings, they can lead to misinterpretations. 
     Trimming is an opportunity to clean-up unwanted white spaces. 
     See if your source data has unwanted white spaces before you decide if or how to trim.  
      * The following sample CSV has white spaces between fields that are unnecessary because commas separate fields. 
        Raven DB Studio import can clean these white spaces with the "Trim whitespace around fields" option.  
      * If there were whitespaces in the fields (e.g. between a date and its comma), it could be more problematic and 
        the option "Trim whitespace inside strings" would clean these, but it would also clean up the desired 
        whitespaces inside the titles.  
      * The RavenDB import from CSV tool does not confuse between commas that separate fields and commas in the title 
        stings because the titles are inside double quotation marks which makes it clear to RavenDB not to use these 
        commas to separate.  
      ![Sample CSV with Whitespaces](images/sample-csv-deniro.png "Sample CSV with Whitespaces")
8. Select **Import Collection**  
  
After importing the CSV file, the resulting .json document should look like the document 
[above](../../../../studio/database/tasks/import-data/import-from-csv#how-should-i-format-my-documents-as-csv).  

{PANEL/}
