# React Starter

React starter is what we think an ideal starting point for the most React.JS frontend applications. It is based on the following primary technologies:

- webpack
- react
- react-router
- redux-toolkit
- postcss
- eslint

Application structured in a way, which we find most efficient in both short and long term projects. The main intention of the current structure is to keep logical components close to each other and define clear structure for the common things, such as routers, store, api wrappers, slices, selectors.

### Start application.

Run ```npm start``` that will start the application using webpack-dev-server.

Or run ```docker-compose up --build``` for starting application inside a container using nginx as a server.

### Explanations of the files structure.

1. **[src/components](./src/components)** - this folder consist all UI components. Root level folders (such as [profile](./src/components/profile), [index](./src/components/index)) are typically pages of your application. Every such component should have all files related to the page: images, style files, jsx files, sub components. This folder also consist two none page components: [common](./src/components/common) and [layout](./src/components/common). *Common* folder should have all common components which are reused in **at least two** root level components. Layout - represent a layout of your application and should consist all layout related logic and other components, such as headers, footers, sidebars.
2. **[src/components/routes.jsx](./src/components/routes.jsx)** - this file should consist all routes for your client side application.
3. **[src/helpers](./src/helpers)** - this folder should consist of common helpers used in other components, such as date formatters, api wrappers, validation functions, common functions and all other files that does not fit current structure. If you don't know where to put certain file - put it into this folder and we will eventually figure out the right place for it.
4. **[src/resources](./src/resources/user)** - a folder consist of all redux/api related things. Typically resource maps 1 to 1 to the api endpoint, but not limited to only api endpoints. Every resource is responsible for management certain part of the redux store. If you need keep something client specific in the redux store, you can create separate resource for it. For example: navigation resource may contain some history of the all opened pages without 1 to 1 connection to the rest api. Main moving parts of resource:
    - **[src/resources/store.js](./src/resources/store.js)** - initialization logic for the redux store. Adds redux middlewares and combines all reducers.
    - **[src/resources/\*/\*.slice.js](./src/resources/user/user.slice.js)** - includes reducers, action creators, thunks.
    - **[src/resource/\*/\*.selectors.js](./src/resources/user/user.selectors.js)** - consist selectors for the given resource. You should never access store directly, but always use selectors instead. That would simplify things when structure of the store data changes.

Redux Toolkit has a ```createSlice``` API that will help us simplify our Redux reducer logic and actions. 

```createSlice``` does several important things for us:
* We can write the case reducers as functions inside of an object, instead of having to write a switch/case statement
* The reducers will be able to write shorter immutable update logic
* All the action creators will be generated automatically based on the reducer functions we've provided

5. **[src/services](./src/services)** - folder should consist the logic for the the third party service integrations (such as Intercom, Segment, etc). Not limited only to the third party services, but could consist some standalone application related services.

### Important things to keep in mind

1. Logical components should be tightly coupled. Keep all component related files, such as images, styles, sub components as close as possible to the component. Do not put component into the `common` folder for the *future use*.
2. Two separate page components should be loosely coupled. If there is two page components which use same image - keep two copies of every image within every page. Do not create generic images folder, as all images belong to some ui components.

### Conventions

1. Name of all files for components should start from lowercase letter and words should be separated by a dash (`date-range`, `multi-action-button`).
2. Code style (eslint).
