# Troubleshooting
---


### `DatabaseDoesNotExist` error

The instance you're connecting to doesn't have a database yet (specified through `DB_NAME`).

Follow the instructions to [create a new database][docs-create-db] in the Studio.

### Cannot find `DB_CERT.fetch` function

Wrangler must be run in _non-local mode_ to populate the `DB_CERT` certificate binding variable.

The RavenDB Cloudflare template is configured to start in non-local mode. If you press the `L` key, it will switch modes and restart Wrangler. It will display a message like this:

`Shutting down local server.`

You may need to authenticate Wrangler again to your Cloudflare account when switching to non-local mode.

Learn more about using [mTLS certificates with Workers][cf-mtls-worker].

### Cannot Connect to RavenDB When Deployed

If you have IP restrictions enabled for your RavenDB cluster, be sure to allow the [Cloudflare IP ranges][cf-ips].

Be sure to also verify your `wrangler.toml` in case you are using [different deployment environments][cf-worker-env].

[docs-create-db]: /docs/article-page/latest/csharp/studio/database/create-new-database/general-flow
[cf-ips]: https://cloudflare.com/ips
[cf-worker-env]: https://developers.cloudflare.com/workers/platform/environments/ 
[cf-mtls-worker]: https://developers.cloudflare.com/workers/runtime-apis/mtls
