const _ = require('lodash');
const supertest = require('supertest');
const chai = require('chai');

const server = require('app');
const db = require('tests/db');
const { USER, ERRORS } = require('tests/constants');
const authHelper = require('tests/auth.helper');
const testsHelper = require('tests/tests.helper');

const UserBuilder = require('./user.builder');
const userSchema = require('./user.schema');

const app = server.listen();
const userService = db.createService(USER.COLLECTION, userSchema);
chai.should();

describe('/users', async () => {
  let newUser;
  let verifiedUser;

  let verifiedUserRequest;

  before(async () => {
    await db.get(USER.COLLECTION).drop();

    [
      newUser,
      verifiedUser,
    ] = await Promise.all([
      new UserBuilder().build(),
      new UserBuilder().emailVerified().build(),
    ]);

    verifiedUserRequest = supertest.agent(app);
    await authHelper.signin(verifiedUserRequest, verifiedUser);
  });

  it('should successfully return data of the current user', (done) => {
    testsHelper.test(done, async () => {
      const startTime = Date.now();

      let updated = verifiedUser;

      const response = await verifiedUserRequest.get('/users/current')
        .expect(200);

      const autoUpdatedFields = ['lastRequest', 'updatedOn'];
      updated = autoUpdatedFields.reduce((acc, field) => ({
        ...acc,
        [field]: response.body[field],
      }), updated);

      testsHelper.checkAutoUpdatedFields(response, startTime, autoUpdatedFields);
      response.body.should.be.deep.equal(testsHelper.datesToISOStrings(
        _.omit(updated, USER.PRIVATE_FIELDS),
      ));

      const dbUser = await userService.findOne({ _id: updated._id });
      testsHelper.datesToISOStrings(dbUser).should.be.deep.equal(
        testsHelper.datesToISOStrings(updated),
      );

      verifiedUser = updated;
    });
  });

  it('should return an error that email is already in use', (done) => {
    testsHelper.test(done, async () => {
      const response = await verifiedUserRequest.put('/users/current')
        .send({ email: newUser.email })
        .expect(400);

      response.body.should.be.deep.equal({ errors: ERRORS.EMAIL_IN_USE });
    });
  });

  it('should successfully update user info', (done) => {
    testsHelper.test(done, async () => {
      const startTime = Date.now();

      const newUserData = {
        firstName: '123',
        lastName: 'Test',
      };
      let updated = {
        ...verifiedUser,
        ...newUserData,
      };

      const response = await verifiedUserRequest
        .put('/users/current')
        .send(newUserData)
        .expect(200);

      const autoUpdatedFields = ['lastRequest', 'updatedOn'];
      updated = autoUpdatedFields.reduce((acc, field) => ({
        ...acc,
        [field]: response.body[field],
      }), updated);

      testsHelper.checkAutoUpdatedFields(response, startTime, autoUpdatedFields);
      response.body.should.be.deep.equal(testsHelper.datesToISOStrings(
        _.omit(updated, USER.PRIVATE_FIELDS),
      ));

      const dbUser = await userService.findOne({ _id: updated._id });
      testsHelper.datesToISOStrings(dbUser).should.be.deep.equal(
        testsHelper.datesToISOStrings(updated),
      );

      verifiedUser = updated;
    });
  });

  it('should successfully update user info exept not existing field', (done) => {
    testsHelper.test(done, async () => {
      const startTime = Date.now();

      const newUserData = {
        firstName: '123',
        lastName: 'Test',
        email: 'new@email.com',
      };
      let updated = {
        ...verifiedUser,
        ...newUserData,
      };

      const response = await verifiedUserRequest
        .put('/users/current')
        .send({
          ...newUserData,
          not_exists: 'value',
        })
        .expect(200);

      const autoUpdatedFields = ['lastRequest', 'updatedOn'];
      updated = autoUpdatedFields.reduce((acc, field) => ({
        ...acc,
        [field]: response.body[field],
      }), updated);

      testsHelper.checkAutoUpdatedFields(response, startTime, autoUpdatedFields);
      response.body.should.be.deep.equal(testsHelper.datesToISOStrings(
        _.omit(updated, USER.PRIVATE_FIELDS),
      ));

      const dbUser = await userService.findOne({ _id: updated._id });
      testsHelper.datesToISOStrings(dbUser).should.be.deep.equal(
        testsHelper.datesToISOStrings(updated),
      );

      verifiedUser = updated;
    });
  });
  it('should successfully return data of users', (done) => {
    testsHelper.test(done, async () => {
      const response = await verifiedUserRequest
        .get('/users/user')
        .query({
          limit: 1, page: 1, sortKey: 'firstName', sortDirection: 1,
        })
        .expect(200);

      response.body.items.should.be.an('array');
      response.body.totalPages.should.be.deep.equal(2);
      response.body.currentPage.should.be.deep.equal(1);
    });
  });
});
