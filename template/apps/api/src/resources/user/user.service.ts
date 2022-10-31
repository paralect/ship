import _ from 'lodash';

import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './user.schema';
import { User } from './user.types';

const service = db.createService<User>(DATABASE_DOCUMENTS.USERS, {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

const updateLastRequest = (_id: string) => {
  const date = new Date();

  return service.atomic.updateOne(
    { _id },
    {
      $set: {
        lastRequest: date,
      },
    },
  );
};

const attachStripeCustomerId = (data: any) => {
  service.atomic.updateOne(
    {
      email: data.email,
    },
    {
      $set: {
        stripeId: data.id,
      },
    },
  );
};

const updateSubscription = async (data: any) => {
  const subscription = {
    subscriptionId: data.id,
    priceId: data.plan.id,
    productId: data.plan.product,
    status: data.status,
    interval: data.plan.interval,
    currentPeriodStartDate: data.current_period_start,
    currentPeriodEndDate: data.current_period_end,
    cancelAtPeriodEnd: data.cancel_at_period_end,
  };

  service.atomic.updateOne(
    {
      stripeId: data.customer,
    },
    {
      $set: {
        subscription,
      },
    },
  );
};

const deleteSubscription = async (data: any) => {
  service.atomic.updateOne(
    {
      stripeId: data.customer,
    },
    {
      $unset: {
        subscription: '',
      },
    },
  );
};

const privateFields = [
  'passwordHash',
  'signupToken',
  'resetPasswordToken',
  'subscription',
];

const getPublic = (user: User | null) => _.omit(user, privateFields);

export default Object.assign(service, {
  updateLastRequest,
  getPublic,
  attachStripeCustomerId,
  updateSubscription,
  deleteSubscription,
});
