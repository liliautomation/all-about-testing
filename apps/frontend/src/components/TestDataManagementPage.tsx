import React, { useState } from "react";

const accent = "#0694a2";
const bg = "#e0f5f5";

interface Section {
  id: string;
  emoji: string;
  title: string;
  summary: string;
  subsections: { heading: string; points: string[] }[];
}

const SECTIONS: Section[] = [
  {
    id: "pii",
    emoji: "🔏",
    title: "PII and Data Privacy",
    summary:
      "Personally Identifiable Information (PII) must never appear in test environments in raw form. All test data strategies must align with GDPR, CCPA, and similar regulations.",
    subsections: [
      {
        heading: "What counts as PII",
        points: [
          "Full name, email address, phone number, postal address",
          "National ID / passport / social security numbers",
          "Date of birth, biometric data, IP addresses (in some jurisdictions)",
          "Financial account details and payment card data (PCI-DSS scope)",
          "Health and medical records (HIPAA scope)",
        ],
      },
      {
        heading: "Safe handling strategies",
        points: [
          "Data masking — replace real values with realistic fake equivalents",
          "Data anonymisation — irreversibly remove the link to an individual",
          "Pseudonymisation — replace identifiers with tokens; keep mapping secure",
          "Synthetic data generation — create statistically realistic data with no real-person origin",
          "Subsetting — use only the minimum dataset needed for the test",
        ],
      },
      {
        heading: "Regulatory obligations",
        points: [
          "GDPR Art. 5: data minimisation and purpose limitation",
          "GDPR Art. 25: data protection by design and by default",
          "CCPA: consumers' right to know, delete, and opt out",
          "Conduct a Data Protection Impact Assessment (DPIA) before using production data",
          "Document lawful basis for any test data that originates from production",
        ],
      },
    ],
  },
  {
    id: "security",
    emoji: "🛡️",
    title: "Security Testing Considerations",
    summary:
      "Test data can be an attack surface. Poorly managed test environments with real or realistic data introduce injection, enumeration, and exfiltration risks.",
    subsections: [
      {
        heading: "Input validation & injection",
        points: [
          "Include boundary and adversarial values: SQL injection strings, XSS payloads, null bytes",
          "Test with oversized inputs to check buffer-handling and truncation",
          "Verify error messages never leak schema or internal paths",
          "Use OWASP Top 10 as a checklist for data-driven attack vectors",
        ],
      },
      {
        heading: "Access control",
        points: [
          "Create test accounts for each role (admin, regular user, guest, service account)",
          "Verify horizontal privilege escalation: user A cannot access user B's data",
          "Verify vertical privilege escalation: regular user cannot reach admin endpoints",
          "Test with expired, revoked, and malformed tokens / session IDs",
        ],
      },
      {
        heading: "Test environment hygiene",
        points: [
          "Never reuse production credentials in test environments",
          "Rotate test secrets regularly; store in a secrets manager (not source control)",
          "Restrict network access to test databases — no public exposure",
          "Purge test data after a test run; automate teardown in CI/CD",
          "Log all access to sensitive test datasets for auditability",
        ],
      },
    ],
  },
  {
    id: "confidentiality",
    emoji: "🔒",
    title: "Confidentiality Controls",
    summary:
      "Test data containing sensitive business, customer, or financial information requires the same classification and access controls as production data.",
    subsections: [
      {
        heading: "Data classification",
        points: [
          "Public — no restrictions; safe to use freely in tests",
          "Internal — restricted to employees; mask before use in CI",
          "Confidential — customer or financial data; must be anonymised or synthetic",
          "Restricted / Top Secret — regulatory / legal data; test with fully synthetic sets only",
        ],
      },
      {
        heading: "Access controls",
        points: [
          "Apply least-privilege: testers access only the data sets their test requires",
          "Use role-based access control (RBAC) on test databases and repositories",
          "Audit and review access rights regularly; remove stale accounts promptly",
          "Encrypt data at rest and in transit in all test environments",
        ],
      },
      {
        heading: "Data lifecycle",
        points: [
          "Define a retention policy: how long test data is kept after a test run",
          "Automate deletion of sensitive test records post-run",
          "Maintain an inventory of all test data sets and their classification level",
          "Include test data disposal in offboarding and project-closure checklists",
        ],
      },
    ],
  },
  {
    id: "erd",
    emoji: "🗂️",
    title: "Entity Relationship Modelling & Data Structures",
    summary:
      "Understanding the data model is essential for building test data that exercises real relationships, constraints, and edge cases — not just isolated records.",
    subsections: [
      {
        heading: "Why ERDs matter for testing",
        points: [
          "Referential integrity: foreign key violations are a common source of bugs",
          "Cardinality: test one-to-one, one-to-many, and many-to-many relationships",
          "Nullable vs required fields: ensure tests cover both present and absent optional data",
          "Cascade rules: verify delete/update cascades propagate correctly across related tables",
        ],
      },
      {
        heading: "Modelling test data sets",
        points: [
          "Start from the ERD; identify the minimum viable set of records for each scenario",
          "Create factory/builder utilities that construct related entities in the correct order",
          "Maintain shared seed data for stable reference data (countries, categories, statuses)",
          "Use separate transient data for each test to avoid state bleed between runs",
        ],
      },
      {
        heading: "Edge cases to model",
        points: [
          "Orphaned records (parent deleted, child remains)",
          "Circular references (entity A references B which references A)",
          "Large graphs: entities with hundreds of child records to test pagination and performance",
          "Sparse data: entities with most optional fields left empty",
          "Duplicate detection: identical or near-identical records to test deduplication logic",
        ],
      },
    ],
  },
];

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: `1.5px solid ${accent}33`,
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

export const TestDataManagementPage: React.FC = () => {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="fade-in-up">
      <h1 style={{ margin: "0 0 0.4rem", fontSize: "1.8rem", fontWeight: 700, color: accent }}>
        🗄️ Test Data Management
      </h1>
      <p style={{ color: "#555", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        Strategies for creating, handling, and protecting test data — covering privacy,
        security, confidentiality, and data modelling.
      </p>

      {SECTIONS.map((section) => (
        <div key={section.id} style={cardStyle}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <span style={{ fontSize: "2rem", lineHeight: 1 }}>{section.emoji}</span>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: "0 0 0.4rem", fontSize: "1.2rem", color: accent }}>
                {section.title}
              </h2>
              <p style={{ margin: 0, color: "#555", fontSize: "0.9rem", lineHeight: 1.6 }}>
                {section.summary}
              </p>
            </div>
          </div>

          {section.subsections.map((sub) => {
            const key = `${section.id}::${sub.heading}`;
            const isOpen = open[key] ?? false;
            return (
              <div key={key}>
                <button
                  onClick={() => toggle(key)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: isOpen ? bg : "transparent",
                    border: `1px solid ${accent}33`,
                    borderRadius: "6px",
                    padding: "0.5rem 0.75rem",
                    marginTop: "0.6rem",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={sectionLabel as React.CSSProperties}>{sub.heading}</span>
                  <span style={{ color: accent, fontSize: "0.85rem" }}>{isOpen ? "▲" : "▼"}</span>
                </button>
                {isOpen && (
                  <ul style={{ ...listStyle, marginTop: "0.4rem", paddingBottom: "0.25rem" }}>
                    {sub.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
