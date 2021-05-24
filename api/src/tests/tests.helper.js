exports.test = async (done, check) => {
  try {
    await check();

    done();
  } catch (error) {
    done(error);
  }
};

exports.checkAutoUpdatedFields = (response, startTime, fields) => {
  fields.forEach((field) => {
    new Date(response.body[field]).getTime().should.be.above(startTime);
    new Date(response.body[field]).getTime().should.be.below(Date.now());
  });
};

exports.datesToISOStrings = (object) => {
  return Object.keys(object).reduce((acc, key) => {
    return {
      ...acc,
      [key]: object[key] instanceof Date ? object[key].toISOString() : object[key],
    };
  }, {});
};
