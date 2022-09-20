/* eslint-disable @typescript-eslint/no-unused-expressions */
import Joi from 'joi';
import chai from 'chai';
import spies from 'chai-spies';

import { Database } from '../index';

import 'mocha';

import config from '../config';

chai.use(spies);
chai.should();
const { assert } = chai;

const database = new Database(config.mongo.connection, config.mongo.dbName);

type UserType = {
  _id: string;
  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
  fullName: string;
};

type CompanyType = {
  _id: string;
  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
  fullName: string;
  users: string[]
};

const companySchema = Joi.object({
  _id: Joi.string().required(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date().allow(null),
  users: Joi.array().items(Joi.string()),
});

const schema = Joi.object({
  _id: Joi.string().required(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date().allow(null),
  fullName: Joi.string().required(),
});

const usersService = database.createService<UserType>('users', { schema });
const companyService = database.createService<CompanyType>('companies', { schema: companySchema });

describe('service.ts', () => {
  before(async () => {
    await database.connect();
  });
  after(async () => {
    await usersService.drop();
    await database.close();
  });
  it('should create and find document', async () => {
    const u = await usersService.insertOne({
      fullName: 'John',
    });

    const newUser = await usersService.findOne({ _id: u._id });

    u._id.should.be.equal(newUser?._id);
  });

  it('should create and find documents', async () => {
    const users = await usersService.insertMany([
      { fullName: 'John' },
      { fullName: 'Kobe' },
    ]);

    const userIds = users.map((u) => u._id);
    const { results: newUsers } = await usersService.find({
      _id: { $in: userIds },
    });

    const newUsersIds = newUsers.map((u) => u._id);

    newUsersIds.should.have.members(userIds);
  });

  // find paging
  // find options
  // insert options
  // delete options
  // exists
  // countDocuments
  // distinct
  // atomicUpdateOne
  // atomicUpdateMany
  // replaceOne
  // createIndex
  // createIndexes
  // dropIndex
  // dropIndexes
  // watch
  // withTransaction

  it('should update document', async () => {
    const u = await usersService.insertOne({
      fullName: 'User to update',
    });

    const updatedUser = await usersService.updateOne(
      { _id: u._id }, () => ({
        fullName: 'Updated fullname',
      }),
    );

    updatedUser?.fullName.should.be.equal('Updated fullname');
  });

  it('should update documents', async () => {
    const users = [
      { fullName: 'John' },
      { fullName: 'Kobe' },
    ];

    const createdUsers = await usersService.insertMany(users);

    const usersIds = createdUsers.map((u) => u._id);

    const updatedUsers = await usersService.updateMany(
      { _id: { $in: usersIds } },
      (doc) => ({
        fullName: `${doc.fullName} Updated fullname`,
      }),
    );

    const expectedFullnames = users.map((u) => `${u.fullName} Updated fullname`);
    const updatedFullnames = updatedUsers.map((u) => u.fullName);

    updatedFullnames.should.have.members(expectedFullnames);
  });

  it('should delete document', async () => {
    const u = await usersService.insertOne({
      fullName: 'User to remove',
    });

    await usersService.deleteOne({ _id: u._id });

    const deletedUser = await usersService.findOne({
      _id: u._id,
    });

    (deletedUser === null).should.be.equal(true);
  });

  it('should delete documents', async () => {
    const users = await usersService.insertMany([
      { fullName: 'User to remove' },
      { fullName: 'User to remove' },
    ]);

    const usersIds = users.map((u) => u._id);

    await usersService.deleteMany({ _id: { $in: usersIds } });

    const { results: removedUsers } = await usersService.find({
      _id: { $in: usersIds },
    });

    removedUsers.length.should.be.equal(0);
  });

  it('should set deletedOn date to current JS date on remove', async () => {
    const u = await usersService.insertOne({
      fullName: 'User to remove',
    });

    await usersService.deleteSoft({
      _id: u._id,
    });

    const updatedUser = await usersService.findOne(
      { _id: u._id },
      {}, { skipDeletedOnDocs: false },
    );

    const deletedUser = await usersService.findOne({
      _id: u._id,
    });

    (deletedUser === null).should.be.equal(true);
    assert.exists(updatedUser?.deletedOn);
  });

  it('should return sum of documents through aggregation', async () => {
    const users = [
      { fullName: 'John' },
      { fullName: 'John' },
      { fullName: 'Kobe' },
    ];

    const createdUsers = await usersService.insertMany(users);

    const usersIds = createdUsers.map((u) => u._id);

    const aggregationResult = await usersService.aggregate([
      { $match: { _id: { $in: usersIds } } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    aggregationResult[0].count.should.be.equal(users.length);
  });

  it('should commit transaction', async () => {
    const { user, company } = await database.withTransaction(async (session) => {
      const createdUser = await usersService.insertOne({ fullName: 'Bahrimchuk' }, { session });
      const createdCompany = await companyService.insertOne(
        { users: [createdUser._id] },
        { session },
      );

      return { user: createdUser, company: createdCompany };
    });

    const expectedUser = await usersService.findOne({ _id: user._id });
    const expectedCompany = await companyService.findOne({ _id: company._id });

    user._id.should.be.equal(expectedUser?._id);
    company._id.should.be.equal(expectedCompany?._id);
  });

  it('should rollback transaction', async () => {
    try {
      await database.withTransaction(async (session) => {
        const createdUser = await usersService.insertOne({ fullName: 'Fake Bahrimchuk' }, { session });

        await companyService.insertOne(
          { users: [createdUser._id], unExistedField: 3 } as any,
          { session },
        );
      });
    } catch (err) {
      const user = await usersService.findOne({ fullName: 'Fake Bahrimchuk' });

      (user === null).should.be.equal(true);
    }
  });
});
