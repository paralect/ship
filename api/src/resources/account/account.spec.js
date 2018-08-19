const chai = require('chai');
const supertest = require('supertest');

const db = require('db');
const constants = require('app.constants');

const userFactory = require('resources/user/user.factory');

const server = require('../../app');

const request = supertest.agent(server.listen());

chai.should();

// TODO:
// 1. discuss how to add signin success test as it is not possible
// with current test structure (password and signuptoken are encapsulated)
// 2. How to test environment dependent code (see _signupToken from account.controller)
const incorrectCredentialsMessage = 'Incorrect email or password.';

describe('/account', () => {
  let user;
  let newUserData;

  before(async () => {
    await db.get(constants.DATABASE_DOCUMENTS.USERS).drop();

    user = await userFactory.unverifiedUser();

    newUserData = {
      firstName: 'Ivan',
      lastName: 'Balalaikin',
      email: 'test@test.test',
      password: 'qwerty',
    };
  });

  it('should successfully create new user', (done) => {
    request
      .post('/account/signup')
      .send(newUserData)
      .expect(200)
      .end(done);
  });

  it('should return an error that email is already registered.', (done) => {
    request
      .post('/account/signup')
      .send({
        firstName: 'Petr',
        lastName: 'Ivanov',
        email: 'test@test.test',
        password: 'qwerty',
      })
      .expect(400)
      .expect(({ body }) => {
        const { errors } = body;
        errors[0].email.should.be.equal('User with this email is already registered.');
      })
      .end(done);
  });

  it('should return an error that token is invalid', (done) => {
    request
      .get('/account/verifyEmail/111')
      .expect(400)
      .expect(({ body }) => {
        const { errors } = body;
        errors[0].token.should.be.equal('Token is invalid');
      })
      .end(done);
  });

  it('should successfully verify email', (done) => {
    request
      .get(`/account/verifyEmail/${user.signupToken}`)
      .expect(302)
      .end(done);
  });

  it('should return an error if email is not registered', (done) => {
    request
      .post('/account/signin')
      .send({
        email: 'test@test.com1',
        password: 'incorrect_password',
      })
      .expect(400)
      .expect(({ body }) => {
        const { errors } = body;
        errors[0].credentials.should.be.equal(incorrectCredentialsMessage);
      })
      .end(done);
  });

  it('should return an error that the password is too short', (done) => {
    request
      .post('/account/signin')
      .send({
        email: newUserData.email,
        password: '1111',
      })
      .expect(400)
      .expect(({ body }) => {
        const { errors } = body;
        errors[0].password.should.be.equal(incorrectCredentialsMessage);
      })
      .end(done);
  });

  it('should return an error that the password is too long', (done) => {
    request
      .post('/account/signin')
      .send({
        email: newUserData.email,
        password: Array(42).join('1'),
      })
      .expect(400)
      .expect(({ body }) => {
        const { errors } = body;
        errors[0].password.should.be.equal(incorrectCredentialsMessage);
      })
      .end(done);
  });

  it('should return an error if trying to log in before email is verified', (done) => {
    request
      .post('/account/signin')
      .send({
        email: newUserData.email,
        password: newUserData.password,
      })
      .expect(400)
      .expect(({ body }) => {
        const { errors } = body;
        errors[0].email.should.be.equal('Please verify your email to sign in');
      })
      .end(done);
  });

  it('should return an error if wrong password is provided when logging in', (done) => {
    request
      .post('/account/signin')
      .send({
        email: user.email,
        password: 'invalid_password',
      })
      .expect(400)
      .expect(({ body }) => {
        const { errors } = body;
        errors[0].credentials.should.be.equal(incorrectCredentialsMessage);
      })
      .end(done);
  });

  it('should return an error that the email address is incorrect', (done) => {
    request
      .post('/account/forgotPassword')
      .send({
        email: 'test@test',
      })
      .expect(400)
      .expect(({ body }) => {
        const { errors } = body;
        errors[0].email.should.be.equal('Please enter a valid email address');
      })
      .end(done);
  });

  it('should successfully send forgot password link', (done) => {
    request
      .post('/account/forgotPassword')
      .send({
        email: newUserData.email,
      })
      .expect(200)
      .end(done);
  });

  it('should return an error forgot password email is not registered', (done) => {
    const email = 'not@registered.user';
    request
      .post('/account/forgotPassword')
      .send({
        email,
      })
      .expect(400)
      .expect(({ body }) => {
        const { errors } = body;
        errors[0].email.should.be.equal(`Couldn't find account associated with ${email}. Please try again`);
      })
      .end(done);
  });

  it('should return an error that reset password token is invalid', (done) => {
    request
      .put('/account/resetPassword')
      .send({
        password: 'qwerty123',
        token: '234',
      })
      .expect(400)
      .expect(({ body }) => {
        const { errors } = body;
        errors[0].token.should.be.equal('Password reset link has expired or invalid');
      })
      .end(done);
  });

  it('should successfully reset old password', (done) => {
    request
      .put('/account/resetPassword')
      .send({
        password: 'new_password',
        token: `${user._id}_reset_password_token`,
      })
      .expect(200)
      .end(done);
  });

  it('should successfully resend verification email', (done) => {
    request
      .post('/account/resend')
      .send({
        email: 'test@test.test',
      })
      .expect(200)
      .end(done);
  });
});
