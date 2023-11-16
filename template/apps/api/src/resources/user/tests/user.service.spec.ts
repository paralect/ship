import { Database } from '@paralect/node-mongo';

import { User } from 'types';
import { userSchema } from 'schemas';
import { DATABASE_DOCUMENTS } from 'app-constants';

const database = new Database(process.env.MONGO_URL as string);

const userService = database.createService<User>(DATABASE_DOCUMENTS.USERS, {
  schemaValidator: (obj) => userSchema.parseAsync(obj),
});

describe('User service', () => {
  beforeAll(async () => {
    await database.connect();
  });

  beforeEach(async () => {
    await userService.deleteMany({});
  });

  it('should create user', async () => {
    const mockUser = {
      _id: '123asdqwer',
      firstName: 'John',
      lastName: 'Smith',
      fullName: 'John Smith',
      email: 'smith@example.com',
      isEmailVerified: false,
    };

    await userService.insertOne(mockUser);

    const insertedUser = await userService.findOne({ _id: mockUser._id });

    expect(insertedUser).not.toBeNull();
  });

  afterAll(async () => {
    await database.close();
  });
});
