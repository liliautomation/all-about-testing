import React from "react";

interface HomePageProps {
  onNavigate: (view: "test-types" | "test-strategy" | "dev-roadmap" | "automation-decision" | "test-data-management") => void;
}

const categories = [
  {
    id: "test-types" as const,
    emoji: "🧩",
    title: "Test Types",
    subtitle: "11 testing types",
    description:
      "Unit, Integration, E2E, Component, API, Performance, Security, Accessibility, Visual Regression, Contract",
    accent: "#1a56db",
    bg: "#e8f0fe",
  },
  {
    id: "test-strategy" as const,
    emoji: "🗺️",
    title: "Test Strategies",
    subtitle: "8 testing strategies",
    description:
      "TDD, BDD, ATDD, Test Pyramid, Shift-Left, Continuous Testing, Risk-Based, Exploratory Testing",
    accent: "#7e3af2",
    bg: "#f3effe",
  },
  {
    id: "dev-roadmap" as const,
    emoji: "🛣️",
    title: "Dev Testing Roadmap",
    subtitle: "5 phases",
    description:
      "A progressive path from unit tests to CI/CD, covering integration, E2E, non-functional, and advanced practices",
    accent: "#0e9f6e",
    bg: "#e6f9f0",
  },
  {
    id: "automation-decision" as const,
    emoji: "🤖",
    title: "Automation Decision",
    subtitle: "What to automate",
    description:
      "Decide what to automate immediately, what to automate later, and what should remain manual — driven by ROI, stability, and risk",
    accent: "#d03027",
    bg: "#fdecea",
  },
  {
    id: "test-data-management" as const,
    emoji: "🗄️",
    title: "Test Data Management",
    subtitle: "4 areas",
    description:
      "PII & data privacy, security testing considerations, confidentiality controls, and entity relationship modelling",
    accent: "#0694a2",
    bg: "#e0f5f5",
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => (
  <div className="fade-in-up">
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem",
        marginTop: "0.5rem",
      }}
    >
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onNavigate(cat.id)}
          style={{
            textAlign: "left",
            background: "#fff",
            border: `2px solid ${cat.accent}`,
            borderRadius: "12px",
            padding: "1.75rem",
            cursor: "pointer",
            transition: "box-shadow 0.15s, transform 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${cat.accent}33`;
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          <div style={{ fontSize: "2.8rem", marginBottom: "0.75rem", lineHeight: 1 }}>
            {cat.emoji}
          </div>
          <div
            style={{
              display: "inline-block",
              background: cat.bg,
              color: cat.accent,
              borderRadius: "6px",
              padding: "0.2rem 0.6rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.75rem",
            }}
          >
            {cat.subtitle}
          </div>
          <h2 style={{ margin: "0 0 0.5rem", color: cat.accent, fontSize: "1.4rem" }}>
            {cat.title}
          </h2>
          <p style={{ margin: 0, color: "#555", fontSize: "0.9rem", lineHeight: 1.5 }}>
            {cat.description}
          </p>
          <div
            style={{
              marginTop: "1.25rem",
              color: cat.accent,
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            Explore →
          </div>
        </button>
      ))}
    </div>
  </div>
);
