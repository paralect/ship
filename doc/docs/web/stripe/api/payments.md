---
sidebar_position: 2
---

# Payments

## POST /payments/create-setup-intent

Generates a one-time secret key to allow the web application to communicate with stripe directly

Returns `clientSecret` token, used by `@stripe/react-stripe-js` components.

Stripe call snippet - 
```
  const setupIntent = await stripeService.setupIntents.create({
    customer: user.stripeId,
    payment_method_types: ['card'],
  });
```

Parameters description -

| Parameter       | type          |  Description  |
| ------------- | ------------- |  -------------  |
|  customer  |  string  | id of the stripe customer  |
|  payment_method_types  | array | The list of payment method types that this SetupIntent is allowed to set up  |

More information about stripe SetupIntent object - [link](https://stripe.com/docs/api/setup_intents/object)

## GET /payments/payment-information

Returns customer's billing details, balance on stripe account and card information (last 4 digits, expiration date and brand)

Stripe call snippet -
```
  const paymentInformation: any = await stripeService.customers.retrieve(user.stripeId, {
    expand: ['invoice_settings.default_payment_method'],
  });
```

Parameters description -

| Parameter       | type          |  Description  |
| ------------- | ------------- |  -------------  |
|  stripeId  |  string  | id of the stripe customer  |
|  expand  | array | By default, stripe returns only the if of the related object (default_payment_method in this case). Those objects can be expanded inline with the expand request parameter.  |

More information about stripe Customer object - [link](https://stripe.com/docs/api/customers/object)

## GET /payments/get-history

Returns a list of the customer's charges. The charges are returned in sorted order, with the most recent charges appearing first.

Query params - 

| Parameter       | type          |  Description  |
| ------------- | ------------- |  -------------  |
| cursorId   | string  |  A cursor for use in pagination. starting_after is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include starting_after=obj_foo in order to fetch the next page of the list.  |
|  direction  | string  | A direction of pagination. Used to determine which parameter `starting_after` or `ending_before` should be passed to the stripe call  |
|  perPage  | string  |  A limit on the number of objects to be returned  |

Stripe call snippet - 
```
const charges = await stripeService.charges.list({
    limit: perPage,
    customer: user.stripeId as string,
    starting_after: cursorId,
  });
```

More information about stripe Charge object - [link](https://stripe.com/docs/api/charges/object)

More information about stripe pagination - [link](https://stripe.com/docs/api/pagination)
