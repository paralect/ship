module.exports = {
  mongo: {
    connection: 'mongodb://mongo:27017/ship-staging',
  },
  session: {
    secret: 'session_staging_secret',
    ttl: 2 * 60 * 60 * 1000, // two hours
    store: {
      host: 'redis',
      port: 6379,
    },
  },
  jwt: {
    secret: 'staging_secret',
    audience: 'ship.staging',
    issuer: 'ship.staging',
  },
  apiUrl: 'http://ship-api.paralect.com',
  webUrl: 'http://ship-app.paralect.com',
  landingUrl: 'http://ship-demo.paralect.com',
  mailgun: {
    apiKey: '329a737adb6b47b77534b434fca1da72-b6183ad4-9914f83d',
    domain: 'sandbox492d785e56fe42cdb3266d86c53cffca.mailgun.org',
  },
};
