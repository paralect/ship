/* eslint-disable @typescript-eslint/no-unused-expressions */
import Joi from 'joi';
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

type UserType = {
  _id: string;
  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
  fullName: string;
};

const schema = Joi.object({
  _id: Joi.string().required(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date().allow(null),
  fullName: Joi.string().required(),
});

const usersService = createService<UserType>('users', { schema });

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
