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

The Playwright config starts the backend and frontend automatically when needed.

## E2E Structure

```text
e2e/
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

Spec files should use page objects from `e2e/pages/` instead of raw Playwright locators.

## Project Structure

```text
all-about-testing/
  backend/      Express API
  frontend/     React UI
  e2e/          Playwright tests
```

## Notes

- Ports `3000` and `5173` need to be available for local development.
- CORS is enabled for local frontend-to-backend requests.
