const chai = require('chai');

const { validate, Symbols } = require('./validator');

chai.should();

describe('validator', () => {
  it("should return '{ errors: [], payload }' with empty validators array", async () => {
    const validationResult = await validate({}, []);
    validationResult.should.be.deep.equal({
      errors: [],
      value: {},
    });
  });

  it('should return the value from the last validator', async () => {
    const validators = [
      () => ({ value: 1 }),
      () => ({ value: 2 }),
    ];

    const validationResult = await validate({}, validators);
    validationResult.should.be.deep.equal({
      errors: [],
      value: 2,
    });
  });

  it('should skip validators after errors appeared', async () => {
    const validators = [
      () => ({ value: 1 }),
      () => ({ value: 2, errors: ['Errors was appear'] }),
      () => ({ value: 3 }),
    ];

    const validationResult = await validate({}, validators);
    validationResult.should.be.deep.equal({
      errors: ['Errors was appear'],
      value: 2,
    });
  });

  it('should apply persistent data to each validator', async () => {
    const persistentData = {
      persistant: 'Wow! persistent!',
    };

    const payload = {
      [Symbols.PERSISTENT]: persistentData,
    };

    const validators = [
      (data, persistent) => {
        persistent.should.be.equal(persistentData);
        return {
          value: 1,
        };
      },
      (data, persist) => {
        persist.should.be.equal(persistentData);
        return {
          value: 2,
        };
      },
    ];

    const validationResult = await validate(payload, validators);
    validationResult.should.be.deep.equal({
      errors: [],
      value: 2,
    });
  });
});
