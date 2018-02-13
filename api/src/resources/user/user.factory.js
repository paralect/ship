const Builder = require('./user.builder');

exports.unverifiedUser = async ({ signupToken = '1234' } = {}) => {
  const builder = new Builder();
  const user = await builder.notVerifiedEmail().build();

  return user;
};

exports.verifiedUser = async ({ signupToken = '1234' } = {}) => {
  const builder = new Builder();
  const user = await builder.build();

  return user;
};
