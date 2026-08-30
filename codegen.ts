import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'schema.graphql',
  documents: ['apps/web/src/**/*.{ts,tsx}'],
  generates: {
    'apps/web/src/graphql/': {
      preset: 'client',
      config: {
        scalars: {
          DateTime: 'string',
        },
      },
    },
  },
  ignoreNoDocuments: false,
};

export default config;
