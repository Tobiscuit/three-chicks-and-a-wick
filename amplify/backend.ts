import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { magicRequestHandler } from './functions/magic-request/resource';

defineBackend({
  data,
  magicRequestHandler
});
