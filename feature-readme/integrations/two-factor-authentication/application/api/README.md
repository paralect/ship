# [2fa] API installation steps:

## 1. Install necessary packages: 

```shell

npm i speakeasy qrcode

```

## 2. Add application name into config if there is no information about it:

```javascript
/* src/config/environment/index.js */

const base = {...};

base.applicationName = 'Ship',

```

## 3. Add two factor authentication helper: 

```javascript
/* src/helpers/twoFa.js */

const qrCode = require('qrcode');
const speakeasy = require('speakeasy');
const config = require('config');

exports.generateAccountName = userAccountName => `${config.applicationName}:${userAccountName}`;

exports.generateSecret = (accountName) => {
  const secret = speakeasy.generateSecret({ name: accountName });

  return secret.base32;
};

exports.generateQrCode = (secret, accountName) => {
  const otpauthURL = speakeasy.otpauthURL({ secret, label: encodeURIComponent(accountName), encoding: 'base32' });

  return qrCode.toDataURL(otpauthURL);
};

exports.isTwoFaCodeValid = (twoFaCode, twoFaSecret) => speakeasy.totp.verify({
  secret: twoFaSecret,
  encoding: 'base32',
  token: twoFaCode,
});

```

## 4. Add routes to handle two factor authentication setup & state: 

```javascript
/* src/resources/user/index.js */


const validate = require('middlewares/validate');
const validators = require('./validators');

...

router.get('/2fa/status', controller.getTwoFaStatus);
router.post('/2fa/init', validate(validators.initTwoFaSetup), controller.initializeTwoFaSetup);
router.post('/2fa/verify', validate(validators.verifyTwoFaSetup), controller.verifyTwoFaSetup);
router.post('/2fa/disable', controller.disableTwoFa);

...
```

## 5. Add necessary validators to validate two factor authentication setup

```javascript

/* src/resources/user/validators/initTwoFaSetup.validator.js */

const validationFunction = async (data, persistentData) => {
  const errors = [];
  const { twoFa: { isEnabled: isTwoFaEnabled } } = persistentData.state.user;

  if (isTwoFaEnabled) {
    errors.push({ twoFa: 'Two factor authentication is already enabled' });
    return {
      errors,
    };
  }

  return {
    value: {},
    errors,
  };
};

module.exports = [
  validationFunction,
];

```

```javascript

/* src/resources/user/validators/verifyTwoFaSetup.validator.js */

const Joi = require('helpers/joi.adapter');
const twoFaHelper = require('helpers/twoFa');

const schema = {
  verificationCode: Joi.string()
    .trim()
    .options({
      language: {
        any: { empty: '!!Verification code is required' },
      },
    }),
};

const validationFunction = async (data, persistentData) => {
  const errors = [];
  const { twoFa: { isEnabled: isTwoFaEnabled, secret: twoFaSecret } } = persistentData.state.user;

  if (isTwoFaEnabled) {
    errors.push({ twoFa: 'Two factor authentication is already enabled' });
    return { errors };
  }

  const isTwoFaVerificationCodeValid = twoFaHelper
    .isTwoFaCodeValid(data.verificationCode, twoFaSecret);

  if (!isTwoFaVerificationCodeValid) {
    errors.push({ verificationCode: 'Verification code is incorrect' });
    return { errors };
  }

  return {
    value: {},
    errors,
  };
};

module.exports = [
  Joi.validate(schema),
  validationFunction,
];

```

```javascript

/* src/resources/user/validators/index.js */

...

const initTwoFaSetup = require('./initTwoFaSetup.validator');
const verifyTwoFaSetup = require('./verifyTwoFaSetup.validator');

...

module.exports = {
  
  ...

  initTwoFaSetup,
  verifyTwoFaSetup,
};

```


## 6. Update user schema: add information about two factor authentication: 

```javascript
/* src/resources/user/user.schema.js */

const Joi = require('joi');

...

const userSchema = {
  ...

  twoFa: Joi.object().keys({
    isEnabled: Joi.boolean().default(false),
    secret: Joi.string(),
  }).required(),
};
...

```

## 7. Update user builder: add information about two factor authentication: 

```javascript
/* src/resources/user/user.builder.js */

...

class UserBuilder extends BaseBuilder {
  constructor() {
    ...

    this.data.twoFa = {
      isEnabled: false,
    };
  }
  ...
}

...

```

## 8. Update user service: add functions to cover two factor authentication functionality: 

```javascript
/* src/resources/user/user.service.js */

...

service.enableTwoFa = (_id) => {
  return service.atomic.update({ _id }, {
    $set: { 'twoFa.isEnabled': true },
  });
};

service.saveTwoFaSecret = (_id, twoFaSecret) => {
  return service.atomic.update({ _id }, {
    $set: { 'twoFa.secret': twoFaSecret },
  });
};

service.disableTwoFa = (_id) => {
  return service.atomic.update({ _id }, {
    $set: { 'twoFa.isEnabled': false },
    $unset: { 'twoFa.secret': true },
  });
};

...

```

## 9. Update user conroller: add handlers to cover two factor authentication functionality: 

```javascript
/* src/resources/user/user.controller.js */

...

const twoFaHelper = require('helpers/twoFa');
const userService = require('./user.service');

...

const userOmitFelds = [
  ...

  'twoFa',
];

...

exports.getTwoFaStatus = async (ctx) => {
  const { twoFa: { isEnabled: isTwoFaEnabled } } = ctx.state.user;

  ctx.body = { isTwoFaEnabled };
};

exports.initializeTwoFaSetup = async (ctx) => {
  const { email, _id: userId } = ctx.state.user;
  const accountName = twoFaHelper.generateAccountName(email);

  let { twoFa: { secret } } = ctx.state.user;

  if (!secret) {
    secret = twoFaHelper.generateSecret(accountName);

    await userService.saveTwoFaSecret(userId, secret);
  }

  const qrCode = await twoFaHelper.generateQrCode(secret, accountName);

  ctx.body = { qrCode, key: secret, account: accountName };
};

exports.verifyTwoFaSetup = async (ctx) => {
  const { _id: userId } = ctx.state.user;

  await userService.enableTwoFa(userId);

  // TBD: send recovery codes
  ctx.body = {};
};

exports.disableTwoFa = async (ctx) => {
  const { twoFa: { isEnabled: isTwoFaEnabled }, _id: userId } = ctx.state.user;

  if (isTwoFaEnabled) {
    await userService.disableTwoFa(userId);
  }

  ctx.body = {};
};

...

```

## 10. Update signin strategy: add additional validation for two factor authentication functionality: 

```javascript
/* src/resources/account/validators/signin.validator.js */

const Joi = require('helpers/joi.adapter');
const twoFaHelper = require('helpers/twoFa');

...

const schema = {
  ...

  twoFaCode: Joi.string()
    .trim(),
};

...

const validateFunc = async (signinData) => {
  const user = await userService.findOne({ email: signinData.email });
  const errors = [];

  ...

  let shouldCompleteTwoFa = false;

  if (user.twoFa.isEnabled) {
    if (signinData.twoFaCode) {
      const isTwoFaCodeValid = twoFaHelper
        .isTwoFaCodeValid(signinData.twoFaCode, user.twoFa.secret);

      if (!isTwoFaCodeValid) {
        errors.push({ twoFaCode: 'Two factor authentication code is incorrect' });

        return { errors };
      }
    } else {
      shouldCompleteTwoFa = true;
    }
  }

  return {
    value: {
      ...
      shouldCompleteTwoFa,
    },
    ...,
  };
};

...

```

```javascript
/* src/resources/account/account.controller.js */

...

exports.signin = async (ctx, next) => {
  const { 
    ...
    shouldCompleteTwoFa
  } = ctx.validatedRequest.value;

  ...

  if (shouldCompleteTwoFa) {
    ctx.body = { shouldCompleteTwoFa };

    return;
  }

  ...
};

...

```