---
applyTo: "tests/e2e/**/*.ts"
---

# Playwright Instructions

Also follow the [shared testing instructions](e2e.instructions.md).

Follow these rules when creating or modifying Playwright tests, page objects,
helpers, fixtures, or configuration in `tests/e2e/`.

## Test Design

- Test user-visible behavior and outcomes rather than implementation details.
- Keep each test independent. Do not rely on test order or state created by
  another test.
- Use `test.describe` to group related scenarios and clear, behavior-focused
  test names that explain the expected outcome.
- Prefer focused tests with one logical user journey. Avoid duplicating coverage
  that belongs in unit or integration tests.
- Navigate and prepare state through fixtures, APIs, or explicit setup. Avoid
  setup through the UI unless the setup flow itself is under test.
- Use `test.step` only when it makes a long workflow materially easier to debug.
- Do not commit `test.only`, `test.skip`, or arbitrary retries as a substitute
  for fixing a flaky test. Add annotations only with a documented reason.

## Locators and Assertions

- Prefer resilient, user-facing locators in this order: `getByRole`,
  `getByLabel`, `getByPlaceholder`, `getByText`, and `getByTestId` when no
  meaningful accessible locator exists.
- Include accessible names in role locators where possible, for example
  `page.getByRole("button", { name: "Submit" })`.
- Avoid brittle CSS or XPath selectors, DOM traversal, positional selectors,
  and implementation-specific classes or IDs.
- Scope ambiguous locators with `locator.filter`, a parent region, or a more
  specific accessible name. Use `first`, `last`, or `nth` only when position is
  the behavior being tested.
- Use Playwright's web-first assertions such as `await expect(locator).toBeVisible()`.
  They auto-wait and produce useful diagnostics.
- Assert the final observable result of an action. Do not use assertions only
  to wait or replace them with manual polling.

## Waiting and Reliability

- Rely on Playwright's actionability checks and auto-waiting.
- Never use `page.waitForTimeout` or fixed sleeps. Wait for a meaningful UI,
  URL, response, or application-state condition instead.
- Start waiting for an event before triggering it when required. For example,
  create a `page.waitForResponse` promise before the click that causes it.
- Avoid `networkidle` as a general readiness signal. Assert the specific UI
  state that tells a user the page is ready.
- Keep tests deterministic. Control unstable external services, time, and test
  data when they are not the behavior under test.
- Do not hide failures with broad `try/catch` blocks or conditional assertions.

## Page Objects and Helpers

- Keep selectors and reusable page behavior in `tests/e2e/pages/`. Keep assertions in
  tests unless an assertion represents a stable, reusable page contract.
- Page objects should receive Playwright's `Page` or a scoped `Locator` through
  their constructor. Expose intent-based methods such as `submitForm`, not raw
  selector details.
- Keep page objects small and composable. Do not create a page object for a
  one-off interaction or turn page objects into test frameworks.
- Put cross-page utilities in `tests/e2e/helpers/`. Prefer Playwright fixtures when
  reusable setup or teardown requires lifecycle management.
- Do not share mutable page objects, browser contexts, pages, or test data
  between tests.

## Network, Data, and Security

- Use the `request` fixture for direct API setup and API assertions.
- Register `page.route` handlers before navigation or the action that sends the
  request, and keep mocked responses contract-accurate.
- Mock only boundaries that need control. Prefer exercising local frontend and
  backend integration for the main user journey.
- Generate unique data for tests that mutate shared state, and clean it up with
  fixtures or `try/finally` when necessary.
- Never hardcode credentials, tokens, or other secrets. Read them from
  environment variables and fail with a clear message when required values are
  missing.
- Do not commit generated artifacts such as traces, screenshots, videos,
  reports, or `test-results/`.

## Project Conventions

- Place specs in `tests/e2e/tests/` with the `*.spec.ts` suffix.
- Reuse existing page objects in `tests/e2e/pages/` and helpers in `tests/e2e/helpers/`
  before introducing new abstractions.
- Use the configured `baseURL`; navigate with `./` or other path-relative URLs
  so the deployed GitHub Pages project path is preserved. Avoid leading `/`
  paths and hardcoded hosts.
- Keep TypeScript strict and readable. Do not use `any` unless an external API
  makes it unavoidable and the reason is documented.
- Preserve the configured Chromium project. With `PLAYWRIGHT_BASE_URL` set,
  tests target that deployed URL and do not start local servers. Without it,
  retain the local `webServer` integration.
- In GitHub Actions, E2E runs only after a successful Pages deployment and uses
  its output URL. Pull request CI builds the applications without running E2E.
- Run all end-to-end tests from the repository root with `pnpm test:e2e`.
- During development, run a focused spec with
  `pnpm exec playwright test tests/e2e/tests/<name>.spec.ts --config=tests/e2e/playwright.config.ts`.
- Use `pnpm test:e2e:ui` for interactive debugging. Prefer traces and the
  Playwright report over adding debug sleeps or permanent logging.

## Completion Checklist

Before finalizing tests, ensure:

- Locators prefer accessible roles and names, identify the intended element
  uniquely, and avoid strict mode violations.
- Tests are grouped logically and follow a clear arrange, act, assert
  structure.
- Assertions verify meaningful, user-visible outcomes.
- Test names consistently describe the behavior and expected result.
- Code follows repository formatting conventions; comments explain
  non-obvious intent.

Complete these verification steps:

- Confirm the test fails for the missing or broken behavior before relying on
  it as regression coverage when practical.
- Run the smallest relevant test first, then `pnpm test:e2e` before completion.
  If a check cannot run, report the blocker and unverified behavior as required
  by the shared testing instructions.
- Check that tests pass without ordering dependencies and do not leave data or
  browser state behind.
- Ensure failure output identifies the user-visible expectation and is useful
  from CI artifacts alone.
