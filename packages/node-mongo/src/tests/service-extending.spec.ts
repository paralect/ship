/* eslint-disable @typescript-eslint/no-unused-expressions */
import { z } from 'zod';
import chai from 'chai';
import spies from 'chai-spies';
import 'mocha';

import {
  Database, eventBus, Service, ServiceOptions,
} from '../index';
import { IDocument } from '../types';
import config from '../config';

chai.use(spies);
chai.should();

const database = new Database(config.mongo.connection, config.mongo.dbName);

class CustomService<T extends IDocument> extends Service<T> {
  createOrUpdate = async (query: any, updateCallback: (item?: T) => Partial<T>) => {
    const docExists = await this.exists(query);

    if (!docExists) {
      const newDoc = updateCallback();
      return this.insertOne(newDoc);
    }

    return this.updateOne(query, (doc) => updateCallback(doc));
  };
}

function createService<T extends IDocument>(collectionName: string, options: ServiceOptions = {}) {
  return new CustomService<T>(collectionName, database, options);
}

const schema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  fullName: z.string(),
});

type UserType = z.infer<typeof schema>;

const usersService = createService<UserType>('users', {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

describe('extending service.ts', () => {
  before(async () => {
    await database.connect();
  });
  after(async () => {
    await usersService.drop();
    await database.close();
  });
  it('should create document and publish users.created event', async () => {
    const spy = chai.spy();
    eventBus.on('users.created', spy);

    await usersService.createOrUpdate(
      { _id: 'some-id' },
      () => ({ fullName: 'Max' }),
    );

    spy.should.have.been.called.at.least(1);
  });

  it('should update document and publish users.updated event', async () => {
    const user = await usersService.insertOne({
      fullName: 'Max',
    });

    const spy = chai.spy();
    eventBus.on('users.updated', spy);

    await usersService.createOrUpdate(
      { _id: user._id },
      () => ({ fullName: 'updated fullname' }),
    );

    spy.should.have.been.called.at.least(1);
  });
});
