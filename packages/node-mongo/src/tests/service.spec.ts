/* eslint-disable @typescript-eslint/no-unused-expressions */
import { z } from 'zod';
import chai from 'chai';
import spies from 'chai-spies';

import { Database } from '../index';

import 'mocha';

import config from '../config';

chai.use(spies);
chai.should();
const { assert } = chai;

const database = new Database(config.mongo.connection, config.mongo.dbName);

const companySchema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  users: z.array(z.string()),
});

const schema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  fullName: z.string(),
});

type UserType = z.infer<typeof schema>;
type CompanyType = z.infer<typeof companySchema>;


const usersService = database.createService<UserType>('users', {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

const companyService = database.createService<CompanyType>('companies', {
  schemaValidator: (obj) => companySchema.parseAsync(obj),
});

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

    await usersService.insertOne(
      { fullName: 'John 2' },
      { publishEvents: false },
    );

    const newUser = await usersService.findOne({ _id: u._id });

    u._id.should.be.equal(newUser?._id);
  });

  it('should create and find all documents', async () => {
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

  it('should check readConfig', async () => {
    const u = await usersService.insertOne({
      fullName: 'John',
    });

    await usersService.deleteSoft({
      _id: u._id,
    });

    const notFoundUser = await usersService.findOne({ _id: u._id });
    const foundUser = await usersService.findOne(
      { _id: u._id },
      { skipDeletedOnDocs: false },
    );

    (notFoundUser === null).should.be.equal(true);
    foundUser?._id.should.be.equal(u._id);
  });

  it('should create and find documents with paging', async () => {
    const users = await usersService.insertMany([
      { fullName: 'John' },
      { fullName: 'Kobe' },
      { fullName: 'John' },
      { fullName: 'Kobe' },
      { fullName: 'John' },
      { fullName: 'Kobe' },
      { fullName: 'John' },
      { fullName: 'Kobe' },
      { fullName: 'John' },
      { fullName: 'Kobe' },
    ]);

    const userIds = users.map((u) => u._id);
    const { results: newUsers, pagesCount, count } = await usersService.find(
      { _id: { $in: userIds } },
      { page: 1, perPage: 2 },
    );

    newUsers?.length.should.be.equal(2);
    pagesCount?.should.be.equal(5);
    count?.should.be.equal(10);
  });

  it('should check that document exists', async () => {
    const user = await usersService.insertOne( { fullName: 'John' });

    const isUserExists = await usersService.exists({ _id: user._id });
    const isNotUserExists = await usersService.exists({ _id: 'some-id' });

    isUserExists.should.be.equal(true);
    isNotUserExists.should.be.equal(false);
  });

  it('should return documents count', async () => {
    await usersService.insertMany([
      { fullName: 'John IM' },
      { fullName: 'John IM' },
      { fullName: 'John IM' },
      { fullName: 'John IM' },
    ]);

    const usersCount = await usersService.countDocuments({ fullName: 'John IM' });

    usersCount.should.be.equal(4);
  });

  it('should return users fullNames', async () => {
    const usersData = [
      { fullName: 'John IMS 1' },
      { fullName: 'John IMS 2' },
      { fullName: 'John IMS 3' },
      { fullName: 'John IMS 4' },
    ];

    await usersService.insertMany(usersData);

    const newUsersFullNames = usersData.map((u) => u.fullName);

    const usersFullNames = await usersService.distinct('fullName', {
      fullName: { $in: newUsersFullNames },
    });

    usersFullNames.should.have.members(newUsersFullNames);
  });

  it('should replace document', async () => {
    const u = await usersService.insertOne({
      fullName: 'User to replace',
    });

    const fullNameToUpdate = 'Updated fullname';

    await usersService.replaceOne(
      { _id: u._id },
      { fullName: fullNameToUpdate },
    );

    const updatedUser = await usersService.findOne({ _id: u._id });

    updatedUser?.fullName.should.be.equal(fullNameToUpdate);
  });

  it('should atomic update document', async () => {
    const u = await usersService.insertOne({
      fullName: 'User to update',
    });

    const fullNameToUpdate = 'Updated fullname';

    await usersService.atomic.updateOne(
      { _id: u._id },
      { $set: { fullName: fullNameToUpdate } },
    );

    const updatedUser = await usersService.findOne({ _id: u._id });

    updatedUser?.fullName.should.be.equal(fullNameToUpdate);
  });

  it('should atomic update documents', async () => {
    const users = [
      { fullName: 'John' },
      { fullName: 'Kobe' },
    ];

    const fullNameToUpdate = 'Updated fullname';

    const createdUsers = await usersService.insertMany(users);

    const usersIds = createdUsers.map((u) => u._id);

    await usersService.atomic.updateMany(
      { _id: { $in: usersIds } },
      { $set: { fullName: fullNameToUpdate } },
    );

    const { results: updatedUsers } = await usersService.find({ _id: { $in: usersIds } });

    const expectedFullnames = updatedUsers.map(() => 'Updated fullname');
    const updatedFullnames = users.map(() => 'Updated fullname');

    expectedFullnames.should.have.members(updatedFullnames);
  });

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
      { skipDeletedOnDocs: false },
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

  // check index cretion and deletion

  // add indexExists

  it('should create and delete index', async () => {
    await usersService.createIndex('fullName');

    await usersService.dropIndex('fullName');
  });

  it('should create and delete indexes', async () => {
    await usersService.createIndexes([{ key: { fullName: 1 } }]);

    await usersService.dropIndexes();
  });

  it('should commit transaction', async () => {
    const { user, company } = await database.withTransaction(async (session) => {
      const createdUser = await usersService.insertOne({ fullName: 'Bahrimchuk' }, {}, { session });
      const createdCompany = await companyService.insertOne(
        { users: [createdUser._id] }, {},
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
        const createdUser = await usersService.insertOne({ fullName: 'Fake Bahrimchuk' }, {}, { session });

        await companyService.insertOne(
          { users: [createdUser._id], unExistedField: 3 } as any,
          {}, { session },
        );
      });
    } catch (err) {
      const user = await usersService.findOne({ fullName: 'Fake Bahrimchuk' });

      (user === null).should.be.equal(true);
    }
  });
});
