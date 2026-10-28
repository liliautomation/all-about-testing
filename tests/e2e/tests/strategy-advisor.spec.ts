import { test, expect } from "@playwright/test";
import { createRecommendation, type ProjectDetails } from "../../../apps/frontend/src/data/recommendations";
import { HomePage } from "../pages/HomePage";
import { StrategyAdvisorPage } from "../pages/StrategyAdvisorPage";

const baseline: ProjectDetails = {
  name: "Example", description: "", projectType: "web", stage: "new",
  releaseCadence: "weekly", teamSize: "small", risks: [],
};

test("advisor requires explicit choices and clears an outdated result", async ({ page }) => {
  const home = new HomePage(page);
  const advisor = new StrategyAdvisorPage(page);
  await home.goto();
  await home.navigateToStrategyAdvisor();
  await advisor.expectEmptyProfile();
  await advisor.build();
  await advisor.expectResult(false);
  await advisor.chooseProfile();
  await advisor.build();
  await advisor.expectResult(true);
  await advisor.chooseProfile("data", "established", "monthly", "large");
  await advisor.expectResult(false);
  await advisor.build();
  await expect(page.getByRole("heading", { name: /data-validation and integration-first strategy/ })).toBeVisible();
});

test("project type, lifecycle, cadence and team change the plan", () => {
  const base = createRecommendation(baseline);
  const api = createRecommendation({ ...baseline, projectType: "api" });
  const data = createRecommendation({ ...baseline, projectType: "data" });
  expect(api.headline).toContain("API-first");
  expect(data.headline).toContain("data-validation");
  expect(api.tests.some(({ topic }) => topic.name === "Component Testing")).toBe(false);
  expect(data.testMix).not.toEqual(api.testMix);
  const legacy = createRecommendation({ ...baseline, stage: "established" });
  expect(legacy.headline).toContain("regression-first");
  expect(legacy.nextSteps[0]).toContain("characterisation");
  expect(legacy.testMix).not.toEqual(base.testMix);
  for (const releaseCadence of ["daily", "weekly", "monthly", "occasional"] as const) {
    expect(createRecommendation({ ...baseline, releaseCadence }).nextSteps[2]).toBeTruthy();
  }
  expect(new Set(["daily", "weekly", "monthly", "occasional"].map((releaseCadence) =>
    createRecommendation({ ...baseline, releaseCadence: releaseCadence as ProjectDetails["releaseCadence"] }).nextSteps[2],
  )).size).toBe(4);
  expect(createRecommendation({ ...baseline, teamSize: "solo" }).tests.filter((test) => test.priority === "Essential")).toHaveLength(2);
  expect(createRecommendation({ ...baseline, teamSize: "large" }).nextSteps[1]).toContain("service boundaries");
});

test("selected risks lead the plan and remain essential for solo developers", () => {
  for (const risk of ["security", "performance", "accessibility", "integrations", "data"] as const) {
    const result = createRecommendation({ ...baseline, teamSize: "solo", risks: [risk] });
    expect(result.tests[0].priority).toBe("Essential");
    expect(result.tests[0].reason).toContain("You selected");
    expect(result.basis.at(-1)).not.toContain("No additional risk");
  }
  for (const projectType of ["web", "api", "mobile", "data", "desktop"] as const) {
    const result = createRecommendation({ ...baseline, projectType, stage: "established", risks: ["integrations", "data"] });
    expect(result.testMix.reduce((sum, layer) => sum + layer.percentage, 0)).toBe(100);
    expect(result.testMix.every((layer) => layer.percentage > 0)).toBe(true);
    expect(new Set(result.tests.map(({ topic }) => topic.name)).size).toBe(result.tests.length);
  }
  expect(() => createRecommendation({ ...baseline, projectType: "" as ProjectDetails["projectType"] })).toThrow("Choose a valid");
});
