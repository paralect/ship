const Joi = require('./joi.adapter');
const chai = require('chai');

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
