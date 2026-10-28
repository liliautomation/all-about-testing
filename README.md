# All About Testing

A React and Express reference app for software testing concepts, strategies, and practical QA guidance.

The frontend presents testing topics as navigable pages, while the backend serves structured testing content used by the dynamic pages.

## Tech Stack

- Frontend: React, Vite, TypeScript
- Backend: Node.js, Express, TypeScript
- Package manager: pnpm
- E2E testing: Playwright

## Features

- Test Types reference page backed by `/api/checklist`
- Test Strategies reference page backed by `/api/strategies`
- Dev Testing Roadmap page
- Automation Decision page
- Test Data Management page
- Playwright E2E tests using the Page Object Model pattern

## Setup

Install dependencies from the repository root:

```bash
pnpm install
```

If Playwright browsers are not installed yet, run:

```bash
pnpm exec playwright install
```

## Run Locally

Start the frontend and backend together:

```bash
pnpm dev
```

Or run them separately:

```bash
pnpm dev:backend
pnpm dev:frontend
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Checklist API: `http://localhost:3000/api/checklist`
- Strategies API: `http://localhost:3000/api/strategies`

## Testing

Run the Playwright E2E test suite:

```bash
pnpm test:e2e
```

Open the Playwright UI runner:

```bash
pnpm test:e2e:ui
```

Without `PLAYWRIGHT_BASE_URL`, Playwright starts the backend and frontend locally.
To test a deployed site instead, substitute its URL below:

```bash
PLAYWRIGHT_BASE_URL=https://example.com/all-about-testing/ pnpm test:e2e
```

When `PLAYWRIGHT_BASE_URL` is set, no local servers are started. Keep navigation
path-relative so the `/all-about-testing/` project path is preserved.

On pull requests, CI builds both applications. On matching pushes to `main`, the
Pages workflow builds and deploys the frontend, then runs E2E against the URL
returned by the deployment. Frontend, E2E, and root dependency changes trigger
this workflow; it can also be run manually. An E2E failure marks the workflow
failed and uploads diagnostics; the frontend has already been deployed.

## E2E Structure

```text
tests/e2e/
  helpers/
    linkChecker.ts
  pages/
    SubPage.ts
    HomePage.ts
    TestTypesPage.ts
    TestStrategiesPage.ts
    RoadmapPage.ts
    AutomationDecisionPage.ts
    TestDataManagementPage.ts
  tests/
    link-checker.spec.ts
  playwright.config.ts
```

Spec files should use page objects from `tests/e2e/pages/` instead of raw Playwright locators.

## Project Structure

```text
all-about-testing/
  apps/
    backend/    Express API
    frontend/   React UI
  tests/
    e2e/        Playwright tests
```

## Notes

- Ports `3000` and `5173` need to be available for local development.
- CORS is enabled for local frontend-to-backend requests.
