module.exports = {
  "extends": "@paralect/eslint-config",
  "plugins": [
    "react",
  ],
  "rules": {
    "import/extensions": 0, //https://github.com/benmosher/eslint-plugin-import/issues/764,
    "jsx-a11y/anchor-is-valid": [ "error", {
      "components": [ "Link" ],
      "specialLink": [ "to" ]
    }],
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": [
        "**/*.config.js",
      ],
    }],
    "react/jsx-one-expression-per-line": ["warn"],
  }
};
