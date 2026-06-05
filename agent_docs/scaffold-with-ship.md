# Scaffold a project with the Ship CLI

> Read this when starting a new Ship project from scratch: choosing the setup, picking plugins, and selecting a deployment target.

One command scaffolds a [pnpm](https://pnpm.io/) + [Turborepo](https://turbo.build/repo/docs) monorepo, copies your chosen plugins into the repo, and wires a deployment target — ready to run.

```bash
npx @paralect/ship init
```

`npx create-ship-app@latest init` resolves to the same CLI. Both run version **3.0.0**.

The CLI downloads the real template from [paralect/ship](https://github.com/paralect/ship), so what you scaffold is exactly what the docs describe — no abstraction layer between you and your code.

---

## The scaffold flow

`init` asks three questions, then builds the project.

### 1. Pick a setup

Two shapes:

- **PostgreSQL + TanStack Start** — full-stack. You get `apps/api` (Hono + oRPC + Drizzle + PostgreSQL) and `apps/web` (TanStack Start), with end-to-end types flowing from the API to the client.
- **TanStack Start web-only** — `apps/web` only, no `apps/api`. Backend logic runs as type-safe [server functions](../template/apps/web/.agents/skills/server-functions/SKILL.md) inside the Start server. No database, no API to maintain.

Both shapes start from the **same** `apps/web` base — a landing page plus a `getGreeting` server-function example. The difference is where data comes from.

### 2. Choose plugins

A multiselect — space to toggle, enter to confirm. Each plugin **merges into your codebase**, the same way `shadcn/ui` adds components: install copies the files in, and from then on every line is yours to edit, extend or delete.

| Plugin | What it adds | Requires |
| --- | --- | --- |
| `auth-starter` | better-auth wiring + the web sign-in/up pages and the authenticated app shell | full-stack |
| `admin` | Admin dashboard with a user list | `auth-starter` |
| `mailer` | Resend + React Email templates → `@ship/emails` | full-stack |
| `cloud-storage` | S3-compatible file upload (Garage in dev, Wasabi/AWS in prod) | full-stack |
| `notes` | Notes CRUD — a worked example resource | full-stack |
| `ai-chat` | Streaming AI chat via `@ship/ai` | `auth-starter` |

`auth-starter` and `admin` are pre-selected for the full-stack setup. In the **web-only** setup, plugins that need a backend are hidden — the multiselect only shows what works without `apps/api`.

### 3. Choose a deployment target

The CLI drops the matching CI workflows and infrastructure-as-code into your repo.

| Choice | `--deployment` shortcut |
| --- | --- |
| Digital Ocean Apps | `do-apps` |
| Render | `render` |
| Digital Ocean Managed Kubernetes | `do-kubernetes` |
| AWS EKS | `aws-eks` |

---

## A run looks like this

```text
Hey! Let's build your Ship 🚀

✔ What is the name of your project? … my-ship-app
? Which setup do you want? › - Use arrow-keys. Return to submit.
❯  PostgreSQL + TanStack Start (full-stack)
   TanStack Start web-only
? Which plugins do you want to install? (space to toggle, enter to confirm)
❯ ◉ auth-starter   better-auth wiring + web sign-in/up
  ◉ admin          Admin dashboard with a user list
  ◯ mailer         Resend + React Email templates
  ◯ cloud-storage  S3-compatible file upload
  ◯ notes          Notes CRUD — example resource
  ◯ ai-chat        Streaming AI chat via @ship/ai
? What deployment type would you like to use? › - Use arrow-keys. Return to submit.
❯  Digital Ocean Apps
   Render
   Digital Ocean Managed Kubernetes
   AWS EKS
```

Then start it:

```bash
cd my-ship-app
pnpm start
```

`pnpm start` brings up infrastructure, runs migrations, and starts every service.

---

## Non-interactive flags

Skip prompts by passing answers up front.

```bash
# name the directory (skips the name prompt)
npx @paralect/ship my-ship-app

# preselect the deployment target
npx @paralect/ship my-ship-app --deployment do-apps
```

The CLI validates the project name against npm rules and refuses to scaffold into a non-empty folder.

| Flag | Does |
| --- | --- |
| `<project-directory>` | Scaffold into a named directory (skips the name prompt) |
| `-d, --deployment <type>` | Preselect the deployment target (`do-apps`, `render`, `do-kubernetes`, `aws-eks`) |
| `-v, --version` | Print the CLI version |

---

## Adding plugins after scaffold

The CLI doesn't stop at scaffold time. From inside an existing Ship project, pull a plugin into your repo:

```bash
npx @paralect/ship install ai-chat
```

`install` copies the plugin's resources, routes and packages into your codebase — `apps/api/src/resources/...`, `apps/web/src/routes/...`, `packages/...` — so from then on every line is yours to edit.

| Command | Does |
| --- | --- |
| `init` | Scaffold a new project interactively |
| `install <plugin>` | Merge a plugin into the current project |

---

## Notes for agents

- Default database is **PostgreSQL**. The full-stack setup is `apps/api` (Hono + oRPC + Drizzle + PostgreSQL) + `apps/web` (TanStack Start). Don't assume any other database is on offer from the CLI.
- The web-only setup has **no** `apps/api` and **no** oRPC client — data access is [server functions](../template/apps/web/.agents/skills/server-functions/SKILL.md) only. Don't scaffold API resources into a web-only project.
- Auth is a plugin (`auth-starter`), not a framework built-in. The base `apps/web` has no auth; `auth-starter` adds the API wiring, the sign-in/up pages, the authenticated app shell and the oRPC client.
- Plugins MERGE into the repo (like shadcn/ui), they are not runtime dependencies. After `install`, edit them in place.
