module.exports = {
  "extends": "@paralect/eslint-config",
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
  }
};
