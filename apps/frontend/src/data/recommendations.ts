import { getTestingTopics, type TestingTopic } from "./checklist";
import { getTestStrategies, type TestStrategy } from "./strategies";

export type ProjectType = "web" | "api" | "mobile" | "data" | "desktop";
export type ProjectStage = "new" | "growing" | "established";
export type ReleaseCadence = "daily" | "weekly" | "monthly" | "occasional";
export type TeamSize = "solo" | "small" | "large";
export type RiskArea = "security" | "performance" | "accessibility" | "integrations" | "data";

export interface ProjectDetails {
  name: string;
  description: string;
  projectType: ProjectType;
  stage: ProjectStage;
  releaseCadence: ReleaseCadence;
  teamSize: TeamSize;
  risks: RiskArea[];
}

export interface RecommendedTest {
  topic: TestingTopic;
  priority: "Essential" | "Recommended";
  reason: string;
}

export interface RecommendedStrategy {
  strategy: TestStrategy;
  reason: string;
}

export interface TestStrategyRecommendation {
  headline: string;
  basis: string[];
  scopeNote: string;
  approach: string;
  testMix: { label: string; percentage: number; detail: string }[];
  tests: RecommendedTest[];
  strategies: RecommendedStrategy[];
  nextSteps: string[];
}

const testReasons: Record<string, string> = {
  "Unit Testing": "Protect business logic with fast feedback on every change.",
  "Integration Testing": "Verify that modules, persistence, and external boundaries work together.",
  "End-to-End (E2E) Testing": "Protect the small set of user journeys that must never break.",
  "Component Testing": "Check UI behaviour and states without the cost of a full browser journey.",
  "API Testing": "Validate request, response, authentication, and error behaviour at the HTTP boundary.",
  "Performance Testing": "Measure response time, throughput, and stability before traffic exposes a bottleneck.",
  "Security Testing": "Exercise authentication, authorisation, input handling, and dependency risks.",
  "Accessibility Testing (a11y)": "Make key workflows usable with keyboards, screen readers, and assistive technology.",
  "Visual Regression Testing": "Detect unintended layout and styling changes in the user interface.",
  "Contract Testing": "Catch breaking changes between services and third-party integrations before deployment.",
};

const projectTests: Record<ProjectType, string[]> = {
  web: ["Unit Testing", "Component Testing", "Integration Testing", "API Testing", "End-to-End (E2E) Testing"],
  api: ["Unit Testing", "API Testing", "Integration Testing", "Contract Testing", "Performance Testing"],
  mobile: ["Unit Testing", "Component Testing", "Integration Testing", "End-to-End (E2E) Testing", "Performance Testing"],
  data: ["Unit Testing", "Integration Testing", "API Testing", "Performance Testing", "Security Testing"],
  desktop: ["Unit Testing", "Component Testing", "Integration Testing", "End-to-End (E2E) Testing", "Accessibility Testing (a11y)"],
};

const riskTests: Record<RiskArea, string[]> = {
  security: ["Security Testing"],
  performance: ["Performance Testing"],
  accessibility: ["Accessibility Testing (a11y)"],
  integrations: ["Contract Testing", "Integration Testing"],
  data: ["Security Testing", "Integration Testing"],
};

const stageLabels: Record<ProjectStage, string> = {
  new: "build quality in from the first feature",
  growing: "add reliable regression coverage without slowing delivery",
  established: "reduce regression risk and modernise coverage incrementally",
};

export function createRecommendation(details: ProjectDetails): TestStrategyRecommendation {
  const topics = getTestingTopics();
  const allStrategies = getTestStrategies();
  if (!projectTests[details.projectType] || !stageLabels[details.stage]
    || !["daily", "weekly", "monthly", "occasional"].includes(details.releaseCadence)
    || !["solo", "small", "large"].includes(details.teamSize)
    || details.risks.some((risk) => !riskTests[risk])) {
    throw new Error("Choose a valid project type, lifecycle stage, release cadence, and team size.");
  }
  const selectedNames = [...new Set([
    ...details.risks.flatMap((risk) => riskTests[risk]),
    ...projectTests[details.projectType],
  ])];

  const riskReasons: Record<RiskArea, string> = {
    security: "You selected security & privacy: prioritise access control, sensitive-data handling, and abuse cases.",
    performance: "You selected performance & scale: establish latency and throughput limits and exercise peak load.",
    accessibility: "You selected accessibility: verify keyboard and assistive-technology access on critical workflows.",
    integrations: "You selected external integrations: check contracts, timeouts, retries, and dependency failures.",
    data: "You selected data accuracy: verify transformations, reconciliation, duplicate handling, and persisted results.",
  };
  const essentialNames = new Set([
    ...projectTests[details.projectType].slice(0, details.teamSize === "solo" ? 2 : 3),
    ...details.risks.flatMap((risk) => riskTests[risk]),
  ]);
  const tests = selectedNames.map((name) => {
    const matchedRisks = details.risks.filter((risk) => riskTests[risk].includes(name));
    return {
      topic: topics.find((topic) => topic.name === name),
      priority: essentialNames.has(name) ? "Essential" as const : "Recommended" as const,
      reason: matchedRisks.length ? matchedRisks.map((risk) => riskReasons[risk]).join(" ") : testReasons[name],
    };
  }).filter((item): item is RecommendedTest => Boolean(item.topic));

  const strategyReasons = new Map<string, string>();
  strategyReasons.set("Test Pyramid", "Keep most checks fast and close to the code, with only critical journeys at E2E level.");
  strategyReasons.set("Risk-Based Testing", "Spend limited testing effort on the failures with the highest likelihood and impact.");

  if (details.stage === "new") {
    strategyReasons.set("Shift-Left Testing", "Review testability and acceptance criteria before implementation starts.");
    strategyReasons.set("Test-Driven Development (TDD)", "Use short red-green-refactor cycles for new business logic.");
  } else if (details.stage === "growing") {
    strategyReasons.set("Shift-Left Testing", "Add tests in the same pull request as each feature and defect fix.");
  } else {
    strategyReasons.set("Exploratory Testing", "Use focused charters to reveal gaps that the established regression suite misses.");
  }

  if (details.releaseCadence === "daily" || details.releaseCadence === "weekly") {
    strategyReasons.set("Continuous Testing", "Run fast quality gates on every pull request and deeper suites before release.");
  }

  const strategies = Array.from(strategyReasons, ([name, reason]) => ({
    strategy: allStrategies.find((strategy) => strategy.name === name),
    reason,
  })).filter((item): item is RecommendedStrategy => Boolean(item.strategy));

  const uiHeavy = details.projectType === "web" || details.projectType === "mobile" || details.projectType === "desktop";
  const testMix = uiHeavy
    ? [
        { label: "Unit & component", percentage: 60, detail: "Fast logic and UI feedback" },
        { label: "Integration & API", percentage: 30, detail: "Module and boundary confidence" },
        { label: "End-to-end", percentage: 10, detail: "Critical user journeys only" },
      ]
    : [
        { label: "Unit", percentage: 55, detail: "Fast business-logic feedback" },
        { label: "Integration & API", percentage: 40, detail: "Data and service boundaries" },
        { label: "System journey", percentage: 5, detail: "A few release smoke checks" },
      ];

  // Shift effort towards boundaries for service/data work and legacy regression.
  let boundaryShift = details.projectType === "data" ? 10 : details.projectType === "api" ? 5 : 0;
  if (details.stage === "established") boundaryShift += 10;
  if (details.risks.includes("integrations") || details.risks.includes("data")) boundaryShift += 5;
  testMix[0].percentage -= boundaryShift;
  testMix[1].percentage += boundaryShift;

  const focus = details.projectType === "data" ? "a data-validation and integration-first strategy"
    : details.projectType === "api" ? "a service-contract and API-first strategy"
    : details.stage === "established" ? "a regression-first testing strategy"
    : "a risk-led test pyramid";
  const riskSummary = details.risks.length
    ? details.risks.map((risk) => riskReasons[risk]).join(" ")
    : "No additional risk areas selected: this is a baseline plan; review product risks before adopting it.";
  const deliveryPlan: Record<ReleaseCadence, string> = {
    daily: "Run fast checks on every pull request, smoke-test each deployment, and schedule deeper suites independently so frequent releases stay fast.",
    weekly: "Run fast checks on every pull request and a focused regression and risk suite before each weekly release.",
    monthly: "Run fast checks during development and reserve time for a full regression, exploratory session, and selected risk checks before the monthly release.",
    occasional: "Keep a repeatable release checklist; refresh fixtures and rerun regression and exploratory checks whenever a release is prepared.",
  };
  const teamPlan: Record<TeamSize, string> = {
    solo: "As a solo developer, start with the two highest-value baseline layers and selected risks; keep the suite small enough to maintain yourself.",
    small: "For a 2–8 person team, assign a coverage owner per feature and share responsibility for investigating failures.",
    large: "For multiple teams, agree ownership at service boundaries, share contract checks, and give each team responsibility for its quality gates.",
  };
  const firstAction = details.stage === "established"
    ? "Map existing regression gaps and add characterisation checks around the highest-risk legacy workflows before refactoring."
    : details.stage === "growing"
      ? "Review recent production defects and cover the recurring failure paths before expanding the regression suite."
      : "Define acceptance examples for the first critical workflow and add fast checks alongside its implementation.";
  const projectLabel = details.name.trim() || "This project";
  return {
    headline: `${projectLabel} should use ${focus}`,
    approach: `For this ${details.stage} ${details.projectType} project, ${stageLabels[details.stage]}. ${riskSummary}`,
    basis: [
      `Project type: ${details.projectType}. This determines the baseline testing layers.`,
      `Lifecycle: ${details.stage}. ${stageLabels[details.stage]}.`,
      deliveryPlan[details.releaseCadence],
      teamPlan[details.teamSize],
      riskSummary,
    ],
    scopeNote: details.description.trim(),
    testMix,
    tests,
    strategies,
    nextSteps: [firstAction, teamPlan[details.teamSize], deliveryPlan[details.releaseCadence],
      details.risks.length
        ? `Define measurable pass/fail criteria for the selected risks (${details.risks.join(", ")}) and review results each release.`
        : "Identify the highest-impact product risks with stakeholders, then regenerate this plan with those risks selected.",
    ],
  };
}
