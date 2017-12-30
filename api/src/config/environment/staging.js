
module.exports = {
  mongo: {
    connection: 'mongodb://mongo:27017/ship-staging',
  },
  webUrl: 'http://ship-app.paralect.com',
  jwt: {
    secret: 'staging_secret',
    audience: 'ship.staging',
    issuer: 'ship.staging',
  },
};
