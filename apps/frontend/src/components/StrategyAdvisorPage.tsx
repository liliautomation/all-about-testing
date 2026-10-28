import { FormEvent, useState } from "react";
import {
  createRecommendation,
  type ProjectDetails,
  type RiskArea,
  type TestStrategyRecommendation,
} from "../data/recommendations";

type ProjectDraft = Omit<ProjectDetails, "projectType" | "stage" | "releaseCadence" | "teamSize"> & {
  [Key in "projectType" | "stage" | "releaseCadence" | "teamSize"]: ProjectDetails[Key] | "";
};

const initialDetails: ProjectDraft = {
  name: "",
  description: "",
  projectType: "",
  stage: "",
  releaseCadence: "",
  teamSize: "",
  risks: [],
};

const riskOptions: { value: RiskArea; label: string }[] = [
  { value: "security", label: "Security & privacy" },
  { value: "performance", label: "Performance & scale" },
  { value: "accessibility", label: "Accessibility" },
  { value: "integrations", label: "External integrations" },
  { value: "data", label: "Data accuracy" },
];

export const StrategyAdvisorPage = () => {
  const [details, setDetails] = useState<ProjectDraft>(initialDetails);
  const [recommendation, setRecommendation] = useState<TestStrategyRecommendation | null>(null);

  const update = <Key extends keyof ProjectDetails>(key: Key, value: ProjectDraft[Key]) => {
    setRecommendation(null);
    setDetails((current) => ({ ...current, [key]: value }));
  };

  const toggleRisk = (risk: RiskArea) => {
    update("risks", details.risks.includes(risk)
      ? details.risks.filter((item) => item !== risk)
      : [...details.risks, risk]);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const { projectType, stage, releaseCadence, teamSize } = details;
    if (!projectType || !stage || !releaseCadence || !teamSize) return;
    setRecommendation(createRecommendation({ ...details, projectType, stage, releaseCadence, teamSize }));
    requestAnimationFrame(() => document.getElementById("strategy-result")?.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <div className="advisor-page fade-in-up">
      <div className="advisor-intro">
        <span className="eyebrow">Project-based guidance</span>
        <h1>Test Strategy Advisor</h1>
        <p>Choose your project profile and risks to get a practical strategy from this guide. Recommendations use these selections; no AI service is involved.</p>
      </div>

      <form className="advisor-form" onSubmit={submit}>
        <div className="form-heading">
          <div>
            <span className="step-number">01</span>
            <h2>Project profile</h2>
          </div>
          <p>No project information leaves your browser.</p>
        </div>

        <div className="form-grid">
          <label className="field field-wide">
            <span>Project name <small>Optional</small></span>
            <input value={details.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. Customer billing portal" />
          </label>

          <label className="field">
            <span>Project type</span>
            <select required value={details.projectType} onChange={(event) => update("projectType", event.target.value as ProjectDetails["projectType"])}>
              <option value="" disabled>Choose a project type</option>
              <option value="web">Web application</option>
              <option value="api">API or microservice</option>
              <option value="mobile">Mobile application</option>
              <option value="data">Data pipeline or platform</option>
              <option value="desktop">Desktop application</option>
            </select>
          </label>

          <label className="field">
            <span>Lifecycle stage</span>
            <select required value={details.stage} onChange={(event) => update("stage", event.target.value as ProjectDetails["stage"])}>
              <option value="" disabled>Choose a lifecycle stage</option>
              <option value="new">New / pre-launch</option>
              <option value="growing">Growing product</option>
              <option value="established">Established / legacy</option>
            </select>
          </label>

          <label className="field">
            <span>Release cadence</span>
            <select required value={details.releaseCadence} onChange={(event) => update("releaseCadence", event.target.value as ProjectDetails["releaseCadence"])}>
              <option value="" disabled>Choose a release cadence</option>
              <option value="daily">Daily or continuous</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="occasional">Occasional releases</option>
            </select>
          </label>

          <label className="field">
            <span>Delivery team</span>
            <select required value={details.teamSize} onChange={(event) => update("teamSize", event.target.value as ProjectDetails["teamSize"])}>
              <option value="" disabled>Choose a team size</option>
              <option value="solo">Solo developer</option>
              <option value="small">2–8 people</option>
              <option value="large">9+ people / multiple teams</option>
            </select>
          </label>

          <label className="field field-wide">
            <span>Project scope note <small>Optional · included in your plan, not analysed</small></span>
            <textarea value={details.description} onChange={(event) => update("description", event.target.value)} placeholder="Record the workflows you want this plan to cover. Select risks below to change the recommendations." rows={3} />
          </label>
        </div>

        <fieldset className="risk-fieldset">
          <legend>Which risks need extra attention?</legend>
          <div className="risk-options">
            {riskOptions.map((option) => (
              <label key={option.value} className={details.risks.includes(option.value) ? "risk-option selected" : "risk-option"}>
                <input type="checkbox" checked={details.risks.includes(option.value)} onChange={() => toggleRisk(option.value)} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button className="generate-button" type="submit">Build my test strategy <span>→</span></button>
      </form>

      {recommendation && <RecommendationResult recommendation={recommendation} />}
    </div>
  );
};

const RecommendationResult = ({ recommendation }: { recommendation: TestStrategyRecommendation }) => (
  <section className="strategy-result" id="strategy-result" aria-live="polite">
    <div className="result-header">
      <div>
        <span className="eyebrow">Recommended strategy</span>
        <h2>{recommendation.headline}</h2>
        <p>{recommendation.approach}</p>
      </div>
      <div className="knowledge-badge">Based on repository guidance</div>
    </div>

    <div className="recommendation-basis"><h3>Why this plan?</h3><ul>{recommendation.basis.map((reason) => <li key={reason}>{reason}</li>)}</ul>{recommendation.scopeNote && <p><strong>Your scope note:</strong> {recommendation.scopeNote}</p>}</div>

    <div className="mix-section">
      <h3>Suggested starting allocation of testing effort</h3><p className="allocation-note">A planning guide, not measured coverage or a target test count. Adjust it as you learn where failures occur.</p>
      <div className="mix-bar" aria-label="Suggested distribution of test coverage">
        {recommendation.testMix.map((item, index) => <span key={item.label} className={`mix-${index}`} style={{ width: `${item.percentage}%` }} />)}
      </div>
      <div className="mix-legend">
        {recommendation.testMix.map((item, index) => (
          <div key={item.label}>
            <span className={`mix-dot mix-${index}`} />
            <strong>{item.percentage}% {item.label}</strong>
            <small>{item.detail}</small>
          </div>
        ))}
      </div>
    </div>

    <div className="result-section">
      <div className="section-title"><span>02</span><div><h3>Recommended coverage</h3><p>Implement in priority order; expand details for repository guidance.</p></div></div>
      <div className="recommendation-list">
        {recommendation.tests.map(({ topic, priority, reason }, index) => (
          <details key={topic.name} className="recommendation-card" open={index === 0}>
            <summary>
              <span className={`priority ${priority.toLowerCase()}`}>{priority}</span>
              <div><h4>{topic.name}</h4><p>{reason}</p></div>
              <span className="expand-mark">+</span>
            </summary>
            <div className="recommendation-detail">
              <p>{topic.description}</p>
              <strong>Start with</strong>
              <ul>{topic.bestPractices.slice(0, 3).map((practice) => <li key={practice.text}>{practice.text}</li>)}</ul>
              <div className="tool-row">{topic.tools.slice(0, 4).map((tool) => <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer">{tool.name}</a>)}</div>
            </div>
          </details>
        ))}
      </div>
    </div>

    <div className="result-section">
      <div className="section-title"><span>03</span><div><h3>Ways of working</h3><p>Practices selected for your project stage and delivery speed.</p></div></div>
      <div className="strategy-grid">
        {recommendation.strategies.map(({ strategy, reason }) => (
          <article key={strategy.name}>
            <h4>{strategy.name}</h4>
            <p>{reason}</p>
            <small>{strategy.description}</small>
          </article>
        ))}
      </div>
    </div>

    <div className="next-steps">
      <div className="section-title"><span>04</span><div><h3>Your first four actions</h3><p>Turn the recommendation into a working test plan.</p></div></div>
      <ol>{recommendation.nextSteps.map((step) => <li key={step}>{step}</li>)}</ol>
    </div>
  </section>
);
