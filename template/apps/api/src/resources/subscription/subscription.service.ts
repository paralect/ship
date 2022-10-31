import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './subscription.schema';
import { Subscription } from './subscription.types';

const service = db.createService<Subscription>(DATABASE_DOCUMENTS.SUBSCRIPTIONS, {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

const updateSubscription = async (data: any) => {
  service.atomic.updateOne(
    { customer: data.customer },
    {
      $set: {
        subscriptionId: data.id,
        priceId: data.plan.id,
        productId: data.plan.product,
        status: data.status,
        interval: data.plan.interval,
        currentPeriodStartDate: data.current_period_start,
        currentPeriodEndDate: data.current_period_end,
        cancelAtPeriodEnd: data.cancel_at_period_end,
      },
    },
    undefined,
    {
      upsert: true,
    },
  );
};

const deleteSubscription = async (data: any) => {
  service.deleteOne({ subscriptionId: data.id });
};

export default Object.assign(service, {
  updateSubscription,
  deleteSubscription,
});
