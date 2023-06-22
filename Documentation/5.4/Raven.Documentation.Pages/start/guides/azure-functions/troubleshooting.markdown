# Troubleshooting
---

### `DatabaseDoesNotExist` error

The instance you're connecting to doesn't have a database yet (specified through `DB_NAME`).

Follow the instructions to [create a new database][docs-create-db] in the Studio.

### `InvalidAuth` certificate error

If RavenDB returns an `InvalidAuth` response with a message like:

`This server requires client certificate for authentication, but none was provided by the client.`

The provided certificate may not be the right one, may have the wrong password, or may lack
permissions. Double-check that the certificate works locally.

[docs-create-db]: /docs/article-page/nodejs/studio/database/create-new-database/general-flow
