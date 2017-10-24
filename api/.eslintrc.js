module.exports = {
  "extends": "@paralect/eslint-config",
  "rules": {
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": [
        "**/tests/**",
        "**/*.test.js",
        "**/*.builder.js",
        "**/*.factory.js",
      ],
    }],
  }
};
