const _ = require('lodash');

exports.mapFacebookProfile = facebookProfile => ({
  firstName: facebookProfile.name.givenName,
  lastName: facebookProfile.name.familyName,
  email: _.get(facebookProfile, 'emails[0].value', null),
  isEmailVerified: Boolean(_.get(facebookProfile, 'emails[0].value', null)),
  oauth: {
    facebookId: facebookProfile.id,
  },
});
