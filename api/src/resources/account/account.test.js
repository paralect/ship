const db = require('db');
const constants = require('app.constants');

const userFactory = require('resources/user/user.factory');

module.exports = (request) => {
  let user;

  describe('/account', () => {
    before(async () => {
      await db.get(constants.DATABASE_DOCUMENTS.USERS).drop();

      user = await userFactory.unverifiedUser('1234');
    });

    it('should successfully create new user', (done) => {
      request.post('/account/signup')
        .send({
          firstName: 'Ivan',
          lastName: 'Balalaikin',
          email: 'test@test.test',
          password: 'qwerty',
        })
        .expect(200)
        .end(done);
    });

    it('should return an error that email is already registered.', (done) => {
      request.post('/account/signup')
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
      request.get('/account/verifyEmail/111')
        .expect(400)
        .expect(({ body }) => {
          const { errors } = body;
          errors[0].token.should.be.equal('Token is invalid');
        })
        .end(done);
    });

    it('should successfully verify email', (done) => {
      request.get('/account/verifyEmail/1234')
        .expect(302)
        .end(done);
    });

    it('should return an error that the password is incorrect', (done) => {
      request.post('/account/signin')
        .send({
          email: 'test@test.com1',
          password: '1234',
        })
        .expect(400)
        .expect(({ body }) => {
          const { errors } = body;
          errors[0].password.should.be.equal('Password must be 6-20 characters');
        })
        .end(done);
    });

    it('should successfully sign in', (done) => {
      request.post('/account/signin')
        .send({
          email: 'test@test.test',
          password: 'qwerty',
        })
        .expect(200)
        .end(done);
    });

    it('should return an error that the email address is incorrect', (done) => {
      request.post('/account/forgotPassword')
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
      request.post('/account/forgotPassword')
        .send({
          user: user.email,
        })
        .expect(200)
        .end(done);
    });

    it('should return an error that reset password token is invalid', (done) => {
      request.put('/account/resetPassword')
        .send({
          password: 'qwerty123',
          token: '234',
        })
        .expect(400)
        .expect(({ body }) => {
          const { errors } = body;
          errors[0].token.should.be.equal('Token is invalid');
        })
        .end(done);
    });

    it('should successfully reset old password', (done) => {
      request.put('/account/resetPassword')
        .send({
          password: 'new_password',
          token: `${user._id}_reset_password_token`,
        })
        .expect(200)
        .end(done);
    });

    it('should successfully resend verification email', (done) => {
      request.post('/account/resend')
        .send({
          email: 'test@test.test',
        })
        .expect(200)
        .end(done);
    });
  });
};
