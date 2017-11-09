module.exports = {
  "extends": "@paralect/eslint-config",
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }], // next.js does not allow to add jsx extension
    "import/extensions": 0, //https://github.com/benmosher/eslint-plugin-import/issues/764,
    "react/jsx-closing-tag-location": 0, // https://github.com/zeit/styled-jsx/issues/320
    "react/jsx-curly-brace-presence": 0, // https://github.com/zeit/styled-jsx/issues/320,
    "jsx-a11y/anchor-is-valid": [ "error", {
      "components": [ "Link" ],
      "specialLink": [ "to" ]
    }]
  }
};
