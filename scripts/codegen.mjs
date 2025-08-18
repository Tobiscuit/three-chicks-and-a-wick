// scripts/codegen.mjs
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { generate } from '@graphql-codegen/cli';

const config = {
  schema: {
    [`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-07/graphql.json`]: {
      headers: {
        'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN,
      },
    },
  },
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
};

generate(config).catch(error => {
  console.error('GraphQL Code Generation failed');
  console.error(error);
  process.exit(1);
}); 