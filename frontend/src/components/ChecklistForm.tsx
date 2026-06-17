import { useEffect, useState } from "react";

const emojiMap: Record<string, string> = {
  "Unit Testing": "🧩",
  "Integration Testing": "🔗",
  "End-to-End (E2E) Testing": "🌐",
  "Component Testing": "🧱",
  "API Testing": "📡",
  "Performance Testing": "⚡",
  "Security Testing": "🔒",
  "Accessibility Testing (a11y)": "♿",
  "Visual Regression Testing": "👁️",
  "Contract Testing": "📜",
  "A/B Testing": "🧦",
};

const palette = [
  "#1a56db", "#7e3af2", "#0e9f6e", "#e3a008", "#e02424",
  "#3f83f8", "#9061f9", "#0694a2", "#ff5a1f", "#31c48d",
];

interface Tool {
  name: string;
  url: string;
}

interface BestPractice {
  text: string;
  url: string;
  sample: string;
}

interface TestingTopic {
  name: string;
  description: string;
  bestPractices: BestPractice[];
  tools: Tool[];
}

const cardStyle: React.CSSProperties = {
  borderRadius: "10px",
  padding: "1.25rem 1.5rem",
  marginBottom: "1.5rem",
  backgroundColor: "#fff",
  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#666",
  marginBottom: "0.4rem",
  marginTop: "1rem",
};

const pillListStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.4rem",
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const pillStyle: React.CSSProperties = {
  background: "#e8f0fe",
  color: "#1a56db",
  borderRadius: "999px",
  padding: "0.2rem 0.75rem",
  fontSize: "0.85rem",
};

const sampleBlockStyle: React.CSSProperties = {
  margin: "0.5rem 0 0 0",
  padding: "0.6rem 0.9rem",
  background: "#1e1e1e",
  color: "#d4d4d4",
  borderRadius: "6px",
  fontSize: "0.8rem",
  lineHeight: 1.5,
  overflowX: "auto",
  whiteSpace: "pre",
  fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
};

export const ChecklistForm = () => {
  const [topics, setTopics] = useState<TestingTopic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openSamples, setOpenSamples] = useState<Set<string>>(new Set());

  const toggleSample = (key: string) =>
    setOpenSamples((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  useEffect(() => {
    fetch("http://localhost:3000/api/checklist")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(setTopics)
      .catch(() =>
        setError("Could not load testing topics. Is the backend running?")
      );
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (topics.length === 0) return <div className="spinner" />;

  return (
    <div>
      <h1 style={{ margin: "0 0 0.4rem", fontSize: "1.8rem", fontWeight: 700, color: "#1a56db" }}>
        🧩 Test Types
      </h1>
      <p style={{ color: "#555", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        Unit, Integration, E2E, Component, API, Performance, Security, Accessibility, Visual Regression, Contract
      </p>
      {topics.map((topic, idx) => {
        const color = palette[idx % palette.length];
        return (
        <div key={topic.name} style={{ ...cardStyle, borderLeft: `4px solid ${color}` }} className="fade-in-up">
          <h2 style={{ margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span>{emojiMap[topic.name] ?? "🔬"}</span> {topic.name}
          </h2>
          <p style={{ margin: "0 0 0.75rem", color: "#444" }}>{topic.description}</p>

          <p style={sectionHeadingStyle}>Best Practices</p>
          <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
            {topic.bestPractices.map((bp) => (
              <li key={bp.text} style={{ marginBottom: "0.6rem" }}>
                <a
                  href={bp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {bp.text}
                </a>
                <details
                  style={{ marginTop: "0.3rem" }}
                  onToggle={(e) => toggleSample(`${topic.name}::${bp.text}`)}
                >
                  <summary style={{ cursor: "pointer", fontSize: "0.8rem", color: "#888", listStyle: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        transition: "transform 0.2s",
                        transform: openSamples.has(`${topic.name}::${bp.text}`) ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    >
                      ▶
                    </span>
                    <span>show example</span>
                  </summary>
                  <pre style={sampleBlockStyle}>{bp.sample}</pre>
                </details>
              </li>
            ))}
          </ul>

          <p style={sectionHeadingStyle}>Common Tools</p>
          <ul style={pillListStyle}>
            {topic.tools.map((tool) => (
              <li key={tool.name} style={pillStyle}>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {tool.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        );
      })}
    </div>
  );
};