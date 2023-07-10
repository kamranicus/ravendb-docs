# Deployment Considerations

## Environment Variable Limitations

AWS limits total environment variable size to 5KB and individual values to 4KB. This presents an issue when dealing with certificates as a full public/private keypair typically exceeds 5KB.

As a workaround, the template and guidance in the documentation suggests only providing the PEM-encoded private key through an environment variable (around 3KB).

For a full production implementation, it's recommended to use [AWS Secrets Manager](secret-manager).

## Document Store Lifetime and Cold Starts

One of the benefits of serverless is that you potentially can lower costs for less-used services and pay-per-invocation. As a trade-off, these functions incur a startup cost known as a "cold start" before they can serve requests.

The Document Store is meant to be instantiated once for the lifetime of an application. However, cold vs. warm starts in serverless environments have some implications on this.

In AWS Lambda, the document store will be shared across invocations of a function as long as it remains warmed up. The time varies based on the runtime and is not controlled by the developer, however the document store will remain initialized and you should not see an impact to latency.

If an Lambda function is wound down, the next time it is invoked will incur a cold start cost. The vast majority of cold start time is due to the Lambda runtime. Document store initialization will not have a major impact on latency, as establishing the TCP & TLS connection is still quite fast.

To reduce cold starts, learn more about [optimizing AWS Lambda functions][aws-lambda-optimization].

[aws-lambda-optimization]: https://aws.amazon.com/blogs/compute/operating-lambda-performance-optimization-part-1/
