import { defineFunction } from '@aws-amplify/backend';

export const magicRequestHandler = defineFunction({
  timeoutSeconds: 30,
  memoryMB: 512,
});