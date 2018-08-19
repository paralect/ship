const chai = require('chai');

const Joi = require('./joi.adapter');

chai.should();

describe('joi validator', () => {
  it('should apply args partially', () => {
    const schema = {
      email: Joi.string(),
    };
    const validationResult = Joi.validate(schema, {
      email: 'test@test.com',
    });

    const validationResultPartial = Joi.validate(schema)({
      email: 'test@test.com',
    });

    validationResult.should.be.deep.equal(validationResultPartial);

    validationResult.should.be.deep.equal({
      errors: [],
      value: {
        email: 'test@test.com',
      },
    });
  });
});
