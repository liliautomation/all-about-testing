// frontend/src/App.tsx
import React, { useState } from "react";
import { HomePage } from "./components/HomePage";
import { ChecklistForm } from "./components/ChecklistForm";
import { StrategiesPage } from "./components/StrategiesPage";
import { RoadmapPage } from "./components/RoadmapPage";
import { AutomationDecisionPage } from "./components/AutomationDecisionPage";
import { TestDataManagementPage } from "./components/TestDataManagementPage";

type View = "home" | "test-types" | "test-strategy" | "dev-roadmap" | "automation-decision" | "test-data-management";

export default function App() {
  const [view, setView] = useState<View>("home");

  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          background: "linear-gradient(135deg, #1a56db 0%, #7e3af2 100%)",
          color: "white",
          padding: "1.5rem 2rem",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          {view !== "home" && (
            <button
              onClick={() => setView("home")}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.4)",
                color: "white",
                cursor: "pointer",
                fontSize: "0.85rem",
                padding: "0.3rem 0.8rem",
                borderRadius: "6px",
                marginBottom: "0.8rem",
                display: "block",
              }}
            >
              ← Back
            </button>
          )}
          <h1 style={{ margin: 0, fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            🧪 All About Testing
          </h1>
          <p style={{ margin: "0.3rem 0 0", opacity: 0.85, fontSize: "0.95rem" }}>
            A reference guide covering every aspect of software testing
          </p>
        </div>
      </header>
      <main style={{ padding: "2rem", maxWidth: "860px", margin: "0 auto" }}>
        {view === "home" && <HomePage onNavigate={setView} />}
        {view === "test-types" && <ChecklistForm />}
        {view === "test-strategy" && <StrategiesPage />}
        {view === "dev-roadmap" && <RoadmapPage />}
        {view === "automation-decision" && <AutomationDecisionPage />}
        {view === "test-data-management" && <TestDataManagementPage />}
      </main>
    </div>
  );
}
