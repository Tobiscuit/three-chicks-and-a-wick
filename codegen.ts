
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: {
    'https://three-girls-and-a-wick.myshopify.com/api/2024-07/graphql.json': {
      headers: {
        'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN!,
      },
    },
  },
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      }
    },
  },
};

export default config; 