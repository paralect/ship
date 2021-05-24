module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "allowImportExportEverywhere": true,
  },
  "env": {
    "browser": true,
    "mocha": true,
    "es6": true,
    "node": true,
  },
  "plugins": [
    "react",
  ],
  "rules": {
    "arrow-body-style": 0,
    "linebreak-style": 0,
    "no-underscore-dangle": 0,
    "import/prefer-default-export": 0,
    "import/extensions": ["error", "ignorePackages", {
      "js": "never",
      "jsx": "never",
    }],
  },
  "settings": {
    "import/resolver": {
      "eslint-import-resolver-custom-alias": {
        "alias": {
          "~": "./src/client",
        },
      },
      "node": {
        "extensions": [".js", ".jsx"],
        "moduleDirectory": [
          "src",
          "node_modules",
          "server",
        ],
        "paths": ["src/client"],
      },
    },
  },
  "globals": {
    "APP_CONFIG": true,
    "APP_CONSTANTS": true,
  },
};
