# Deployment Considerations
---

This document describes different things to consider when deploying RavenDB serverless workloads to Microsoft Azure Functions platform.

## Linux or Windows?

Azure Functions allows you to deploy Function Apps on Linux or Windows. For RavenDB, this mainly affects the way certificates are loaded and handled.

**Using a Windows deployment plus .NET Azure Functions will provide the most secure and performant option.** This will allow you to upload client certificates through the Portal and make them accessible to your .NET functions with the `WEBSITE_LOAD_CERTIFICATES` application setting. Further, .NET Core functions have the lowest cold start times compared to Node.js.

**If you prefer to use Node.js,** you can choose Linux or Windows. The template is configured to support a PEM-encoded certificate loaded through an environment variable due to a limitation with cross-platform support for `WEBSITE_LOAD_CERTIFICATES` (see [this issue][ms-issue-linux-certs-unsupported] on the Azure Functions repo).

## Document Store Lifetime and Cold Starts

One of the benefits of serverless is that you potentially can lower costs for less-used services and pay-per-invocation. As a trade-off, these functions incur a startup cost known as a "cold start" before they can serve requests.

The Document Store is meant to be instantiated once for the lifetime of an application. However, cold vs. warm starts in serverless environments have some implications on this.

In Azure Functions, the document store will be shared across invocations of a Function as long as it remains warmed up. For Functions being invoked more than once every 60 seconds, the document store will remain initialized and you should not see an impact to latency.

If an Azure Function is wound down, the next time it is invoked will incur a cold start cost, including initializing the document store.

To reduce cold starts, consider switching from the Consumption (Pay-as-you-Go) plan to a Premium App Service Plan which will allow you to keep Functions warm for longer periods of time.

Learn more about [how Azure Functions deals with cold vs. warm start times][az-func-cold-warm].

[az-func-cold-warm]: https://azure.microsoft.com/en-us/blog/understanding-serverless-cold-start/
[ms-issue-linux-certs-unsupported]: https://github.com/Azure/Azure-Functions/issues/1644
