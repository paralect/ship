/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
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

enum UserRoles {
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
}

enum AdminPermissions {
  READ = 'read',
  WRITE = 'write',
  EDIT = 'edit',
}

const userSchema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  fullName: z.string(),
  age: z.number().optional(),
  role: z.nativeEnum(UserRoles).default(UserRoles.MEMBER),
  permissions: z.array(z.nativeEnum(AdminPermissions)).optional(),
  birthDate: z.date().optional(),
  subscriptionId: z.string().optional(),
});

type UserType = Omit<z.infer<typeof userSchema>, 'permissions'>;
type AdminType = Omit<z.infer<typeof userSchema>, 'subscriptionId'>;
type CompanyType = z.infer<typeof companySchema>;

const usersService = database.createService<UserType>('users', {
  schemaValidator: (obj) => userSchema.parseAsync(obj),
});

const usersServiceEscapeRegExp = database.createService<UserType>('usersEsapeRegExp', {
  schemaValidator: (obj) => userSchema.parseAsync(obj),
  escapeRegExp: true,
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
    await usersServiceEscapeRegExp.drop();
    await companyService.drop();
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

  it('should create and delete index', async () => {
    const index = await usersService.createIndex({ fullName: 1 }) as string;

    const isIndexExists = await usersService.indexExists(index);

    await usersService.dropIndex(index);

    const isIndexNotExists = await usersService.indexExists('fullName');

    isIndexExists.should.be.equal(true);
    isIndexNotExists.should.be.equal(false);
  });

  it('should create and delete indexes', async () => {
    const indexes = await usersService.createIndexes([
      { key: { fullName: 1 } },
      { key: { createdOn: 1 } },
    ]) as string[];

    const isIndexesExists = await usersService.indexExists(indexes);

    await usersService.dropIndexes();

    const isIndexesNotExists = await usersService.indexExists(indexes);

    isIndexesExists.should.be.equal(true);
    isIndexesNotExists.should.be.equal(false);
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

  it('should throw a ts error if you pass an object that is not suitable for a generic type when creating a document', async () => {
    // should throw ts error because admin doesn't have subscriptionId field
    await usersService.insertOne<AdminType>({ 
      fullName: 'Fake Bahrimchuk',
      role: UserRoles.ADMIN,
      //@ts-expect-error
      subscriptionId: 'fakeId',
    });

    // should throw ts error because member doesn't have permissions field
    await usersService.insertOne<UserType>({ 
      fullName: 'Fake Bahrimchuk',
      //@ts-expect-error
      permissions: [AdminPermissions.WRITE],
    });
  });

  it('should throw a ts error if you pass an array of objects that is not suitable for a generic type when creating documents', async () => {
    // should throw ts error because admin doesn't have subscriptionId field
    await usersService.insertMany<AdminType>([
      { 
        fullName: 'Fake Bahrimchuk',
        role: UserRoles.ADMIN,
        //@ts-expect-error
        subscriptionId: 'fakeId',
      },
    ]);

    // should throw ts error because member doesn't have permissions field
    await usersService.insertMany<UserType>([
      { 
        fullName: 'Fake Bahrimchuk',
        //@ts-expect-error
        permissions: [AdminPermissions.WRITE],
      },
    ]);
  });

  it('should throw a ts error if you pass an object that is not suitable for a generic type when updating a document', async () => {
    const createdAdmin = await usersService.insertOne<AdminType>({ 
      fullName: 'Admin to update',
      role: UserRoles.ADMIN,
      permissions: [AdminPermissions.READ],
    });

    const createdMember = await usersService.insertOne<UserType>({ 
      fullName: 'Member to update',
    });

    // should throw ts error because admin doesn't have subscriptionId field
    await usersService.updateOne<AdminType>(
      {  _id: createdAdmin._id },
      //@ts-expect-error
      (): AdminType => ({ subscriptionId: 'fakeId' }),
    );

    // should throw ts error because member doesn't have permissions field
    await usersService.updateOne<UserType>(
      { _id: createdMember._id },
      //@ts-expect-error
      (): UserType => ({ permissions: [AdminPermissions.WRITE] }),
    );
  });

  it('should throw a ts error if you pass an object that is not suitable for a generic type when updating documents', async () => {
    const createdAdmin = await usersService.insertOne<AdminType>({ 
      fullName: 'Admin to updated',
      role: UserRoles.ADMIN,
      permissions: [AdminPermissions.READ],
    });

    const createdMember = await usersService.insertOne<UserType>({ 
      fullName: 'Member to update',
    });

    // should throw ts error because admin doesn't have subscriptionId field
    await usersService.updateMany<AdminType>(
      { _id: createdAdmin._id },
      //@ts-expect-error
      (): AdminType => ({ subscriptionId: 'fakeId' }),
    );

    // should throw ts error because member doesn't have permissions field
    await usersService.updateMany<UserType>(
      { _id: createdMember._id },
      //@ts-expect-error
      (): UserType => ({ permissions: [AdminPermissions.WRITE] }),
    );
  });

  it('should throw a ts error if you try to pick a field that does not exist in generic type when finding a document', async () => {
    const createdAdmin = await usersService.insertOne<AdminType>({ 
      fullName: 'Fake Bahrimchuk',
      role: UserRoles.ADMIN,
      permissions: [AdminPermissions.READ],
    });
    
    const admin = await usersService.findOne<AdminType>({ 
      _id: createdAdmin._id,
    });

    const createdMember = await usersService.insertOne<UserType>({ 
      fullName: 'Fake Bahrimchuk',
    });
    
    const member = await usersService.findOne<UserType>({ 
      _id: createdMember._id,
    });

    // should throw ts error because admin doesn't have subscriptionId field
    //@ts-expect-error
    admin?.subscriptionId?.should.to.be.undefined;

    // should throw ts error because member doesn't have permissions field
    //@ts-expect-error
    member?.permissions?.should.to.be.undefined;
  });

  it('should throw a ts error if you try to pick a field that does not exist in generic type when finding documents', async () => {
    const createdAdmin = await usersService.insertOne<AdminType>({ 
      fullName: 'Fake Bahrimchuk',
      role: UserRoles.ADMIN,
      permissions: [AdminPermissions.READ],
    });
    
    const admins = await usersService.find<AdminType>({ 
      _id: createdAdmin._id,
    });

    const createdMember = await usersService.insertOne<UserType>({ 
      fullName: 'Fake Bahrimchuk',
    });
    
    const members = await usersService.find<UserType>({ 
      _id: createdMember._id,
    });

    // should throw ts error because admin doesn't have subscriptionId field
    //@ts-expect-error
    admins.results[0]?.subscriptionId?.should.to.be.undefined;

    // should throw ts error because member doesn't have permissions field
    //@ts-expect-error
    members.results[0]?.permissions?.should.to.be.undefined;
  });

  it('should throw a ts error if you pass an object that is not suitable for a generic type when deleting a document', async () => {
    const createdAdmin = await usersService.insertOne<AdminType>({ 
      fullName: 'Admin to delete',
      role: UserRoles.ADMIN,
      permissions: [AdminPermissions.READ],
    });

    const deletedAdmin = await usersService.deleteOne<AdminType>(
      { _id: createdAdmin._id },
    );

    const createdMember = await usersService.insertOne<UserType>({ 
      fullName: 'Member to delete',
    });

    const deletedMember = await usersService.deleteOne<UserType>(
      { _id: createdMember._id },
    );

    // should throw ts error because admin doesn't have subscriptionId field
    //@ts-expect-error
    deletedAdmin?.subscriptionId?.should.to.be.undefined;

    // should throw ts error because member doesn't have permissions field
    //@ts-expect-error
    deletedMember?.permissions?.should.to.be.undefined;
  });

  it('should throw a ts error if you pass an object that is not suitable for a generic type when deleting documents', async () => {
    const createdAdmin = await usersService.insertOne<AdminType>({ 
      fullName: 'Admin to delete',
      role: UserRoles.ADMIN,
      permissions: [AdminPermissions.READ],
    });

    const deletedAdmins = await usersService.deleteMany<AdminType>(
      { _id: createdAdmin._id },
    );

    const createdMember = await usersService.insertOne<UserType>({ 
      fullName: 'Member to delete',
    });

    const deletedMembers = await usersService.deleteMany<UserType>(
      { _id: createdMember._id },
    );

    // should throw ts error because admin doesn't have subscriptionId field
    //@ts-expect-error
    deletedAdmins[0]?.subscriptionId?.should.to.be.undefined;

    // should throw ts error because member doesn't have permissions field
    //@ts-expect-error
    deletedMembers[0]?.permissions?.should.to.be.undefined;
  });

  it('should escape regexp', async () => {
    const users = await usersServiceEscapeRegExp.insertMany([
      { fullName: 'A(B).Nosov' },
      { fullName: 'A(B).Nosov' },
      { fullName: 'I.Krivoshey' },
      { fullName: ' ] \ ^ $ . | ? * + ( )' },
    ]);

    const { results: nosovUsers } = await usersServiceEscapeRegExp.find({
      fullName: { $regex: 'A(B).Nosov' },
    });
    const targetIds = users.map((p) => p._id);
    targetIds.slice(0, 2).should.be.deep.equal(nosovUsers.map((u) => u._id));

    const randomUser = await usersServiceEscapeRegExp.findOne({
      fullName: { $regex: ' ] \ ^ $ . | ? * + ( )' },
    });
    targetIds[3].should.be.equal(randomUser?._id);
  });

  it('should not escape regexp', async () => {
    await usersService.insertMany([
      { fullName: '$Ken BL' },
      { fullName: 'John Dow*^' },
    ]);

    const { results: newUsers } = await usersService.find({
      $or: [
        { fullName: { $regex: '$Ken BL' } },
        { fullName: { $regex: 'John Dow*^' } },
      ],
    });
    (newUsers.length).should.be.equal(0);
  });

  it('should update many documents with $set mongo operator', async () => {
    const users = await usersService.insertMany([
      { fullName: 'User 1 to update' },
      { fullName: 'User 2 to update' },
    ]);

    const usersIds = users.map((u) => u._id);

    const fullNameToUpdate = 'Updated fullname';

    const updatedUsers = await usersService.updateMany(
      { _id: { $in: usersIds } }, 
      {
        $set: {
          fullName: fullNameToUpdate,
        },
      },
    );

    updatedUsers?.[0].fullName.should.be.equal(fullNameToUpdate);
    updatedUsers?.[1].fullName.should.be.equal(fullNameToUpdate);
  });

  it('should update many documents with $currentDate mongo operator', async () => {
    const nowDate = new Date();

    const users = await usersService.insertMany([
      { 
        fullName: 'User 1 to update',
        birthDate: new Date('2022-01-01'), 
      },
      {  
        fullName: 'User 2 to update',
        birthDate: new Date('2022-01-01'),
      },
    ]);

    const usersIds = users.map((u) => u._id);

    const updatedUsers = await usersService.updateMany(
      { _id: { $in: usersIds } },
      {
        $currentDate: {
          birthDate: true,
        },
      },
      {},
    );

    updatedUsers?.[0].birthDate?.getDate().should.be.equal(nowDate.getDate());
    updatedUsers?.[0].birthDate?.getMonth().should.be.equal(nowDate.getMonth());
    updatedUsers?.[0].birthDate?.getFullYear().should.be.equal(nowDate.getFullYear());

    updatedUsers?.[1].birthDate?.getDate().should.be.equal(nowDate.getDate());
    updatedUsers?.[1].birthDate?.getMonth().should.be.equal(nowDate.getMonth());
    updatedUsers?.[1].birthDate?.getFullYear().should.be.equal(nowDate.getFullYear());
  });

  it('should update many documents with $inc mongo operator', async () => {
    const userAge = 20;

    const users = await usersService.insertMany([
      { 
        fullName: 'User 1 to update',
        age: userAge, 
      },
      {  
        fullName: 'User 2 to update',
        age: userAge,
      },
    ]);

    const usersIds = users.map((u) => u._id);

    const ageToUpdate = userAge + 1;

    const updatedUsers = await usersService.updateMany(
      { _id: { $in: usersIds } }, 
      {
        $inc: {
          age: 1,
        },
      },
    );

    updatedUsers?.[0].age?.should.be.equal(ageToUpdate);
    updatedUsers?.[1].age?.should.be.equal(ageToUpdate);
  });

  it('should update many documents with $min mongo operator', async () => {
    const userAge = 20;

    const users = await usersService.insertMany([
      { 
        fullName: 'User 1 to update',
        age: userAge, 
      },
      {  
        fullName: 'User 2 to update',
        age: userAge,
      },
    ]);

    const usersIds = users.map((u) => u._id);

    const notUpdatedUsers = await usersService.updateMany(
      { _id: { $in: usersIds } }, 
      {
        $min: {
          age: 21,
        },
      },
    );

    notUpdatedUsers[0]?.age?.should.be.equal(userAge);
    notUpdatedUsers[1]?.age?.should.be.equal(userAge);

    const minAgeToUpdate = 19;

    const updatedUsers = await usersService.updateMany(
      { _id: { $in: usersIds } },  
      {
        $min: {
          age: minAgeToUpdate,
        },
      },
    );

    updatedUsers[0]?.age?.should.be.equal(minAgeToUpdate);
    updatedUsers[1]?.age?.should.be.equal(minAgeToUpdate);
  });

  it('should update many documents with $max mongo operator', async () => {
    const userAge = 20;

    const users = await usersService.insertMany([
      { 
        fullName: 'User 1 to update',
        age: userAge, 
      },
      {  
        fullName: 'User 2 to update',
        age: userAge,
      },
    ]);

    const usersIds = users.map((u) => u._id);

    const notUpdatedUsers = await usersService.updateMany(
      { _id: { $in: usersIds } }, 
      {
        $max: {
          age: 19,
        },
      },
    );

    notUpdatedUsers?.[0]?.age?.should.be.equal(userAge);
    notUpdatedUsers?.[1]?.age?.should.be.equal(userAge);

    const maxAgeToUpdate = 21;

    const updatedUsers = await usersService.updateMany(
      { _id: { $in: usersIds } }, 
      {
        $max: {
          age: maxAgeToUpdate,
        },
      },
    );

    updatedUsers?.[0]?.age?.should.be.equal(maxAgeToUpdate);
    updatedUsers?.[1]?.age?.should.be.equal(maxAgeToUpdate);
  });

  it('should update many documents with $mul mongo operator', async () => {
    const userAge = 20;

    const users = await usersService.insertMany([
      { 
        fullName: 'User 1 to update',
        age: userAge, 
      },
      {  
        fullName: 'User 2 to update',
        age: userAge,
      },
    ]);

    const usersIds = users.map((u) => u._id);

    const mulValue = 2;
    const updatedAge = userAge * mulValue;

    const updatedUsers = await usersService.updateMany(
      { _id: { $in: usersIds } }, 
      {
        $mul: {
          age: mulValue,
        },
      },
    );

    updatedUsers?.[0]?.age?.should.be.equal(updatedAge);
    updatedUsers?.[1]?.age?.should.be.equal(updatedAge);
  });

  it('should update many documents with $rename mongo operator', async () => {
    const userAge = 20;

    type InvalidUser = Omit<UserType, 'age'> & {
      'fakeAge'?: number
    };

    const users = await usersService.insertMany<InvalidUser>([
      { 
        fullName: 'User 1 to update',
        fakeAge: userAge,
      },
      {  
        fullName: 'User 2 to update',
        fakeAge: userAge,
      },
    ]);

    const usersIds = users.map((u) => u._id);

    const updatedUsers = await usersService.updateMany<UserType>(
      { _id: { $in: usersIds } }, 
      {
        $rename: {
          'fakeAge': 'age',
        },
      },
    );

    updatedUsers?.[0]?.age?.should.be.equal(userAge);
    updatedUsers?.[1]?.age?.should.be.equal(userAge);
  });

  it('should update many documents with $setOnInsert mongo operator', async () => {
    const users = await usersService.insertMany([
      { fullName: 'User 1 to update' },
      { fullName: 'User 2 to update' },
    ]);

    const usersIds = users.map((u) => u._id);

    const userAgeToUpdate = 20;
    const userFullNameToUpdate = 'Test Updated';

    const updatedUsers = await usersService.updateMany<UserType>(
      { _id: { $in: usersIds } }, 
      {
        $set: {
          fullName: userFullNameToUpdate,
        },
        $setOnInsert: {
          age: userAgeToUpdate,
        },
      },
      {},
      { upsert: true },
    );

    updatedUsers?.[0]?.age?.should.be.equal(userAgeToUpdate);
    updatedUsers?.[0]?.fullName?.should.be.equal(userFullNameToUpdate);
    updatedUsers?.[1]?.age?.should.be.equal(userAgeToUpdate);
    updatedUsers?.[1]?.fullName?.should.be.equal(userFullNameToUpdate);
  });

  it('should update many document with $unset mongo operator', async () => {
    const users = await usersService.insertMany([
      { 
        fullName: 'User 1 to update',
        birthDate: new Date(),
      },
      { 
        fullName: 'User 2 to update',
        birthDate: new Date(),
      },
    ]);

    const usersIds = users.map((u) => u._id);

    const updatedUsers = await usersService.updateMany<UserType>(
      { _id: { $in: usersIds } }, 
      {
        $unset: {
          birthDate: true,
        },
      },
    );

    updatedUsers?.[0]?.birthDate?.should.be.undefined;
    updatedUsers?.[1]?.birthDate?.should.be.undefined;
  });

  it('should update many documents with $addToSet mongo operator', async () => {
    const users = await usersService.insertMany<AdminType>([
      { 
        fullName: 'User 1 to update',
        permissions: [AdminPermissions.EDIT],
      },
      { 
        fullName: 'User 2 to update',
        permissions: [AdminPermissions.EDIT],
      },
    ]);

    const usersIds = users.map((u) => u._id);

    const notUpdatedUsers = await usersService.updateMany<AdminType>(
      { _id: { $in: usersIds } },  
      {
        $addToSet: {
          permissions: AdminPermissions.EDIT,
        },
      },
    );

    notUpdatedUsers?.[0]?.permissions?.[0]?.should.be.equal(AdminPermissions.EDIT);
    notUpdatedUsers?.[0]?.permissions?.length?.should.be.equal(1);
    notUpdatedUsers?.[1]?.permissions?.[0]?.should.be.equal(AdminPermissions.EDIT);
    notUpdatedUsers?.[1]?.permissions?.length?.should.be.equal(1);

    const updatedUsers = await usersService.updateMany<AdminType>(
      { _id: { $in: usersIds } },  
      {
        $addToSet: {
          permissions: AdminPermissions.WRITE,
        },
      },
    );

    updatedUsers?.[0]?.permissions?.[1]?.should.be.equal(AdminPermissions.WRITE);
    updatedUsers?.[0]?.permissions?.length?.should.be.equal(2);
    updatedUsers?.[1]?.permissions?.[1]?.should.be.equal(AdminPermissions.WRITE);
    updatedUsers?.[1]?.permissions?.length?.should.be.equal(2);
  });

  it('should update many documents with $pop mongo operator', async () => {
    const firstUsers = await usersService.insertMany<AdminType>([
      {
        fullName: 'Test 1',
        permissions: [AdminPermissions.EDIT, AdminPermissions.WRITE],
      },
      {
        fullName: 'Test 2',
        permissions: [AdminPermissions.EDIT, AdminPermissions.WRITE],
      },
    ]);

    const secondUsers = await usersService.insertMany<AdminType>([
      {
        fullName: 'Test 3',
        permissions: [AdminPermissions.EDIT, AdminPermissions.WRITE],
      },
      {
        fullName: 'Test 4',
        permissions: [AdminPermissions.EDIT, AdminPermissions.WRITE],
      },
    ]);

    const firstUsersIds = firstUsers.map((u) => u._id);
    const secondUsersIds = secondUsers.map((u) => u._id);

    const updatedFirstUsers = await usersService.updateMany<AdminType>(
      { _id: { $in: firstUsersIds } },  
      {
        $pop: {
          permissions: -1,
        },
      },
    );

    updatedFirstUsers?.[0]?.permissions?.[0]?.should.be.equal(AdminPermissions.WRITE);
    updatedFirstUsers?.[0].permissions?.length?.should.be.equal(1);
    updatedFirstUsers?.[1]?.permissions?.[0]?.should.be.equal(AdminPermissions.WRITE);
    updatedFirstUsers?.[1].permissions?.length?.should.be.equal(1);

    const updatedSecondUsers = await usersService.updateMany<AdminType>(
      { _id: { $in: secondUsersIds } },  
      {
        $pop: {
          permissions: 1,
        },
      },
    );

    updatedSecondUsers?.[0].permissions?.[0]?.should.be.equal(AdminPermissions.EDIT);
    updatedSecondUsers?.[0].permissions?.length?.should.be.equal(1);
    updatedSecondUsers?.[1].permissions?.[0]?.should.be.equal(AdminPermissions.EDIT);
    updatedSecondUsers?.[1].permissions?.length?.should.be.equal(1);
  });

  it('should update many documents with $pull mongo operator', async () => {
    const users = await usersService.insertMany<AdminType>([
      {
        fullName: 'Test 1',
        permissions: [AdminPermissions.EDIT, AdminPermissions.WRITE],
      },
      {
        fullName: 'Test 2',
        permissions: [AdminPermissions.EDIT, AdminPermissions.WRITE],
      },
    ]);

    const usersIds = users.map((u) => u._id);

    const updatedUsers = await usersService.updateMany<AdminType>(
      { _id: { $in: usersIds } },  
      {
        $pull: {
          permissions: { $in: [AdminPermissions.EDIT] },
        },
      },
    );

    updatedUsers?.[0]?.permissions?.[0]?.should.be.equal(AdminPermissions.WRITE);
    updatedUsers?.[0]?.permissions?.length?.should.be.equal(1);
    updatedUsers?.[1]?.permissions?.[0]?.should.be.equal(AdminPermissions.WRITE);
    updatedUsers?.[1]?.permissions?.length?.should.be.equal(1);
  });

  it('should update many documents with $push mongo operator', async () => {
    const users = await usersService.insertMany<AdminType>([
      {
        fullName: 'Test 1',
        permissions: [AdminPermissions.EDIT],
      },
      {
        fullName: 'Test 2',
        permissions: [AdminPermissions.EDIT],
      },
    ]);

    const usersIds = users.map((u) => u._id);

    const updatedUsers = await usersService.updateMany<AdminType>(
      { _id: { $in: usersIds } }, 
      {
        $push: {
          permissions: AdminPermissions.WRITE,
        },
      },
    );

    updatedUsers?.[0]?.permissions?.[1]?.should.be.equal(AdminPermissions.WRITE);
    updatedUsers?.[0]?.permissions?.length?.should.be.equal(2);
    updatedUsers?.[1]?.permissions?.[1]?.should.be.equal(AdminPermissions.WRITE);
    updatedUsers?.[1]?.permissions?.length?.should.be.equal(2);
  });

  it('should update many documents with $pullAll mongo operator', async () => {
    const users = await usersService.insertMany<AdminType>([
      {
        fullName: 'Test 1',
        permissions: [AdminPermissions.EDIT, AdminPermissions.WRITE],
      },
      {
        fullName: 'Test 2',
        permissions: [AdminPermissions.EDIT, AdminPermissions.WRITE],
      },
    ]);

    const usersIds = users.map((u) => u._id);

    const updatedUsers = await usersService.updateMany<AdminType>(
      { _id: { $in: usersIds } }, 
      {
        $pullAll: {
          permissions: [AdminPermissions.WRITE, AdminPermissions.EDIT],
        },
      },
    );

    updatedUsers?.[0]?.permissions?.[0]?.should.be.undefined;
    updatedUsers?.[0].permissions?.[1]?.should.be.undefined;
    updatedUsers?.[0].permissions?.length?.should.be.equal(0);
    updatedUsers?.[1]?.permissions?.[0]?.should.be.undefined;
    updatedUsers?.[1].permissions?.[1]?.should.be.undefined;
    updatedUsers?.[1].permissions?.length?.should.be.equal(0);
  });

  it('should update document with $set mongo operator', async () => {
    const user = await usersService.insertOne({
      fullName: 'User to update',
    });

    const fullNameToUpdate = 'Updated fullname';

    const updatedUser = await usersService.updateOne(
      { _id: user._id }, 
      {
        $set: {
          fullName: fullNameToUpdate,
        },
      },
    );

    updatedUser?.fullName.should.be.equal(fullNameToUpdate);
  });

  it('should update document with $currentDate mongo operator', async () => {
    const nowDate = new Date();

    const user = await usersService.insertOne({
      fullName: 'Test',
      birthDate: new Date('2022-01-01'),
    });

    const updatedUser = await usersService.updateOne(
      { _id: user._id }, 
      {
        $currentDate: {
          birthDate: true,
        },
      },
    );

    updatedUser?.birthDate?.getDate().should.be.equal(nowDate.getDate());
    updatedUser?.birthDate?.getMonth().should.be.equal(nowDate.getMonth());
    updatedUser?.birthDate?.getFullYear().should.be.equal(nowDate.getFullYear());
  });

  it('should update document with $inc mongo operator', async () => {
    const userAge = 20;

    const user = await usersService.insertOne({
      fullName: 'Test',
      age: userAge,
    });

    const ageToUpdate = userAge + 1;

    const updatedUser = await usersService.updateOne(
      { _id: user._id }, 
      {
        $inc: {
          age: 1,
        },
      },
    );

    updatedUser?.age?.should.be.equal(ageToUpdate);
  });

  it('should update document with $min mongo operator', async () => {
    const userAge = 20;

    const user = await usersService.insertOne({
      fullName: 'Test',
      age: userAge,
    });

    const notUpdatedUser = await usersService.updateOne(
      { _id: user._id }, 
      {
        $min: {
          age: 21,
        },
      },
    );

    notUpdatedUser?.age?.should.be.equal(userAge);

    const minAgeToUpdate = 19;

    const updatedUser = await usersService.updateOne(
      { _id: user._id }, 
      {
        $min: {
          age: minAgeToUpdate,
        },
      },
    );

    updatedUser?.age?.should.be.equal(minAgeToUpdate);
  });

  it('should update document with $max mongo operator', async () => {
    const userAge = 20;

    const user = await usersService.insertOne({
      fullName: 'Test',
      age: userAge,
    });

    const notUpdatedUser = await usersService.updateOne(
      { _id: user._id }, 
      {
        $max: {
          age: 19,
        },
      },
    );

    notUpdatedUser?.age?.should.be.equal(userAge);

    const maxAgeToUpdate = 21;

    const updatedUser = await usersService.updateOne(
      { _id: user._id }, 
      {
        $max: {
          age: maxAgeToUpdate,
        },
      },
    );

    updatedUser?.age?.should.be.equal(maxAgeToUpdate);
  });

  it('should update document with $mul mongo operator', async () => {
    const userAge = 20;

    const user = await usersService.insertOne({
      fullName: 'Test',
      age: userAge,
    });

    const mulValue = 2;
    const updatedAge = userAge * mulValue;

    const updatedUser = await usersService.updateOne(
      { _id: user._id }, 
      {
        $mul: {
          age: mulValue,
        },
      },
    );

    updatedUser?.age?.should.be.equal(updatedAge);
  });

  it('should update document with $rename mongo operator', async () => {
    const userAge = 20;

    type InvalidUser = Omit<UserType, 'age'> & {
      'fakeAge'?: number
    };

    const userWithInvalidFields = await usersService.insertOne<InvalidUser>({
      fullName: 'Test',
      fakeAge: userAge,
    });

    const updatedUser = await usersService.updateOne<UserType>(
      { _id: userWithInvalidFields._id }, 
      {
        $rename: {
          'fakeAge': 'age',
        },
      },
    );

    updatedUser?.age?.should.be.equal(userAge);
  });

  it('should update document with $setOnInsert mongo operator', async () => {
    const user = await usersService.insertOne({
      fullName: 'Test',
    });

    const userAgeToUpdate = 20;
    const userFullNameToUpdate = 'Test Updated';

    const updatedUser = await usersService.updateOne<UserType>(
      { _id: user._id }, 
      {
        $set: {
          fullName: userFullNameToUpdate,
        },
        $setOnInsert: {
          age: userAgeToUpdate,
        },
      },
      {},
      { upsert: true },
    );

    updatedUser?.age?.should.be.equal(userAgeToUpdate);
    updatedUser?.fullName?.should.be.equal(userFullNameToUpdate);
  });

  it('should update document with $unset mongo operator', async () => {
    const user = await usersService.insertOne({
      fullName: 'Test',
      birthDate: new Date(),
    });

    const updatedUser = await usersService.updateOne<UserType>(
      { _id: user._id }, 
      {
        $unset: {
          birthDate: true,
        },
      },
    );

    updatedUser?.birthDate?.should.be.undefined;
  });

  it('should update document with $addToSet mongo operator', async () => {
    const user = await usersService.insertOne<AdminType>({
      fullName: 'Test',
      permissions: [AdminPermissions.EDIT],
    });

    const notUpdatedUser = await usersService.updateOne<AdminType>(
      { _id: user._id }, 
      {
        $addToSet: {
          permissions: AdminPermissions.EDIT,
        },
      },
    );

    notUpdatedUser?.permissions?.[0]?.should.be.equal(user.permissions?.[0]);
    notUpdatedUser?.permissions?.length?.should.be.equal(user.permissions?.length);

    const updatedUser = await usersService.updateOne<AdminType>(
      { _id: user._id }, 
      {
        $addToSet: {
          permissions: AdminPermissions.WRITE,
        },
      },
    );

    updatedUser?.permissions?.[1]?.should.be.equal(AdminPermissions.WRITE);
    updatedUser?.permissions?.length?.should.be.equal(2);
  });

  it('should update document with $pop mongo operator', async () => {
    const firstUser = await usersService.insertOne<AdminType>({
      fullName: 'Test',
      permissions: [AdminPermissions.EDIT, AdminPermissions.WRITE],
    });

    const secondUser = await usersService.insertOne<AdminType>({
      fullName: 'Test',
      permissions: [AdminPermissions.EDIT, AdminPermissions.WRITE],
    });

    const updatedFirstUser = await usersService.updateOne<AdminType>(
      { _id: firstUser._id }, 
      {
        $pop: {
          permissions: -1,
        },
      },
    );

    updatedFirstUser?.permissions?.[0]?.should.be.equal(AdminPermissions.WRITE);
    updatedFirstUser?.permissions?.length?.should.be.equal(1);

    const updatedSecondUser = await usersService.updateOne<AdminType>(
      { _id: secondUser._id }, 
      {
        $pop: {
          permissions: 1,
        },
      },
    );

    updatedSecondUser?.permissions?.[0]?.should.be.equal(AdminPermissions.EDIT);
    updatedSecondUser?.permissions?.length?.should.be.equal(1);
  });

  it('should update document with $pull mongo operator', async () => {
    const user = await usersService.insertOne<AdminType>({
      fullName: 'Test',
      permissions: [AdminPermissions.EDIT, AdminPermissions.WRITE],
    });

    const updatedUser = await usersService.updateOne<AdminType>(
      { _id: user._id }, 
      {
        $pull: {
          permissions: { $in: [AdminPermissions.EDIT] },
        },
      },
    );

    updatedUser?.permissions?.[0]?.should.be.equal(AdminPermissions.WRITE);
    updatedUser?.permissions?.length?.should.be.equal(1);
  });

  it('should update document with $push mongo operator', async () => {
    const user = await usersService.insertOne<AdminType>({
      fullName: 'Test',
      permissions: [AdminPermissions.EDIT],
    });

    const updatedUser = await usersService.updateOne<AdminType>(
      { _id: user._id }, 
      {
        $push: {
          permissions: AdminPermissions.WRITE,
        },
      },
    );

    updatedUser?.permissions?.[1]?.should.be.equal(AdminPermissions.WRITE);
    updatedUser?.permissions?.length?.should.be.equal(2);
  });

  it('should update document with $pullAll mongo operator', async () => {
    const user = await usersService.insertOne<AdminType>({
      fullName: 'Test',
      permissions: [AdminPermissions.EDIT, AdminPermissions.WRITE],
    });

    const updatedUser = await usersService.updateOne<AdminType>(
      { _id: user._id }, 
      {
        $pullAll: {
          permissions: [AdminPermissions.WRITE, AdminPermissions.EDIT],
        },
      },
    );

    updatedUser?.permissions?.[0]?.should.be.undefined;
    updatedUser?.permissions?.[1]?.should.be.undefined;
    updatedUser?.permissions?.length?.should.be.equal(0);
  });
});
