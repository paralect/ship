import next from 'eslint-config/next';

export default next.append(
  {
    ignores: ['src/components/ui/**', 'src/routeTree.gen.ts', 'content/**', '**/*.md'],
  },
  {
    files: ['src/routes/**'],
    rules: {
      'jsx-react/function-component-definition': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
);
