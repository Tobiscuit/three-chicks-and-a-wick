// amplify/backend.ts

import { defineBackend } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';
import { magicRequest } from './functions/magic-request/resource';

export const backend = defineBackend({
  magicRequest,
});

backend.addOutput({
    custom: {
        magicRequestFunctionName: backend.magicRequest.resources.lambda.functionName,
        aws_region: Stack.of(backend.magicRequest.resources.lambda).region
    }
})
