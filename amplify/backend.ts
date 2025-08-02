// amplify/backend.ts

import { defineBackend } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { magicRequest } from './functions/magic-request/resource';

export const backend = defineBackend({
  magicRequest,
});

// Create a new REST API
const api = new RestApi(Stack.of(backend.magicRequest.resources.lambda), 'magicRequestApi', {
  restApiName: 'magicRequestApi',
  deploy: true,
  deployOptions: {
    stageName: 'dev',
  },
  defaultCorsPreflightOptions: {
    allowOrigins: ['*'],
    allowMethods: ['POST'],
    allowHeaders: ['*'],
  },
});

// Add a /magic-request resource and a POST method
api.root.addResource('magic-request').addMethod('POST', new LambdaIntegration(backend.magicRequest.resources.lambda));

// Add the API endpoint to the outputs
backend.addOutput({
  custom: {
    magicRequestApiEndpoint: api.url,
    magicRequestApiName: api.restApiName,
    magicRequestApiRegion: Stack.of(backend.magicRequest.resources.lambda).region,
  },
});
