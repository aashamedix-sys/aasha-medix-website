module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-unescaped-entities': 'off', // Disable for now, or fix later
    'no-unused-vars': 'off', // Disable for now
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-comment-textnodes': 'error',
    'react-hooks/immutability': 'error',
    'react-hooks/static-components': 'off', // Disable for component definitions
    'react-hooks/set-state-in-effect': 'off', // Disable for data fetching
    'react-hooks/exhaustive-deps': 'off', // Disable for simplicity
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};