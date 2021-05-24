const { USER } = require('./constants');

exports.signin = (request, user, password = USER.DEFAULT_PASSWORD) => {
  return new Promise((resolve, reject) => {
    request
      .post('/account/signin')
      .send({
        email: user.email,
        password,
      })
      .end((err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
  });
};
