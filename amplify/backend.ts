// amplify/backend.ts

import { defineBackend } from '@aws-amplify/backend';
import { magicRequest } from './functions/magic-request/resource';
import { RestApi, Cors } from 'aws-cdk-lib/aws-apigateway';
import { Stack } from 'aws-cdk-lib';

export const backend = defineBackend({
  magicRequest,
});

const api = backend.createStack('api-stack');

const magicRequestApi = new RestApi(api, 'magicRequestApi', {
  restApiName: 'magicRequestApi',
  deploy: true,
  deployOptions: {
    stageName: 'dev',
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: Cors.DEFAULT_HEADERS,
  },
});

const magicRequestResource = magicRequestApi.root.addResource('magic-request');
magicRequestResource.addMethod('POST', backend.magicRequest.resources.lambda);

backend.addOutput({
  custom: {
    magicRequestApi: {
      endpoint: magicRequestApi.url,
      region: Stack.of(magicRequestApi).region,
      apiName: magicRequestApi.restApiName,
    },
  },
});
