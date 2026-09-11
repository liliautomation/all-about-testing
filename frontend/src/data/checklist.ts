export interface Tool {
  name: string;
  url: string;
}

export interface BestPractice {
  text: string;
  url: string;
  sample: string;
}

export interface TestingTopic {
  name: string;
  description: string;
  bestPractices: BestPractice[];
  tools: Tool[];
}

export function getTestingTopics(): TestingTopic[] {
  return [
    {
      name: "Unit Testing",
      description:
        "Tests individual functions, classes, or modules in complete isolation from their dependencies.",
      bestPractices: [
        {
          text: "Follow Arrange–Act–Assert (AAA) structure in every test",
          url: "https://jestjs.io/docs/getting-started",
          sample: `// Arrange
const user = { name: "Alice", age: 17 };
// Act
const result = isAdult(user);
// Assert
expect(result).toBe(false);`,
        },
        {
          text: "Test one behaviour per test case",
          url: "https://jestjs.io/docs/api#testname-fn-timeout",
          sample: `it("returns false for users under 18", () => {
  expect(isAdult({ age: 17 })).toBe(false);
});`,
        },
        {
          text: "Use descriptive names: 'should return null when input is empty'",
          url: "https://jestjs.io/docs/api#testname-fn-timeout",
          sample: `it("should return null when input is empty", () => {
  expect(parse("")).toBeNull();
});`,
        },
        {
          text: "Keep tests fast and deterministic — no I/O, no network",
          url: "https://jestjs.io/docs/jest-object#jestfnimplementation",
          sample: `jest.mock("./db", () => ({
  query: jest.fn().mockResolvedValue([]),
}));`,
        },
        {
          text: "Mock or stub all external dependencies at the module boundary",
          url: "https://jestjs.io/docs/mock-functions",
          sample: `const fetchUser = jest.fn().mockResolvedValue({ id: 1, name: "Alice" });
const result = await getProfile(fetchUser, 1);
expect(fetchUser).toHaveBeenCalledWith(1);`,
        },
        {
          text: "Aim for high coverage of business logic, not framework glue code",
          url: "https://jestjs.io/docs/configuration#collectcoveragefrom-array",
          sample: `// jest.config.ts
collectCoverageFrom: [
  "src/**/*.ts",
  "!src/**/*.config.ts",
  "!src/index.ts",
]`,
        },
      ],
      tools: [
        { name: "Jest", url: "https://jestjs.io" },
        { name: "Vitest", url: "https://vitest.dev" },
        { name: "Mocha + Chai", url: "https://mochajs.org" },
        { name: "Jasmine", url: "https://jasmine.github.io" },
        { name: "node:test (built-in)", url: "https://nodejs.org/api/test.html" },
      ],
    },
    {
      name: "Integration Testing",
      description:
        "Verifies that multiple modules or services interact correctly — e.g. a route handler wiring together a service and a database.",
      bestPractices: [
        {
          text: "Test at the seam between components, not inside each one",
          url: "https://github.com/ladjs/supertest#readme",
          sample: `const res = await request(app).get("/api/users/1");
expect(res.status).toBe(200);
expect(res.body).toHaveProperty("name");`,
        },
        {
          text: "Use real implementations where practical; mock only at external boundaries",
          url: "https://testcontainers.com/guides/getting-started-with-testcontainers-for-nodejs/",
          sample: `const pg = await new PostgreSqlContainer().start();
const db = new Database(pg.getConnectionUri());
// use real DB, no mocks`,
        },
        {
          text: "Reset state (DB, cache) before each test",
          url: "https://jestjs.io/docs/configuration#setupfilesafterframework-array",
          sample: `beforeEach(async () => {
  await db.query("TRUNCATE users RESTART IDENTITY CASCADE");
});`,
        },
        {
          text: "Keep scope narrow — don't let integration tests become system tests",
          url: "https://martinfowler.com/bliki/IntegrationTest.html",
          sample: `// Test only the repository layer + DB, not the full HTTP stack
const result = await userRepo.findById(1);
expect(result.name).toBe("Alice");`,
        },
        {
          text: "Run in a CI environment that mirrors production dependencies",
          url: "https://testcontainers.com",
          sample: `# GitHub Actions
services:
  postgres:
    image: postgres:16
    env:
      POSTGRES_PASSWORD: test`,
        },
      ],
      tools: [
        { name: "Jest", url: "https://jestjs.io" },
        { name: "Vitest", url: "https://vitest.dev" },
        { name: "Supertest", url: "https://github.com/ladjs/supertest" },
        { name: "Testcontainers", url: "https://testcontainers.com" },
        { name: "Mocha", url: "https://mochajs.org" },
      ],
    },
    {
      name: "End-to-End (E2E) Testing",
      description:
        "Simulates complete user journeys through the full stack in a real or headless browser.",
      bestPractices: [
        {
          text: "Cover critical user flows only — keep the suite small",
          url: "https://playwright.dev/docs/best-practices",
          sample: `test("user can complete checkout", async ({ page }) => {
  await page.goto("/shop");
  await page.getByTestId("add-to-cart").click();
  await page.getByTestId("checkout").click();
  await expect(page.getByTestId("confirmation")).toBeVisible();
});`,
        },
        {
          text: "Use stable selectors: data-testid attributes or ARIA roles",
          url: "https://playwright.dev/docs/locators",
          sample: `// Good — role-based
await page.getByRole("button", { name: "Submit" }).click();

// Avoid — brittle CSS
await page.click(".btn-primary > span:nth-child(2)");`,
        },
        {
          text: "Avoid asserting on implementation details (CSS classes, DOM structure)",
          url: "https://testing-library.com/docs/queries/about#priority",
          sample: `// Good — visible text
await expect(page.getByText("Order confirmed")).toBeVisible();

// Avoid — internal class
await expect(page.locator(".alert-success")).toBeVisible();`,
        },
        {
          text: "Run against a seeded, reproducible environment",
          url: "https://playwright.dev/docs/test-fixtures",
          sample: `test.beforeEach(async ({ request }) => {
  await request.post("/api/seed", {
    data: { scenario: "checkout" },
  });
});`,
        },
        {
          text: "Quarantine flaky tests immediately rather than tolerating them",
          url: "https://playwright.dev/docs/test-annotations#tag-tests",
          sample: `test.fixme(
  "flaky checkout test — investigating #123",
  async ({ page }) => { /* ... */ }
);`,
        },
        {
          text: "Parallelise across browsers in CI to keep feedback loops short",
          url: "https://playwright.dev/docs/test-parallel",
          sample: `// playwright.config.ts
projects: [
  { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  { name: "firefox",  use: { ...devices["Desktop Firefox"] } },
  { name: "webkit",   use: { ...devices["Desktop Safari"] } },
],`,
        },
      ],
      tools: [
        { name: "Playwright", url: "https://playwright.dev" },
        { name: "Cypress", url: "https://www.cypress.io" },
        { name: "Selenium WebDriver", url: "https://www.selenium.dev" },
        { name: "Puppeteer", url: "https://pptr.dev" },
      ],
    },
    {
      name: "Component Testing",
      description:
        "Renders individual UI components in isolation to verify their behaviour and output without a full browser or app context.",
      bestPractices: [
        {
          text: "Query by accessible roles and labels (getByRole, getByLabelText), not test IDs",
          url: "https://testing-library.com/docs/queries/byrole",
          sample: `const btn = screen.getByRole("button", { name: /submit/i });
expect(btn).toBeEnabled();`,
        },
        {
          text: "Test user-facing behaviour, not internal state or implementation",
          url: "https://testing-library.com/docs/guiding-principles",
          sample: `await userEvent.type(screen.getByLabelText("Email"), "a@b.com");
await userEvent.click(screen.getByRole("button", { name: /save/i }));
expect(screen.getByText("Saved!")).toBeInTheDocument();`,
        },
        {
          text: "Cover error states, loading states, and edge-case prop combinations",
          url: "https://testing-library.com/docs/react-testing-library/intro",
          sample: `it("shows a spinner while loading", () => {
  render(<UserCard isLoading={true} />);
  expect(screen.getByRole("status")).toBeInTheDocument();
});`,
        },
        {
          text: "Avoid over-reliance on snapshot tests for logic-heavy components",
          url: "https://jestjs.io/docs/snapshot-testing",
          sample: `// Prefer explicit assertions for logic
expect(screen.getByText("€12.50")).toBeInTheDocument();

// Reserve snapshots for static presentational components
expect(container).toMatchSnapshot();`,
        },
        {
          text: "Use MSW to mock network requests at the component boundary",
          url: "https://mswjs.io/docs/getting-started",
          sample: `server.use(
  http.get("/api/user", () => HttpResponse.json({ name: "Alice" }))
);
render(<ProfileCard />);
expect(await screen.findByText("Alice")).toBeInTheDocument();`,
        },
      ],
      tools: [
        { name: "React Testing Library", url: "https://testing-library.com/docs/react-testing-library/intro" },
        { name: "Vitest", url: "https://vitest.dev" },
        { name: "Jest", url: "https://jestjs.io" },
        { name: "Storybook", url: "https://storybook.js.org" },
        { name: "Cypress Component Testing", url: "https://docs.cypress.io/guides/component-testing/overview" },
      ],
    },
    {
      name: "API Testing",
      description:
        "Validates HTTP endpoints: status codes, response schemas, authentication, and error handling.",
      bestPractices: [
        {
          text: "Test both happy paths and all documented error responses",
          url: "https://github.com/ladjs/supertest#readme",
          sample: `it("returns 404 when user is not found", async () => {
  const res = await request(app).get("/api/users/99999");
  expect(res.status).toBe(404);
  expect(res.body.message).toBe("User not found");
});`,
        },
        {
          text: "Validate full response schemas, not just status codes",
          url: "https://zod.dev",
          sample: `const UserSchema = z.object({ id: z.number(), name: z.string() });
const parsed = UserSchema.safeParse(res.body);
expect(parsed.success).toBe(true);`,
        },
        {
          text: "Include authentication and authorisation scenarios",
          url: "https://github.com/ladjs/supertest#readme",
          sample: `it("returns 401 without a token", async () => {
  const res = await request(app).get("/api/profile");
  expect(res.status).toBe(401);
});`,
        },
        {
          text: "Test boundary inputs and malformed payloads",
          url: "https://github.com/ladjs/supertest#readme",
          sample: `it("returns 400 for a missing required field", async () => {
  const res = await request(app).post("/api/users").send({});
  expect(res.status).toBe(400);
});`,
        },
        {
          text: "Automate API tests in CI to catch contract regressions early",
          url: "https://learning.postman.com/docs/collections/running-collections/using-newman-cli/command-line-integration-with-newman/",
          sample: `newman run collection.json \\
  --environment ci.json \\
  --reporters cli,junit`,
        },
        {
          text: "Store test data as fixtures rather than hard-coded strings",
          url: "https://jestjs.io/docs/configuration#roots-arraystring",
          sample: `import userFixture from "./__fixtures__/user.json";
const res = await request(app)
  .post("/api/users")
  .send(userFixture);`,
        },
      ],
      tools: [
        { name: "Supertest", url: "https://github.com/ladjs/supertest" },
        { name: "Postman / Newman", url: "https://www.postman.com" },
        { name: "Insomnia", url: "https://insomnia.rest" },
        { name: "Hoppscotch", url: "https://hoppscotch.io" },
        { name: "REST Assured", url: "https://rest-assured.io" },
      ],
    },
    {
      name: "Performance Testing",
      description:
        "Measures response times, throughput, and resource usage under varying levels of load.",
      bestPractices: [
        {
          text: "Establish a performance baseline before optimising anything",
          url: "https://k6.io/docs/get-started/running-k6/",
          sample: `export const options = {
  thresholds: { http_req_duration: ["p(95)<200"] },
};`,
        },
        {
          text: "Use realistic load profiles based on actual traffic patterns",
          url: "https://k6.io/docs/using-k6/scenarios/",
          sample: `scenarios: {
  typical: {
    executor: "ramping-vus",
    stages: [
      { duration: "1m", target: 50 },
      { duration: "3m", target: 50 },
      { duration: "30s", target: 0 },
    ],
  },
},`,
        },
        {
          text: "Include spike tests (sudden burst) and soak tests (sustained load)",
          url: "https://k6.io/docs/test-types/spike-testing/",
          sample: `stages: [
  { duration: "10s", target: 500 }, // spike up
  { duration: "1m",  target: 500 }, // hold
  { duration: "10s", target: 0   }, // recover
]`,
        },
        {
          text: "Monitor server-side metrics (CPU, memory, DB connections) alongside latency",
          url: "https://k6.io/docs/results-output/",
          sample: `k6 run --out influxdb=http://localhost:8086/k6 script.js
# then visualise in Grafana`,
        },
        {
          text: "Set explicit pass/fail thresholds so CI can catch regressions",
          url: "https://k6.io/docs/using-k6/thresholds/",
          sample: `thresholds: {
  http_req_failed:   ["rate<0.01"],   // <1% errors
  http_req_duration: ["p(99)<500"],   // 99th %ile < 500ms
},`,
        },
      ],
      tools: [
        { name: "k6", url: "https://k6.io" },
        { name: "Artillery", url: "https://www.artillery.io" },
        { name: "Apache JMeter", url: "https://jmeter.apache.org" },
        { name: "Gatling", url: "https://gatling.io" },
        { name: "Lighthouse", url: "https://developer.chrome.com/docs/lighthouse/overview/" },
      ],
    },
    {
      name: "Security Testing",
      description:
        "Identifies vulnerabilities such as injection flaws, broken authentication, and sensitive data exposure.",
      bestPractices: [
        {
          text: "Use OWASP Top 10 as a structured checklist for every release",
          url: "https://owasp.org/www-project-top-ten/",
          sample: `// Pre-release checklist
// [ ] A01: Enforce least-privilege access control on all routes
// [ ] A02: Secrets in env vars, not source code
// [ ] A03: All user inputs validated and parameterised
// [ ] A07: Ensure auth & session management is robust`,
        },
        {
          text: "Automate dependency vulnerability scanning in CI (npm audit, Snyk)",
          url: "https://docs.snyk.io/developer-tools/snyk-cli/snyk-cli/getting-started-with-the-snyk-cli",
          sample: `# In CI pipeline
snyk test --severity-threshold=high
npm audit --audit-level=high`,
        },
        {
          text: "Test input validation: SQL injection, XSS, path traversal",
          url: "https://owasp.org/www-community/attacks/SQL_Injection",
          sample: `it("rejects SQL injection in search param", async () => {
  const res = await request(app)
    .get("/api/search?q=' OR '1'='1");
  expect(res.status).toBe(400);
});`,
        },
        {
          text: "Verify authentication and authorisation on every protected route",
          url: "https://owasp.org/Top10/A01_2021-Broken_Access_Control/",
          sample: `it("returns 403 when a regular user hits an admin route", async () => {
  const res = await request(app)
    .get("/api/admin/users")
    .set("Authorization", \`Bearer \${userToken}\`);
  expect(res.status).toBe(403);
});`,
        },
        {
          text: "Never commit secrets — scan commits with tools like truffleHog",
          url: "https://github.com/trufflesecurity/trufflehog",
          sample: `trufflehog git file://. \\
  --since-commit HEAD \\
  --only-verified`,
        },
      ],
      tools: [
        { name: "OWASP ZAP", url: "https://www.zaproxy.org" },
        { name: "Snyk", url: "https://snyk.io" },
        { name: "npm audit", url: "https://docs.npmjs.com/cli/commands/npm-audit" },
        { name: "Burp Suite", url: "https://portswigger.net/web-security" },
        { name: "Trivy", url: "https://trivy.dev" },
        { name: "Semgrep", url: "https://semgrep.dev" },
      ],
    },
    {
      name: "Accessibility Testing (a11y)",
      description:
        "Ensures the application is usable by people with disabilities and meets WCAG 2.1 AA standards.",
      bestPractices: [
        {
          text: "Run automated scans early, but treat them as a floor not a ceiling",
          url: "https://github.com/dequelabs/axe-core",
          sample: `it("has no a11y violations", async () => {
  const { container } = render(<LoginPage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});`,
        },
        {
          text: "Test full keyboard navigation: focus order, visible focus ring, no traps",
          url: "https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html",
          sample: `await page.keyboard.press("Tab");
await expect(page.locator(":focus"))
  .toHaveAttribute("data-testid", "skip-link");`,
        },
        {
          text: "Test with real screen readers (VoiceOver on macOS, NVDA on Windows)",
          url: "https://www.nvaccess.org/about-nvda/",
          sample: `// Manual test script
// 1. Open page with NVDA active
// 2. Press H to navigate by headings
// 3. Verify order matches visual structure
// 4. Activate all interactive elements with Enter/Space`,
        },
        {
          text: "Use semantic HTML and ARIA roles correctly — prefer native elements",
          url: "https://www.w3.org/TR/wai-aria-practices/",
          sample: `<!-- Good: native button -->
<button type="submit">Save</button>

<!-- Avoid: div masquerading as a button -->
<div role="button" tabindex="0">Save</div>`,
        },
        {
          text: "Include a11y checks as a CI quality gate using axe-core",
          url: "https://github.com/nickcolley/jest-axe",
          sample: `// jest.setup.ts
import { toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);`,
        },
      ],
      tools: [
        { name: "axe-core / jest-axe", url: "https://www.deque.com/axe/" },
        { name: "Lighthouse", url: "https://developer.chrome.com/docs/lighthouse/overview/" },
        { name: "eslint-plugin-jsx-a11y", url: "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y" },
        { name: "VoiceOver (macOS)", url: "https://www.apple.com/accessibility/vision/" },
        { name: "NVDA (Windows)", url: "https://www.nvaccess.org" },
      ],
    },
    {
      name: "Visual Regression Testing",
      description:
        "Captures screenshots of pages or components and diffs them against approved baselines to catch unintended visual changes.",
      bestPractices: [
        {
          text: "Run against a stable, seeded dataset to avoid noise",
          url: "https://www.chromatic.com/docs/snapshots",
          sample: `// Storybook story with fixed, static data
export const Default: Story = {
  args: { user: { name: "Alice", avatar: "/static/avatar.png" } },
};`,
        },
        {
          text: "Scope to component level where possible to isolate changes",
          url: "https://storybook.js.org/docs/writing-stories",
          sample: `export default { title: "Components/Button", component: Button };
export const Primary: Story = { args: { label: "Click me" } };`,
        },
        {
          text: "Review pixel diffs carefully in PR review before approving",
          url: "https://percy.io/docs/approving-builds",
          sample: `// In Percy / Chromatic:
// 1. Open the diff overlay in the PR check
// 2. Confirm the change is intentional
// 3. Approve the build before merging`,
        },
        {
          text: "Maintain baselines in version control alongside the code",
          url: "https://github.com/garris/BackstopJS#readme",
          sample: `# After a confirmed intentional visual change:
backstop approve
git add backstop_data/bitmaps_reference
git commit -m "chore: update visual baselines"`,
        },
        {
          text: "Integrate into the PR workflow so visual changes require explicit sign-off",
          url: "https://www.chromatic.com/docs/ci",
          sample: `- name: Run Chromatic
  uses: chromaui/action@v1
  with:
    projectToken: \${{ secrets.CHROMATIC_TOKEN }}
    autoAcceptChanges: false`,
        },
      ],
      tools: [
        { name: "Percy", url: "https://percy.io" },
        { name: "Chromatic", url: "https://www.chromatic.com" },
        { name: "BackstopJS", url: "https://github.com/garris/BackstopJS" },
        { name: "Playwright screenshot diffs", url: "https://playwright.dev/docs/screenshots" },
      ],
    },
    {
      name: "Contract Testing",
      description:
        "Verifies that the API contracts between a service producer and its consumers are honoured independently, without end-to-end integration.",
      bestPractices: [
        {
          text: "Define contracts from the consumer's perspective (consumer-driven)",
          url: "https://docs.pact.io/consumer",
          sample: `await provider.addInteraction({
  state: "user 1 exists",
  uponReceiving: "a request for user 1",
  withRequest: { method: "GET", path: "/users/1" },
  willRespondWith: { status: 200, body: { id: 1, name: "Alice" } },
});`,
        },
        {
          text: "Run provider verification automatically in the provider's CI pipeline",
          url: "https://docs.pact.io/provider",
          sample: `const verifier = new Verifier({
  providerBaseUrl: "http://localhost:3000",
  pactUrls: ["./pacts/consumer-provider.json"],
});
await verifier.verifyProvider();`,
        },
        {
          text: "Version contracts alongside the API and track breaking changes",
          url: "https://docs.pact.io/pact_broker",
          sample: `pact-broker publish ./pacts \\
  --consumer-app-version $(git rev-parse HEAD) \\
  --broker-base-url https://broker.example.com`,
        },
        {
          text: "Start with your highest-risk or most frequently changed integrations",
          url: "https://docs.pact.io/getting_started",
          sample: `// Priority order:
// 1. Payment service ↔ Order service  (high risk)
// 2. Auth service ↔ all consumers     (high frequency)
// 3. Notification service ↔ triggers  (lower risk)`,
        },
        {
          text: "Use a Pact Broker or similar to share and manage contract versions",
          url: "https://docs.pact.io/pact_broker/docker_images",
          sample: `docker run -p 9292:9292 pactfoundation/pact-broker`,
        },
      ],
      tools: [
        { name: "Pact", url: "https://pact.io" },
        { name: "Spring Cloud Contract", url: "https://spring.io/projects/spring-cloud-contract" },
        { name: "Dredd", url: "https://dredd.org" },
      ],
    },
    {
      name: "A/B Testing",
      description:
        "Compares two variants of a feature (A and B) with real users simultaneously to determine which performs better against a defined metric such as conversion rate or engagement.",
      bestPractices: [
        {
          text: "Define a single primary metric per experiment before you start",
          url: "https://www.optimizely.com/optimization-glossary/ab-testing/",
          sample: `// Good — one clear success metric
const experiment = {
  name: "checkout-button-colour",
  metric: "checkout_completion_rate",
  variants: ["control", "green-button"],
};`,
        },
        {
          text: "Calculate the required sample size before launching to ensure statistical power",
          url: "https://www.evanmiller.org/ab-testing/sample-size.html",
          sample: `// Minimum Detectable Effect: 5%, baseline rate: 10%
// → ~3 800 users per variant needed before reading results`,
        },
        {
          text: "Run the experiment for at least one full business cycle to avoid novelty bias",
          url: "https://experimentguide.com",
          sample: `// Don't stop early — wait the pre-calculated duration
// even if early results look promising`,
        },
        {
          text: "Assign users consistently using a deterministic hash of user ID + experiment ID",
          url: "https://docs.launchdarkly.com/home/experimentation",
          sample: `function getVariant(userId: string, experimentId: string): 'A' | 'B' {
  const hash = murmurhash(userId + experimentId);
  return hash % 2 === 0 ? 'A' : 'B';
}`,
        },
        {
          text: "Only change one variable at a time; use multivariate tests for multiple changes",
          url: "https://www.optimizely.com/optimization-glossary/multivariate-testing/",
          sample: `// Bad — changing two things at once
// variant: green button + new headline

// Good — isolate one change
// variant: green button only`,
        },
      ],
      tools: [
        { name: "Optimizely", url: "https://www.optimizely.com" },
        { name: "LaunchDarkly", url: "https://launchdarkly.com" },
        { name: "GrowthBook", url: "https://www.growthbook.io" },
        { name: "Optimizely", url: "https://www.optimizely.com/products/experiment/" },
        { name: "Split.io", url: "https://www.split.io" },
      ],
    },
  ];
}