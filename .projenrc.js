const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Fabian',
  authorAddress: 'FBosler@gmail.com',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'apigateway-sqs-lambda',
  repositoryUrl: 'https://github.com/FBosler/apigateway-sqs-lambda.git',

  deps: ['aws-cdk-lib@^2.1.0', 'constructs@^10.0.5', '@aws-solutions-constructs/core@2.25.0'],
  description:
    'Package provides opinionated constrcut for API Gateway with associated SQS queue and Lambda function',
  // devDeps: [],             /* Build dependencies for this module. */
  packageName: 'apigateway-sqs-lambda',
  publishToPypi: {
    distName: 'apigateway-sqs-lambda',
    module: 'apigateway_sqs_lambda',
  },
  stability: 'experimental',
});
project.synth();
