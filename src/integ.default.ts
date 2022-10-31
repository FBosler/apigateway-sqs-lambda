import { join } from 'path';
import * as cdk from 'aws-cdk-lib';
import { ApiGatewayToSqsToLambda } from './index';
// eslint-disable-next-line import/order
import {
  Runtime,
  Code,
  Function as LambdaFunction,
} from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyStack');

const lambdaFunction = new LambdaFunction(stack, 'sqs-pusher-lambda', {
  functionName: 'sqs-pusher-lambda',
  runtime: Runtime.PYTHON_3_9,
  handler: 'index.handler',
  code: Code.fromAsset(join(__dirname, 'lambda-handler')),
});

const apiGatewayToSqsToLambdaProps = {
  serviceName: 'sqs-pusher',
  domain: 'example.com',
  domainCertArn:
    'arn:aws:acm:eu-central-1:1234567852354:certificate/123123sdf-dsf-sdfs-sdsad-sadsdasdasd',
  route53HostedZoneId: 'Z0633005JYFGNZXCT3BN',
  deployDeadLetterQueue: true,
  lambdaFunction: lambdaFunction,
};

new ApiGatewayToSqsToLambda(
  stack,
  'ApiGateway-Sqs-Lambda',
  apiGatewayToSqsToLambdaProps,
);
