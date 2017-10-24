const faker = require('faker');

const BaseBuilder = require('tests/base.builder');
const userService = require('resources/user/user.service');

const salt = 'salt';
const qwertyHash = '$2a$10$8Z0s/vCE09wIN.piv7qCEuBmV8oIfafV.j7IOCXUTPZOUOpaLPa9K';

class UserBuilder extends BaseBuilder {
  constructor() {
    super(userService);

    this.data.createdOn = new Date();
    this.data.firstName = faker.name.firstName();
    this.data.lastName = faker.name.lastName();
    this.data.signupToken = null;
    this.data.resetPasswordToken = `${this.data._id}_reset_password_token`;
    this.data.isEmailVerified = true;
  }

  email(emailAddress) {
    this.data.email = emailAddress || faker.internet.email();
    return this;
  }

  rootEmail() {
    this.data.email = 'root@root.root';
    return this;
  }

  password(passwordHash = qwertyHash, passwordSalt = salt) {
    this.data.passwordHash = passwordHash;
    this.data.passwordSalt = passwordSalt;
    return this;
  }

  notVerifiedEmail() {
    this.data.isEmailVerified = false;
    return this;
  }

  signupToken(token) {
    this.data.signupToken = token;
    return this;
  }
}

module.exports = UserBuilder;
