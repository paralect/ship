import { Database } from '@paralect/node-mongo';

// import config from 'config';

import { DATABASE_DOCUMENTS } from 'app.constants';

import { User, userSchema } from 'resources/user';

const database = new Database(process.env.MONGO_URL as string);

// jest.useFakeTimers({ legacyFakeTimers: true });
// jest.setTimeout(60000);
// jest.useRealTimers();

const userService = database.createService<User>(DATABASE_DOCUMENTS.USERS, {
  schemaValidator: (obj) => userSchema.parseAsync(obj),
});

describe('User service', () => {
  beforeAll(async () => {
    // console.log(process.env.mongoUri);
    // console.log(process.env.MONGO_URI);
    console.log(process.env.MONGO_URL);
    // console.log(process.env);
    // console.log(process.config);
    // console.log(process.argv);

    // console.log(config.mongo.connection, config.mongo.dbName);
    await database.connect();
    // console.log(config.apiUrl);
    // console.log(database.);
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
    // expect(true).toEqual(true);
  });

  it('should create user with correct fields', async () => {
    // expect(true).toEqual(true);
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

    expect({
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      fullName: mockUser.fullName,
      email: mockUser.email,
      isEmailVerified: mockUser.isEmailVerified,
    }).toEqual({
      firstName: insertedUser?.firstName,
      lastName: insertedUser?.lastName,
      fullName: insertedUser?.fullName,
      email: insertedUser?.email,
      isEmailVerified: insertedUser?.isEmailVerified,
    });
  });

  afterAll(async () => {
    await database.close();
  });
});
