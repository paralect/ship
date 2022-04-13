---
sidebar_position: 2
---

# Using events

The picture below shows the 'events part' of a sample API implementation:
![Event handlers](/img/api_event_handlers.png)

In Ship, every resource produces events on create, update and delete database operations. As a result, we have all events in one place and these events describe system behavior. Stripe has [an event for any change](https://stripe.com/docs/api/events/types) that happens in their system. We do pretty much the same.
