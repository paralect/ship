const bcrypt = require('bcrypt');

exports.getHashSync = (text) => {
  return bcrypt.hashSync(text, 10);
};
