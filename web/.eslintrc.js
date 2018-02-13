module.exports = {
  "extends": "@paralect/eslint-config",
  "rules": {
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": [
        "**/webpack.config.js",
        "**/webpack.config.*.js",
      ],
    }],
    "jsx-a11y/anchor-is-valid": [ "error", {
      "components": [ "Link" ],
      "specialLink": [ "to" ],
    }]
  },
  "settings": {
    "import/resolver": {
      "node": {
        "moduleDirectory": [
          "src",
          "node_modules",
          "server"
        ],
        "paths": ["src/client"]
      },
    }
  }
};
