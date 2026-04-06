/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from 'zod';
import chai from 'chai';
import spies from 'chai-spies';

import { Database } from '../index';
import PopulateUtil from '../utils/populate';
import { PopulateOptions } from '../types';

import 'mocha';

import config from '../config';

chai.use(spies);
chai.should();
const { expect } = chai;

const database = new Database(config.mongo.connection, config.mongo.dbName);

const userSchema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  fullName: z.string(),
  role: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  subscriptionId: z.string().optional(),
});

const postSchema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  title: z.string(),
  content: z.string(),
  authorId: z.string().optional(),
  authorIds: z.array(z.string()).optional(), // Array of author IDs
  authorRefs: z.array(z.object({
    _id: z.string(),
    role: z.string().optional(),
  })).optional(), // Array of author objects with _id field
  authorObj: z.object({
    _id: z.string(),
    role: z.string().optional(),
  }).passthrough().optional(), // Single author object with _id field, allow additional properties
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

type UserType = z.infer<typeof userSchema>;
type PostType = z.infer<typeof postSchema>;
type CategoryType = z.infer<typeof categorySchema>;

const usersService = database.createService<UserType>('users', {
  schemaValidator: (obj) => userSchema.parseAsync(obj),
});

const postsService = database.createService<PostType>('posts', {
  schemaValidator: (obj) => postSchema.parseAsync(obj),
});

const categoriesService = database.createService<CategoryType>('categories', {
  schemaValidator: (obj) => categorySchema.parseAsync(obj),
});

describe('populate.spec.ts', () => {
  before(async () => {
    await database.connect();
  });
  
  after(async () => {
    await usersService.drop();
    await postsService.drop();
    await categoriesService.drop();
    await database.close();
  });

  describe('PopulateUtil', () => {
    describe('buildPipeline', () => {
      it('should build pipeline for simple field populate', () => {
        const filter = { _id: 'test' };
        const populateOptions: PopulateOptions = {
          localField: 'authorId',
          foreignField: '_id',
          collection: 'users',
          fieldName: 'author',
        };

        const pipeline = PopulateUtil.buildPipeline(filter, populateOptions);

        expect(pipeline).to.deep.equal([
          { $match: { _id: 'test' } },
          {
            $lookup: {
              from: 'users',
              localField: 'authorId',
              foreignField: '_id',
              as: 'author',
            },
          },
          {
            $addFields: {
              author: {
                $arrayElemAt: ['$author', 0],
              },
            },
          },
        ]);
      });

      it('should build pipeline for array of IDs populate', () => {
        const filter = { _id: 'test' };
        const populateOptions: PopulateOptions = {
          localField: {
            name: 'authorIds',
            isArray: true,
          },
          foreignField: '_id',
          collection: 'users',
          fieldName: 'authors',
        };

        const pipeline = PopulateUtil.buildPipeline(filter, populateOptions);

        expect(pipeline).to.deep.equal([
          { $match: { _id: 'test' } },
          {
            $lookup: {
              from: 'users',
              localField: 'authorIds',
              foreignField: '_id',
              as: 'authors',
            },
          },
        ]);
      });

      it('should build pipeline for array of objects populate', () => {
        const filter = { _id: 'test' };
        const populateOptions: PopulateOptions = {
          localField: {
            name: 'authorRefs',
            isArray: true,
            path: '_id',
          },
          foreignField: '_id',
          collection: 'users',
          fieldName: 'authors',
        };

        const pipeline = PopulateUtil.buildPipeline(filter, populateOptions);

        expect(pipeline).to.deep.equal([
          { $match: { _id: 'test' } },
          {
            $addFields: {
              authorRefs_extracted: {
                $map: {
                  input: '$authorRefs',
                  as: 'item',
                  in: '$$item._id',
                },
              },
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'authorRefs_extracted',
              foreignField: '_id',
              as: 'authors_lookup',
            },
          },
          {
            $addFields: {
              authors: {
                $map: {
                  input: '$authorRefs',
                  as: 'originalItem',
                  in: {
                    $mergeObjects: [
                      '$$originalItem',
                      {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$authors_lookup',
                              as: 'lookupItem',
                              cond: { $eq: ['$$lookupItem._id', '$$originalItem._id'] },
                            },
                          },
                          0,
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
          {
            $unset: ['authorRefs_extracted', 'authors_lookup'],
          },
        ]);
      });

      it('should build pipeline for nested object populate', () => {
        const filter = { _id: 'test' };
        const populateOptions: PopulateOptions = {
          localField: {
            name: 'authorObj',
            path: '_id',
          },
          foreignField: '_id',
          collection: 'users',
          fieldName: 'author',
        };

        const pipeline = PopulateUtil.buildPipeline(filter, populateOptions);

        expect(pipeline).to.deep.equal([
          { $match: { _id: 'test' } },
          {
            $addFields: {
              authorObj_extracted: '$authorObj._id',
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'authorObj_extracted',
              foreignField: '_id',
              as: 'author_lookup',
            },
          },
          {
            $addFields: {
              author: {
                $mergeObjects: [
                  '$authorObj',
                  {
                    $arrayElemAt: ['$author_lookup', 0],
                  },
                ],
              },
            },
          },
          {
            $unset: ['authorObj_extracted', 'author_lookup'],
          },
        ]);
      });

      it('should build pipeline for multiple populate options', () => {
        const filter = { _id: 'test' };
        const populateOptions: PopulateOptions[] = [
          {
            localField: 'authorId',
            foreignField: '_id',
            collection: 'users',
            fieldName: 'author',
          },
          {
            localField: {
              name: 'authorIds',
              isArray: true,
            },
            foreignField: '_id',
            collection: 'users',
            fieldName: 'authors',
          },
        ];

        const pipeline = PopulateUtil.buildPipeline(filter, populateOptions);

        expect(pipeline).to.deep.equal([
          { $match: { _id: 'test' } },
          {
            $lookup: {
              from: 'users',
              localField: 'authorId',
              foreignField: '_id',
              as: 'author',
            },
          },
          {
            $addFields: {
              author: {
                $arrayElemAt: ['$author', 0],
              },
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'authorIds',
              foreignField: '_id',
              as: 'authors',
            },
          },
        ]);
      });

      it('should throw error for invalid populate options', () => {
        const filter = { _id: 'test' };
        const populateOptions: PopulateOptions = {
          localField: 'authorId',
          // Missing required fields
        } as PopulateOptions;

        expect(() => PopulateUtil.buildPipeline(filter, populateOptions)).to.throw(
          'Invalid populate option at index 0: missing required fields (collection, fieldName, or localField)',
        );
      });

      it('should handle single populate option as array', () => {
        const filter = { _id: 'test' };
        const populateOptions: PopulateOptions = {
          localField: 'authorId',
          foreignField: '_id',
          collection: 'users',
          fieldName: 'author',
        };

        const pipeline = PopulateUtil.buildPipeline(filter, populateOptions);

        expect(pipeline).to.have.length(3);
        expect(pipeline[0]).to.deep.equal({ $match: { _id: 'test' } });
      });
    });
  });

  describe('Service Populate Integration Tests', () => {
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
      populatedPost?.author?.fullName.should.equal('John Doe');
      populatedPost?.author?._id.should.equal(user._id);
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

      const populatedPost = await postsService.findOne<PostType, { author: UserType, editor: UserType }>(
        { _id: post._id },
        {
          populate: [{
            localField: 'authorId',
            foreignField: '_id',
            collection: 'users',
            fieldName: 'author',
          }, {
            localField: 'editorId',
            foreignField: '_id',
            collection: 'users',
            fieldName: 'editor',
          }],
        },
      );

      populatedPost?.should.exist;
      populatedPost?.author.should.exist;
      populatedPost?.editor.should.exist;
      populatedPost?.author.fullName.should.equal('John Doe');
      populatedPost?.editor.fullName.should.equal('Jane Doe');
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

      const { results: populatedPosts } = await postsService.find<PostType, { author: UserType, editor: UserType }>(
        { _id: { $in: [post1._id, post2._id] } },
        {
          populate: [{
            localField: 'authorId',
            foreignField: '_id',
            collection: 'users',
            fieldName: 'author',
          }, {
            localField: 'editorId',
            foreignField: '_id',
            collection: 'users',
            fieldName: 'editor',
          }],
        },
      );

      populatedPosts?.should.have.length(2);
      populatedPosts?.[0]?.author.should.exist;
      populatedPosts?.[0]?.editor.should.exist;
      populatedPosts?.[1]?.author.should.exist;
      populatedPosts?.[1]?.editor.should.exist;
    });

    it('should populate array field with multiple authors', async () => {
      const author1 = await usersService.insertOne({
        fullName: 'John Doe',
      });

      const author2 = await usersService.insertOne({
        fullName: 'Jane Smith',
      });

      const author3 = await usersService.insertOne({
        fullName: 'Bob Johnson',
      });

      const post = await postsService.insertOne({
        title: 'Multi-Author Post',
        content: 'This post has multiple authors',
        authorId: author1._id, // Single author (existing field)
        authorIds: [author1._id, author2._id, author3._id], // Array of author IDs
      });

      const populatedPost = await postsService.findOne<PostType, { authors: UserType[] }>(
        { _id: post._id },
        {
          populate: {
            localField: {
              name: 'authorIds',
              isArray: true, // This tells the service that authorIds is an array field
            },
            foreignField: '_id',
            collection: 'users',
            fieldName: 'authors',
          },
        },
      );

      populatedPost?.should.exist;
      populatedPost?.authors.should.have.length(3);
      populatedPost?.authors[0].fullName.should.equal('John Doe');
      populatedPost?.authors[1].fullName.should.equal('Jane Smith');
      populatedPost?.authors[2].fullName.should.equal('Bob Johnson');
    });

    it('should populate array field for multiple posts', async () => {
      const author1 = await usersService.insertOne({
        fullName: 'Author 1',
      });

      const author2 = await usersService.insertOne({
        fullName: 'Author 2',
      });

      const author3 = await usersService.insertOne({
        fullName: 'Author 3',
      });

      const post1 = await postsService.insertOne({
        title: 'Post 1',
        content: 'First post with multiple authors',
        authorIds: [author1._id, author2._id],
      });

      const post2 = await postsService.insertOne({
        title: 'Post 2',
        content: 'Second post with multiple authors',
        authorIds: [author2._id, author3._id],
      });

      const { results: populatedPosts } = await postsService.find<PostType, { authors: UserType[] }>(
        { _id: { $in: [post1._id, post2._id] } },
        {
          populate: {
            localField: {
              name: 'authorIds',
              isArray: true,
            },
            foreignField: '_id',
            collection: 'users',
            fieldName: 'authors',
          },
        },
      );

      populatedPosts?.should.have.length(2);
      populatedPosts?.[0]?.authors.should.have.length(2);
      populatedPosts?.[1]?.authors.should.have.length(2);
      populatedPosts?.[0]?.authors[0].fullName.should.equal('Author 1');
      populatedPosts?.[0]?.authors[1].fullName.should.equal('Author 2');
      populatedPosts?.[1]?.authors[0].fullName.should.equal('Author 2');
      populatedPosts?.[1]?.authors[1].fullName.should.equal('Author 3');
    });

    it('should populate array of objects using path parameter', async () => {
      const author1 = await usersService.insertOne({
        fullName: 'John Doe',
      });
      const author2 = await usersService.insertOne({
        fullName: 'Jane Smith',
      });
      const author3 = await usersService.insertOne({
        fullName: 'Bob Johnson',
      });
      const post = await postsService.insertOne({
        title: 'Post with Author References',
        content: 'This post has author references with roles',
        authorRefs: [
          { _id: author1._id, role: 'primary' },
          { _id: author2._id, role: 'secondary' },
          { _id: author3._id, role: 'reviewer' },
        ],
      });
      const populatedPost = await postsService.findOne<PostType, { authors: UserType[] }>(
        { _id: post._id },
        {
          populate: {
            localField: {
              name: 'authorRefs',
              isArray: true,
              path: '_id',
            },
            foreignField: '_id',
            collection: 'users',
            fieldName: 'authors',
          },
        },
      );
      populatedPost?.should.exist;
      populatedPost?.authors.should.have.length(3);
      populatedPost?.authors[0].fullName.should.equal('John Doe');
      populatedPost?.authors[1].fullName.should.equal('Jane Smith');
      populatedPost?.authors[2].fullName.should.equal('Bob Johnson');
    });

    it('should populate array of objects for multiple posts', async () => {
      const author1 = await usersService.insertOne({ fullName: 'Author 1' });
      const author2 = await usersService.insertOne({ fullName: 'Author 2' });
      const author3 = await usersService.insertOne({ fullName: 'Author 3' });
      const post1 = await postsService.insertOne({
        title: 'Post 1 with Refs',
        content: 'First post with author references',
        authorRefs: [
          { _id: author1._id, role: 'writer' },
          { _id: author2._id, role: 'editor' },
        ],
      });
      const post2 = await postsService.insertOne({
        title: 'Post 2 with Refs',
        content: 'Second post with author references',
        authorRefs: [
          { _id: author2._id, role: 'writer' },
          { _id: author3._id, role: 'reviewer' },
        ],
      });
      const { results: populatedPosts } = await postsService.find<PostType, { authors: UserType[] }>(
        { _id: { $in: [post1._id, post2._id] } },
        {
          populate: {
            localField: {
              name: 'authorRefs',
              isArray: true,
              path: '_id',
            },
            foreignField: '_id',
            collection: 'users',
            fieldName: 'authors',
          },
        },
      );
      populatedPosts?.should.have.length(2);
      populatedPosts?.[0]?.authors.should.have.length(2);
      populatedPosts?.[1]?.authors.should.have.length(2);
      populatedPosts?.[0]?.authors[0].fullName.should.equal('Author 1');
      populatedPosts?.[0]?.authors[1].fullName.should.equal('Author 2');
      populatedPosts?.[1]?.authors[0].fullName.should.equal('Author 2');
      populatedPosts?.[1]?.authors[1].fullName.should.equal('Author 3');
    });

    it('should handle path only (single object with nested _id)', async () => {
      const author = await usersService.insertOne({ fullName: 'Nested Author' });
      const post = await postsService.insertOne({
        title: 'Post with nested author',
        content: 'This post has a nested author object',
        authorObj: { _id: author._id, role: 'main' },
      });
      const populatedPost = await postsService.findOne<PostType, { author: UserType }>(
        { _id: post._id },
        {
          populate: {
            localField: { name: 'authorObj', path: '_id' },
            foreignField: '_id',
            collection: 'users',
            fieldName: 'author',
          },
        },
      );
      populatedPost?.should.exist;
      populatedPost?.author.should.exist;
      populatedPost?.author.fullName.should.equal('Nested Author');
    });

    it('should merge nested object properties with populated data', async () => {
      const author = await usersService.insertOne({ fullName: 'Merged Author' });
      const post = await postsService.insertOne({
        title: 'Post with merged author object',
        content: 'This post has a nested author object with additional properties',
        authorObj: { 
          _id: author._id, 
          role: 'primary',
          customField: 'custom value',
        },
      });
      
      const populatedPost = await postsService.findOne<PostType, { author: UserType & { role?: string; customField?: string } }>(
        { _id: post._id },
        {
          populate: {
            localField: { name: 'authorObj', path: '_id' },
            foreignField: '_id',
            collection: 'users',
            fieldName: 'author',
          },
        },
      );
      
      populatedPost?.should.exist;
      populatedPost?.author.should.exist;
      
      // Check that populated data is present
      populatedPost?.author.fullName.should.equal('Merged Author');
      
      // Check that original object properties are preserved
      populatedPost?.author.role?.should.equal('primary');
      populatedPost?.author.customField?.should.equal('custom value');
      
      // Verify the object has both populated and original properties
      populatedPost?.author.should.have.property('_id', author._id);
      populatedPost?.author.should.have.property('fullName', 'Merged Author');
      populatedPost?.author.should.have.property('role', 'primary');
      populatedPost?.author.should.have.property('customField', 'custom value');
    });

    it('should handle different path field names', async () => {
      const author1 = await usersService.insertOne({
        fullName: 'John Doe',
      });

      const author2 = await usersService.insertOne({
        fullName: 'Jane Smith',
      });

      const post = await postsService.insertOne({
        title: 'Post with Custom Path',
        content: 'This post uses a different field name',
        authorRefs: [
          { _id: author1._id, role: 'primary' },
          { _id: author2._id, role: 'secondary' },
        ],
      });

      // Test with 'id' path
      const populatedPost1 = await postsService.findOne<PostType, { authors: UserType[] }>(
        { _id: post._id },
        {
          populate: {
            localField: {
              name: 'authorRefs',
              isArray: true,
              path: 'id',
            },
            foreignField: '_id',
            collection: 'users',
            fieldName: 'authors',
          },
        },
      );

      populatedPost1?.should.exist;
      populatedPost1?.authors.should.have.length(2);

      // Test with 'userId' path (should work if we had such a field)
      const populatedPost2 = await postsService.findOne<PostType, { authors: UserType[] }>(
        { _id: post._id },
        {
          populate: {
            localField: {
              name: 'authorRefs',
              isArray: true,
              path: '_id',
            },
            foreignField: '_id',
            collection: 'users',
            fieldName: 'authors',
          },
        },
      );

      populatedPost2?.should.exist;
      populatedPost2?.authors.should.have.length(2);
    });
  });
}); 
