# API Component

A fully featured [Koa.JS](https://koajs.com/) RESTful API starter application
designed to handle routine tasks, so you can focus on your product's business logic.

For more detailed information,
refer to the [API section in Ship documentation](https://ship.paralect.com/docs/api-reference/overview).

## Getting Started

### Prerequisites

Ensure you have a `.env` file. If not, create one by copying the `.env.example` file:

```sh
cp .env.example .env
```

### Running the Application

You can start the application in two ways:

1. **Independent Start**: Navigate to the `api` folder and run:
   ```sh
   pnpm run dev
   ```
2. **Root Start**: From the root of the project, run:
   ```sh
   pnpm start
   ```
   This also starts the [developer dashboards](#developer-dashboards) (DB studio + API docs).

## Features

### Configuration and Management

- **Config Management**: Configuration management with schema validation.
- **Logging**: Configured console logger for effective debugging.
- **Environment Handling**: Supports both development and production environments with Docker configuration.

### Development Tools

- **Automatic Restart**: Utilizes [tsx](https://tsx.is/) for automatic application restart on code changes.
- **Code Quality**: Enforces code linting with [ESLint](https://eslint.org/) and formatting with [Prettier](https://prettier.io/).
- **TypeScript Support**: Full support for TypeScript for a better development experience.

### Developer Dashboards

Two interactive dashboards are available during development (both auto-started by `pnpm start`):

- **Database Studio** — visual table/relations browser + query runner (Drizzle Studio).
  - URL: <https://local.drizzle.studio> (proxy on `:4983`)
  - Standalone: `pnpm dashboard` (alias for `pnpm --filter api studio`)
  - Requires the PostgreSQL plugin; no-op on Mongo / web-only.
- **API Documentation** — interactive OpenAPI reference with "try it out" (Scalar).
  - URL: <http://localhost:3001/docs>
  - Raw spec: <http://localhost:3001/spec.json> (OpenAPI 3.1.1, generated live from the oRPC router)
  - Served in-process by the API; non-production only.

### API and Authentication

- **Account API**: Provides production-ready account functionalities including Sign Up, Sign In, Forgot Password, and Reset Password.
- **Authentication**: Implements access token-based authentication.

### Data Handling

- **Request Validation**: Simplified request data validation and sanitization with [Zod](https://zod.dev/).
- **Database**: Configuration for MongoDB, including migrations.

### Communication and Scheduling

- **WebSocket**: Integrated WebSocket server using [socket.io](https://socket.io/).
- **Scheduler**: Task scheduling based on cron jobs.
