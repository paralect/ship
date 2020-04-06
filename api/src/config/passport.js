const passport = require('koa-passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('config');
const accountService = require('resources/account/account.service');
const { mapFacebookProfile } = require('resources/user/user.helper');

const handleOauthStrategyResponse = (oauthName, mapOauthProfile) =>
  async (token, tokenSecret, profile, done) => { // eslint-disable-line
    const mappedProfile = mapOauthProfile(profile);
    let user;

    try {
      user = await accountService.ensureAccountCreated(oauthName, mappedProfile);
    } catch (err) {
      done(err);
    }

    done(null, user);
  };

passport.use(new FacebookStrategy({
  clientID: config.facebook.clientId,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.redirectUri,
  profileFields: ['id', 'name', 'email'],
}, handleOauthStrategyResponse('facebook', mapFacebookProfile)));
