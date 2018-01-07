# MyProduct Landing site

Landing site is based on [Next.JS](https://github.com/zeit/next.js).

## Run 

`npm run development` — run landing in development mode with hot-reloading in place.
`npm start` — run landing in production mode.

## Things to notice
This starter files and code structure aimed to match other [Stack family](https://github.com/paralect/stack) starters (such as [koa-api](https://github.com/paralect/koa-api-starter) and [koa-react](https://github.com/paralect/koa-react-starter) features as much as possible.
Next.js introduces strict file conventions while SSR requires some important limitations and rules that leads to some differences described below along with other details.

1. Next.js SSR implementation **does not allow adding custom webpack loaders** ([docs](https://github.com/zeit/next.js/#customizing-webpack-config) + [issue](https://github.com/zeit/next.js/issues/1245)). That means that:
  - It's not possible to use common css-loader, style-loader, postcss-loader to add custom extensions like `.pcss`. Next.js enforces to use `styled-jsx` or other css-in-js solutions to solve this.
  - It's not possible to `.jsx` extension for react components and restricted only to `.js` extension.
  - **Babel plugins should be used instead of webpack**. Extend `./.babelrc` to add your plugins. That's right – you can simply transform your css, svg or other files with custom babel plugins instead of webpack loaders. <br/>
  You can find the examples of using `styled-jsx-plugin-postcss` to allow postcss for `styled-jsx` and `inline-react-svg` for importing svgs to react code.

2. The starter has separate `client` and `server` folders containing corresponding pieces of application. <br/>

   **./server** app will be rarely modified as next.js core functionality covers all the server needs and SSR requirements. `./server/app.js` defines [custom next.js server](https://github.com/zeit/next.js/#custom-server-and-routing) to work with Stack's logger and config. <br />

   **./client** app is the main extension point.
  - New pages must be added under `./client/pages` directory. New pages automatically become available under the endpoints that map directly to their name (for example `./client/pages/signin.js` page by default maps to `http://localhost:3002/signin` endpoint, `./client/pages/index.js` maps to the root url). Base page template is extendable via special `./client/pages/_document.js` file.
  - Linking must be maid with `next/link` component instead of `<a />` (which also has a cool `prefetch` prop)
  - Static content is served automatically from `./client/static` directory
  - Place the reusable components under `./client/components`
  - Place all kind of helpers/services/factories/[your term here] to `./client/helpers` directory
  - Common layout is defied under `./client/layouts/main.js` and is used for all the pages. If you have multiple layouts for you app – place it here. Layout is just a regular react component with no magic.
  - Require client files relatively to client root using path started with `~`. <br/>
  Example: import header to pages with <br />
  `import Header from '~/components/header'` instead of `import Header from '../components/header'`. This will help to maintain sustainability when importing files are moved around the app.

3. Configuration
  - Next.js provides bundled webpack config that is extended with `./server/config/webpack.config.next.js` that we are using to expose client config to the browser. <br />
  Server config is placed under `./server/config/index.js`. Client config properties are defined as subset of server's config and defined under `./server/config/client.js`. After client's config is exposed with webpack's custom configuration it becomes available for browser and you can import it with `import config from '~/config'` <br />  <br />
  **SSR NOTE:** config secrets like oauth secret keys should be never exposed to the client side

4. Read the [main readme](https://github.com/zeit/next.js)  of next.js project and look through their [examples](https://github.com/zeit/next.js/tree/canary/examples) before starting your own app development. It is pretty compact and clear.

