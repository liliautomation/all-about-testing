---
description: "Review new frontend components/routes and update e2e tests to cover them. Use when a new menu item, page, or feature has been added."
name: "Update E2E Tests"
argument-hint: "Describe the new feature or leave blank to auto-detect"
agent: "agent"
tools: [vscode, execute, read, agent, edit, search, web, browser, todo]
---

You are a QA engineer working in this project. Your job is to detect new frontend features and ensure the E2E test file covers them.

This project uses the **Page Object Model (POM)** pattern for all E2E tests. Every page has a corresponding POM class in `e2e/pages/`. Always follow this pattern — never write raw Playwright locators directly in spec files.

## POM Structure

```
e2e/
  pages/
    SubPage.ts               ← Abstract base: clickBack(), expectBackButtonVisible(), expectHeading()
    HomePage.ts              ← goto(), expectCardVisible(), clickCard(), navigateTo*()
    TestTypesPage.ts         ← extends SubPage
    TestStrategiesPage.ts    ← extends SubPage
    RoadmapPage.ts           ← extends SubPage
    AutomationDecisionPage.ts ← extends SubPage
    TestDataManagementPage.ts ← extends SubPage
  helpers/
    linkChecker.ts           ← checkLinksOnPage(), collectExternalHrefs(), checkUrl()
  link-checker.spec.ts       ← imports POMs and helpers; no raw locators
```

## Step 1 — Detect new features

Scan the following files for features not yet covered by the E2E spec:

- [App.tsx](../../frontend/src/App.tsx) — check the `View` type and all `{view === "..."}` render branches
- [HomePage.tsx](../../frontend/src/components/HomePage.tsx) — check the `categories` array for menu cards
- Any new `*Page.tsx` files in [frontend/src/components/](../../frontend/src/components/)

Compare against the existing tests in [link-checker.spec.ts](../../e2e/tests/link-checker.spec.ts) and the existing POM files in [e2e/pages/](../../e2e/pages/).

A feature is **not covered** if:
- No POM class exists for the page, OR
- The navigation test in the spec does not call that POM

## Step 2 — Confirm what needs adding

List each uncovered feature as:
- View ID (e.g. `test-data-management`)
- Menu button label (e.g. `Test Data Management`)
- Expected `h1` heading text (e.g. `🗄️ Test Data Management`)

## Step 3 — Create the POM class

For each uncovered page, create a new file `e2e/pages/<PageName>Page.ts`:

```ts
import { Page } from "@playwright/test";
import { SubPage } from "./SubPage";

export class <PageName>Page extends SubPage {
  constructor(page: Page) {
    super(page);
  }

  async expectHeadingVisible() {
    await this.expectHeading(/<h1 emoji and title>/i);
  }
}
```

Rules:
- Always extend `SubPage` — never extend `Page` directly
- Use `this.expectHeading(/<regex>/i)` for the page title assertion
- Add extra `expectContentLoaded()` methods only if the page loads async data from the backend

## Step 4 — Add a navigation method to HomePage

Open [e2e/pages/HomePage.ts](../../e2e/pages/HomePage.ts) and add:

```ts
async navigateTo<PageName>() {
  await this.clickCard(/<Menu Card Label>/i);
}
```

## Step 5 — Update the spec

In [link-checker.spec.ts](../../e2e/tests/link-checker.spec.ts), add a new block inside the existing `"home page renders and all navigation cards are clickable"` test, following the established pattern:

```ts
// ── <Page Title> ──────────────────────────────────────────────────────────
await home.expectCardVisible(/<Menu Card Label>/i);
await home.navigateTo<PageName>();
const <camelCase> = new <PageName>Page(page);
await <camelCase>.expectHeadingVisible();
await <camelCase>.clickBack();
await home.expectCardVisible(/Test Types/i);
```

Also add the POM import at the top of the spec file.

Rules:
- Do NOT remove or rewrite existing blocks
- Do NOT add new `test.describe` blocks — append inside the existing navigation test
- Import the new POM at the top of the spec file

## Step 6 — Verify

After editing, confirm:
- A POM file exists in `e2e/pages/` for every view in `App.tsx`
- `HomePage.ts` has a `navigateTo*()` method for every page
- The spec imports and uses every POM
- No raw `page.getByRole` / `page.goto` calls appear in the spec body (only in POM files)
- No duplicate test blocks exist
- No TypeScript errors

