'use client';

import { Amplify, ResourcesConfig } from 'aws-amplify';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import outputs from '@root/amplify_outputs.json';

type AmplifyContextType = {
  isConfigured: boolean;
};

const AmplifyContext = createContext<AmplifyContextType>({ isConfigured: false });

type AppAmplifyOutputs = ResourcesConfig & {
  custom?: {
    API?: Record<string, { endpoint: string; region: string; apiName: string; }>;
  };
};

const configureAmplify = () => {
  const typedOutputs: AppAmplifyOutputs = outputs;
  const config: ResourcesConfig = { ...typedOutputs };

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
};

export const AmplifyProvider = ({ children }: { children: ReactNode }) => {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    configureAmplify();
    setIsConfigured(true);
  }, []);

  return (
    <AmplifyContext.Provider value={{ isConfigured }}>
      {children}
    </AmplifyContext.Provider>
  );
};

export const useAmplify = () => useContext(AmplifyContext); 