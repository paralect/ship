/* eslint no-await-in-loop: 0, no-loop-func: 0 */

const supertest = require('supertest');
const chai = require('chai');

const server = require('app');
const db = require('tests/db');
const { USER } = require('tests/constants');
const authHelper = require('tests/auth.helper');
const testsHelper = require('tests/tests.helper');

const UserBuilder = require('./user.builder');

const app = server.listen();
chai.should();

describe('/users', async () => {
  let userRequest;
  let authUserRequest;

  before(async () => {
    await db.get(USER.COLLECTION).drop();

    const [, authUser] = await Promise.all([
      new UserBuilder().emailVerified().build(),
      new UserBuilder().emailVerified().build(),
    ]);

    userRequest = supertest.agent(app);
    authUserRequest = supertest.agent(app);
    await authHelper.signin(authUserRequest, authUser);
  });

  it('should return an error for not authed user', (done) => {
    testsHelper.test(done, async () => {
      await userRequest.get('/users/current')
        .expect(401);
    });
  });

  it('should successfully response for authed user', (done) => {
    testsHelper.test(done, async () => {
      await authUserRequest.get('/users/current')
        .expect(200);
    });
  });

  it('should return an error for not authed user', (done) => {
    testsHelper.test(done, async () => {
      await userRequest.put('/users/current')
        .expect(401);
    });
  });

  it('should successfully response for authed user', (done) => {
    testsHelper.test(done, async () => {
      await authUserRequest.put('/users/current')
        .expect(200);
    });
  });
});
