const db = require('db');

const constants = require('app.constants');
const securityUtil = require('security.util');

const schema = require('./user.schema');

const service = db.createService(constants.DATABASE_DOCUMENTS.USERS, schema);

service.markEmailAsVerified = (_id) => {
  return service.update(
    {
      _id,
    },
    (doc) => {
      const userDoc = doc;
      userDoc.isEmailVerified = true;
    },
  );
};

service.updateResetPasswordToken = (_id, token) => {
  return service.findOneAndUpdate(
    { _id },
    {
      $set: {
        resetPasswordToken: token,
      },
    },
  );
};

service.updatePassword = async (_id, newPassword) => {
  const salt = await securityUtil.generateSalt();
  const hash = await securityUtil.getHash(newPassword, salt);

  return service.update(
    {
      _id,
    },
    (doc) => {
      const userDoc = doc;
      userDoc.passwordHash = hash;
      userDoc.passwordSalt = salt;
    },
  );
};

service.updateInfo = (_id, { email, firstName, lastName }) => {
  return service.update(
    {
      _id,
    },
    (doc) => {
      const userDoc = doc;
      userDoc.email = email;
      userDoc.firstName = firstName;
      userDoc.lastName = lastName;
    },
  );
};

module.exports = service;
