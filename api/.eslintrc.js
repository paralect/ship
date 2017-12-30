module.exports = {
  "extends": "@paralect/eslint-config",
  "rules": {
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": [
        "**/tests/**",
        "**/*.spec.js",
        "**/*.builder.js",
        "**/*.factory.js",
      ],
    }],
  },
  "settings": {
    "import/resolver": {
      "node": {
        "moduleDirectory": [
          "src",
          "node_modules"
        ],
      },
    }
  }
};
