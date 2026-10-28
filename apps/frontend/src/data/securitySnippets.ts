export interface SecuritySnippet {
  name: string;
  tool: string;
  description: string;
  code: string;
}

export const securitySnippets: SecuritySnippet[] = [
  {
    name: "Dependency Vulnerability Scan",
    tool: "npm audit + Snyk",
    description: "Scan all project dependencies for known CVEs and fail the build if high-severity issues are found.",
    code: `# Run npm's built-in audit
npm audit --audit-level=high

# Or with Snyk for richer output and fix suggestions
npx snyk test --severity-threshold=high

# In CI — fail the pipeline on any high/critical finding
npx snyk test --severity-threshold=high --json | \\
  jq '.vulnerabilities[] | select(.severity=="high" or .severity=="critical")'`,
  },
  {
    name: "OWASP ZAP Baseline Scan",
    tool: "OWASP ZAP (Docker)",
    description: "Run a passive spider + active scan against your running app to catch the OWASP Top 10. Safe to run in CI.",
    code: `# Pull the ZAP stable image
docker pull ghcr.io/zaproxy/zaproxy:stable

# Baseline scan — passive only, safe for production-like envs
docker run --rm \\
  -v "$(pwd)/zap-reports:/zap/wrk" \\
  ghcr.io/zaproxy/zaproxy:stable \\
  zap-baseline.py \\
  -t https://staging.example.com \\
  -r zap-report.html \\
  -I  # do not fail on warnings, only on errors

# Full scan — includes active attack rules (use on dedicated test env only)
docker run --rm \\
  -v "$(pwd)/zap-reports:/zap/wrk" \\
  ghcr.io/zaproxy/zaproxy:stable \\
  zap-full-scan.py \\
  -t https://staging.example.com \\
  -r zap-full-report.html`,
  },
  {
    name: "Auth & JWT Boundary Tests",
    tool: "Supertest (Node.js)",
    description: "Verify that protected routes reject unauthenticated/tampered requests and that privilege escalation is blocked.",
    code: `import request from "supertest";
import app from "../src/app";

describe("Auth boundary tests", () => {
  test("401 — no token", async () => {
    const res = await request(app).get("/api/admin/users");
    expect(res.status).toBe(401);
  });

  test("403 — valid token but wrong role", async () => {
    const viewerToken = await getToken("viewer");
    const res = await request(app)
      .delete("/api/admin/users/42")
      .set("Authorization", \`Bearer \${viewerToken}\`);
    expect(res.status).toBe(403);
  });

  test("401 — tampered JWT signature", async () => {
    const token = await getToken("admin");
    const [header, payload] = token.split(".");
    const tampered = \`\${header}.\${payload}.invalidsignature\`;
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", \`Bearer \${tampered}\`);
    expect(res.status).toBe(401);
  });

  test("400 — SQL injection attempt is sanitised", async () => {
    const res = await request(app)
      .get("/api/users?id=1 OR 1=1--");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid/i);
  });
});`,
  },
  {
    name: "Secret Detection in Source",
    tool: "Semgrep",
    description: "Scan the codebase for hardcoded secrets, API keys, and passwords before they reach the repo.",
    code: `# Install Semgrep
pip install semgrep

# Run the secrets ruleset against your source
semgrep scan \\
  --config "p/secrets" \\
  --config "p/owasp-top-ten" \\
  --error \\          # exit non-zero on findings
  --json \\
  -o semgrep-report.json \\
  ./src

# Parse and summarise findings
cat semgrep-report.json | \\
  jq '[.results[] | {rule: .check_id, file: .path, line: .start.line, severity: .extra.severity}]'

# In GitHub Actions — add as a required check:
# uses: returntocorp/semgrep-action@v1
# with:
#   config: p/secrets p/owasp-top-ten`,
  },
  {
    name: "Security Headers Check",
    tool: "Playwright",
    description: "Assert that every response includes the expected security headers (CSP, HSTS, X-Frame-Options, etc.).",
    code: `import { test, expect } from "@playwright/test";

const REQUIRED_HEADERS: Record<string, RegExp> = {
  "strict-transport-security": /max-age=\\d+/,
  "x-content-type-options":    /nosniff/,
  "x-frame-options":           /DENY|SAMEORIGIN/,
  "content-security-policy":   /default-src/,
  "referrer-policy":           /.+/,
};

test("security headers are present on every page", async ({ page }) => {
  const responses: Record<string, string>[] = [];

  page.on("response", (res) => {
    if (res.url().startsWith("https://example.com")) {
      responses.push(Object.fromEntries(
        Object.entries(res.headers())
      ));
    }
  });

  await page.goto("https://example.com");

  for (const headers of responses) {
    for (const [header, pattern] of Object.entries(REQUIRED_HEADERS)) {
      const value = headers[header];
      expect(value, \`Missing header: \${header}\`).toBeTruthy();
      expect(value).toMatch(pattern);
    }
  }
});`,
  },
];
