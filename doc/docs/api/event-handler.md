---
sidebar_position: 6
---

# Event handler

## Overview

**Event handler** — is a simple function that receives event as an argument and performs required logic. All event handlers should be stored in the /handlers folder within resource. Handler name should include event name e.x. `user.created.handler.ts`. That helps find all places were event is used. Direct database updates of the current resource entity are allowed within handler. 


## Examples
