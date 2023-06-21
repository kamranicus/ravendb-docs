# Troubleshooting
---

## Cannot find `AWSRegion` or `ServiceUrl`

Your local AWS development environment is not completely set up.

1. Check that you have [configured AWS Credentials][aws-credentials] (e.g. `~/.aws/credentials`)
    - The AWS Toolkits for Visual Studio or Visual Studio will help you set these up
1. Check that you have a default AWS Region specified in your environment
    - Example: `$env:AWS_REGION = "east-us-1"` or `export AWS_REGION='us-east-1'`

## Not authorized to perform: `<PERMISSION>`

The user profile used in your AWS credentials is missing an IAM policy. The default RavenDB Lambda template requires the following policies:

{NOTE: }
If you have multiple AWS profiles, you can change the AWS profile used by setting the `$env:AWS_PROFILE` environment variable.
{NOTE/}

Learn more about [configuring IAM user policies][aws-iam-policies].

### Runtime policies

* `SecretsManagerReadWrite` for accessing AWS Secrets Manager configuration to load a client certificate

### Deployment policies

To deploy your AWS Lambda functions, it's recommended to set up a dedicated deployment IAM user.

This user will need the following policies set:

* `AWSLambda_FullAccess` for local deployment
* `IAMFullAccess` for local deployment and `IAMReadOnlyAccess` for hosted deployment

## Environment Variables Exceed AWS Limits

AWS limits the size of individual environment variables to 4KB and 5KB overall. This does not leave much room for using public/private keypair values to pass to your Lambda function.

The template is built to support loading the PEM-encoded public key from the file system (`.crt` file), to be deployed alongside your app through the `RavenSettings:CertPublicKeyFilePath` app setting. The private key can be provided in plain-text through the `RavenSettings:CertPrivateKey` app setting, which using the .NET conventions is the `RavenSettings__CertPrivateKey` environment variable.

The private key should be around 3.1KB, which is under the 4KB limit, but you may still exceed the 5KB limit overall when combined with your other environment variables.

If this is the case, we recommend [using the AWS Secrets Manager](secrets-manager) for storing your certificate instead since this will not be subject to the same limitations (and it is more secure and robust for production-scale usage).

[aws-credentials]: https://docs.aws.amazon.com/sdk-for-net/v3/developer-guide/net-dg-config-creds.html
[aws-iam-policies]: https://docs.aws.amazon.com/sdk-for-net/v3/developer-guide/net-dg-users-roles.html
