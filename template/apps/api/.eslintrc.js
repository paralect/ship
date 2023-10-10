module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
  ],
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
    project: "./tsconfig.json",
    // use tsconfig relative to eslintrc file for IDE
    tsconfigRootDir: __dirname,
  },
  rules: {
    'arrow-body-style': 0,
    'no-underscore-dangle': 0,
    'function-paren-newline': 1,
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        '**/*.spec.{js,ts}',
        '**/*.builder.{js,ts}',
      ],
    }],
    'max-len': ['warn', {
      code: 120,
      ignoreStrings: true,
      ignoreUrls: true,
      ignoreTemplateLiterals: true,
    }],
  },
  settings: {
    "import/resolver": {
      "node": {
        "moduleDirectory": [
          "src",
          "node_modules"
        ]
      }
    }
  },
  ignorePatterns: [
    // ignore this file
    ".eslintrc.js",
    // never lint node modules
    "node_modules",
    // ignore prod_node_modules copied in Docker
    "prod_node_modules",
    // ignore output build files
    "dist"
  ],
};
