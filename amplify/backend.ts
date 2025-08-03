// amplify/backend.ts

import { defineBackend } from '@aws-amplify/backend';
import { magicRequest } from './functions/magic-request/resource';
import { data } from './data/resource';

export const backend = defineBackend({
  magicRequest,
  data,
});
