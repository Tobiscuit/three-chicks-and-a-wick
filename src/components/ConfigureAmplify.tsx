'use client';

import { Amplify } from 'aws-amplify';
import outputs from '@root/amplify_outputs.json';

// Configure Amplify for the entire client side
Amplify.configure(outputs, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
} 