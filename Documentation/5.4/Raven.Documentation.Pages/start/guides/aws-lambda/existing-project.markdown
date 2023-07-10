# Add RavenDB to an Existing AWS Lambda Project (.NET C#)
---

{NOTE: What is AWS Lambda?}
AWS Lambda is a serverless platform that supports multiple languages and frameworks that let you deploy workloads that scale without managing any infrastructure.

Learn more about [how AWS Lambda works][aws-lambda].
{NOTE/}

In this guide, you will learn how to connect to RavenDB from your existing .NET AWS Lambda functions. This guide assumes you are familiar with .NET development techniques and the basics of AWS Lambda functions.

On this page:

* [Before We Get Started](#before-we-get-started)
* [Installing the RavenDB Client SDK](#installing-the-ravendb-client-sdk)
* [Initializing the Document Store](#initializing-the-document-store)
* [Adding Support for App Settings](#adding-support-for-app-settings)
* [Configuring Support for Certificates](#configuring-support-for-certificates)
* [Configuring AWS](#configuring-aws)

{PANEL: Before We Get Started}

You will need the following before continuing:

- A [RavenDB Cloud][cloud-signup] account or self-hosted client certificate
- A local [AWS .NET development environment][aws-dotnet] set up
  - _Recommended_: [AWS Toolkit for VS Code][aws-vs-code]
  - _Recommended_: [AWS Toolkit for Visual Studio][aws-vs]
- [Amazon Lambda Tools package for .NET CLI][aws-dotnet-lambda]
- [.NET 6.x][ms-download-dotnet]

{NOTE: Starting from scratch?}
For a brand new AWS Lambda function, we recommend using the [RavenDB AWS Lambda .NET template](overview) which is set up with dependency injection, X.509/PEM certificate support, and AWS Secrets Manager integration. You can also reference the template to see how the integration is set up.
{NOTE/}

{PANEL/}

{PANEL: Installing the RavenDB Client SDK}

Get started by installing the [RavenDB.Client][nuget-ravendb-client] Nuget package in your solution or project which provides the .NET client SDK.

Using the .NET CLI:

{CODE-BLOCK:bash}
dotnet add package RavenDB.Client
{CODE-BLOCK/}

{PANEL/}

{PANEL: Initializing the Document Store}

Import the `DocumentStore` from `Raven.Client.Documents` namespace to create a new instance with the required configuration and initialize your connection to RavenDB by calling the `Initialize` method.

{CODE-BLOCK:csharp}
using Raven.Client.Documents;

var documentStore = new DocumentStore() {
  Urls = new [] { "https://a.free.mycompany.ravendb.cloud" },
  DatabaseName = "demo",
  // Other options
};
documentStore.Initialize();
{CODE-BLOCK/}

For more on what options are available, see [Creating a Document Store][docs-creating-document-store].

### Set up dependency injection

For AWS Lambda functions, it's recommended to configure the document store and document sessions with .NET dependency injection. The easiest way is to use the community Nuget package [RavenDB.DependencyInjection][nuget-ravendb-di]:

{CODE-BLOCK:bash}
dotnet add package RavenDB.DependencyInjection
{CODE-BLOCK/}

The pattern to set up dependency injection to inject an `IAsyncDocumentSession` only works reliably with a [ASP.NET Core Lambda function][aws-dotnet-aspnetcore]. If you are not using the AWS Lambda ASP.NET Core Hosting for .NET, you can still use a more traditional singleton `DocumentStoreHolder` pattern.

In your `Program.cs`, add a using statement for `Raven.DependencyInjection` which exposes two extension methods:

- `IServiceCollection.AddRavenDbDocStore`
- `IServiceCollection.AddRavenDbAsyncSession`

The resulting service configuration will look like this:

{CODE-BLOCK:csharp}
// Requires a using statement
using Raven.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Configure injection for IDocumentStore
services.AddRavenDbDocStore();

// Configure injection for IAsyncDocumentSession
services.AddRavenDbAsyncSession();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register Lambda to replace Kestrel as the web server for the ASP.NET Core application.
// If the application is not running in Lambda then this method will do nothing. 
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
{CODE-BLOCK/}

You can customize the options before they get passed down to the underlying `DocumentStore` with an overload:

{CODE-BLOCK:csharp}
services.AddRavenDbDocStore(options => {
    // ...
    // Customize `options`
    // ...

    options.Conventions.UseOptimisticConcurrency = true;
});
{CODE-BLOCK/}

{NOTE: Warm vs. Cold Starts}
In AWS Lambda, the instance will be shared across function invocations if the Lambda is warmed up, otherwise it will be constructed each time the function warms up. For more, see [Deployment Considerations](deployment-considerations)
{NOTE/}

You can set options manually but it's more likely you'll want to configure support for app settings.

{PANEL/}

{PANEL: Adding Support for App Settings}

You will need a way to pass options to the `DocumentStore` on your local machine and when deployed to AWS Lambda.

The RavenDB.DependencyInjection package supports reading settings from `appsettings.json` for ASP.NET applications. The default ASP.NET Core hosting also supports environment variable configuration.

For more on the different configuration providers supported, see [Configuration in ASP.NET Core][ms-docs-aspnet-configuration].

### Using JSON settings

An example `appsettings.json` file that connects to the RavenDB live test cluster might look like:

{CODE-BLOCK:json}
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "RavenSettings": {
    "Urls": ["http://live-test.ravendb.net"],
    "DatabaseName": "(not set)"
  }
}
{CODE-BLOCK/}

### Using environment variables

Environment variables follow the .NET conventions with `__` being the dot-notation separator (e.g. `RavenSettings__DatabaseName`).

You can pass environment variables in your terminal profile, OS settings, Docker `env`, on the command-line, or within AWS.

{PANEL/}

{PANEL: Configuring Support for Certificates}

RavenDB uses client certificate authentication (mutual TLS) to secure your database connection. The .NET Client SDK supports `X509Certificate2` which is passed to the `DocumentStore.Certificate` option. There are multiple ways to load a certificate:

- Load from .pfx files
- Load from PEM-encoded certificate
- Load from AWS Secrets Manager

### Load from .pfx Files

You can load PFX files with or without a password by providing the certificate path using `RavenSettings:CertFilePath`:

{CODE-BLOCK:json}
{
    "RavenSettings": {
        "Urls": ["https://a.free.company.ravendb.cloud"],
        "DatabaseName": "demo",
        "CertFilePath": "..\\shared\\certs\\company.client.certificate.pfx"
    }
}
{CODE-BLOCK/}

The dependency injection logic will automatically load the certificate from this path without extra code.

If the `.pfx` file requires a password, provide it using the .NET secrets tool by setting `RavenSettings:CertPassword`:

{CODE-BLOCK:bash}
dotnet user-secrets init
dotnet user-secrets set "RavenSettings:CertPassword" "<CertPassword>"
{CODE-BLOCK/}

However, keep in mind that using an absolute physical file path or a user secret requires manual steps for every developer working on a project to configure.

{WARNING: Avoid uploading or deploying .pfx files}
PFX files can be compromised, especially if they are not password-protected. Using a physical file also makes it hard to manage and rotate when they expire. They are only recommended for ease-of-use on your local machine. For production, it is better to use the PEM certificate method or AWS Secrets Manager.
{WARNING/}


### Load from PEM-encoded certificate

For AWS Lambda, it's recommended to use a PEM-encoded certificate that can be provided through an environment variable without deploying any files.

Unlike a `.pfx` file, a PEM-encoded certificate is plain-text encoded:

{CODE-BLOCK:plain}
-----BEGIN CERTIFICATE-----
MIIFCzCCAvO...
-----END CERTIFICATE-----
-----BEGIN RSA PRIVATE KEY-----
MIIJKAIBAAK...
-----END RSA PRIVATE KEY-----
{CODE-BLOCK/}

AWS limits the size of an environment variable to 4KB with a 5KB limit for all variables. To pass a PEM-encoded certificate, you will need to store the public key (`.crt` file) alongside your app files and pass the private key contents through an environment variable like `RavenSettings__CertPrivateKey`. The private key will be about 3KB, leaving 2KB left for other environment variables.

On the client, you will have to assemble a PEM using the static `X509Certificate2.CreateFromPem(publicKey, privateKey)` method.

Here is an example `Program.cs` that adds support for assembling a PEM certificate by adding `RavenSettings:CertPublicKeyFilePath` and `RavenSettings:CertPrivateKey` configuration options:

{CODE-BLOCK:csharp}
using System.Security.Cryptography.X509Certificates;
using Raven.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRavenDbAsyncSession();
builder.Services.AddRavenDbDocStore(options =>
    {
      var certPrivateKey = builder.Configuration.GetSection("RavenSettings:CertPrivateKey");
      var certPublicKeyFilePath = builder.Configuration.GetSection("RavenSettings:CertPublicKeyFilePath");
      var usePemCert = certPrivateKey != null && certPublicKeyFilePath != null;

      if (usePemCert)
      {
        var certPem = File.ReadAllText(certPublicKeyFilePath);
        // Workaround ephemeral keys in Windows
        // See: https://github.com/dotnet/runtime/issues/66283
        var intermediateCert = X509Certificate2.CreateFromPem(certPem, certPrivateKey);
        var cert = new X509Certificate2(intermediateCert.Export(X509ContentType.Pfx));
        intermediateCert.Dispose();

        options.Certificate = cert;
      }
    });

builder.Services.AddControllers();
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
{CODE-BLOCK/}

This supports using `.pfx` files or a PEM-encoded certificate, if provided. It works around a [known issue](https://github.com/dotnet/runtime/issues/66283) in Windows with ephemeral keys.

For a full reference implementation, view the code on the [template repository][gh-ravendb-template].

### Load from AWS Secrets Manager

If you want to load your .NET configuration from AWS Secrets Manager, you can use the community package [Kralizek.Extensions.Configuration.AWSSecretsManager][kralizek] to support securely loading certificates instead of relying on production environment variables.

[Learn more about configuring AWS Secrets Manager](secrets-manager)

{PANEL/}

{PANEL: Configuring AWS}

You will need to configure certificate authentication in AWS Lambda. Depending on the method you choose above, the steps vary.

### Using Environment Variables

Under your Lambda function, go to **Configuration > Environment** to edit your environment variables.

![AWS environment variable settings](images/aws-lambda-env-vars.jpg)

#### Specifying Path to Certificate Files

If you are deploying a physical `.pfx` file, you can specify the `RavenSettings__CertFilePath` and `RavenSettings__CertPassword` environment variables.

If you are using a PEM-encoded certificate, using the example code above you would pass a `RavenSettings__CertPublicKeyFilePath` environment variable (if it differs from your `appsettings.json` value).

#### Specifying the PEM-encoded Private Key

The `RavenSettings__CertPrivateKey` environment variable should be set to the contents of the `.key` file from the RavenDB client certificate package.

**Example value:**

{CODE-BLOCK:bash}
RavenSettings__CertPrivateKey=----- BEGIN RSA PRIVATE KEY ----- MIIJKA...
{CODE-BLOCK/}

It will look like this in the AWS console:

![AWS environment variable settings for PEM certificate private key](images/aws-lambda-env-vars-pem.jpg)

When pasting into the AWS Console, line breaks will automatically be removed and this should still be parsed successfully with `X509Certificate2.CreateFromPem` without extra handling.

These values will override `appsettings.json` once saved.

{PANEL/}

{PANEL: Next Steps}

- Learn more about [how to use the RavenDB .NET client SDK][docs-dotnet]
- Reference the [.NET AWS Lambda starter template][gh-ravendb-template] to see the code
- [Troubleshoot](troubleshooting) issues with RavenDB and AWS Lambda
- [Deployment Considerations](deployment-considerations) for RavenDB and AWS Lambda

{PANEL/}

[cloud-signup]: https://cloud.ravendb.net?utm_source=ravendb_docs&utm_medium=web&utm_campaign=howto_template_lambda_dotnet_existing&utm_content=cloud_signup
[docs-dotnet]: /docs/article-page/csharp/client-api/session/what-is-a-session-and-how-does-it-work
[docs-creating-document-store]: /docs/article-page/csharp/client-api/creating-document-store
[gh-ravendb-template]: https://github.com/ravendb/templates/tree/main/aws-lambda/csharp-http
[aws-lambda]: https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
[aws-dotnet]: https://aws.amazon.com/sdk-for-net/
[aws-dotnet-lambda]: https://docs.aws.amazon.com/lambda/latest/dg/csharp-package-cli.html
[aws-dotnet-aspnetcore]: https://github.com/aws/aws-lambda-dotnet/tree/master/Libraries/src/Amazon.Lambda.AspNetCoreServer.Hosting
[aws-vs-code]: https://aws.amazon.com/visualstudiocode/
[aws-vs]: https://aws.amazon.com/visualstudio/
[ms-download-dotnet]: https://dotnet.microsoft.com/en-us/download/dotnet/6.0
[ms-docs-aspnet-configuration]: https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/#configuration-providers
[nuget-ravendb-client]: https://www.nuget.org/packages/RavenDB.Client
[nuget-ravendb-di]: https://www.nuget.org/packages/RavenDB.DependencyInjection
[kralizek]: https://github.com/Kralizek/AWSSecretsManagerConfigurationExtensions
