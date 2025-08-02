// src/utils/amplify-utils.ts
import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/api';
import { cookies } from 'next/headers';

import outputs from '@root/amplify_outputs.json';

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs
});

export const cookiesClient = generateServerClientUsingCookies({
  config: outputs,
  cookies
}); 