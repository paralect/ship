const userService = require('resources/user/user.service');

exports.ensureAccountCreated = async (oauthName, userData) => {
  let user = await userService.findOne({ email: userData.email });

  if (user) {
    const socialId = user.oauth[oauthName];

    if (!socialId) {
      user = await userService.findOneAndUpdate(
        { _id: user._id },
        { $set: { [`oauth.${oauthName}Id`]: userData.oauth[`${oauthName}Id`] } },
      );
    }

    return user;
  }

  return userService.create(userData);
};
