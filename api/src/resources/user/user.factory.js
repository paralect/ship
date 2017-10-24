const Builder = require('./user.builder');

exports.rootUser = async () => {
  const builder = new Builder();
  const user = await builder
    .rootEmail()
    .password()
    .build();

  return user;
};

exports.unverifiedUser = async (signupToken = '123') => {
  const builder = new Builder();
  const user = await builder
    .email()
    .password()
    .signupToken(signupToken)
    .build();

  return user;
};
