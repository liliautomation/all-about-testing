---
name: update-e2e-tests
description: Update Playwright coverage for application changes and verify it
agent: Test Strategist
argument-hint: Describe the changed behavior or provide relevant files
---

Update the Playwright E2E coverage for `${input:scope:the requested application change}`.

Follow the [shared testing instructions](../instructions/e2e.instructions.md)
and [Playwright instructions](../instructions/playwright.instructions.md).

1. Inspect the relevant application changes, current behavior, Playwright
   configuration, specs, page objects, and helpers.
2. Identify the user-visible behavior and regression risk. Use E2E coverage only
   where a cross-system user journey adds value; explain if no E2E change is
   warranted.
3. Update existing tests before adding overlapping specs. Reuse page objects and
   helpers when they improve clarity, but avoid unnecessary abstractions.
4. Implement the coverage using the linked instructions for locators, assertions,
   data, and reliability.
5. Follow the Playwright verification checklist: run the smallest affected spec,
   then `pnpm test:e2e`. Report blockers and unverified behavior if checks cannot run.
6. Run `pnpm security:scan` after changing tests or fixtures.

At completion, summarize:

- Behaviors and risks covered
- Files changed
- Commands run and their results
- Any unverified behavior, skipped checks, or remaining coverage gaps

