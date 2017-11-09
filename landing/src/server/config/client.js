const { apiUrl } = require('./index');

const config = {
  apiUrl,
};

// This line is needed to reflect definePlugin setting in webpack config
process.CLIENT_CONFIG = config;

module.exports = config;
