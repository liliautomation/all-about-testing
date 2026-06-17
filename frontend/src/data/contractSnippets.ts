import { SecuritySnippet } from "./securitySnippets";

// Reusing SecuritySnippet shape: { name, tool, description, code }
export const contractSnippets: SecuritySnippet[] = [
  {
    name: "Consumer — Write a Pact",
    tool: "Pact (Jest / Node.js)",
    description: "The consumer defines the interaction it expects from the provider and generates a pact file.",
    code: `import { PactV3, MatchersV3 } from "@pact-foundation/pact";
import { getUser } from "../src/apiClient";

const { like, string } = MatchersV3;

const provider = new PactV3({
  consumer: "UserDashboard",
  provider: "UserService",
  dir: "./pacts",           // pact file is written here
  logLevel: "warn",
});

describe("UserService contract — consumer side", () => {
  test("returns a user by ID", async () => {
    await provider
      .given("user 42 exists")
      .uponReceiving("a request for user 42")
      .withRequest({ method: "GET", path: "/users/42" })
      .willRespondWith({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: {
          id:    like(42),
          name:  string("Alice"),
          email: string("alice@example.com"),
        },
      })
      .executeTest(async (mockServer) => {
        const user = await getUser(mockServer.url, 42);
        expect(user.id).toBe(42);
        expect(user.name).toBeDefined();
      });
  });
});`,
  },
  {
    name: "Provider — Verify the Pact",
    tool: "Pact (Jest / Node.js)",
    description: "The provider loads the published pact and replays each interaction against its running server to confirm it still satisfies the contract.",
    code: `import { Verifier } from "@pact-foundation/pact";
import path from "path";
import app from "../src/app";
import http from "http";

let server: http.Server;
let port: number;

beforeAll((done) => {
  server = app.listen(0, () => {
    port = (server.address() as any).port;
    done();
  });
});

afterAll((done) => server.close(done));

test("UserService satisfies UserDashboard pact", async () => {
  await new Verifier({
    provider:     "UserService",
    providerBaseUrl: \`http://localhost:\${port}\`,

    // Load pact from local file (or swap for Pact Broker URL)
    pactUrls: [path.resolve(__dirname, "../pacts/UserDashboard-UserService.json")],

    // Or pull from Pact Broker:
    // pactBrokerUrl: "https://broker.pact.example.com",
    // consumerVersionSelectors: [{ mainBranch: true }],

    stateHandlers: {
      "user 42 exists": async () => {
        // seed the DB / mock here
        await seedUser({ id: 42, name: "Alice", email: "alice@example.com" });
      },
    },
    publishVerificationResult: false,   // set true in CI
  }).verifyProvider();
});`,
  },
  {
    name: "Publish Pact to Broker",
    tool: "Pact Broker CLI",
    description: "After generating the pact file, publish it to a Pact Broker so the provider can always pull the latest version.",
    code: `# Install the Pact CLI tools
npm install --save-dev @pact-foundation/pact-cli

# Publish pact files to a self-hosted or managed broker
npx pact-broker publish ./pacts \\
  --broker-base-url https://broker.pact.example.com \\
  --broker-token  \${PACT_BROKER_TOKEN} \\
  --consumer-app-version \$(git rev-parse --short HEAD) \\
  --branch \$(git rev-parse --abbrev-ref HEAD)

# Can-I-Deploy check — blocks the release if the contract is broken
npx pact-broker can-i-deploy \\
  --pacticipant UserDashboard \\
  --broker-base-url https://broker.pact.example.com \\
  --broker-token  \${PACT_BROKER_TOKEN} \\
  --version \$(git rev-parse --short HEAD) \\
  --to-environment production`,
  },
  {
    name: "Contract Test in GitHub Actions",
    tool: "GitHub Actions + Pact Broker",
    description: "Full CI pipeline: run consumer tests to generate the pact, publish to broker, then verify on the provider side and gate deployment with can-i-deploy.",
    code: `# .github/workflows/contract.yml
name: Contract Tests

on: [push, pull_request]

jobs:
  consumer:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm test -- --testPathPattern=pact
        env:
          PACT_DIR: ./pacts
      - name: Publish pacts
        run: |
          npx pact-broker publish ./pacts \\
            --broker-base-url \${{ secrets.PACT_BROKER_URL }} \\
            --broker-token   \${{ secrets.PACT_BROKER_TOKEN }} \\
            --consumer-app-version \${{ github.sha }} \\
            --branch \${{ github.ref_name }}

  provider:
    needs: consumer
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run start:test &   # start provider in test mode
      - run: npm test -- --testPathPattern=provider.pact
        env:
          PACT_BROKER_URL:   \${{ secrets.PACT_BROKER_URL }}
          PACT_BROKER_TOKEN: \${{ secrets.PACT_BROKER_TOKEN }}
          PROVIDER_VERSION:  \${{ github.sha }}

  can-i-deploy:
    needs: provider
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g @pact-foundation/pact-cli
      - run: |
          pact-broker can-i-deploy \\
            --pacticipant UserDashboard \\
            --broker-base-url \${{ secrets.PACT_BROKER_URL }} \\
            --broker-token   \${{ secrets.PACT_BROKER_TOKEN }} \\
            --version \${{ github.sha }} \\
            --to-environment production`,
  },
];
