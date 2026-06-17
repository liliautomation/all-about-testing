import { useEffect, useState } from "react";

const emojiMap: Record<string, string> = {
  "Test-Driven Development (TDD)": "🔴",
  "Behaviour-Driven Development (BDD)": "💬",
  "Acceptance Test-Driven Development (ATDD)": "✅",
  "Test Pyramid": "🔺",
  "Shift-Left Testing": "⬅️",
  "Continuous Testing": "♾️",
  "Risk-Based Testing": "⚠️",
  "Exploratory Testing": "🧭",
};

const palette = [
  "#7e3af2", "#0e9f6e", "#1a56db", "#e3a008", "#e02424",
  "#9061f9", "#0694a2", "#ff5a1f",
];

interface Tool {
  name: string;
  url: string;
}

interface StrategyPrinciple {
  text: string;
  url: string;
  sample: string;
}

interface TestStrategy {
  name: string;
  description: string;
  principles: StrategyPrinciple[];
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
  background: "#def7ec",
  color: "#0e9f6e",
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

export const StrategiesPage = () => {
  const [strategies, setStrategies] = useState<TestStrategy[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openSamples, setOpenSamples] = useState<Set<string>>(new Set());

  const toggleSample = (key: string) =>
    setOpenSamples((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  useEffect(() => {
    fetch("http://localhost:3000/api/strategies")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(setStrategies)
      .catch(() =>
        setError("Could not load strategies. Is the backend running?")
      );
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (strategies.length === 0) return <div className="spinner" />;

  return (
    <div>
      <h1 style={{ margin: "0 0 0.4rem", fontSize: "1.8rem", fontWeight: 700, color: "#7e3af2" }}>
        🗺️ Test Strategies
      </h1>
      <p style={{ color: "#555", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        TDD, BDD, ATDD, Test Pyramid, Shift-Left, Continuous Testing, Risk-Based, Exploratory Testing
      </p>
      {strategies.map((strategy, idx) => {
        const color = palette[idx % palette.length];
        return (
        <div key={strategy.name} style={{ ...cardStyle, borderLeft: `4px solid ${color}` }} className="fade-in-up">
          <h2 style={{ margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span>{emojiMap[strategy.name] ?? "🧪"}</span> {strategy.name}
          </h2>
          <p style={{ margin: "0 0 0.75rem", color: "#444" }}>{strategy.description}</p>

          <p style={sectionHeadingStyle}>Key Principles</p>
          <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
            {strategy.principles.map((p) => (
              <li key={p.text} style={{ marginBottom: "0.6rem" }}>
                <a href={p.url} target="_blank" rel="noopener noreferrer">
                  {p.text}
                </a>
                <details
                  style={{ marginTop: "0.3rem" }}
                  onToggle={() => toggleSample(`${strategy.name}::${p.text}`)}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      color: "#888",
                      listStyle: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        transition: "transform 0.2s",
                        transform: openSamples.has(`${strategy.name}::${p.text}`)
                          ? "rotate(90deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      ▶
                    </span>
                    <span>show example</span>
                  </summary>
                  <pre style={sampleBlockStyle}>{p.sample}</pre>
                </details>
              </li>
            ))}
          </ul>

          <p style={sectionHeadingStyle}>Common Tools</p>
          <ul style={pillListStyle}>
            {strategy.tools.map((tool) => (
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
