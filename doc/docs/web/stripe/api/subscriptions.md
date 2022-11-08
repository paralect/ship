---
sidebar_position: 1
---

# Subscriptions

## POST /subscriptions/subscribe

Generates subscription for customer and returns a link to checkout session where user can review payment details, provides payment information, and purchase a subscription.

Body params - 

| Parameter       | type          |  Description  |
| ------------- | ------------- |  -------------  |
| priceId   | string  |  Id of the price for subscription  |

Returns `checkoutLink` url with checkout form.

Stripe call snippet - 
```
  const session = await stripeService.checkout.sessions.create({
    mode: 'subscription',
    customer: user.stripeId,
    line_items: [{
      quantity: 1,
      price: priceId,
    }],
    success_url: `${config.webUrl}?subscriptionPlan=${priceId}`,
    cancel_url: config.webUrl,
  });
```

Parameters description -

| Parameter       | type          |  Description  |
| ------------- | ------------- |  -------------  |
| mode   | string  |  The mode of the Checkout Session. For subscription it should be set to `subscription`  |
|  customer  |  string  | id of the stripe customer. if `undefined`, stripe will ask for the user's email and create a new customer upon purchasing  |
|  line_items  | array | Array with information about items that will be included in checkout session  |
|  <ul><li>quantity</li><li>price</li></ul>  | <ul><li>number</li><li>string</li></ul>  | <ul><li>Amount of items (usually 1 for subscription)</li><li>id of the specific price of the product</li></ul>  |
|  success_url  | string  |  The URL to which Stripe should send customers when payment or setup is complete  |
|  cancel_url  |  string  |  The URL the customer will be directed to if they decide to cancel payment and return to your website  |

More information about stripe checkout object - [link](https://stripe.com/docs/api/checkout/sessions)


## POST /subscriptions/cancel-subscription

Cancels prolongation of a customer’s subscription. The customer will not be charged again for the subscription.

Stripe call snippet -
```
  stripeService.subscriptions.update(user.subscription?.subscriptionId as string, {
      cancel_at_period_end: true,
  });
```

Parameters description -

| Parameter       | type          |  Description  |
| ------------- | ------------- |  -------------  |
|  customer  |  string  | id of the stripe customer  |
|  cancel_at_period_end  | boolean | Indicating whether this subscription should cancel at the end of the current period.  |

More information about subscription update - [link](https://stripe.com/docs/api/subscriptions/update)


## POST /subscriptions/upgrade

Changes customer's subscription plan (billing period or subscription plan)

Body params - 

| Parameter       | type          |  Description  |
| ------------- | ------------- |  -------------  |
| priceId   | string  |  Id of the price for subscription  |

Stripe call snippet -
```
  const subscriptionDetails = await stripeService.subscriptions.retrieve(subscriptionId);

  const items = [{
    id: subscriptionDetails.items.data[0].id,
    price: priceId,
  }];

  await stripeService.subscriptions.update(subscriptionId, {
    proration_behavior: 'always_invoice',
    cancel_at_period_end: false,
    items,
  });
```

Parameters description -

| Parameter       | type          |  Description  |
| ------------- | ------------- |  -------------  |
|  subscriptionId  |  string  | id of the customer's active subscription  |
|  proration_behavior  | string | Determines how to handle prorations when the billing cycle changes (switching plan in this case). parameter `Always_invoice` is used to charge the customer immediately  |
|  cancel_at_period_end  |  string  |  Boolean indicating whether this subscription should cancel at the end of the current period.  |
|  items  | array  |  array with information about subscription items  |
|  <ul><li>id</li><li>price</li></ul>  | <ul><li>string</li><li>string</li></ul>  | <ul><li>id of the customer's active subscription</li><li>id of the specific price of the product</li></ul>  |

More information about subscription update - [link](https://stripe.com/docs/api/subscriptions/update)


## GET /subscriptions/current

Returns detailes subscription information along with pending invoice

Stripe call snippet -
```
  const product = await stripeService.products.retrieve(user.subscription?.productId);
```

| Parameter       | type          |  Description  |
| ------------- | ------------- |  -------------  |
|  productId  |  string  | id of the product (subscription)  |

More information about products - [link](https://stripe.com/docs/api/products)

```
  const pendingInvoice = await stripeService.invoices.retrieveUpcoming({
    subscription: user.subscription?.subscriptionId,
  });
```

| Parameter       | type          |  Description  |
| ------------- | ------------- |  -------------  |
|  subscription  |  string  | id of the customer's active subscription  |

More information about invoices - [link](https://stripe.com/docs/api/invoices)


## GET /subscriptions/preview-upgrade

Returns invoice with billing information of subscription upgrade/downgrade

Query params - 

| Parameter       | type          |  Description  |
| ------------- | ------------- |  -------------  |
| priceId   | string  |  Id of the price for subscription  |

Returns invoice with payment details

Code snippet -
```
  if (priceId === 'price_0') {
    items = [{
      id: subscriptionDetails.items.data[0].id,
      price_data: {
        currency: 'USD',
        product: user.subscription?.productId,
        recurring: {
          interval: subscriptionDetails.items.data[0].price.recurring?.interval,
          interval_count: 1,
        },
        unit_amount: 0,
      },
    }];
  } else {
    items = [{
      id: subscriptionDetails.items.data[0].id,
      price: priceId,
    }];
  }

  const invoice = await stripeService.invoices.retrieveUpcoming({
    customer: user.stripeId || undefined,
    subscription: user.subscription?.subscriptionId,
    subscription_items: items,
    subscription_proration_behavior: 'always_invoice',
  });
```

Parameters description -

| Parameter       | type          |  Description  |
| ------------- | ------------- |  -------------  |
|  customer  |  string  | id of the stripe customer  |
|  subscription  | string | id of customer's active subscription  |
|  subscription_proration_behavior  | string  |  Determines how to handle prorations when the billing cycle changes (e.g., when switching plans, resetting billing_cycle_anchor=now, or starting a trial), or if an item’s quantity changes.  |
|  subscription_items  |  array  |  array with information about subscription items  |
|  <ul><li>id</li><li>price</li></ul>  | <ul><li>string</li><li>string</li></ul>  | <ul><li>id of the customer's active subscription</li><li>id of the specific price of the product</li></ul>  |

In case the customer chooses free plan, we need to send a custom price object to stripe with unit_amount set to 0 in order to receive invoice with empty products and information about a refund for canceled subscription

Price data parameters - 

| Parameter       | type          |  Description  |
| ------------- | ------------- |  -------------  |
|  currency  |  string  | Three-letter ISO currency code, in lowercase.  |
|  product  | string | id of subscription product  |
|  recurring  | object  |  The recurring components of a price such as interval and interval_count  |
|  <ul><li>interval</li><li>interval_count</li></ul>  | <ul><li>string</li><li>number</li></ul>  | <ul><li>Specifies billing frequency. Either day, week, month or year.</li><li>The number of intervals between subscription billings</li></ul>  |
|  unit_amount  |  number  |  A positive integer in cents (or 0 for a free price) representing how much to charge.  |

More information about previewing upcoming invoices - [link](https://stripe.com/docs/api/invoices/upcoming)
