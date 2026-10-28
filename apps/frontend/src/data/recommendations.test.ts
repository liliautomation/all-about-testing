import { describe, expect, it } from "vitest";
import {
  createRecommendation,
  type ProjectDetails,
} from "./recommendations";

const baseDetails: ProjectDetails = {
  name: "Customer portal",
  description: "A self-service account portal",
  projectType: "web",
  stage: "new",
  releaseCadence: "weekly",
  teamSize: "small",
  risks: [],
};

const testNames = (details: ProjectDetails) =>
  createRecommendation(details).tests.map(({ topic }) => topic.name);

const strategyNames = (details: ProjectDetails) =>
  createRecommendation(details).strategies.map(({ strategy }) => strategy.name);

describe("createRecommendation", () => {
  it("creates a web test pyramid with critical browser coverage", () => {
    const recommendation = createRecommendation(baseDetails);

    expect(recommendation.headline).toBe(
      "Customer portal should use a risk-led test pyramid",
    );
    expect(testNames(baseDetails)).toEqual([
      "Unit Testing",
      "Component Testing",
      "Integration Testing",
      "API Testing",
      "End-to-End (E2E) Testing",
    ]);
    expect(recommendation.testMix.map(({ percentage }) => percentage)).toEqual([
      60, 30, 10,
    ]);
  });

  it("adds risk-specific coverage without duplicating existing tests", () => {
    const details: ProjectDetails = {
      ...baseDetails,
      risks: ["security", "integrations", "performance"],
    };
    const names = testNames(details);

    expect(names).toContain("Security Testing");
    expect(names).toContain("Contract Testing");
    expect(names).toContain("Performance Testing");
    expect(names.filter((name) => name === "Integration Testing")).toHaveLength(1);
  });

  it("recommends shift-left and TDD for a new project", () => {
    expect(strategyNames(baseDetails)).toEqual(
      expect.arrayContaining([
        "Test Pyramid",
        "Risk-Based Testing",
        "Shift-Left Testing",
        "Test-Driven Development (TDD)",
      ]),
    );
  });

  it("recommends exploratory testing for an established project", () => {
    const details: ProjectDetails = {
      ...baseDetails,
      stage: "established",
      releaseCadence: "monthly",
    };
    const names = strategyNames(details);

    expect(names).toContain("Exploratory Testing");
    expect(names).not.toContain("Test-Driven Development (TDD)");
    expect(names).not.toContain("Continuous Testing");
  });

  it.each(["daily", "weekly"] as const)(
    "recommends continuous testing for %s releases",
    (releaseCadence) => {
      expect(
        strategyNames({ ...baseDetails, releaseCadence }),
      ).toContain("Continuous Testing");
    },
  );

  it("limits baseline essential coverage for a solo developer", () => {
    const recommendation = createRecommendation({
      ...baseDetails,
      teamSize: "solo",
    });

    expect(
      recommendation.tests.filter(({ priority }) => priority === "Essential"),
    ).toHaveLength(2);
    expect(recommendation.tests[2].priority).toBe("Recommended");
  });

  it("uses a generic label when no project name is supplied", () => {
    const recommendation = createRecommendation({
      ...baseDetails,
      name: "   ",
    });

    expect(recommendation.headline).toBe(
      "This project should use a risk-led test pyramid",
    );
  });

  it("uses an API-focused mix and coverage for a service", () => {
    const details: ProjectDetails = {
      ...baseDetails,
      projectType: "api",
    };
    const recommendation = createRecommendation(details);

    expect(testNames(details)).toEqual([
      "Unit Testing",
      "API Testing",
      "Integration Testing",
      "Contract Testing",
      "Performance Testing",
    ]);
    expect(recommendation.testMix.map(({ percentage }) => percentage)).toEqual([
      50, 45, 5,
    ]);
  });
});
