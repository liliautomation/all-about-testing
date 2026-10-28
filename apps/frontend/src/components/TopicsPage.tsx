import type { View } from "../App";
import { topics } from "../data/topics";

type Topic = (typeof topics)[number];

export function TopicList({ topics: items, onNavigate }: { topics: readonly Topic[]; onNavigate: (view: View) => void }) {
  return <div className="topic-rows">
    {items.map((topic) => <button key={topic.id} className={`topic-row ${topic.color}`} onClick={() => onNavigate(topic.id)}>
      <span className="row-icon" aria-hidden="true">{topic.icon}</span>
      <span className="row-copy"><span className="row-eyebrow">{topic.subtitle}</span><span className="row-title">{topic.title}</span><span className="row-description">{topic.description}</span></span>
      <span className="row-end"><span className="row-number">/{topic.number}</span><span aria-hidden="true">↗</span></span>
    </button>)}
  </div>;
}

export function TopicsPage({ onNavigate }: { onNavigate: (view: View) => void }) {
  return <section className="all-topics fade-in-up">
    <span className="eyebrow">FOLLOW YOUR CURIOSITY</span>
    <h1>Explore all topics</h1>
    <p className="topics-intro">Find your next step, from testing fundamentals to a confident release.</p>
    <TopicList topics={topics} onNavigate={onNavigate} />
  </section>;
}
