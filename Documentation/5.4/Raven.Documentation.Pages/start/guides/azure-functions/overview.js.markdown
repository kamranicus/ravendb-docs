﻿# Azure Functions (Node.js)
---

{NOTE: What is Azure Functions?}
Microsoft Azure Functions is a serverless platform that supports multiple languages and frameworks that let you deploy workloads that scale without managing any infrastructure.

Learn more about [how Microsoft Azure Functions work][az-funcs].

<!-- ### New to Azure Functions?

For a walkthrough and demo of getting started with Azure Functions, see [TBD](#). -->
{NOTE/}

In this guide, you will learn how to deploy a Node.js Azure Function using the [RavenDB Azure Functions Node.js template][template] that is connected to your RavenDB database. This guide assumes you are familiar with Node.js development techniques and the basics of Azure Function apps.

* [Before We Get Started](#before-we-get-started)
* [Create a Local Azure Function App](#create-a-local-azure-function-app)
* [Connecting to RavenDB](#connecting-to-ravendb)
* [Creating a Function App in Azure](#creating-a-function-app-in-azure)
* [Deploying to Azure](#deploying-to-azure)
* [Verify the Connection Works](#verify-the-connection-works)
* [Using RavenDB in the Azure Functions App](#using-ravendb-in-the-azure-functions-app)

{PANEL: Before We Get Started}

You will need the following before continuing:

- A [RavenDB Cloud][cloud-signup] account or self-hosted client certificate
- [Azure Function Core Tools][az-core-tools] 4.x+
- [Git](https://git-scm.org)
- [Node.js][nodejs] 18+

If you are new to Azure Function local development, see the [Getting started guide][az-funcs] for how to get up and running with your toolchain of choice.

{PANEL/}

{PANEL: Create a Local Azure Function App}

The [RavenDB Azure Function template][template] is a template repository on GitHub which means you can either create a new repository derived from the template or clone and push it to a new repository.

This will set up a local Azure Function app that we will deploy to your Azure account at the end of the guide.

### Creating a New Repository from the Template

Depending on your environment, there are several ways to clone the template and initialize a new Git repository. The template repository lists each clone method you can copy & paste directly, but the fastest way is by using [degit][tool-degit].

{CODE-BLOCK:bash}
npx degit ravendb/templates/azure-functions/node-http my-project
cd my-project
git init
{CODE-BLOCK/}

### Install Dependencies

After cloning the repository locally, install the Node.js dependencies with `npm`:

{CODE-BLOCK:bash}
npm install
{CODE-BLOCK/}

By default, the template is configured to connect to the Live Test instance of RavenDB. Since this is only for testing purposes, next you will configure the app to connect to your existing RavenDB database.

### Starting the Function

You can start the Azure Function locally using:

`npm start`

If you are using Visual Studio Code, you can also debug the function with F5 debugging.

You will see the welcome screen if the template is set up correctly:

![.NET template welcome screen](images/js-func-start.jpg)

Since this is only for testing purposes, next you will configure the connection to your existing RavenDB database.

{PANEL/}

{PANEL: Connecting to RavenDB}

To configure the local version of your Azure Functions app to connect to RavenDB, you will need to update the `local.settings.json` file with the `DB_URLS` value and `DB_NAME` value. The default is:

{CODE-BLOCK:json}
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "DB_URLS": "",
    "DB_NAME": ""
  }
}
{CODE-BLOCK/}

### Configure Local Database Certificate

RavenDB is secured using client-certificate authentication (or Mutual TLS).

The template supports loading certificate through physical `.pfx` files (X.509 certificates) locally.

Specify the following app settings:

- `DB_CERT_PATH`: the absolute path or relative path from the project root to your `.pfx` file, e.g. `../certs/db.pfx`
- `DB_PASSWORD`: the password that is protecting your PFX file

{WARNING: Do not store DB_PASSWORD in source control}
You are not required to use the password-protected PFX locally. If you do intend use the password-protected PFX file, you will need to set `DB_PASSWORD` as an environment variable in your terminal session (e.g. `export DB_PASSWORD=abc`) or through your terminal profile (e.g. `.bashrc`). Do not store the `.pfx` files to source control.
{WARNING/}

{PANEL/}

{PANEL: Creating a Function App in Azure}
At this point, the local Function app is ready to be deployed. There are multiple ways to create and deploy Function apps using tools like Visual Studio Code or the portal itself.

Follow the guide of your choice in the Microsoft docs. Once the app is created, come back here to finish configuring your database connection.

### Configuring Application Settings

1. Go to your Azure Functions dashboard in the Portal
1. Click the Application Settings menu
1. Add an app setting for `DB_URLS` with the comma-separated list of RavenDB node URLs to connect to
1. Add an app setting for `DB_NAME` with the database name to connect to

![JS update Azure app settings](images/js-azure-app-settings.jpg)

These values will override `local.settings.json` once deployed on Azure.

### Configuring PEM Certificate in Azure

Azure Functions supports client certificates on both the Consumption or App Service Plans.

Specify the `DB_CERT_PEM` app settings:

![JS add DB_CERT_PEM Azure app setting](images/js-azure-db-cert-pem.jpg)

The value should be the contents of the PEM-encoded certificate (`.pem` file) downloaded from RavenDB.

You can safely copy/paste the contents of the file into the environment variable in the Azure Portal without preserving newlines. If you are setting the value in the `local.settings.json` file, you will need to format the value for JSON using [a stringify tool][tool-stringify].

{NOTE: What about uploading certificates to the portal?}

Azure allows you to upload PFX certificates to the portal and load them using the `WEBSITE_LOAD_CERTIFICATES` app setting. However, this is much more difficult to use
for Node.js functions. That method is better suited for .NET or Java functions. **Regardless, this is not yet supported on Linux Consumption-based plans.** For a discussion on this, reference [this issue on the Azure Functions repository][ms-issue-linux-certs-unsupported].

The template is configured to use the PEM certificate method for ease of use across plan types and platforms.

{NOTE/}

{PANEL/}

{PANEL: Deploying to Azure}
Once the Azure app is set up in the portal, you are ready to deploy your app. There are 3 main ways to deploy your new Azure Function app: GitHub actions, command-line, and an extension.

The template has already been set up to use continuous deployment using GitHub Actions. For the other methods, see [Deploying Azure Function apps][az-deploy].

### Configure GitHub Secrets

The GitHub actions rely on having a secret environment variable `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` in your repository secrets.

1. Go to your Azure Functions dashboard in the Azure Portal
1. Click "Get Publish Profile"
    - ![download Azure publish profile](images/azure-download-publish-profile.jpg)
1. Download the publish profile
1. Open it and copy the full XML
1. Go to your [GitHub repository's secrets settings][gh-secrets]
    - ![add GitHub secret for publish profile](images/github-publish-profile-secret.jpg)
1. Add a new secret: `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`
1. Paste in the value of the publish profile

### Trigger a Deployment

Your repository and GitHub action is now set up. To test the deployment, you can push a commit to the repository.

If you have already committed and pushed, it is likely that the Action failed and you can re-run the job using the new secret variable.

{PANEL/}

{PANEL: Verify the Connection Works}

If the deployment succeeds, the `HttpTrigger` endpoint should now be available at your Function URL.

Once you open the URL in the browser, you should see a welcome screen like this with the connection information:

![JS Azure func welcome screen](images/js-azure-func-success.jpg)

This means your Azure Functions app is correctly configured and ready to work with RavenDB.

{PANEL/}

{PANEL: Using RavenDB in the Azure Functions App}

The template uses the [@senacor/azure-function-middleware][npm-middleware] npm package to provide a `middleware` helper function that can wrap Azure function handlers. The template includes a database middleware that opens a new session per request and ensures the document store is initialized once.

### Exporting an Azure Function trigger with middleware

By default, Azure Function handlers are exported like `export default httpTrigger;`.

You will need to change this to export with the `middleware` helper function for any new triggers being added. Import the `createDbMiddleware` function and pass it as the second parameter to `middleware`, like this:

`export default middleware(httpTrigger, [createDbMiddleware]);`

### Example: Passing the database middleware to an Azure function handler

{CODE-BLOCK:javascript}
import { Context, HttpRequest } from "@azure/functions";

// Import the middleware helpers
import { middleware } from "@senacor/azure-function-middleware";
import { createDbMiddleware } from "../db/middleware";

const httpTrigger = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: 'success'
  };
};

// Export default trigger wrapped with middleware
export default middleware(httpTrigger, [createDbMiddleware]);
{CODE-BLOCK/}

The middleware injects a `db` parameter on the `context` object of type `IDocumentSession`. You can access the document session using `context.db` in the function handler.

### Example: Loading a user

{CODE-BLOCK:javascript}
const httpTrigger = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const user = await context.db.load("users/" + req.params.id);

  context.res = {
    body: JSON.stringify({ user })
  };
};
{CODE-BLOCK/}

Learn more about [how to use the RavenDB Node.js client SDK][ravendb-nodejs]

{PANEL/}

[az-funcs]: https://learn.microsoft.com/en-us/azure/azure-functions/functions-get-started
[az-core-tools]: https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local
[az-deploy]: https://learn.microsoft.com/en-us/azure/azure-functions/functions-deployment-technologies
[nodejs]: https://nodejs.org
[template]: https://github.com/ravendb/templates/tree/main/azure-functions/node-http
[gh-secrets]: https://docs.github.com/en/actions/security-guides/encrypted-secrets
[cloud-signup]: https://cloud.ravendb.net?utm_source=ravendb_docs&utm_medium=web&utm_campaign=howto_template_azurefns_nodejs&utm_content=cloud_signup
[docs-get-started]: /docs/article-page/nodejs/start/getting-started
[ravendb-nodejs]: /docs/article-page/nodejs/client-api/session/what-is-a-session-and-how-does-it-work
[npm-middleware]: https://npmjs.com/package/@senacor/azure-function-middleware
[tool-stringify]: https://onlinestringtools.com/json-stringify-string
[tool-degit]: https://npmjs.com/package/degit
[ms-issue-linux-certs-unsupported]: https://github.com/Azure/Azure-Functions/issues/1644
