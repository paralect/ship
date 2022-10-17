import Joi from 'joi';
import { z } from 'zod';

import { Database } from '../index';
import config from '../config';

const database = new Database(config.mongo.connection, config.mongo.dbName);

type JoiUserType = {
  _id: string;
  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
  fullName: string;
};

const joiSchema = Joi.object({
  _id: Joi.string().required(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date().allow(null),
  fullName: Joi.string().required(),
});

const zodSchema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  fullName: z.string(),
});

type ZodUserType = z.infer<typeof zodSchema>;

const joiUsersService = database.createService<JoiUserType>('users-joi-schema-validation', {
  schemaValidator: (obj) => joiSchema.validateAsync(obj),
});

const zodUsersService = database.createService<ZodUserType>('users-zod-schema-validation', {
  schemaValidator: (obj) => zodSchema.parseAsync(obj),
});

describe('schema-validation.spec.ts', () => {
  before(async () => {
    await database.connect();
  });
  after(async () => {
    await joiUsersService.drop();
    await zodUsersService.drop();
    await database.close();
  });

  it('should validate Joi schema', async () => {
    try {
      await joiUsersService.insertOne({ firstName: 'fake', fullName: 'something' } as any);
    } catch (err) {
      const expectedErrorMesage = '"firstName" is not allowed';

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      err.message.should.be.equal(expectedErrorMesage);
    }
  });

  it('should validate Zod schema', async () => {
    try {
      await joiUsersService.insertOne({ firstName: 'fake', fullName: 'something' } as any);
    } catch (err) {
      const expectedErrorMesage = '"firstName" is not allowed';

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      err.message.should.be.equal(expectedErrorMesage);
    }
  });
});
