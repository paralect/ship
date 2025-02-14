import { database } from 'database';

describe('User service', () => {
  beforeAll(async () => {
    await database.$connect();
  });

  beforeEach(async () => {
    await database.user.deleteMany({});
  });

  it('should create user', async () => {
    const mockUser = {
      id: 123,
      firstName: 'John',
      lastName: 'Smith',
      fullName: 'John Smith',
      email: 'smith@example.com',
      isEmailVerified: false,
    };

    await database.user.create({
      data: mockUser,
    });

    const insertedUser = await database.user.findUnique({
      where: { id: mockUser.id },
    });

    expect(insertedUser).not.toBeNull();
  });

  afterAll(async () => {
    await database.$disconnect();
  });
});
