import React, { useState } from "react";
import { k6Snippets } from "../data/k6Snippets";
import { securitySnippets, SecuritySnippet } from "../data/securitySnippets";
import { contractSnippets } from "../data/contractSnippets";
import { accessibilitySnippets } from "../data/accessibilitySnippets";

interface PerformanceSubType {
  name: string;
  description: string;
  whenToUse: string;
  codeSnippet: string;
}

interface RoadmapItem {
  id: string;
  title: string; 
  description: string;
  skills: string[];
  tools: string[];
  resources?: string[];
  subTypes?: PerformanceSubType[];
  snippets?: SecuritySnippet[];
}

interface RoadmapPhase {
  phase: number;
  label: string;
  accent: string;
  bg: string;
  items: RoadmapItem[];
}

const roadmap: RoadmapPhase[] = [
  {
    phase: 1,
    label: "Foundation",
    accent: "#0e9f6e",
    bg: "#e6f9f0",
    items: [
      {
        id: "unit",
        title: "Unit Testing",
        description: "Test individual functions and modules in isolation. The base of the test pyramid.",
        skills: ["Write pure functions", "Mock dependencies", "Assert expected outcomes", "Aim for fast, deterministic tests"],
        tools: ["Jest", "Vitest", "Mocha", "pytest"],
        resources: ["Testing Library docs", "Jest getting started"],
      },
      {
        id: "test-structure",
        title: "Test Structure & Naming",
        description: "Organise tests with Arrange–Act–Assert and meaningful names so failures self-document.",
        skills: ["AAA pattern", "Descriptive test names", "One assertion per test", "Test file co-location"],
        tools: ["Jest", "Vitest"],
      },
    ],
  },
  {
    phase: 2,
    label: "Component & Integration",
    accent: "#1a56db",
    bg: "#e8f0fe",
    items: [
      {
        id: "component",
        title: "Component Testing",
        description: "Render UI components in isolation and assert their behaviour, output, and accessibility.",
        skills: ["Render with props", "Simulate user events", "Query by role/label", "Snapshot testing"],
        tools: ["React Testing Library", "Storybook", "Playwright CT"],
      },
      {
        id: "integration",
        title: "Integration Testing",
        description: "Verify that multiple units work together: service + DB, API + handler, etc.",
        skills: ["Test real I/O boundaries", "In-memory databases", "Supertest / httpx for APIs", "Seed + tear-down fixtures"],
        tools: ["Supertest", "MSW", "Testcontainers", "httpx"],
      },
      {
        id: "api",
        title: "API Testing",
        description: "Validate request/response contracts, error codes, auth, and edge cases at the HTTP layer.",
        skills: ["Happy-path & error flows", "Auth token handling", "Schema validation", "Status code assertions"],
        tools: ["Postman / Newman", "REST Assured", "Supertest", "Hoppscotch"],
      },
    ],
  },
  {
    phase: 3,
    label: "End-to-End",
    accent: "#7e3af2",
    bg: "#f3effe",
    items: [
      {
        id: "e2e",
        title: "E2E Testing",
        description: "Simulate real user journeys through the full stack in a browser.",
        skills: ["Page Object Model", "Stable selectors (role/label)", "Network interception", "Retry-ability"],
        tools: ["Playwright", "Cypress", "WebdriverIO"],
      },
      {
        id: "visual",
        title: "Visual Regression Testing",
        description: "Catch unintended UI changes by comparing screenshots pixel-by-pixel.",
        skills: ["Baseline management", "Diff thresholds", "Per-component snapshots", "CI integration"],
        tools: ["Percy", "Chromatic", "Playwright screenshots", "Applitools"],
      },
    ],
  },
  {
    phase: 4,
    label: "Non-Functional",
    accent: "#d03801",
    bg: "#fef3ee",
    items: [
      {
        id: "performance",
        title: "Performance Testing",
        description: "Measure load times, throughput, and system behaviour under stress. Covers 8 distinct test types each targeting a different failure mode.",
        skills: [
          "Define SLAs & performance baselines",
          "Choose the right test type for each scenario",
          "Analyse percentiles (p50, p95, p99) not just averages",
          "Identify bottlenecks (CPU, memory, I/O, DB)",
          "Frontend Core Web Vitals (LCP, INP, CLS)",
          "Correlate backend traces with frontend metrics",
        ],
        tools: ["k6", "Lighthouse", "Artillery", "JMeter", "Gatling", "Locust", "WebPageTest", "Grafana"],
        subTypes: [
          {
            name: "Load Testing",
            description: "Simulate the expected number of concurrent users / requests to verify the system meets SLAs under normal conditions.",
            whenToUse: "Before every major release; establish a stable baseline to compare regressions against.",
            codeSnippet: k6Snippets["Load Testing"],
          },
          {
            name: "Stress Testing",
            description: "Ramp load beyond the expected maximum to find the breaking point and observe how the system fails (gracefully or not).",
            whenToUse: "When you need to know the hard ceiling of your infrastructure and how it recovers after overload.",
            codeSnippet: k6Snippets["Stress Testing"],
          },
          {
            name: "Spike Testing",
            description: "Inject a sudden, sharp burst of traffic in a very short window, then return to baseline — simulating flash sales, viral events, or bad-actor bursts.",
            whenToUse: "For consumer-facing apps with unpredictable traffic patterns or scheduled high-traffic events.",
            codeSnippet: k6Snippets["Spike Testing"],
          },
          {
            name: "Soak / Endurance Testing",
            description: "Run at a sustained moderate load for hours or days to surface slow memory leaks, connection pool exhaustion, and gradual performance degradation.",
            whenToUse: "Before shipping long-running services or after adding caching/connection-pooling changes.",
            codeSnippet: k6Snippets["Soak / Endurance Testing"],
          },
          {
            name: "Volume Testing",
            description: "Flood the system with large amounts of data (large payloads, huge DB row counts) to test data-processing paths and storage limits.",
            whenToUse: "For data-intensive features: exports, bulk imports, reporting queries, or large file uploads.",
            codeSnippet: k6Snippets["Volume Testing"],
          },
          {
            name: "Scalability Testing",
            description: "Incrementally increase load while scaling resources (horizontal pods, vertical CPU/RAM) to verify that throughput scales linearly and cost-efficiently.",
            whenToUse: "When planning auto-scaling policies or evaluating whether adding nodes actually improves throughput.",
            codeSnippet: k6Snippets["Scalability Testing"],
          },
          {
            name: "Concurrency Testing",
            description: "Send many requests to the exact same resource simultaneously to expose race conditions, deadlocks, and thread-safety issues.",
            whenToUse: "For shared resources: inventory decrement, seat reservation, coupon redemption, file writes.",
            codeSnippet: k6Snippets["Concurrency Testing"],
          },
          {
            name: "Chaos / Resilience Testing",
            description: "Deliberately inject failures (kill pods, throttle network, corrupt dependencies) while under load to verify the system degrades gracefully and recovers.",
            whenToUse: "For distributed or microservice architectures where partial failures must not cascade.",
            codeSnippet: k6Snippets["Chaos / Resilience Testing"],
          },
        ],
      },
      {
        id: "accessibility",
        title: "Accessibility Testing",
        description: "Ensure the app is usable by everyone, including keyboard and screen-reader users.",
        skills: ["WCAG 2.2 criteria", "Keyboard navigation", "ARIA roles & labels", "Colour contrast"],
        tools: ["axe-core", "Playwright axe", "WAVE", "Lighthouse"],
        snippets: accessibilitySnippets,
      },
      {
        id: "security",
        title: "Security Testing",
        description: "Identify vulnerabilities before attackers do — OWASP Top 10 as a starting point.",
        skills: ["Dependency scanning", "Input sanitisation checks", "Auth/authz boundary tests", "Secret detection"],
        tools: ["OWASP ZAP", "Snyk", "npm audit", "Semgrep"],
        snippets: securitySnippets,
      },
    ],
  },
  {
    phase: 5,
    label: "Continuous & Advanced",
    accent: "#c81e1e",
    bg: "#fde8e8",
    items: [
      {
        id: "ci",
        title: "CI/CD Integration",
        description: "Run the full test suite automatically on every push and block merges on failure.",
        skills: ["Parallelise test runs", "Flake detection & quarantine", "Coverage gates", "Artefact publishing"],
        tools: ["GitHub Actions", "CircleCI", "Jenkins", "GitLab CI"],
      },
      {
        id: "contract",
        title: "Contract Testing",
        description: "Verify that consumers and providers agree on API shapes without full integration deploys.",
        skills: ["Consumer-driven contracts", "Provider verification", "Versioning & breaking changes", "Broker setup"],
        tools: ["Pact", "Spring Cloud Contract"],
        snippets: contractSnippets,
      },
      {
        id: "observability",
        title: "Observability & Monitoring",
        description: "Treat production telemetry as tests — alerts, dashboards, and synthetic checks.",
        skills: ["Structured logging", "Distributed tracing", "Synthetic monitors", "Error budgets"],
        tools: ["Datadog", "Grafana", "OpenTelemetry", "Sentry"],
      },
    ],
  },
];

const K6_TYPE_DOCS: Record<string, string> = {
  "Load Testing":             "https://k6.io/docs/test-types/load-testing/",
  "Stress Testing":           "https://k6.io/docs/test-types/stress-testing/",
  "Spike Testing":            "https://k6.io/docs/test-types/spike-testing/",
  "Soak / Endurance Testing": "https://k6.io/docs/test-types/soak-testing/",
  "Volume Testing":           "https://k6.io/docs/test-types/load-testing/",
  "Scalability Testing":      "https://k6.io/docs/test-types/load-testing/",
  "Concurrency Testing":      "https://k6.io/docs/test-types/load-testing/",
  "Chaos / Resilience Testing": "https://grafana.com/docs/k6/latest/testing-guides/injecting-faults-with-xk6-disruptor/",
};

export const RoadmapPage: React.FC = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [openSnippet, setOpenSnippet] = useState<string | null>(null);
  const [openSecSnippet, setOpenSecSnippet] = useState<string | null>(null);

  const toggle = (id: string) => setOpenItem((prev) => (prev === id ? null : id));
  const toggleSnippet = (name: string) => setOpenSnippet((prev) => (prev === name ? null : name));
  const toggleSecSnippet = (name: string) => setOpenSecSnippet((prev) => (prev === name ? null : name));

  return (
    <div className="fade-in-up">
      <h1 style={{ margin: "0 0 0.4rem", fontSize: "1.8rem", fontWeight: 700, color: "#0e9f6e" }}>
        🛣️ Dev Testing Roadmap
      </h1>
      <p style={{ color: "#555", fontSize: "0.95rem", marginBottom: "2rem", lineHeight: 1.6 }}>
        A progressive path from writing your first unit test to advanced continuous testing practices.
        Expand any topic to see skills, tools, and tips.
      </p>

      <div style={{ position: "relative" }}>
        {/* Vertical connector line */}
        <div
          style={{
            position: "absolute",
            left: "22px",
            top: 0,
            bottom: 0,
            width: "3px",
            background: "linear-gradient(to bottom, #0e9f6e, #1a56db, #7e3af2, #d03801, #c81e1e)",
            borderRadius: "2px",
          }}
        />

        {roadmap.map((phase) => (
          <div key={phase.phase} style={{ marginBottom: "2.5rem" }}>
            {/* Phase header */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem", position: "relative" }}>
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "50%",
                  background: phase.accent,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "1rem",
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 1,
                  boxShadow: `0 0 0 4px ${phase.bg}`,
                }}
              >
                {phase.phase}
              </div>
              <div style={{ marginLeft: "1rem" }}>
                <span
                  style={{
                    background: phase.bg,
                    color: phase.accent,
                    borderRadius: "6px",
                    padding: "0.2rem 0.7rem",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginRight: "0.6rem",
                  }}
                >
                  Phase {phase.phase}
                </span>
                <span style={{ fontWeight: 700, fontSize: "1.15rem", color: "#1a1a2e" }}>
                  {phase.label}
                </span>
              </div>
            </div>

            {/* Phase items */}
            <div style={{ marginLeft: "62px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {phase.items.map((item) => {
                const isOpen = openItem === item.id;
                return (
                  <div
                    key={item.id}
                    style={{
                      background: "#fff",
                      border: `1.5px solid ${isOpen ? phase.accent : "#e5e7eb"}`,
                      borderRadius: "10px",
                      overflow: "hidden",
                      transition: "border-color 0.15s, box-shadow 0.15s",
                      boxShadow: isOpen ? `0 4px 16px ${phase.accent}22` : "none",
                    }}
                  >
                    <button
                      onClick={() => toggle(item.id)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        background: "none",
                        border: "none",
                        padding: "1rem 1.25rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "1rem", color: "#1a1a2e" }}>
                          {item.title}
                        </div>
                        <div style={{ color: "#666", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                          {item.description}
                        </div>
                      </div>
                      <span
                        style={{
                          color: phase.accent,
                          fontSize: "1.2rem",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                          flexShrink: 0,
                        }}
                      >
                        ▾
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        style={{
                          padding: "0 1.25rem 1.25rem",
                          borderTop: `1px solid ${phase.bg}`,
                        }}
                      >
                        {/* Skills + Tools row */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "1rem",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                                color: phase.accent,
                                marginBottom: "0.5rem",
                                marginTop: "1rem",
                              }}
                            >
                              Key Skills
                            </div>
                            <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#444", fontSize: "0.875rem", lineHeight: 1.7 }}>
                              {item.skills.map((s) => (
                                <li key={s}>{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                                color: phase.accent,
                                marginBottom: "0.5rem",
                                marginTop: "1rem",
                              }}
                            >
                              Tools
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                              {item.tools.map((t) => (
                                <span
                                  key={t}
                                  style={{
                                    background: phase.bg,
                                    color: phase.accent,
                                    borderRadius: "5px",
                                    padding: "0.2rem 0.6rem",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Security snippets section */}
                        {item.snippets && (
                          <div style={{ marginTop: "1.5rem" }}>
                            <div
                              style={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                                color: phase.accent,
                                marginBottom: "0.75rem",
                              }}
                            >
                              Code Examples
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                              {item.snippets.map((sn) => {
                                const secOpen = openSecSnippet === sn.name;
                                return (
                                  <div
                                    key={sn.name}
                                    style={{
                                      background: phase.bg,
                                      borderRadius: "8px",
                                      borderLeft: `3px solid ${phase.accent}`,
                                      overflow: "hidden",
                                    }}
                                  >
                                    <div
                                      style={{
                                        padding: "0.9rem 1rem",
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        gap: "1rem",
                                      }}
                                    >
                                      <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                                          <span style={{ fontWeight: 700, fontSize: "0.875rem", color: phase.accent }}>
                                            {sn.name}
                                          </span>
                                          <span
                                            style={{
                                              fontSize: "0.7rem",
                                              color: phase.accent,
                                              border: `1px solid ${phase.accent}`,
                                              borderRadius: "4px",
                                              padding: "0.1rem 0.45rem",
                                              fontWeight: 600,
                                              opacity: 0.8,
                                            }}
                                          >
                                            {sn.tool}
                                          </span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: "0.825rem", color: "#444", lineHeight: 1.55 }}>
                                          {sn.description}
                                        </p>
                                      </div>
                                      <button
                                        onClick={() => toggleSecSnippet(sn.name)}
                                        style={{
                                          flexShrink: 0,
                                          background: secOpen ? phase.accent : "transparent",
                                          color: secOpen ? "#fff" : phase.accent,
                                          border: `1.5px solid ${phase.accent}`,
                                          borderRadius: "6px",
                                          padding: "0.3rem 0.75rem",
                                          fontSize: "0.75rem",
                                          fontWeight: 700,
                                          cursor: "pointer",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        {secOpen ? "Hide code" : "Show code"}
                                      </button>
                                    </div>
                                    {secOpen && (
                                      <div
                                        style={{
                                          borderTop: `1px solid ${phase.accent}33`,
                                          background: "#1e1e2e",
                                          padding: "1rem 1.25rem",
                                          overflowX: "auto",
                                        }}
                                      >
                                        <pre
                                          style={{
                                            margin: 0,
                                            fontFamily: "'Fira Code', 'Cascadia Code', 'Menlo', monospace",
                                            fontSize: "0.8rem",
                                            lineHeight: 1.65,
                                            color: "#cdd6f4",
                                            whiteSpace: "pre",
                                          }}
                                        >
                                          {sn.code}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Performance sub-types section */}
                        {item.subTypes && (
                          <div style={{ marginTop: "1.5rem" }}>
                            <div
                              style={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                                color: phase.accent,
                                marginBottom: "0.75rem",
                              }}
                            >
                              Performance Test Types
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                              {item.subTypes.map((st) => {
                                const snippetOpen = openSnippet === st.name;
                                const docsUrl = K6_TYPE_DOCS[st.name];
                                return (
                                  <div
                                    key={st.name}
                                    style={{
                                      background: phase.bg,
                                      borderRadius: "8px",
                                      borderLeft: `3px solid ${phase.accent}`,
                                      overflow: "hidden",
                                    }}
                                  >
                                    {/* Sub-type header */}
                                    <div
                                      style={{
                                        padding: "0.9rem 1rem",
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        gap: "1rem",
                                      }}
                                    >
                                      <div style={{ flex: 1 }}>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            marginBottom: "0.35rem",
                                          }}
                                        >
                                          <span style={{ fontWeight: 700, fontSize: "0.875rem", color: phase.accent }}>
                                            {st.name}
                                          </span>
                                          {docsUrl && (
                                            <a
                                              href={docsUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              style={{
                                                fontSize: "0.7rem",
                                                color: phase.accent,
                                                border: `1px solid ${phase.accent}`,
                                                borderRadius: "4px",
                                                padding: "0.1rem 0.45rem",
                                                textDecoration: "none",
                                                fontWeight: 600,
                                                opacity: 0.8,
                                                whiteSpace: "nowrap",
                                              }}
                                            >
                                              k6 docs ↗
                                            </a>
                                          )}
                                        </div>
                                        <p style={{ margin: "0 0 0.5rem", fontSize: "0.825rem", color: "#444", lineHeight: 1.55 }}>
                                          {st.description}
                                        </p>
                                        <div style={{ fontSize: "0.75rem", color: "#666", lineHeight: 1.4 }}>
                                          <strong style={{ color: "#555" }}>When:</strong>{" "}
                                          {st.whenToUse}
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => toggleSnippet(st.name)}
                                        style={{
                                          flexShrink: 0,
                                          background: snippetOpen ? phase.accent : "transparent",
                                          color: snippetOpen ? "#fff" : phase.accent,
                                          border: `1.5px solid ${phase.accent}`,
                                          borderRadius: "6px",
                                          padding: "0.3rem 0.75rem",
                                          fontSize: "0.75rem",
                                          fontWeight: 700,
                                          cursor: "pointer",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        {snippetOpen ? "Hide code" : "k6 example"}
                                      </button>
                                    </div>
                                    {/* Code snippet panel */}
                                    {snippetOpen && (
                                      <div
                                        style={{
                                          borderTop: `1px solid ${phase.accent}33`,
                                          background: "#1e1e2e",
                                          padding: "1rem 1.25rem",
                                          overflowX: "auto",
                                        }}
                                      >
                                        <pre
                                          style={{
                                            margin: 0,
                                            fontFamily: "'Fira Code', 'Cascadia Code', 'Menlo', monospace",
                                            fontSize: "0.8rem",
                                            lineHeight: 1.65,
                                            color: "#cdd6f4",
                                            whiteSpace: "pre",
                                          }}
                                        >
                                          {st.codeSnippet}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
