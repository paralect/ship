# ✨ Next.JS Landing Starter ✨

[![Stack](https://raw.githubusercontent.com/paralect/stack/master/stack-component-template/stack.png)](https://github.com/paralect/stack)

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Build Status](http://product-stack-ci.paralect.com/api/badges/paralect/nextjs-landing-starter/status.svg)](http://product-stack-ci.paralect.com/paralect/nextjs-landing-starter)
[![David Dependancy Status](https://david-dm.org/paralect/nextjs-landing-starter.svg)](https://david-dm.org/paralect/nextjs-landing-starter)

[![Watch on GitHub](https://img.shields.io/github/watchers/paralect/nextjs-landing-starter.svg?style=social&label=Watch)](https://github.com/paralect/nextjs-landing-starter/watchers)
[![Star on GitHub](https://img.shields.io/github/stars/paralect/nextjs-landing-starter.svg?style=social&label=Stars)](https://github.com/paralect/nextjs-landing-starter/stargazers)
[![Follow](https://img.shields.io/twitter/follow/paralect.svg?style=social&label=Follow)](https://twitter.com/paralect)
[![Tweet](https://img.shields.io/twitter/url/https/github.com/paralect/ship.svg?style=social)](https://twitter.com/intent/tweet?text=I%27m%20building%20my%20next%20product%20with%20Ship%20%F0%9F%9A%80.%20Check%20it%20out:%20https://github.com/paralect/ship)

Next.JS Landing Starter — is a [Next.JS](https://github.com/zeit/next.js) starter kit, which allow you start development of new landing site in matter of minutes. This repository is one of the compontents of [Stack family](https://github.com/paralect/stack) — a set of components for makers to ship better products faster 🚀. Stack is an number of open-source components, resulted from years of hard work on a number of awesome products. We carefully select, document and share our production-ready knowledge with you.

## Features

* 😍 **Nice-looking** common basic templates for the main, login and signup pages with bindings to API. Styles are based on [PostCSS](https://github.com/postcss/postcss) with [cssnext](https://github.com/MoOx/postcss-cssnext) + [LostGrid](https://github.com/peterramsing/lost) via [css modules](https://github.com/zeit/next-plugins/tree/master/packages/next-css).
* 🔥 **Hot reloading** with webpack
* ⚡️ **Server side rendering**
* 👮 **Secure** — separate client and server configuration to protect secure server-only items
* 🛠️ **Support of \*.pcss** - We use `.pcss` files for styles. But as long as `.pcss` files are not supported by `@zeit/next-css` we use a [workaround](./src/server/lib/next-css)
#
# Getting Started

Just fork or clone and push repository into your own repo. Rename [SHIP_README.md](SHIP_README.md) into README.md. To keep your repository clean remove `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `LICENSE` and `.drone.yml`.

You can read develoment details [here](SHIP_README.md) — that will become a primary readme of your landing site.

#### Google Analytics

Take tracking Id from [Google Analytics](https://analytics.google.com) and paste in `/src/server/config/environment/development.js`
```
gaTrackingId: 'UA-XXXXX-Y'
```

## Start

In order to start nextjs server in the docker container you can use bash file `./bin/start.sh`:
```bash
$ ./bin/start.sh
```

Also, you need REST api server on several pages (sigun, signin). If you are using `paralect/koa-api-starter` then you can start this server using the corresponding command. Or you can start any other REST api server on port `3001`.

## Demo

Demo is available as part of [Ship](https://github.com/paralect/ship) [here](http://ship-demo.paralect.com/).

## Why Next.JS?

#### **Server-side rendering (SSR) a.k.a. [universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9) app**
SSR is the requirement for the modern landing websites which allows the indexing of single-page applications for search engines such as google. Which means you can continue to have fun with your [favorite UI library](https://github.com/facebook/react) while having your awesome stuff seen in the web for everyone.

#### **Bundled react.js + webpack**.
Even though landing websites are often considered to consist of mostly static pages which do not require a tone of javascript code, we believe that having the same library across all your ecosystem leads to *predictable*, *clean*, *reusable* and *extendable* code.
<br />Because the basic handling of the form input with raw JS code is not a very pleasant thing, don't you remember?

#### **Prepared app structure with clearly defined conventions**
Next.js is built to simplify the life of developers and remove boilerplate code while giving the power of the latest technologies so it fully correlates with our goals.

#### Community driven and widely popular framework
Next.js is the most popular SSR framework for react with constant updates and improvements and big number of contributors. Two heads are better than one, 20k is even better.

## Change Log

This project adheres to [Semantic Versioning](http://semver.org/).
Every release is documented on the Github [Releases](https://github.com/paralect/nextjs-landing-starter/releases) page.

## License

Next.JS Landing Starter is released under the [MIT License](LICENSE).

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://github.com/IharKrasnik"><img src="https://avatars3.githubusercontent.com/u/2302873?v=4" width="100px;" alt="Ihar"/><br /><sub><b>Ihar</b></sub></a><br /><a href="https://github.com/paralect/nextjs-landing-starter/commits?author=IharKrasnik" title="Code">💻</a> <a href="#design-IharKrasnik" title="Design">🎨</a> <a href="https://github.com/paralect/nextjs-landing-starter/commits?author=IharKrasnik" title="Documentation">📖</a> <a href="#ideas-IharKrasnik" title="Ideas, Planning, & Feedback">🤔</a> <a href="#review-IharKrasnik" title="Reviewed Pull Requests">👀</a></td><td align="center"><a href="https://github.com/ezhivitsa"><img src="https://avatars2.githubusercontent.com/u/6461311?v=4" width="100px;" alt="Evgeny Zhivitsa"/><br /><sub><b>Evgeny Zhivitsa</b></sub></a><br /><a href="https://github.com/paralect/nextjs-landing-starter/commits?author=ezhivitsa" title="Code">💻</a> <a href="#design-ezhivitsa" title="Design">🎨</a> <a href="#review-ezhivitsa" title="Reviewed Pull Requests">👀</a></td><td align="center"><a href="https://github.com/Mar1nka"><img src="https://avatars1.githubusercontent.com/u/25400321?v=4" width="100px;" alt="Mar1nka"/><br /><sub><b>Mar1nka</b></sub></a><br /><a href="https://github.com/paralect/nextjs-landing-starter/commits?author=Mar1nka" title="Code">💻</a> <a href="#ideas-Mar1nka" title="Ideas, Planning, & Feedback">🤔</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
