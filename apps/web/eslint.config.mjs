import tseslint from 'typescript-eslint';
export default tseslint.config(
  { ignores: ['dist/**'] },
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { project: './tsconfig.json', tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      complexity: ['error', 30],
      'max-depth': ['error', 4],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@sskutushev/api', '@sskutushev/api/**', '../../api/**', '../../../api/**'],
              message: 'The web app must consume API contracts, not API internals.',
            },
          ],
        },
      ],
    },
  },
);
