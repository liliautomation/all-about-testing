---
name: create-test-strategy
description: Create a risk-based test strategy for a feature or change
agent: Test Strategist
argument-hint: Describe the feature, change, bug, or files to assess
---

Create a pragmatic, risk-based test strategy for `${input:scope:the requested feature or change}`.

Inspect the relevant code and existing tests before responding. Follow the
[shared testing instructions](../instructions/e2e.instructions.md) and use
the repository's current tools and architecture.

Return a concise Markdown strategy with these sections:

## Scope and Assumptions

Define the behavior being assessed, dependencies, and any unresolved facts.

## Risk Matrix

Use a table with: priority, risk or behavior, impact, likelihood, recommended
test level, and rationale.

## Coverage Plan

List concrete scenarios by unit, integration or API, and E2E level. Include only
levels that add distinct value. Identify existing coverage with file references
and distinguish new tests from updates.

## Test Data and Environment

Describe synthetic data, mocks, setup, cleanup, browsers, and environment needs.
Do not use production data, real PII, or secrets.

## Execution

List repository commands in the order they should run. Include focused checks
before full suites.

## Exclusions and Residual Risk

State what should not be tested now, why, and what risk remains.

Do not modify files unless the user explicitly asks for implementation.
