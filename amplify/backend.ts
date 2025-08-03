// amplify/backend.ts

import { defineBackend } from '@aws-amplify/backend';
import { magicRequest } from './functions/magic-request/resource';

export const backend = defineBackend({
  magicRequest,
});
