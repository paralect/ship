import next from 'eslint-config/next';

export default next.append(
  {
    ignores: ['src/components/ui/**', 'content/**', '*.md'],
  },
  {
    files: ['**/*.page.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
);
