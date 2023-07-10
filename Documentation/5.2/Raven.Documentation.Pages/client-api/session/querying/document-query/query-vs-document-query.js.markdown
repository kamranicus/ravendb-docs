# Query vs DocumentQuery

---

{NOTE: }

* The Node.js client provides a __unified API__ for querying documents via the `session.query()` method.  
  All available methods for the session's _query_ method are listed [here](../../../../client-api/session/querying/how-to-query#query-api).

* The `query` method is essentially a shorthand for invoking the `documentQuery` method.  
  Examples of those equivalent calls are listed below. 


{NOTE/}

---

{CODE:nodejs query_1@ClientApi\Session\Querying\DocumentQuery\queryVsDocumentQuery.js /}
{CODE:nodejs query_2@ClientApi\Session\Querying\DocumentQuery\queryVsDocumentQuery.js /}
{CODE:nodejs query_3@ClientApi\Session\Querying\DocumentQuery\queryVsDocumentQuery.js /}
{CODE:nodejs query_4@ClientApi\Session\Querying\DocumentQuery\queryVsDocumentQuery.js /}

## Related Articles

### Session 

- [Query Overview](../../../../client-api/session/querying/how-to-query)
- [What is a Document Query](../../../../client-api/session/querying/document-query/what-is-document-query)
- [How to use Lucene](../../../../client-api/session/querying/document-query/how-to-use-lucene)

### Indexes

- [Querying an index](../../../../indexes/querying/query-index)