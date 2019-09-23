# Facebook Passport OAuth2 Integration

## 1. Install necessary packages: 

```shell

cd api

npm i koa-passport passport-facebook

```

## 2. Add necessary Facebook credentials

> To get these credentials, you should setup them at Facebook Developer Portal. You can find instructions [here](https://auth0.com/docs/connections/social/facebook)

```javascript

// api/src/config/environment/index.js

let base = {
  ...

  facebook: {
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    redirectUri: 'redirectUri', // callback url
  },
};

```

## 3. Setup passport and Facebook oauth strategy

```javascript

// api/src/config/koa.js

...

const passport = require('koa-passport');
require('./passport');

...

module.exports = (app) => {
  ...

  app.use(passport.initialize());

  validate(app);

  app.use(routeErrorHandler);

  routes(app);
};

```

```javascript

// api/src/config/passport.js

const passport = require('koa-passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('config');
const accountService = require('resources/account/account.service');
const { mapFacebookProfile } = require('resources/user/user.helper');

const handleOauthStrategyResponse = (oauthName, mapOauthProfile) =>
  async (token, tokenSecret, profile, done) => { // eslint-disable-line
    const mappedProfile = mapOauthProfile(profile);
    let user;

    try {
      user = await accountService.ensureAccountCreated(oauthName, mappedProfile);
    } catch (err) {
      done(err);
    }

    done(null, user);
  };

passport.use(new FacebookStrategy({
  clientID: config.facebook.clientId,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.redirectUri,
  profileFields: ['id', 'name', 'email'],
}, handleOauthStrategyResponse('facebook', mapFacebookProfile)));

```

```javascript

// api/src/resources/account/account.service.js

const userService = require('resources/user/user.service');

exports.ensureAccountCreated = async (oauthName, userData) => {
  let user = await userService.findOne({ email: userData.email });

  if (user) {
    const socialId = user.oauth[oauthName];

    if (!socialId) {
      user = await userService.findOneAndUpdate(
        { _id: user._id },
        { $set: { [`oauth.${oauthName}Id`]: userData.oauth[`${oauthName}Id`] } },
      );
    }

    return user;
  }

  return userService.create(userData);
};

```

```javascript

// api/src/resources/user/user.helper.js

const _ = require('lodash');

exports.mapFacebookProfile = facebookProfile => ({
  firstName: facebookProfile.name.givenName,
  lastName: facebookProfile.name.familyName,
  email: _.get(facebookProfile, 'emails[0].value', null),
  isEmailVerified: Boolean(_.get(facebookProfile, 'emails[0].value', null)),
  oauth: {
    facebookId: facebookProfile.id,
  },
});

```

## 4. Add endpoints and controller methods to handle Facebook Oauth

```javascript

// api/src/resources/account/public.js

...

const controller = require('./account.controller');

...

router.get('/auth/facebook', controller.handleOauth('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback', controller.handleOauthCallback('facebook'));

```

```javascript

// api/src/resources/account/account.controller.js

...

const passport = require('koa-passport');
const authService = require('auth.service');
const config = require('config')
...

exports
  .handleOauth = (oauthStrategy, options) => passport.authenticate(oauthStrategy, options);

exports.handleOauthCallback = oauthStrategy => async (ctx) => {
  return passport.authenticate(oauthStrategy, (err, user, info) => {
    if (err) {
      ctx.status = 401;
      ctx.body = {};
    }

    const token = authService.createAuthToken({ userId: user._id });

    ctx.redirect(`${config.webUrl}?token=${token}`);
  })(ctx);
};

```

## 5. Add facebook oauth mention to user schema

```javascript

// api/src/resources/user/user.schema.js

const Joi = require('joi');

const userSchema = {
  ...

  oauth: Joi.object().keys({
    ...

    facebookId: Joi.string(),
  }),

  ...
};

...

```

## 6. Add additional Oauth component for landing

```javascript

// landing/src/client/components/oauth/index.js

import OAuth from './index.jsx';

export default OAuth;

```

```jsx

// landing/src/client/components/oauth/index.jsx

import React from 'react';
import PropTypes from 'prop-types';
import getConfig from 'next/config';

import styles from './styles.pcss';

const { publicRuntimeConfig: { apiUrl } } = getConfig();


function OAuth(props) {
  const { name } = props;
  const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className={styles.container}>
      <a
        href={`${apiUrl}/account/auth/${name}`}
        className={styles.signup}
      >
        <span className={styles[`icon--${name}`]} />
        <span className={styles.label}>{`Continue with ${nameCapitalized}`}</span>
      </a>
    </div>
  );
}

OAuth.propTypes = {
  name: PropTypes.string.isRequired,
};

export default OAuth;

```

```css

/* landing/src/client/components/oauth/styles.pcss */

.container {
  margin-top: 30px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.signup {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  background: var(--white);
  border-radius: 2px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.24), 0 0 1px 0 rgba(0, 0, 0, 0.12);
  text-decoration: none;
  transition: all 0.3s;

  &:hover {
    cursor: pointer;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 0 10px rgba(224, 244, 241, 0.3);
  }
}

.icon--google {
  width: 25px;
  height: 25px;
  background-size: 25px 25px;
  background-image: url("https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png");
}

.icon--facebook {
  width: 25px;
  height: 25px;
  background-size: 25px 25px;
  background-image: url("https://scontent-frx5-1.xx.fbcdn.net/v/t39.2365-6/34929128_2542370199321677_3462617962773479424_n.png?_nc_cat=1&_nc_oc=AQkQfLGtxXHmc6Rw33sOf6SRsMgGiuYT4al9GtemX-ghWVnM1_4uTE4hIbHOfMHNSjY&_nc_ht=scontent-frx5-1.xx&oh=a1e28dee88ff51df8b61c33626c2e937&oe=5E3D222E");
}

.label {
  margin-left: 10px;
}

```

## 6. Add Oauth component to signin and signup pages

```jsx

// landing/src/client/pages/signin/signin.jsx

...

import OAuth from '~/components/oauth';

...

export default class Signin extends PureComponent {
  ...

  render() {
    ...

    return (
      ...

      <SignUpGoogle />
      <OAuth name="facebook" />

      ...
    );
  }
}

...

```

```jsx

// landing/src/client/pages/signup/signup.jsx

...

import OAuth from '~/components/oauth';

...

export default class Signup extends PureComponent {
  ...

  render() {
    ...

    return (
      ...

      <SignUpGoogle />
      <OAuth name="facebook" />

      ...
    );
  }
}

...

```

## 7. Remove extra hash symbols from address bar after Facebook authentication

```jsx

// landing/src/client/pages/signin/signin.jsx

...

export default class Signin extends PureComponent {
  ...

  componentDidMount() {
    // Remove extra symbols in address bar after facebook oauth login
    if (window.location.hash === '#_=_') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }

  ...
}

...

```

```jsx

// landing/src/client/pages/signup/signup.jsx

...

export default class Signup extends PureComponent {
  ...
  
  componentDidMount() {
    // Remove extra symbols in address bar after facebook oauth login
    if (window.location.hash === '#_=_') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }

  ...
}

...

```

```jsx

// web/src/client/index.jsx

...

// Remove extra symbols in address bar after facebook oauth login
if (window.location.hash === '#_=_') {
  window.history.pushState('', document.title, window.location.pathname + window.location.search);
}

...

```