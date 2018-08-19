const path = require('path');
const _ = require('lodash');
const chai = require('chai');

require('app-module-path').addPath(path.resolve(__dirname, '../'));

const Joi = require('helpers/joi.adapter');
const validate = require('./validate');

chai.should();

describe('validator', () => {
  const ctx = {
    request: {
      body: {
        test: 'test',
      },
    },
    query: {},
    params: {},
    throw: (status) => {
      throw new Error(status);
    },
  };

  const noop = () => { };

  it('should add validatedRequest to ctx', async () => {
    const schema = {
      test: Joi.string(),
    };
    const ctxMock = _.cloneDeep(ctx);

    await validate(Joi.validate(schema))(ctxMock, noop);
    ctxMock.validatedRequest.should.deep.equal({ errors: [], value: { test: 'test' } });
  });

  it('should throw error for wrong validation', async () => {
    const schema = {
      test: Joi.string().email(),
    };
    const ctxMock = _.cloneDeep(ctx);

    try {
      await validate(Joi.validate(schema))(ctxMock, noop);
    } catch (err) {
      err.message.should.be.equal('400');
    }
  });


  it('should throw error if validators is not a an function', async () => {
    const ctxMock = _.cloneDeep(ctx);

    try {
      await validate('wrong validate func')(ctxMock, noop);
    } catch (err) {
      err.message.should.be.equal('Validators must be a function or array of functions');
    }
  });
});
