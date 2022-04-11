/* eslint-disable @typescript-eslint/no-unused-expressions */
import chai from 'chai';
import spies from 'chai-spies';

import { Database, inMemoryEventBus } from './index';

import 'mocha';

import config from './config';

chai.use(spies);
chai.should();
const { assert } = chai;

const database = new Database(config.mongo.connection, config.mongo.dbName);

type UserType = {
  _id: string;
  createdOn: string;
  fullName: string;
  deletedOn: string;
};

const usersService = database.createService<UserType>('users', {
  outbox: false,
});

describe('mongo/service.ts', () => {
  before(async () => {
    await database.connect();
  });
  after(async () => {
    await usersService.remove({});
    await database.close();
  });
  it('should create document', async () => {
    const u = await usersService.create({
      fullName: 'John',
    });

    u?.fullName.should.be.equal('John');
  });

  it('should update document', async () => {
    const u = await usersService.create({
      fullName: 'User to update',
    });

    await usersService.update(
      { _id: u?._id }, (doc) => ({
        ...doc,
        fullName: 'Updated fullname',
      }),
    );

    const updatedUser = await usersService.findOne({
      _id: u?._id,
    }, { doNotAddDeletedOn: true });

    updatedUser?.fullName.should.be.equal('Updated fullname');
  });

  it('should remove document', async () => {
    const u = await usersService.create({
      fullName: 'User to remove',
    });

    await usersService.remove({ _id: u?._id });

    const removedUser = await usersService.findOne({
      _id: u?._id,
    });

    (removedUser === null).should.be.equal(true);
  });

  it('should set deletedOn date to current JS date on remove', async () => {
    const u = await usersService.create({
      fullName: 'User to remove',
    });

    await usersService.removeSoft({
      _id: u?._id,
    });
    const updatedUser = await usersService.findOne({
      _id: u?._id,
    }, { doNotAddDeletedOn: true });

    assert.exists(updatedUser?.deletedOn);
  });

  describe('dbChangesPublisher', () => {
    const collectionName = 'dbChanges';
    const service = database.createService<any>(collectionName, {
      outbox: false,
    });

    after(async () => {
      await service.remove({});
    });

    it('should publish entity.created event on create', async () => {
      const spy = chai.spy();
      inMemoryEventBus.on(`${collectionName}.created`, spy);
      await service.create({});
      spy.should.have.been.called.at.least(1);
    });

    it('should publish entity.updated event on update', async () => {
      const spy = chai.spy();
      inMemoryEventBus.on(`${collectionName}.updated`, spy);
      const doc = await service.create({});
      await service.update({ _id: doc._id }, () => ({ newField: true }));
      spy.should.have.been.called.at.least(1);
    });

    it('should publish entity.removed event when document removed', async () => {
      const spy = chai.spy();
      inMemoryEventBus.on(`${collectionName}.removed`, spy);
      const doc = await service.create({});
      await service.remove({ _id: doc._id });
      spy.should.have.been.called.at.least(1);
    });
  });
});
