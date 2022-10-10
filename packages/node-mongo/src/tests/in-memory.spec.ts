/* eslint-disable @typescript-eslint/no-unused-expressions */
import chai from 'chai';
import { z } from 'zod';
import spies from 'chai-spies';

import { Database, eventBus } from '../index';

import 'mocha';

import config from '../config';

chai.use(spies);
chai.should();

const database = new Database(config.mongo.connection, config.mongo.dbName);

const schema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  fullName: z.string(),
  oauth: z.object({
    google: z.boolean().optional(),
  }).optional(),
});

type UserType = z.infer<typeof schema>;

const usersService = database.createService<UserType>('users', {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

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
      const nestedFieldSpy = chai.spy();

      eventBus.onUpdated('users', ['fullName'], fullNameSpy);
      eventBus.onUpdated('users', [{ fullName: 'John Wake' }], expectedFullNameSpy);

      eventBus.onUpdated('users', [{ fullName: 'Random fullName' }, 'firstName'], randomFullNameSpy);
      eventBus.onUpdated('users', [{ fullName: 'John Wake', firstName: 'John' }], expectedFullNameAndFirstNameSpy);
      eventBus.onUpdated('users', [{ fullName: 'John Wake', firstName: 'John' }, 'lastName'], expectedFullNameAndFirstNameAndLastNameSpy);
      eventBus.onUpdated('users', ['oauth.google'], nestedFieldSpy);

      const user = await usersService.insertOne({
        fullName: 'Mike',
      });

      await usersService.updateOne({ _id: user._id }, () => ({
        fullName: 'John Wake',
        firstName: 'John',
        oauth: {
          google: true,
        },
      }));

      await usersService.updateOne({ _id: user._id }, () => ({
        fullName: 'John Wake',
      }));

      spy.should.have.been.called.exactly(1);
      fullNameSpy.should.have.been.called.exactly(1);
      expectedFullNameSpy.should.have.been.called.exactly(1);

      nestedFieldSpy.should.have.been.called.exactly(1);
      randomFullNameSpy.should.have.been.called.exactly(1);
      expectedFullNameAndFirstNameSpy.should.have.been.called.exactly(1);
      expectedFullNameAndFirstNameAndLastNameSpy.should.have.been.called.exactly(1);
    });
  });
});
