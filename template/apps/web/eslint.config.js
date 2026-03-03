import next from 'eslint-config/next';

export default next.append(
  {
    ignores: ['src/components/ui/**', 'content/**'],
  },
  {
    files: ['**/*.page.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
);
