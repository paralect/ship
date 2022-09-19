/* eslint-disable @typescript-eslint/no-unused-expressions */
import chai from 'chai';
import Joi from 'joi';
import spies from 'chai-spies';

import { Database, eventBus } from '../index';

import 'mocha';

import config from '../config';

chai.use(spies);
chai.should();

const database = new Database(config.mongo.connection, config.mongo.dbName);

type UserType = {
  _id: string;
  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
  fullName: string;
  firstName: string;
  lastName: string;
};

const schema = Joi.object({
  _id: Joi.string().required(),
  createdOn: Joi.date(),
  updatedOn: Joi.date(),
  deletedOn: Joi.date().allow(null),
  firstName: Joi.string(),
  lastName: Joi.string(),
  fullName: Joi.string().required(),
});

const usersService = database.createService<UserType>('users', { schema });

describe('events/in-memory.ts', () => {
  before(async () => {
    await database.connect();
  });
  after(async () => {
    await usersService.drop();
    await database.close();
  });

  describe('In memory event bus', () => {
    it('should publish users.created event on create', async () => {
      const spy = chai.spy();
      eventBus.on('users.created', spy);

      await usersService.insertOne({
        fullName: 'John',
      });

      spy.should.have.been.called.at.least(1);
    });

    it('should publish users.created events on create', async () => {
      const spy = chai.spy();
      eventBus.on('users.created', spy);

      await usersService.insertMany([
        { fullName: 'John' },
        { fullName: 'Kobe' },
      ]);

      spy.should.have.been.called.at.least(2);
    });

    it('should publish users.updated event on update', async () => {
      const spy = chai.spy();
      eventBus.on('users.updated', spy);

      const user = await usersService.insertOne({
        fullName: 'John',
      });

      await usersService.updateOne({ _id: user._id }, () => ({ fullName: 'updated fullname' }));

      spy.should.have.been.called.at.least(1);
    });

    it('should publish users.updated events on update', async () => {
      const spy = chai.spy();
      eventBus.on('users.updated', spy);

      const users = await usersService.insertMany([
        { fullName: 'John' },
        { fullName: 'Kobe' },
      ]);

      const usersIds = users.map((u) => u._id);

      await usersService.updateMany(
        { _id: { $in: usersIds } },
        () => ({ fullName: 'updated fullname' }),
      );

      spy.should.have.been.called.at.least(2);
    });

    it('should publish users.deleted event when document deleted', async () => {
      const spy = chai.spy();
      eventBus.on('users.deleted', spy);

      const user = await usersService.insertOne({
        fullName: 'John',
      });

      await usersService.deleteOne({ _id: user._id });

      spy.should.have.been.called.at.least(1);
    });

    it('should publish users.deleted events when document deleted', async () => {
      const spy = chai.spy();
      eventBus.on('users.deleted', spy);

      const users = await usersService.insertMany([
        { fullName: 'John' },
        { fullName: 'Kobe' },
      ]);

      const usersIds = users.map((u) => u._id);

      await usersService.deleteMany({ _id: { $in: usersIds } });

      spy.should.have.been.called.at.least(2);
    });

    it('should publish users.deleted event when deletedOn set', async () => {
      const spy = chai.spy();
      eventBus.on('users.deleted', spy);

      const user = await usersService.insertOne({
        fullName: 'John',
      });

      await usersService.deleteSoft({ _id: user._id });

      spy.should.have.been.called.at.least(1);
    });

    it('should track updated fields on user update', async () => {
      const fullNameSpy = chai.spy();
      const expectedFullNameSpy = chai.spy();

      const spy = chai.spy();
      eventBus.on('users.updated', spy);

      const randomFullNameSpy = chai.spy();
      const expectedFullNameAndFirstNameSpy = chai.spy();
      const expectedFullNameAndFirstNameAndLastNameSpy = chai.spy();

      eventBus.onUpdated<UserType>('users', ['fullName'], fullNameSpy);
      eventBus.onUpdated<UserType>('users', [{ fullName: 'John Wake' }], expectedFullNameSpy);

      eventBus.onUpdated<UserType>('users', [{ fullName: 'Random fullName' }, 'firstName'], randomFullNameSpy);
      eventBus.onUpdated<UserType>('users', [{ fullName: 'John Wake', firstName: 'John' }], expectedFullNameAndFirstNameSpy);
      eventBus.onUpdated<UserType>('users', [{ fullName: 'John Wake', firstName: 'John' }, 'lastName'], expectedFullNameAndFirstNameAndLastNameSpy);

      // check nested fields google.oauth?

      const user = await usersService.insertOne({
        fullName: 'Mike',
      });

      await usersService.updateOne({ _id: user._id }, () => ({
        fullName: 'John Wake',
        firstName: 'John',
      }));

      await usersService.updateOne({ _id: user._id }, () => ({
        fullName: 'John Wake',
      }));

      spy.should.have.been.called.exactly(1);
      fullNameSpy.should.have.been.called.exactly(1);
      expectedFullNameSpy.should.have.been.called.exactly(1);

      randomFullNameSpy.should.have.been.called.exactly(1);
      expectedFullNameAndFirstNameSpy.should.have.been.called.exactly(1);
      expectedFullNameAndFirstNameAndLastNameSpy.should.have.been.called.exactly(1);
    });
  });
});
