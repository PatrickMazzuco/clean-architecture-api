module.exports = {
  root: true,
  env: {
    node: true,
    jest: true
  },
  plugins: ['eslint-plugin-import-helpers', 'prettier'],
  extends: [
    'standard-with-typescript',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended'
  ],
  overrides: [],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  rules: {
    'space-before-function-paren': 0,
    semi: ['error', 'always'],
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/consistent-type-definitions': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/space-before-function-paren': 0,
    '@typescript-eslint/no-extraneous-class': 0,
    '@typescript-eslint/no-namespace': 0,
    '@typescript-eslint/no-misused-promises': 0,
    '@typescript-eslint/no-invalid-void-type': 0,
    'import/no-named-as-default-member': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never'
      }
    ],
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always',
        groups: [
          ['module', '/^@(?!/)/'],
          ['/^@//', 'parent', 'sibling', 'index']
        ],
        alphabetize: {
          order: 'asc',
          ignoreCase: true
        }
      }
    ]
  },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  }
};
