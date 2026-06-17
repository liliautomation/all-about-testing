import React from "react";

interface AutomationTiers {
  automateNow: string[];
  automateLater: string[];
  keepManual: string[];
}

interface UseCaseItem {
  id: string;
  actor: string;
  title: string;
  preconditions: string[];
  mainFlow: string[];
  alternativeFlows: string[];
  exceptionPaths: string[];
  tags: string[];
  automationTiers?: AutomationTiers;
}

const USE_CASES: UseCaseItem[] = [
  {
    id: "uc-01",
    actor: "QA Engineer / Team",
    title: "Decide What to Automate",
    preconditions: [
      "A backlog of test cases or scenarios exists",
      "Team has access to the codebase and CI/CD pipeline",
      "Automation tooling is available (e.g. Playwright, Jest)",
    ],
    mainFlow: [
      "QA reviews the full test suite and categorises each test",
      "Tests are scored by: frequency of execution, stability of the feature, ROI of automation",
      "High-frequency, stable, regression-critical tests → Automate Now",
      "Valuable but complex or unstable tests → Automate Later",
      "Exploratory, subjective, or one-off scenarios → Keep Manual",
      "Decision is documented and tracked in the test plan",
    ],
    alternativeFlows: [
      "Team runs a risk-based analysis to re-prioritise the order",
      "Product owner flags business-critical flows that must be automated immediately",
    ],
    exceptionPaths: [
      "Feature under active development → defer automation until API is stable",
      "Flaky test detected → move from Automate Now to Automate Later until fixed",
      "No CI/CD pipeline → keep all automated tests in a manual trigger queue",
    ],
    tags: ["automation-strategy", "ROI", "test-planning"],
    automationTiers: {
      automateNow: [
        "Login / logout flows (run on every build)",
        "Core happy-path user journeys (checkout, registration, search)",
        "API contract tests and CRUD endpoints",
        "Regression suite for stable, high-traffic features",
        "Data-driven tests with many input combinations",
      ],
      automateLater: [
        "Edge cases for recently released features (wait for stability)",
        "Performance / load tests (need infrastructure setup)",
        "Visual regression tests (need baseline snapshots first)",
        "Tests for third-party integrations with sandbox environments",
        "Complex multi-step workflows that require test data orchestration",
      ],
      keepManual: [
        "Exploratory testing of new or changing UX",
        "Usability and accessibility reviews requiring human judgment",
        "One-off production investigations and incident post-mortems",
        "Tests with unclear or frequently changing acceptance criteria",
        "Highly visual checks (layout, branding, emotional tone of content)",
      ],
    },
  },
];

const accent = "#d03027";
const bg = "#fdecea";

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: `1.5px solid ${accent}22`,
  borderRadius: "10px",
  padding: "1.5rem",
  marginBottom: "1.5rem",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

const sectionLabel: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#888",
  marginTop: "1rem",
  marginBottom: "0.35rem",
};

const listStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: "1.2rem",
  color: "#444",
  fontSize: "0.9rem",
  lineHeight: 1.7,
};

const tagStyle: React.CSSProperties = {
  display: "inline-block",
  background: bg,
  color: accent,
  borderRadius: "6px",
  padding: "0.15rem 0.55rem",
  fontSize: "0.75rem",
  fontWeight: 600,
  marginRight: "0.35rem",
  marginTop: "0.25rem",
};

export const AutomationDecisionPage: React.FC = () => (
  <div className="fade-in-up">
    <h1 style={{ margin: "0 0 0.4rem", fontSize: "1.8rem", fontWeight: 700, color: accent }}>
      🤖 Automation Decisions
    </h1>
    <p style={{ color: "#555", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
      A framework for deciding which tests to automate immediately, which to automate later, and
      which should stay manual — based on ROI, execution frequency, stability, and risk.
    </p>
    {USE_CASES.map((uc) => (
      <div key={uc.id} style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span
            style={{
              background: bg,
              color: accent,
              borderRadius: "6px",
              padding: "0.2rem 0.6rem",
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {uc.id}
          </span>
          <h2 style={{ margin: 0, fontSize: "1.2rem", color: accent }}>{uc.title}</h2>
          <span style={{ marginLeft: "auto", fontSize: "0.85rem", color: "#777" }}>
            Actor: <strong>{uc.actor}</strong>
          </span>
        </div>

        <div>
          <p style={sectionLabel}>Preconditions</p>
          <ul style={listStyle}>
            {uc.preconditions.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>

        <div>
          <p style={sectionLabel}>Main Flow</p>
          <ol style={listStyle}>
            {uc.mainFlow.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        <div>
          <p style={sectionLabel}>Alternative Flows</p>
          <ul style={listStyle}>
            {uc.alternativeFlows.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        <div>
          <p style={sectionLabel}>Exception Paths</p>
          <ul style={listStyle}>
            {uc.exceptionPaths.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>

        {uc.automationTiers && (
          <div
            style={{
              marginTop: "1.25rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {([
              { key: "automateNow", label: "⚡ Automate Now", color: "#0e9f6e", bg: "#e6f9f0" },
              { key: "automateLater", label: "🕐 Automate Later", color: "#e3a008", bg: "#fdf6e3" },
              { key: "keepManual", label: "🤚 Keep Manual", color: "#1a56db", bg: "#e8f0fe" },
            ] as const).map(({ key, label, color, bg: tileBg }) => (
              <div
                key={key}
                style={{
                  background: tileBg,
                  border: `1.5px solid ${color}33`,
                  borderRadius: "8px",
                  padding: "0.85rem 1rem",
                }}
              >
                <p
                  style={{
                    margin: "0 0 0.5rem",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {label}
                </p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "1.1rem",
                    fontSize: "0.85rem",
                    color: "#444",
                    lineHeight: 1.65,
                  }}
                >
                  {uc.automationTiers![key].map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "1rem" }}>
          {uc.tags.map((tag) => (
            <span key={tag} style={tagStyle}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);
