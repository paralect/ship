module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    project: "./tsconfig.json",
    // use tsconfig relative to eslintrc file for IDE
    tsconfigRootDir: __dirname
  },
  rules: {
    // mongodb has _id
    "no-underscore-dangle": "off",
    "no-param-reassign": "off",
    "import/prefer-default-export": "warn"
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
  ]
}
