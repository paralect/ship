const chai = require('chai');
const supertest = require('supertest');

const server = require('app');
const db = require('tests/db');
const { USER, ERRORS } = require('tests/constants');
const testsHelper = require('tests/tests.helper');
const UserBuilder = require('resources/user/user.builder');
const validateSchema = require('resources/user/user.schema');

const userService = db.createService(USER.COLLECTION, { validate: validateSchema });
const app = server.listen();

const request = supertest.agent(app);
chai.should();

// TODO:
// 1. discuss how to add signin success test as it is not possible
// with current test structure (password and signuptoken are encapsulated)
// 2. How to test environment dependent code (see _signupToken from account.controller)

describe('/account', () => {
  let user;
  let newUserData;

  before(async () => {
    await db.get(USER.COLLECTION).drop();

    user = await new UserBuilder().forgotPassword().build();

    newUserData = {
      firstName: 'Ivan',
      lastName: 'Balalaikin',
      email: 'test@test.com',
      password: 'qwerty',
    };
  });

  it('should successfully create new user', (done) => {
    testsHelper.test(done, async () => {
      const response = await request.post('/account/signup')
        .send(newUserData)
        .expect(200);

      const created = await userService.findOne({ email: newUserData.email });
      created.should.be.an('object');

      response.body.should.be.deep.equal({});
    });
  });

  it('should return an error that email is already registered.', (done) => {
    testsHelper.test(done, async () => {
      const response = await request.post('/account/signup')
        .send({
          firstName: 'Petr',
          lastName: 'Ivanov',
          email: user.email,
          password: 'qwerty',
        })
        .expect(400);

      response.body.should.be.deep.equal({ errors: ERRORS.USER_REGISTRED });
    });
  });

  it('should return an error that token is invalid', (done) => {
    testsHelper.test(done, async () => {
      const response = await request.get('/account/verify-email?token=token')
        .expect(400);

      response.body.should.be.deep.equal({ errors: ERRORS.INVALID_TOKEN });
    });
  });

  it('should successfully verify email', (done) => {
    testsHelper.test(done, async () => {
      const response = await request.get(`/account/verify-email?token=${user.signupToken}`)
        .expect(302);

      const updated = await userService.findOne({ _id: user._id });
      updated.isEmailVerified.should.be.equal(true);

      response.body.should.be.deep.equal({});
    });
  });

  it('should return an error if email is not registered', (done) => {
    testsHelper.test(done, async () => {
      const response = await request.post('/account/signin')
        .send({
          email: 'test@test.com',
          password: 'incorrect_password',
        })
        .expect(400);

      response.body.should.be.deep.equal({ errors: ERRORS.INCORRECT_CREDENTIALS });
    });
  });

  it('should return an error if trying to log in before email is verified', (done) => {
    testsHelper.test(done, async () => {
      const response = await request.post('/account/signin')
        .send({
          email: newUserData.email,
          password: newUserData.password,
        })
        .expect(400);

      response.body.should.be.deep.equal({ errors: ERRORS.VIRIFY_EMAIL_TO_SIGNIN });
    });
  });

  it('should return an error if wrong password is provided when logging in', (done) => {
    testsHelper.test(done, async () => {
      const response = await request.post('/account/signin')
        .send({
          email: user.email,
          password: 'invalid_password',
        })
        .expect(400);

      response.body.should.be.deep.equal({ errors: ERRORS.INCORRECT_CREDENTIALS });
    });
  });

  it('should return an error that the email address is incorrect', (done) => {
    testsHelper.test(done, async () => {
      const response = await request.post('/account/forgot-password')
        .send({ email: 'not@email' })
        .expect(400);

      response.body.should.be.deep.equal({ errors: ERRORS.INCORRECT_EMAIL });
    });
  });

  it('should successfully send forgot password link', (done) => {
    testsHelper.test(done, async () => {
      const response = await request.post('/account/forgot-password')
        .send({ email: newUserData.email })
        .expect(200);

      const updated = await userService.findOne({ email: newUserData.email });
      updated.resetPasswordToken.should.be.an('string').to.have.lengthOf.above(1);

      response.body.should.be.deep.equal({});
    });
  });

  it('should return 200 if forgot password email is not registered', (done) => {
    testsHelper.test(done, async () => {
      const response = await request.post('/account/forgot-password')
        .send({ email: 'not@registered.com' })
        .expect(200);

      response.body.should.be.deep.equal({});
    });
  });

  it('should return an error that reset password token is invalid', (done) => {
    testsHelper.test(done, async () => {
      const response = await request.put('/account/reset-password')
        .send({
          password: 'new_password',
          token: 'invalid_token',
        })
        .expect(400);

      response.body.should.be.deep.equal({ errors: ERRORS.INVALID_RESET_TOKEN });
    });
  });

  it('should successfully reset old password', (done) => {
    testsHelper.test(done, async () => {
      const response = await request.put('/account/reset-password')
        .send({
          password: 'new_password',
          token: user.resetPasswordToken,
        })
        .expect(200);

      const updated = await userService.findOne({ _id: user._id });
      // https://stackoverflow.com/questions/18102152/should-js-cannot-read-property-should-of-null
      (updated.resetPasswordToken === null).should.be.equal(true);
      updated.passwordHash.should.not.be.equal(user.passwordHash);

      response.body.should.be.deep.equal({});
    });
  });

  it('should successfully resend verification email', (done) => {
    testsHelper.test(done, async () => {
      const response = await request
        .post('/account/resend')
        .send({ email: newUserData.email })
        .expect(200);

      response.body.should.be.deep.equal({});
    });
  });

  it('should return an error that the email address is incorrect', (done) => {
    testsHelper.test(done, async () => {
      const response = await request.post('/account/resend')
        .send({ email: 'not@email' })
        .expect(400);

      response.body.should.be.deep.equal({ errors: ERRORS.INCORRECT_EMAIL });
    });
  });

  it('should successfully logout user', (done) => {
    testsHelper.test(done, async () => {
      const response = await request
        .post('/account/logout')
        .expect(200);

      response.body.should.be.deep.equal({});
    });
  });

  it('should redirect to google auth url', (done) => {
    testsHelper.test(done, async () => {
      const response = await request
        .get('/account/signin/google/auth')
        .expect(302);

      response.body.should.be.deep.equal({});
    });
  });

  it('should return 404 for google signin with invalid code', (done) => {
    testsHelper.test(done, async () => {
      await request
        .get('/account/signin/google')
        .expect(404);
    });
  });
});
