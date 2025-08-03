// amplify/backend.ts

import { defineBackend } from '@aws-amplify/backend';
import { magicRequest } from './functions/magic-request/resource';
import { RestApi, Cors, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Stack } from 'aws-cdk-lib';

export const backend = defineBackend({
  magicRequest,
});

// Get the stack that the magicRequest function is defined in
const apiStack = Stack.of(backend.magicRequest.resources.lambda);

const magicRequestApi = new RestApi(apiStack, 'magicRequestApi', {
  restApiName: 'magicRequestApi',
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: Cors.DEFAULT_HEADERS,
  },
});

const magicRequestResource = magicRequestApi.root.addResource('magic-request');
magicRequestResource.addMethod('POST', new LambdaIntegration(backend.magicRequest.resources.lambda));

backend.addOutput({
  custom: {
    API: {
      [magicRequestApi.restApiName]: {
        endpoint: magicRequestApi.url,
        region: Stack.of(magicRequestApi).region,
        apiName: magicRequestApi.restApiName,
      },
    },
  },
});
