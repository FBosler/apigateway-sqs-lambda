import { join } from 'path';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ApiGatewayToSqsToLambda } from '../src/index';
// eslint-disable-next-line import/order
import { Runtime, Code } from 'aws-cdk-lib/aws-lambda';

const lambdaFunctionProps = {
  runtime: Runtime.PYTHON_3_9,
  handler: 'index.handler',
  code: Code.fromAsset(join(__dirname, '..', 'src', 'lambda-handler')),
};

const SERVICE_NAME = 'sqs-pusher';

const apiGatewayToSqsToLambdaProps = {
  serviceName: SERVICE_NAME,
  domain: 'example.com',
  domainCertArn:
    'arn:aws:acm:eu-central-1:1234567852354:certificate/123123sdf-dsf-sdfs-sdsad-sadsdasdasd',
  route53HostedZoneId: 'Z0633005JYFGNZXCT3BN',
  lambdaFunctionProps: lambdaFunctionProps,
  deployDeadLetterQueue: true,
};

const mockApp = new App();
const stack = new Stack(mockApp);
new ApiGatewayToSqsToLambda(
  stack,
  'ApiGateway-Sqs-Lambda',
  apiGatewayToSqsToLambdaProps,
);

const template = Template.fromStack(stack);

test('Lambda functions should be configured with properties and execution roles', () => {
  template.hasResourceProperties('AWS::Lambda::Function', {
    Runtime: 'python3.9',
  });

  template.hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'lambda.amazonaws.com',
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('HTTP API should be created', () => {
  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Name: SERVICE_NAME,
  });
});

test('API Gateway has POST Method', () => {
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'POST',
  });
});
