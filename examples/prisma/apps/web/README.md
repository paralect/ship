# Web Component

This is a [Next.js](https://nextjs.org/) web application starter,
designed to streamline the development of web frontends by addressing common setup and infrastructure tasks,
allowing developers to focus on unique features and business logic.

For more detailed information,
refer to the [API section in Ship documentation](https://ship.paralect.com/docs/web/overview).

## Getting Started

### Running the Application

You can start the application in two ways:

1. **Independent Start**: Navigate to the `web` folder and run:
   ```sh
   pnpm run dev
   ```
2. **Root Start**: From the root of the project, run:
   ```sh
   pnpm start
   ```

## Features

### Styling

- Leverage [Mantine](https://mantine.dev/) for robust UI development. Detailed styling guide available [here](https://ship.paralect.com/docs/web/styling).

### API Interactions

- Manage API calls efficiently using [Axios](https://axios-http.com/) and handle server state with [@tanstack/react-query](https://tanstack.com/query). Details on API interactions are [here](https://ship.paralect.com/docs/web/calling-api).

### Form Handling

- Implement forms using [React Hook Form](https://react-hook-form.com/) integrated with [Zod](https://zod.dev/) for schema validation. Explore more on form handling [here](https://ship.paralect.com/docs/web/forms).

### Services

- Use built-in service architecture for clean separation of concerns. Service implementation details can be found [here](https://ship.paralect.com/docs/web/services).

### Environment Variables

- Secure and manage application configuration using environment-specific `.env` files. Learn about managing environment variables [here](https://ship.paralect.com/docs/web/environment-variables).

## Development Tools

- **Storybook**: Develop UI components in isolation with [Storybook](https://storybook.js.org/), enhancing UI consistency and speeding up the development process.
- **Linting and Formatting**: Enforce coding standards using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/).
- **TypeScript**: Leverage TypeScript for safer and more reliable coding thanks to static type checking.
