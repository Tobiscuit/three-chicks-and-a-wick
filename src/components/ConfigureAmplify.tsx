'use client';

import { Amplify, ResourcesConfig } from 'aws-amplify';
import outputs from '@root/amplify_outputs.json';

// Define a comprehensive type that extends the base Amplify configuration to include all
// possible shapes of our custom output, making the properties optional to handle
// different states of the amplify_outputs.json file during deployment.
type AppAmplifyOutputs = ResourcesConfig & {
  custom?: {
    magicRequestFunctionName?: string;
    aws_region?: string;
    API?: Record<
      string,
      {
        endpoint: string;
        region: string;
        apiName: string;
      }
    >;
  };
};

const typedOutputs: AppAmplifyOutputs = outputs;

// Start with the typed outputs as the base configuration
const config: ResourcesConfig = { ...typedOutputs };

// If a custom API configuration exists, merge it into the main API config
if (typedOutputs.custom?.API) {
  config.API = {
    ...typedOutputs.API,
    REST: {
      ...typedOutputs.API?.REST,
      ...typedOutputs.custom.API,
    },
  };
}

Amplify.configure(config, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  // This component's purpose is to run the Amplify configuration logic in a client component.
  // It does not need to render anything.
  return null;
} 