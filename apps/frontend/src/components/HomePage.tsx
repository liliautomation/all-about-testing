import React from "react";
import type { View } from "../App";
import { topics } from "../data/topics";
import { TopicList } from "./TopicsPage";
interface HomePageProps { onNavigate: (view: View) => void; }


export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => (
  <div className="playground fade-in-up">
    <section className="playground-hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="hero-kicker"><span /> YOUR TESTING PLAYGROUND</div>
        <h1 id="hero-title">Break things.<br />Build <span>confidence.<svg viewBox="0 0 420 18" preserveAspectRatio="none" aria-hidden="true"><path d="M3 12 Q180 -2 414 8 M25 17 Q230 4 395 14" /></svg></span></h1>
        <p>A practical little corner of the internet for better software testing. Explore the concepts, try the tools, and find your next “aha!”</p>
        <div className="hero-actions"><button className="primary-action" onClick={() => document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" })}>Find your starting point <span>↓</span></button><span className="hero-note">Curiosity encouraged.<br />Bugs welcome.</span></div>
      </div>
      <div className="lab-art" role="img" aria-label="A playful testing lab with a green flask, passing checks and a curious bug">
        <span className="art-label">EXPERIMENT No. 001</span><span className="art-spark spark-one">✳</span><span className="art-spark spark-two">+</span>
        <div className="test-slip"><span>● ● ●</span><code>describe('a better release')<br /><em>✓</em> a little more coverage<br /><em>✓</em> a lot less guessing<br /><em>✓</em> ready for the unexpected</code><strong>3 passed <span>feels good, right?</span></strong></div>
        <svg className="flask" viewBox="0 0 200 235" aria-hidden="true"><defs><clipPath id="flask-clip"><path d="M76 24H124V94L177 184Q190 211 160 214H40Q10 211 23 184L76 94Z" /></clipPath></defs><path d="M76 24H124V94L177 184Q190 211 160 214H40Q10 211 23 184L76 94Z" fill="#faf9f1" stroke="#242724" strokeWidth="5" strokeLinejoin="round"/><g clipPath="url(#flask-clip)"><path d="M0 147Q50 127 100 145T200 142V235H0Z" fill="#c8f36b"/><circle cx="76" cy="168" r="9" fill="#a6ce45"/><circle cx="128" cy="190" r="5" fill="#a6ce45"/><circle cx="109" cy="156" r="4" fill="#a6ce45"/></g><path d="M70 24H130M91 48V101L57 157" fill="none" stroke="#242724" strokeWidth="5" strokeLinecap="round"/><circle cx="88" cy="185" r="3"/><circle cx="113" cy="185" r="3"/><path d="M95 195Q101 201 108 195" fill="none" stroke="#242724" strokeWidth="3" strokeLinecap="round"/></svg>
        <span className="bubble bubble-one"/><span className="bubble bubble-two"/><span className="art-sticker">a healthy dose<br />of <b>“what if?”</b></span><span className="little-bug" aria-hidden="true">✳</span><span className="bug-note">a feature? a bug?<br />let’s find out. ↗</span>
      </div>
    </section>
    <div className="manifesto-strip"><span>LESS GUESSWORK</span><b aria-hidden="true">🤖</b><span>MORE “AHA!” MOMENTS</span><b aria-hidden="true">🤖</b><span>BETTER SOFTWARE</span><b aria-hidden="true">🤖</b><span>ONE TEST AT A TIME</span></div>
    <section id="explore" className="explore-section" aria-labelledby="explore-title">
      <div className="explore-heading"><div><span className="eyebrow">PICK A THREAD. FOLLOW YOUR CURIOSITY.</span><h2 id="explore-title">What are we exploring?</h2></div><span className="section-aside">A few good places to start ↙</span></div>
      <div className="playground-grid">
        <article className="lab-feature"><div className="feature-top"><span className="feature-tag">THE STRATEGY LAB</span></div><div className="feature-orbit" aria-hidden="true">✳</div><div><h3>Your project.<br />Your game plan.</h3><p>A new app? A tricky release? Tell us what you’re building and get a testing strategy that fits.</p><button onClick={() => onNavigate("strategy-advisor")}>Open strategy advisor <span aria-hidden="true">→</span></button><small>Practical guidance. No account needed.</small></div></article>
        <div className="home-topic-column">
          <TopicList topics={topics.slice(0, 5)} onNavigate={onNavigate} />
          {topics.length > 5 && <button className="more-topics" onClick={() => onNavigate("topics")}>More… <span aria-hidden="true">↗</span></button>}
        </div>
      </div>
    </section>
    <section className="closing-note"><span aria-hidden="true">✺</span><div><h2>You don’t need to test everything at once.</h2><p>Start with one thing. Make it a little more reliable. Keep going.</p></div><a href="#dev-roadmap">Take the first step ↗</a></section>
  </div>
);
