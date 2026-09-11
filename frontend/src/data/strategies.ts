export interface StrategyPrinciple {
  text: string;
  url: string;
  sample: string;
}

export interface Tool {
  name: string;
  url: string;
}

export interface TestStrategy {
  name: string;
  description: string;
  principles: StrategyPrinciple[];
  tools: Tool[];
}

export function getTestStrategies(): TestStrategy[] {
  return [
    {
      name: "Test-Driven Development (TDD)",
      description:
        "Write a failing test before writing production code, then write the minimum code to pass it, then refactor — the Red–Green–Refactor cycle.",
      principles: [
        {
          text: "Red — write a failing test first, before any production code exists",
          url: "https://jestjs.io/docs/getting-started",
          sample: `it("adds two numbers", () => {
  expect(add(2, 3)).toBe(5); // fails — add() doesn't exist yet
});`,
        },
        {
          text: "Green — write the simplest code that makes the test pass",
          url: "https://jestjs.io/docs/getting-started",
          sample: `function add(a: number, b: number) {
  return a + b; // minimal implementation
}`,
        },
        {
          text: "Refactor — clean up the code while keeping all tests green",
          url: "https://refactoring.guru/refactoring",
          sample: `// Extract shared logic, improve naming, remove duplication
// Re-run tests after every change to confirm nothing broke`,
        },
        {
          text: "Keep each Red–Green–Refactor cycle short (under 5 minutes)",
          url: "https://jestjs.io/docs/cli#--watch",
          sample: `# Run tests in watch mode for instant feedback
jest --watch`,
        },
        {
          text: "Test behaviour and outcomes, not internal implementation details",
          url: "https://testing-library.com/docs/guiding-principles",
          sample: `// Test what the function returns, not how it works inside
expect(formatCurrency(1050)).toBe("£10.50");`,
        },
      ],
      tools: [
        { name: "Jest", url: "https://jestjs.io" },
        { name: "Vitest", url: "https://vitest.dev" },
        { name: "Mocha + Chai", url: "https://mochajs.org" },
      ],
    },
    {
      name: "Behaviour-Driven Development (BDD)",
      description:
        "Describe system behaviour in plain language (Given/When/Then) that is shared between developers, testers, and stakeholders, then automate those descriptions as tests.",
      principles: [
        {
          text: "Write scenarios in Given/When/Then format understandable by non-engineers",
          url: "https://cucumber.io/docs/gherkin/reference/",
          sample: `Feature: User login
  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When they enter valid credentials
    Then they are redirected to the dashboard`,
        },
        {
          text: "Collaborate on scenarios before writing code ('Three Amigos' sessions)",
          url: "https://cucumber.io/docs/bdd/",
          sample: `// Three Amigos = developer + tester + product owner
// Meet before each story to write examples together
// Uncover missing requirements and edge cases early`,
        },
        {
          text: "Map each Given/When/Then step to an automated step definition",
          url: "https://cucumber.io/docs/cucumber/step-definitions/",
          sample: `When("they enter valid credentials", async () => {
  await page.fill('[name=email]', 'user@example.com');
  await page.fill('[name=password]', 'secret');
  await page.click('[type=submit]');
});`,
        },
        {
          text: "Use the ubiquitous language of the domain in all scenario names",
          url: "https://martinfowler.com/bliki/UbiquitousLanguage.html",
          sample: `// Use domain terms consistently across code, tests, and docs
// Say "order" not "record", "checkout" not "submit form"`,
        },
        {
          text: "Treat feature files as living documentation — keep them in sync with code",
          url: "https://cucumber.io/docs/guides/",
          sample: `# features/ folder lives alongside src/
# Feature files committed in the same PR as the implementation`,
        },
      ],
      tools: [
        { name: "Cucumber.js", url: "https://cucumber.io/docs/installation/javascript/" },
        { name: "Playwright + BDD", url: "https://github.com/vitalets/playwright-bdd" },
        { name: "Cypress Cucumber Preprocessor", url: "https://github.com/badeball/cypress-cucumber-preprocessor" },
        { name: "Jest-Cucumber", url: "https://github.com/bencompton/jest-cucumber" },
      ],
    },
    {
      name: "Acceptance Test-Driven Development (ATDD)",
      description:
        "Derive automated acceptance tests directly from user stories and acceptance criteria before development begins, so that 'done' is defined by passing tests.",
      principles: [
        {
          text: "Define acceptance criteria as automatable tests before a story enters development",
          url: "https://www.agilealliance.org/glossary/atdd/",
          sample: `// User story: "As a user I can reset my password"
// Acceptance test written before coding starts:
it("sends a reset email when a valid address is submitted", async () => {
  await request(app).post("/auth/reset").send({ email: "a@b.com" });
  expect(mockMailer.send).toHaveBeenCalledWith("a@b.com");
});`,
        },
        {
          text: "Involve the whole team (dev, QA, PO) in writing acceptance tests",
          url: "https://www.agilealliance.org/glossary/atdd/",
          sample: `// Workshop format (30 min per story):
// 1. Read the user story aloud
// 2. Write examples as Given/When/Then
// 3. Identify unhappy paths and edge cases
// 4. Agree on the definition of done`,
        },
        {
          text: "Automate acceptance tests before implementing the feature (TDD at story level)",
          url: "https://cucumber.io/docs/bdd/",
          sample: `// 1. Write .feature file with acceptance scenarios  ← before coding
// 2. Run Cucumber — all scenarios fail (RED)
// 3. Implement the feature
// 4. Run Cucumber — all scenarios pass (GREEN)`,
        },
        {
          text: "A story is only 'done' when all its acceptance tests pass in CI",
          url: "https://www.agilealliance.org/glossary/definition-of-done/",
          sample: `# GitHub Actions — PR is blocked until acceptance tests pass
- name: Run acceptance tests
  run: pnpm test:acceptance`,
        },
      ],
      tools: [
        { name: "Cucumber.js", url: "https://cucumber.io/docs/installation/javascript/" },
        { name: "Robot Framework", url: "https://robotframework.org" },
        { name: "FitNesse", url: "http://fitnesse.org" },
        { name: "Playwright", url: "https://playwright.dev" },
      ],
    },
    {
      name: "Test Pyramid",
      description:
        "Structure your test suite in layers — many fast unit tests at the base, fewer integration tests in the middle, and a small number of E2E tests at the top — to maximise confidence while minimising cost and run time.",
      principles: [
        {
          text: "Build the base with many fast, isolated unit tests (~70% of the suite)",
          url: "https://martinfowler.com/bliki/TestPyramid.html",
          sample: `// Fast, cheap, high coverage of business logic
// Run in milliseconds, give instant feedback
it("calculates VAT at 20%", () => {
  expect(applyVat(100)).toBe(120);
});`,
        },
        {
          text: "Use integration tests to verify module seams (~20% of the suite)",
          url: "https://martinfowler.com/bliki/TestPyramid.html",
          sample: `// Test that the route, service, and DB work together
const res = await request(app).post("/api/orders").send(order);
expect(res.status).toBe(201);`,
        },
        {
          text: "Reserve E2E tests for critical user journeys only (~10% of the suite)",
          url: "https://martinfowler.com/bliki/TestPyramid.html",
          sample: `// Cover checkout, login, core workflows — not every permutation
test("user can complete checkout end-to-end", async ({ page }) => {
  await page.goto("/shop");
  // ...
});`,
        },
        {
          text: "Avoid the ice cream cone antipattern — more E2E than unit tests",
          url: "https://martinfowler.com/bliki/TestPyramid.html",
          sample: `// ❌ Ice cream cone: many manual/E2E tests, few unit tests
// ✅ Pyramid: automate at the lowest practical level
// Rule: if a unit test can cover it, don't write an E2E test for it`,
        },
        {
          text: "If unit tests are hard to write, the design likely needs improvement",
          url: "https://martinfowler.com/bliki/TestPyramid.html",
          sample: `// Hard-to-test code often signals tight coupling or hidden globals
// Use the pain as feedback to improve the design`,
        },
      ],
      tools: [
        { name: "Jest", url: "https://jestjs.io" },
        { name: "Vitest", url: "https://vitest.dev" },
        { name: "Supertest", url: "https://github.com/ladjs/supertest" },
        { name: "Playwright", url: "https://playwright.dev" },
        { name: "Cypress", url: "https://www.cypress.io" },
      ],
    },
    {
      name: "Shift-Left Testing",
      description:
        "Move testing activities earlier in the development lifecycle — into design, planning, and coding — so defects are found and fixed when they are cheapest to address.",
      principles: [
        {
          text: "Include testers in sprint planning and requirements review before coding starts",
          url: "https://agilealliance.org/agile101/agile-glossary/",
          sample: `// Tester joins the story refinement session
// Raises ambiguities, edge cases, and testability concerns
// Acceptance criteria agreed before the sprint begins`,
        },
        {
          text: "Write tests alongside the feature code in the same pull request",
          url: "https://jestjs.io/docs/getting-started",
          sample: `# PR checklist:
# [ ] Unit tests added for new logic
# [ ] Integration test updated if API changed
# [ ] No reduction in code coverage`,
        },
        {
          text: "Run static analysis, type checking, and linting on every save and pre-commit",
          url: "https://typicode.github.io/husky/",
          sample: `# .husky/pre-commit
npx lint-staged
# lint-staged.config.js: run eslint + tsc --noEmit on staged files`,
        },
        {
          text: "Fail the CI pipeline early on quality gates before running slow tests",
          url: "https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions",
          sample: `jobs:
  lint:      # fast — runs first
    runs-on: ubuntu-latest
    steps: [run: pnpm lint]
  unit:      # depends on lint passing
    needs: lint
    steps: [run: pnpm test:unit]`,
        },
        {
          text: "Automate security and dependency scanning as part of every CI run",
          url: "https://snyk.io",
          sample: `- name: Snyk security scan
  run: snyk test --severity-threshold=high`,
        },
      ],
      tools: [
        { name: "ESLint", url: "https://eslint.org" },
        { name: "Husky", url: "https://typicode.github.io/husky/" },
        { name: "GitHub Actions", url: "https://docs.github.com/en/actions" },
        { name: "SonarQube", url: "https://www.sonarsource.com/products/sonarqube/" },
        { name: "Snyk", url: "https://snyk.io" },
      ],
    },
    {
      name: "Continuous Testing",
      description:
        "Execute automated tests as part of every CI/CD pipeline run so every commit receives rapid, automated quality feedback.",
      principles: [
        {
          text: "Trigger the full test suite automatically on every push and pull request",
          url: "https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions",
          sample: `on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install && pnpm test`,
        },
        {
          text: "Keep the suite fast enough to complete in under 10 minutes",
          url: "https://jestjs.io/docs/cli#--maxworkersnumstring",
          sample: `# Parallelise with multiple workers
jest --maxWorkers=4

# Or shard tests across CI runners
jest --shard=1/4`,
        },
        {
          text: "Block pull request merges when any test or quality gate fails",
          url: "https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches",
          sample: `// GitHub branch protection settings:
// ✅ "Require status checks to pass before merging"
// ✅ "Require branches to be up to date before merging"`,
        },
        {
          text: "Run test stages in parallel to shrink end-to-end pipeline time",
          url: "https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions",
          sample: `jobs:
  unit: { runs-on: ubuntu-latest }
  integration: { runs-on: ubuntu-latest }
  e2e:
    needs: [unit, integration]
    runs-on: ubuntu-latest`,
        },
        {
          text: "Track test health over time — quarantine or fix flaky tests immediately",
          url: "https://jestjs.io/docs/configuration#reporters-arraymodulename--modulename-options",
          sample: `// Report results to a dashboard
jest --reporters=default --reporters=jest-junit
# Upload JUnit XML to CI test analytics`,
        },
      ],
      tools: [
        { name: "GitHub Actions", url: "https://docs.github.com/en/actions" },
        { name: "CircleCI", url: "https://circleci.com" },
        { name: "GitLab CI", url: "https://docs.gitlab.com/ee/ci/" },
        { name: "Jest", url: "https://jestjs.io" },
        { name: "Playwright", url: "https://playwright.dev" },
      ],
    },
    {
      name: "Risk-Based Testing",
      description:
        "Prioritise test coverage based on the likelihood and business impact of failure, focusing testing effort where it matters most and consciously accepting risk where it is low.",
      principles: [
        {
          text: "Identify and score risks by likelihood × impact before each release",
          url: "https://www.ministryoftesting.com/software-testing-glossary/risk-based-testing",
          sample: `// Risk matrix example:
// | Feature         | Likelihood | Impact | Priority |
// | Payment flow    | Medium     | High   | P1       |
// | Export to CSV   | Low        | Medium | P2       |
// | Profile avatar  | Low        | Low    | P3       |`,
        },
        {
          text: "Allocate more test depth and breadth to P1 areas",
          url: "https://www.ministryoftesting.com/software-testing-glossary/risk-based-testing",
          sample: `// P1 (high risk): full regression + exploratory session
// P2 (medium risk): smoke test + happy path automation
// P3 (low risk): smoke test only`,
        },
        {
          text: "Use code coverage data to find undertested high-risk modules",
          url: "https://jestjs.io/docs/configuration#collectcoveragefrom-array",
          sample: `jest --coverage --collectCoverageFrom="src/payments/**"
# Review coverage report — any gaps in high-risk code?`,
        },
        {
          text: "Review and update the risk register at the start of each sprint",
          url: "https://www.ministryoftesting.com/software-testing-glossary/risk-based-testing",
          sample: `// Risk register lives in team wiki / Confluence
// Reviewed during sprint planning or retrospective
// Update after incidents, near-misses, or scope changes`,
        },
        {
          text: "Document accepted residual risk explicitly with sign-off from the PO",
          url: "https://www.istqb.org",
          sample: `// Known gap documented in the story:
// "Payment retry edge case not covered in automation.
//  Risk accepted by PO on 2026-01-15 — low traffic path."`,
        },
      ],
      tools: [
        { name: "Jira", url: "https://www.atlassian.com/software/jira" },
        { name: "TestRail", url: "https://www.testrail.com" },
        { name: "SonarQube", url: "https://www.sonarsource.com/products/sonarqube/" },
        { name: "Jest coverage", url: "https://jestjs.io/docs/configuration#collectcoverage-boolean" },
      ],
    },
    {
      name: "Exploratory Testing",
      description:
        "Simultaneously design and execute tests based on learning about the system, uncovering defects that scripted tests miss through curiosity and structured exploration.",
      principles: [
        {
          text: "Define a focused test charter before each session to guide exploration",
          url: "https://www.satisfice.com/download/session-based-test-management",
          sample: `// Charter example:
// "Explore the checkout flow as a first-time user
//  with an expired payment card, focusing on error
//  messages and recovery paths."`,
        },
        {
          text: "Time-box each session to 60–90 minutes to maintain focus",
          url: "https://www.satisfice.com/download/session-based-test-management",
          sample: `// Session log:
// Charter:  Explore registration with edge-case email formats
// Start:    10:00
// End:      11:30
// Coverage: Normal flow, special chars, very long emails`,
        },
        {
          text: "Take structured notes and log bugs as you discover them",
          url: "https://www.satisfice.com/download/session-based-test-management",
          sample: `// Bug report template:
// Observed:  Submitting "" as email shows a 500 error
// Expected:  Validation error "Email is required"
// Reproduce: 1. Open /register  2. Leave email blank  3. Submit`,
        },
        {
          text: "Debrief after each session to share findings with the team",
          url: "https://www.satisfice.com/download/session-based-test-management",
          sample: `// 15-min debrief agenda:
// 1. What did you explore?
// 2. What bugs did you find?
// 3. What areas need more exploration next session?`,
        },
        {
          text: "Convert recurring exploratory findings into automated regression tests",
          url: "https://jestjs.io/docs/getting-started",
          sample: `// Bug found during exploration → write a failing test first
it("returns 422 when email field is blank", async () => {
  const res = await request(app).post("/api/register").send({});
  expect(res.status).toBe(422);
});
// Then fix the bug`,
        },
      ],
      tools: [
        { name: "Testpad", url: "https://testpad.com" },
        { name: "qTest Insights", url: "https://www.tricentis.com/products/unified-test-management-qtest" },
        { name: "Jira", url: "https://www.atlassian.com/software/jira" },
        { name: "Confluence", url: "https://www.atlassian.com/software/confluence" },
      ],
    },
  ];
}
