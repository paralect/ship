---
sidebar_position: 1
---

# Overview

Web Starter is what we think an ideal starting point for the most React frontend applications. It is based on the following primary technologies:

- Next.js
- React Query
- React Hook Form
- Mantine UI + Tabler
- Typescript
- Storybook + Chromatic

## Start application.

Run ```npm run dev``` that will start the application with ```development.json``` config.

You also can start the app using Dockerfile.

### Important notes

You need to set ```APP_ENV``` variable in build args in a place where you deploy application. It is responsible for the config file from ```environment``` folder that will be taken when building your application

| APP_ENV       | File          |
| ------------- | ------------- |
| development   | development.json  |
| staging       | staging.json  |
| production    | production.json  |

## [React Typescript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/docs/basic/setup/)
