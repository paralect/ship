---
sidebar_position: 2
---

# API limitations

To keep things simple and maintainable we enforce some limitations on the API level. Limitations are more conventions and are not enforced in the code. If followed, they guarantee you can continue ship things quickly even after years of development.

## Resource updates

### Rule
**Every** entity update should stay within a resource folder. Direct database updates are allowed in data services, handlers and actions. 

### Explanation
This restriction makes sure that entity updates are not exposed outside the resource. This enables the discoverability of all updates and simplifies resource changes. 



## Complex read operations

### Rule
Complex data read operations (e.x. aggregation, complex queries) must be defined in the data service.

### Explanation
Complex operations often require maintenance and need to be edited, when the code (especially data schema) changes. The goal of that rule is to keep all such operations in the data service or near it in a separate file, so it's easy to discover them.



## Predictable file location

### Rule

Put things as close as possible to the place where they are used.

### Explanation
We want to keep things together that belong together and keep them apart if they belong apart. With that rule in mind, every resource has clear boundaries. 



## Two data services

### Rule
Two data services can not use each other directly. You may use two services together in actions or (better!) in workflows.

### Explanation
Use of two data services inside each other leads to circular dependencies and unnecessary complexities. We encourage the use of CUD events to protect the boundaries of different resources and services. You can use two services together in the workflow.


## Dependencies relatively to the /src folder

### Rule
Files shoud be required from the current folder or from the root, `../` is not allowed. E.x.:

```typescript
import service from 'resources/user/user.service';
```

### Explanation

This makes it easy to move files around without breaking an app and also much simpler to understand where the actual file is located, compared to something like: `../../user.service`.
