module.exports = {
  "extends": "@paralect/eslint-config",
  "plugins": [
    "react",
    "flowtype"
  ],
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
    }],
    "max-len": ["error", 100, 2, {
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      // ignore function with specified types for parameters and return type
      ignorePattern: '.+=.*\\(.+:.+\\):\\s.+'
    }],
    "flowtype/boolean-style": [
      2,
      "boolean"
    ],
    "flowtype/define-flow-type": 1,
    "flowtype/delimiter-dangle": [
      2,
      "always-multiline"
    ],
    "flowtype/generic-spacing": [
      2,
      "never"
    ],
    "flowtype/no-primitive-constructor-types": 2,
    "flowtype/no-types-missing-file-annotation": 2,
    "flowtype/no-weak-types": 2,
    "flowtype/object-type-delimiter": [
      2,
      "comma"
    ],
    "flowtype/require-parameter-type": 2,
    "flowtype/require-return-type": [
      2,
      "always",
    ],
    "flowtype/require-valid-file-annotation": 2,
    "flowtype/semi": [
      2,
      "always"
    ],
    "flowtype/space-after-type-colon": [
      2,
      "always"
    ],
    "flowtype/space-before-generic-bracket": [
      2,
      "never"
    ],
    "flowtype/space-before-type-colon": [
      2,
      "never"
    ],
    "flowtype/type-id-match": [
      2,
      "^([A-Z][a-z0-9]+)+Type$"
    ],
    "flowtype/union-intersection-spacing": [
      2,
      "always"
    ],
    "flowtype/use-flow-type": 1,
    "flowtype/valid-syntax": 1
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
    },
    "flowtype": {
      "onlyFilesWithFlowAnnotation": true
    }
  }
};
