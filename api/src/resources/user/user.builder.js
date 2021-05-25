const faker = require('faker');

const db = require('tests/db');
const { USER } = require('tests/constants');
const securityUtil = require('tests/security.util');
const BaseBuilder = require('tests/base.builder');

const validateSchema = require('./user.schema');

const userService = db.createService(USER.COLLECTION, { validate: validateSchema });

class UserBuilder extends BaseBuilder {
  constructor({
    firstName = faker.name.firstName(),
    lastName = faker.name.lastName(),
    email = faker.internet.email().toLowerCase(),
    createdOn = new Date(),
    lastRequest = new Date(),
    signupToken = USER.DEFAULT_SIGNUP_TOKEN,
    password = USER.DEFAULT_PASSWORD,
  } = {}) {
    super(userService);

    this.data = {
      ...this.data,
      firstName,
      lastName,
      email,
      createdOn,
      lastRequest,
      signupToken,
      passwordHash: securityUtil.getHashSync(password),
      isEmailVerified: false,
      oauth: { google: false },
    };
  }

  googleAuth() {
    this.data.oauth.google = true;
    this.data.isEmailVerified = true;
    this.data.signupToken = null;
    return this;
  }

  emailVerified() {
    this.data.isEmailVerified = true;
    this.data.signupToken = null;
    return this;
  }

  forgotPassword(token = USER.DEFAULT_RESET_PASSWORD_TOKEN) {
    this.data.resetPasswordToken = token;
    return this;
  }
}

module.exports = UserBuilder;
