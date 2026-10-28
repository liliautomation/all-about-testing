---
applyTo: "tests/e2e/**/*.ts,**/*.test.js,**/*.test.jsx,**/*.test.ts,**/*.test.tsx,**/*.spec.js,**/*.spec.jsx,**/*.spec.ts,**/*.spec.tsx,**/test/**,**/tests/**,**/*test*.config.js,**/*test*.config.cjs,**/*test*.config.mjs,**/*test*.config.ts"
---

# Testing Instructions

Use these shared standards for all test code and test configuration. For files
under `tests/e2e/`, also follow `playwright.instructions.md`; its Playwright-specific
rules take precedence when guidance overlaps.

## Scope and Value

- Test observable behavior and stable contracts, not private implementation
  details.
- Choose the lowest test level that provides confidence: unit tests for isolated
  logic, integration tests for boundaries, and end-to-end tests for critical
  user journeys.
- Cover meaningful success, failure, boundary, and permission cases based on
  risk. Do not optimize for test count or coverage percentage alone.
- Add regression coverage for defects and demonstrate that it fails for the
  broken behavior when practical.
- Avoid duplicating the same assertion across several test levels unless each
  level protects a distinct risk.

## Test Quality

- Give tests behavior-focused names that state the condition and expected
  outcome.
- Keep tests independent, deterministic, and safe to run in any order or in
  parallel.
- Follow arrange, act, assert structure without comments when the phases are
  already clear.
- Assert outcomes precisely. Avoid assertions that pass without proving the
  requested behavior.
- Prefer real collaborators when they are fast and deterministic. Mock only
  external systems, expensive boundaries, or behavior that must be controlled.
- Keep fixtures minimal and explicit. Use synthetic data, reserved example
  domains, and unique values when tests mutate shared state.
- Never add real personal data, credentials, tokens, or production data to
  tests, snapshots, fixtures, logs, or generated artifacts.

## Reliability and Maintenance

- Do not use fixed delays, test ordering, retries, or broad exception handling
  to conceal flaky behavior.
- Clean up resources and state created by a test, preferably through the test
  framework's lifecycle facilities.
- Reuse helpers only when they improve intent or remove meaningful duplication.
  Avoid abstractions that hide the behavior under test.
- Keep production changes separate from test-only conveniences unless the
  production seam is useful in its own right.
- Do not commit focused, skipped, quarantined, or snapshot-updated tests without
  an explicit and documented reason.

## Verification

- Run the smallest affected test set while developing, then the relevant suite
  before completion.
- Report changed coverage, exact commands run, results, and remaining gaps.
  If a required check cannot run, explain the blocker and mark it unverified.
- Never claim a test passed unless you ran it successfully.
- Treat failures as signals to investigate. Do not weaken assertions merely to
  make a test pass.
- Run `pnpm security:scan` before pushing test data or fixtures.
