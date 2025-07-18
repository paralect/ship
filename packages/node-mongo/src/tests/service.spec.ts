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
const { assert, expect } = chai;

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
  role: z.nativeEnum(UserRoles).default(UserRoles.MEMBER),
  permissions: z.array(z.nativeEnum(AdminPermissions)).optional(),
  subscriptionId: z.string().optional(),
});

const postSchema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  categoryId: z.string().optional(),
  editorId: z.string().optional(),
});

const categorySchema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  name: z.string(),
});

type UserType = Omit<z.infer<typeof userSchema>, 'permissions'>;
type AdminType = Omit<z.infer<typeof userSchema>, 'subscriptionId'>;
type CompanyType = z.infer<typeof companySchema>;
type PostType = z.infer<typeof postSchema>;
type CategoryType = z.infer<typeof categorySchema>;

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

const postsService = database.createService<PostType>('posts', {
  schemaValidator: (obj) => postSchema.parseAsync(obj),
});

const categoriesService = database.createService<CategoryType>('categories', {
  schemaValidator: (obj) => categorySchema.parseAsync(obj),
});

describe('service.ts', () => {
  before(async () => {
    await database.connect();
  });
  after(async () => {
    await usersService.drop();
    await usersServiceEscapeRegExp.drop();
    await postsService.drop();
    await companyService.drop();
    await categoriesService.drop();
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
      () => ({
        subscriptionId: 'fakeId',
      }),
    );

    // should throw ts error because member doesn't have permissions field
    await usersService.updateOne<UserType>(
      { _id: createdMember._id },
      //@ts-expect-error
      () => ({
        permissions: [AdminPermissions.WRITE],
      }),
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
      () => ({
        subscriptionId: 'fakeId',
      }),
    );

    // should throw ts error because member doesn't have permissions field
    await usersService.updateMany<UserType>(
      { _id: createdMember._id },
      //@ts-expect-error
      () => ({
        permissions: [AdminPermissions.WRITE],
      }),
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

  it('should populate single field', async () => {
    const user = await usersService.insertOne({
      fullName: 'John Doe',
    });

    const post = await postsService.insertOne({
      title: 'Test Post',
      content: 'This is a test post',
      authorId: user._id,
    });

    const populatedPost = await postsService.findOne<PostType, { author: UserType }>(
      { _id: post._id },
      {
        populate: {
          localField: 'authorId',
          foreignField: '_id',
          collection: 'users',
          fieldName: 'author',
        },
      },
    );

    populatedPost?.should.exist;
    populatedPost?.author.should.exist;
    populatedPost?.author.fullName.should.equal('John Doe');
  });

  it('should populate multiple posts', async () => {
    const user1 = await usersService.insertOne({
      fullName: 'Jane Smith',
    });

    const user2 = await usersService.insertOne({
      fullName: 'Bob Johnson',
    });

    await postsService.insertOne({
      title: 'Test Post 1',
      content: 'First post',
      authorId: user1._id,
    });

    await postsService.insertOne({
      title: 'Test Post 2',
      content: 'Second post',
      authorId: user2._id,
    });

    const { results: populatedPosts } = await postsService.find<PostType, { author: UserType }>(
      { authorId: { $in: [user1._id, user2._id] } },
      {
        populate: {
          localField: 'authorId',
          foreignField: '_id',
          collection: 'users',
          fieldName: 'author',
        },
      },
    );

    populatedPosts?.should.have.length(2);
    populatedPosts?.[0]?.author.should.exist;
    populatedPosts?.[1]?.author.should.exist;
    populatedPosts?.[0]?.author.fullName.should.exist;
    populatedPosts?.[1]?.author.fullName.should.exist;
  });

  it('should handle populate with foreign field other than _id', async () => {
    const user = await usersService.insertOne({
      fullName: 'Custom Field User',
    });

    // Insert a post with fullName reference instead of _id
    const post = await postsService.insertOne({
      title: 'Custom Field Post',
      content: 'This post references user by email',
      authorId: user.fullName, // Using fullName as reference
    });

    // Find post with populated author using email as foreign field
    const populatedPost = await postsService.findOne<PostType, { author: UserType }>(
      { _id: post._id },
      {
        populate: {
          localField: 'authorId',
          foreignField: 'fullName',
          collection: 'users',
          fieldName: 'author',
        },
      },
    );

    populatedPost?.should.exist;
    populatedPost?.author.should.exist;
    populatedPost?.author.fullName.should.equal('Custom Field User');
  });

  it('should provide type-safe populate with minimal changes', async () => {
    const user = await usersService.insertOne({
      fullName: 'John Doe',
    });

    const post = await postsService.insertOne({
      title: 'Test Post',
      content: 'This is a test post',
      authorId: user._id,
    });

    const populatedPost = await postsService.findOne<PostType, { author: UserType }>(
      { _id: post._id },
      {
        populate: {
          localField: 'authorId',
          foreignField: '_id',
          collection: 'users',
          fieldName: 'author',
        },
      },
    );

    populatedPost?.should.exist;
    populatedPost?.title.should.equal('Test Post');

    if (populatedPost?.author) {
      populatedPost.author.fullName.should.equal('John Doe');
      populatedPost.author._id.should.equal(user._id);
    }
  });

  it('should handle populate with no matching documents', async () => {
    // Insert a post with non-existent author reference
    const post = await postsService.insertOne({
      title: 'Orphan Post',
      content: 'This post has no author',
      authorId: 'non-existent-id',
    });

    // Find post with populated author (should not have author field)
    const populatedPost = await postsService.findOne<PostType, { author: UserType }>(
      { _id: post._id },
      {
        populate: {
          localField: 'authorId',
          foreignField: '_id',
          collection: 'users',
          fieldName: 'author',
        },
      },
    );

    populatedPost?.should.exist;
    populatedPost?.title.should.equal('Orphan Post');
    expect(populatedPost?.author).to.be.undefined;
  });

  it('should handle populate with multiple documents for findOne', async () => {
    const user = await usersService.insertOne({
      fullName: 'John Doe',
    });

    const category = await categoriesService.insertOne({
      name: 'Test Category',
    });

    const post = await postsService.insertOne({
      title: 'Test Post',
      content: 'This is a test post',
      authorId: user._id,
      categoryId: category._id,
    });

    const populatedPost = await postsService.findOne<PostType, { author: UserType, category: CategoryType }>(
      { _id: post._id },
      {
        populate: [{
          localField: 'authorId',
          foreignField: '_id',
          collection: 'users',
          fieldName: 'author',
        }, {
          localField: 'categoryId',
          foreignField: '_id',
          collection: 'categories',
          fieldName: 'category',
        }],
      },
    );

    populatedPost?.should.exist;
    populatedPost?.author.should.exist;
    populatedPost?.category.should.exist;
    populatedPost?.author.fullName.should.equal('John Doe');
    populatedPost?.category.name.should.equal('Test Category');
  });

  it('should handle populate with multiple documents for find', async () => {
    const user1 = await usersService.insertOne({
      fullName: 'Mark Doe',
    });

    const user2 = await usersService.insertOne({
      fullName: 'Jimmy Doe',
    });

    const category1 = await categoriesService.insertOne({
      name: 'Category 1',
    });

    const category2 = await categoriesService.insertOne({
      name: 'Category 2',
    });

    const post1 = await postsService.insertOne({
      title: 'Post 1',
      content: 'This is a test post',
      authorId: user1._id,
      categoryId: category1._id,
    });

    const post2 = await postsService.insertOne({
      title: 'Post 2',
      content: 'This is a test post',
      authorId: user2._id,
      categoryId: category2._id,
    });

    const { results: populatedPosts } = await postsService.find<PostType, { author: UserType, category: CategoryType }>(
      { _id: { $in: [post1._id, post2._id] } },
      {
        populate: [{
          localField: 'authorId',
          foreignField: '_id',
          collection: 'users',
          fieldName: 'author',
        }, {
          localField: 'categoryId',
          foreignField: '_id',
          collection: 'categories',
          fieldName: 'category',
        }],
      },
    );

    populatedPosts?.should.have.length(2);
    populatedPosts?.[0]?.author.should.exist;
    populatedPosts?.[1]?.author.should.exist;
    populatedPosts?.[0]?.category.should.exist;
    populatedPosts?.[1]?.category.should.exist;
  });

  it('should handle populate with multiple local fields', async () => {
    const author = await usersService.insertOne({
      fullName: 'John Doe',
    });

    const editor = await usersService.insertOne({
      fullName: 'Jane Doe',
    });

    const post = await postsService.insertOne({
      title: 'Test Post',
      content: 'This is a test post',
      authorId: author._id,
      editorId: editor._id,
    });

    const populatedPost = await postsService.findOne<PostType, { authorsAndEditors: UserType[] }>(
      { _id: post._id },
      {
        populate: {
          localField: ['authorId', 'editorId'],
          foreignField: '_id',
          collection: 'users',
          fieldName: 'authorsAndEditors',
        },
      },
    );

    populatedPost?.should.exist;
    populatedPost?.authorsAndEditors.should.have.length(2);
    populatedPost?.authorsAndEditors[0].should.exist;
    populatedPost?.authorsAndEditors[1].should.exist;
  });

  it('should handle populate with multiple local fields for find', async () => {
    const author1 = await usersService.insertOne({
      fullName: 'John Doe',
    });

    const editor1 = await usersService.insertOne({
      fullName: 'Jane Doe',
    });

    const author2 = await usersService.insertOne({
      fullName: 'John Doe 2',
    });

    const editor2 = await usersService.insertOne({
      fullName: 'Jane Doe 2',
    });

    const post1 = await postsService.insertOne({
      title: 'Test Post 1',
      content: 'This is a test post 1',
      authorId: author1._id,
      editorId: editor1._id,
    });

    const post2 = await postsService.insertOne({
      title: 'Test Post 2',
      content: 'This is a test post 2',
      authorId: author2._id,
      editorId: editor2._id,
    });

    const { results: populatedPosts } = await postsService.find<PostType, { authorsAndEditors: UserType[] }>(
      { _id: { $in: [post1._id, post2._id] } },
      {
        populate: {
          localField: ['authorId', 'editorId'],
          foreignField: '_id',
          collection: 'users',
          fieldName: 'authorsAndEditors',
        },
      },
    );

    populatedPosts?.should.have.length(2);
    populatedPosts?.[0]?.authorsAndEditors.should.have.length(2);
    populatedPosts?.[1]?.authorsAndEditors.should.have.length(2);
    populatedPosts?.[0]?.authorsAndEditors[0].should.exist;
    populatedPosts?.[0]?.authorsAndEditors[1].should.exist;
    populatedPosts?.[1]?.authorsAndEditors[0].should.exist;
    populatedPosts?.[1]?.authorsAndEditors[1].should.exist;
  });
});
