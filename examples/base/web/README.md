# Web Starter

Web Starter is what we think an ideal starting point for the most React.JS frontend applications. It is based on the following primary technologies:
 
- Next.js
- React Query
- React Hook Form
- Storybook + Chromatic
- PostCSS

Application structured in a way, which we find most efficient in both short and long term projects. The main intention of the current structure is to keep logical components close to each other and define clear structure for the common things, such as services, helpers, hooks, api and etc.

## [Ship UI](https://master--62543f00c4eb91003a7f2a91.chromatic.com/)

The starter has a basic set of easily customizable components to launch applications instantly.

## Start application.

Run ```npm run dev``` that will start the application with ```development.json``` config.

You also can start the app using Dockerfile.

## Deployment

### Vercel

The easiest way to deploy Web Starter is to use the [Vercel Platform](https://vercel.com/) from the creators of Next.js.

### Docker

You can deploy Web starter anywhere where you can run Docker. In our opinion, the easiest way is [Digital Ocean Apps](https://www.digitalocean.com/products/app-platform).

### CDN

You can deploy Web starter through CDN, but keep in mind that some features of Next.js like [SSR](https://nextjs.org/docs/basic-features/pages#server-side-rendering), [API Routes](https://nextjs.org/docs/api-routes/introduction) will not work.

### Important notes

You need to set ```APP_ENV``` variable in build args in a place where you deploy application. It is responsible for the config file from ```environment``` folder that will be taken when building your application


| APP_ENV       | File          |
| ------------- | ------------- |
| development   | development.json  |
| staging       | staging.json  |
| production    | production.json  |
