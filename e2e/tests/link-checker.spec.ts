import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { TestTypesPage } from "../pages/TestTypesPage";
import { TestStrategiesPage } from "../pages/TestStrategiesPage";
import { RoadmapPage } from "../pages/RoadmapPage";
import { AutomationDecisionPage } from "../pages/AutomationDecisionPage";
import { TestDataManagementPage } from "../pages/TestDataManagementPage";
import { checkLinksOnPage } from "../helpers/linkChecker";

// ─────────────────────────────────────────────────────────────────────────────
// Navigation tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Navigation buttons", () => {
  test("home page renders and all navigation cards are clickable", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();

    // ── Test Types ───────────────────────────────────────────────────────────
    await home.expectCardVisible(/Test Types/i);
    await home.navigateToTestTypes();
    const testTypes = new TestTypesPage(page);
    await testTypes.expectHeadingVisible();
    await testTypes.expectContentLoaded();
    await testTypes.clickBack();
    await home.expectCardVisible(/Test Types/i);

    // ── Test Strategies ──────────────────────────────────────────────────────
    await home.expectCardVisible(/Test Strategies/i);
    await home.navigateToTestStrategies();
    const strategies = new TestStrategiesPage(page);
    await strategies.expectHeadingVisible();
    await strategies.expectContentLoaded();
    await strategies.clickBack();
    await home.expectCardVisible(/Test Types/i);

    // ── Dev Testing Roadmap ──────────────────────────────────────────────────
    await home.expectCardVisible(/Dev Testing Roadmap/i);
    await home.navigateToDevRoadmap();
    const roadmap = new RoadmapPage(page);
    await roadmap.expectHeadingVisible();
    await roadmap.clickBack();
    await home.expectCardVisible(/Test Types/i);

    // ── Automation Decision ──────────────────────────────────────────────────
    await home.expectCardVisible(/Automation Decision/i);
    await home.navigateToAutomationDecision();
    const automationDecision = new AutomationDecisionPage(page);
    await automationDecision.expectHeadingVisible();
    await automationDecision.clickBack();
    await home.expectCardVisible(/Test Types/i);

    // ── Test Data Management ─────────────────────────────────────────────────
    await home.expectCardVisible(/Test Data Management/i);
    await home.navigateToTestDataManagement();
    const testDataMgmt = new TestDataManagementPage(page);
    await testDataMgmt.expectHeadingVisible();
    await testDataMgmt.clickBack();
    await home.expectCardVisible(/Test Types/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Link checker tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Link checker – no 404s", () => {
  test("all external links on Test Types page are reachable", async ({
    page,
    request,
  }) => {
    const home = new HomePage(page);
    await home.goto();
    await checkLinksOnPage(
      page,
      request,
      () => home.navigateToTestTypes(),
      "Test Types page",
    );
  });

  test("all external links on Test Strategies page are reachable", async ({
    page,
    request,
  }) => {
    const home = new HomePage(page);
    await home.goto();
    await checkLinksOnPage(
      page,
      request,
      () => home.navigateToTestStrategies(),
      "Test Strategies page",
    );
  });
});

