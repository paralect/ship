const chai = require('chai');
const supertest = require('supertest');

const db = require('db');
const constants = require('app.constants');

const userFactory = require('resources/user/user.factory');
const { signin } = require('tests/auth');

const server = require('../../app');

const request = supertest.agent(server.listen());

chai.should();

const emailInUseMessage = 'This email is already in use.';

describe('/users', () => {
  const users = [];
  let token;

  before(async () => {
    await db.get(constants.DATABASE_DOCUMENTS.USERS).drop();

    users[0] = await userFactory.verifiedUser();
    users[1] = await userFactory.unverifiedUser();
    token = await signin(request, users[0]);
  });

  it('should successfully return data of the current user', (done) => {
    request
      .get('/users/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        res.body.email.should.be.equal(users[0].email);
      })
      .end(done);
  });

  it('should return an error that email is already in use', (done) => {
    request
      .put('/users/current')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        email: users[1].email,
      })
      .expect(400)
      .expect(({ body: { errors } }) => {
        errors[0].email.should.be.equal(emailInUseMessage);
      })
      .end(done);
  });

  it('should successfully update user info', (done) => {
    request
      .put('/users/current')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: '123',
        lastName: 'Test',
        email: users[0].email,
      })
      .expect(200)
      .expect(({ body }) => {
        body.lastName.should.be.equal('Test');
      })
      .end(done);
  });
});
