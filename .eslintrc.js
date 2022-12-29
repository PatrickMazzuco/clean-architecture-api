module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard-with-typescript',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    'space-before-function-paren': 0,
    semi: ['error', 'always'],
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/consistent-type-definitions': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/space-before-function-paren': 0,
    '@typescript-eslint/no-extraneous-class': 0
  }
};
