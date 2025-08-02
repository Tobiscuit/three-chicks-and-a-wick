'use client';

import { Amplify } from 'aws-amplify';
import outputs from '@root/amplify_outputs.json';

// Define a type for the expected custom outputs
type CustomOutputs = {
  magicRequestApiEndpoint?: string;
  magicRequestApiName?: string;
  magicRequestApiRegion?: string;
  magicRequestFunctionName?: string;
  aws_region?: string;
};

const customOutputs = outputs.custom as CustomOutputs;

// We only need to configure the REST API part if it's defined in the outputs
if (customOutputs.magicRequestApiEndpoint && customOutputs.magicRequestApiName && customOutputs.magicRequestApiRegion) {
  Amplify.configure({
    ...outputs,
    API: {
      REST: {
        [customOutputs.magicRequestApiName]: {
          endpoint: customOutputs.magicRequestApiEndpoint,
          region: customOutputs.magicRequestApiRegion,
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