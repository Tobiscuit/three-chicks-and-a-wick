'use client';

import { Amplify } from 'aws-amplify';
import outputs from '@root/amplify_outputs.json';

// We only need to configure the REST API part if it's defined in the outputs
if (outputs.custom?.magicRequestApiEndpoint) {
  Amplify.configure({
    ...outputs,
    API: {
      REST: {
        [outputs.custom.magicRequestApiName]: {
          endpoint: outputs.custom.magicRequestApiEndpoint,
          region: outputs.custom.magicRequestApiRegion,
        }
      }
    }
  }, { ssr: true });
} else {
  // If there's no custom API, just configure with the base outputs
  Amplify.configure(outputs, { ssr: true });
}


export default function ConfigureAmplifyClientSide() {
  return null;
} 