import { defineBackend } from '@aws-amplify/backend';
import { MagicRequestFunction } from './functions/magic-request/resource';
import { Stack } from 'aws-cdk-lib';
import { data } from './data/resource';

const backend = defineBackend({
  data,
});

const magicRequestStack = backend.createStack('MagicRequestStack');
new MagicRequestFunction(magicRequestStack, 'MagicRequestFunction');
