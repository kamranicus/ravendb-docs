import { DocumentStore } from "ravendb";

const store = new DocumentStore();
const session = store.openSession();

let action, queryCustomization, seed, waitTimeout, projectionBehavior;
class Employee {}

//region index_1
class BlogPosts_ByTag extends AbstractJavaScriptIndexCreationTask {
    constructor() {
        super();

        this.map(BlogPost, b => {
            const result = [];

            b.tags.forEach(item => {
                result.push({
                    tag: item
                });
            });

            return result;

            // This fanout index outputs multiple index entries per each document,
            // (an index-entry per tag in from the tags list).            
            // The query can be customized to return the documents without the duplicates,
            // (see the query example in the first tab).  
        })
    }
}

class BlogPost {
    constructor() {
        this.id = null;
        this.title = null;
        this.body = null;
        this.tags = null;
    }
}

class TagResult {
    constructor() {
        this.tag = null;
    }
}
//endregion

//region index_2
class Employee_ByFullName extends AbstractJavaScriptIndexCreationTask {
    constructor() {
        super();

        this.map(Employee, e => {
            return {
                fullName: e.firstName + " " + e.lastName
            }
        })

        // Store field 'fullName' in the index
        this.store("fullName", "Yes");
    }
}
//endregion

async function customizeExamples() {
    {
        //region customize_1_0
        const results = await session
             // Query an index
            .query(BlogPost, BlogPosts_ByTag)
             // Provide a callback for the 'beforeQueryExecuted' event 
            .on("beforeQueryExecuted", query => {
                // Can modify query parameters
                query.skipDuplicateChecking = true;
                // Can apply any needed action, e.g. write to log/console
                console.log(`Query to be executed is: ${query.query}`);
            })
            .all();
        //endregion
    }

    {
        //region customize_2_0
        let queryDuration = 0;

        const results = await session
            .query({ collection: "employees" })
             // Provide a callback for the 'afterQueryExecuted' event 
            .on("afterQueryExecuted", rawResult => {
                // Can access the raw query result
                queryDuration = rawResult.durationInMs
                // Can apply any needed action, e.g. write to log/console
                console.log(`${rawResult.lastQueryTime}`);
             })
            .all();
        //endregion
    }

    {
        //region customize_3_0
        const results = await session
            .query({ collection: "employees" })
            .whereEquals("firstName", "Robert")
             // Add a call to 'noCaching'
            .noCaching()
            .all();
        //endregion
    }

    {
        //region customize_4_0
        const results = await session
            .query({ collection: "employees" })
            .whereEquals("firstName", "Robert")
            // Add a call to 'noTrcking'
            .noTracking()
            .all();
        //endregion
    }

    {
        //region customize_5_0
        // The projection class: 
        class EmployeeProjectedDetails {
            constructor() {
                this.fullName = null;
            }
        }
        
        // Define a query with a projection
        const query = session
             // Query an index that has stored fields
            .query(Employee, Employee_ByFullName)
             // Use 'selectFields' to project the query results
             // Pass the requested projection behavior (3'rd param)
            .selectFields(["fullName"], EmployeeProjectedDetails, "FromDocumentOrThrow")
            .all();

        // * Field 'fullName' is stored in the index.
        //   However, the server will try to fetch the value from the document 
        //   since the default behavior was modified to `FromDocumentOrThrow`.
        
        // * An exception will be thrown -
        //   since an 'Employee' document does not contain the property 'fullName'.
        //   (based on the Northwind sample data).        
        //endregion
    }
    
    {
        //region customize_6_0
        const results = await session
            .query({ collection: "employees" })
            // Add a call to 'randomOrdering', can pass a seed
            .randomOrdering("123")
            .all();
        //endregion
    }

    {
        //region customize_7_0
        let timingsResults;

        const results = await session.query({ collection: "Products" })
            .whereEquals("firstName", "Robert")
             // Call 'timings', pass a callback function
             // Output param 'timingsResults' will be filled with the timings details when query returns 
            .timings(t => timingsResults = t)
            .all();
        //endregion
    }

    {
        //region customize_8_0
        const results = await session.query({ collection: "Products" })
            .whereEquals("firstName", "Robert")
             // Call 'waitForNonStaleResults', 
             // Optionally, pass the time to wait. Default is 15 seconds.
            .waitForNonStaleResults(10_000)
            .all();
        //endregion
    }
}

{
    const query = session.query({ collection: "test" });

    //region customize_1_1
    on("beforeQueryExecuted", eventHandler);
    //endregion

    //region customize_2_1
    on("afterQueryExecuted", eventHandler);
    //endregion

    //region customize_3_1
    noCaching();
    //endregion

    //region customize_4_1
    noTracking();
    //endregion

    //region customize_5_1
    selectFields(properties, projectionClass, projectionBehavior);
    //endregion

    //region customize_6_1
    randomOrdering();
    randomOrdering(seed);
    //endregion

    //region customize_7_1
    timings(timingsCallback)
    //endregion

    //region customize_8_1
    waitForNonStaleResults();
    waitForNonStaleResults(waitTimeout);
    //endregion
}
