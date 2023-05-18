---
sidebar_position: 3
---

# How it works

When you're calling `registerDocs` function, we add config in Registry. You can register docs in any part of application.
This config is written with this [standard](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#serverObject) in mind.
This registry contains all actions that gathered inside API. To retrieve these docs in open api format, you can call `docsService.getDocs` function.

For advanced usage cases, you can reference to this [documentation](https://github.com/asteasolutions/zod-to-openapi)