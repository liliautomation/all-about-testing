import React, { useEffect, useRef, useState } from "react";
import { TopicsPage } from "./components/TopicsPage";
import { topics } from "./data/topics";
import { HomePage } from "./components/HomePage";
import { ChecklistForm } from "./components/ChecklistForm";
import { StrategiesPage } from "./components/StrategiesPage";
import { RoadmapPage } from "./components/RoadmapPage";
import { AutomationDecisionPage } from "./components/AutomationDecisionPage";
import { TestDataManagementPage } from "./components/TestDataManagementPage";
import { StrategyAdvisorPage } from "./components/StrategyAdvisorPage";

export type View = "topics" | "home" | "strategy-advisor" | "test-types" | "test-strategy" | "dev-roadmap" | "automation-decision" | "test-data-management";
const views: View[] = ["topics", "home", "strategy-advisor", "test-types", "test-strategy", "dev-roadmap", "automation-decision", "test-data-management"];
const exploreLinks = topics.map((topic) => ({ view: topic.id, label: topic.title, icon: topic.icon }));
const readView = (): View => {
  const value = window.location.hash.slice(1) as View;
  return views.includes(value) ? value : "home";
};

export default function App() {
  const [view, setView] = useState<View>(readView);
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const exploreButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!exploreOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!exploreRef.current?.contains(event.target as Node)) setExploreOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExploreOpen(false);
        exploreButtonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [exploreOpen]);
  useEffect(() => {
    const sync = () => {
      setView(readView());
      setExploreOpen(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const navigate = (next: View) => {
    setExploreOpen(false);
    window.location.hash = next === "home" ? "" : next;
    setView(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content" onClick={(event) => { event.preventDefault(); document.getElementById("main-content")?.focus(); }}>Skip to content</a>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#" onClick={(event) => { event.preventDefault(); navigate("home"); }}>
            <span className="brand-symbol" aria-hidden="true">a<span>at</span><i /></span>
            <span>all about testing<span className="brand-caption">A LITTLE CURIOUS. A LOT MORE CONFIDENT.</span></span>
          </a>
          <nav aria-label="Main navigation">
            <div className="explore-nav" ref={exploreRef} onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setExploreOpen(false);
            }}>
              <button ref={exploreButtonRef} className="explore-toggle" aria-expanded={exploreOpen} aria-controls="explore-links" onClick={() => setExploreOpen(!exploreOpen)}>
                Explore <span aria-hidden="true">{exploreOpen ? "⌃" : "⌄"}</span>
              </button>
              <div id="explore-links" className="explore-dropdown" hidden={!exploreOpen}>
                <span className="explore-dropdown-label">FOLLOW YOUR CURIOSITY</span>
                {exploreLinks.map((link) => <a key={link.view} href={`#${link.view}`} aria-current={view === link.view ? "page" : undefined} onClick={() => { setExploreOpen(false); exploreButtonRef.current?.focus(); }}>
                  <span className="explore-link-icon" aria-hidden="true">{link.icon}</span>{link.label}<span className="explore-link-arrow" aria-hidden="true">↗</span>
                </a>)}
              </div>
            </div>
            <a className="nav-cta" href="#strategy-advisor" aria-current={view === "strategy-advisor" ? "page" : undefined}>Strategy lab <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className={view === "home" ? "home-main" : "reference-main"}>
        {view !== "home" && <button className="back-button" onClick={() => navigate("home")}>← Back <span>to the playground</span></button>}
        {view === "home" && <HomePage onNavigate={navigate} />}
        {view === "topics" && <TopicsPage onNavigate={navigate} />}
        {view === "strategy-advisor" && <StrategyAdvisorPage />}
        {view === "test-types" && <ChecklistForm />}
        {view === "test-strategy" && <StrategiesPage />}
        {view === "dev-roadmap" && <RoadmapPage />}
        {view === "automation-decision" && <AutomationDecisionPage />}
        {view === "test-data-management" && <TestDataManagementPage />}
      </main>
      <footer className="site-footer"><span>all about testing <b aria-hidden="true">🤖</b></span><span>Stay curious. Test the unexpected.</span><a href="#dev-roadmap">Find your next step ↗</a></footer>
    </div>
  );
}
