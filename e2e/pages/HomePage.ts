import { Page, expect } from "@playwright/test";

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  async expectCardVisible(name: RegExp) {
    await expect(this.page.getByRole("button", { name })).toBeVisible();
  }

  async clickCard(name: RegExp) {
    await this.page.getByRole("button", { name }).click();
  }

  async clickBack() {
    await this.page.getByRole("button", { name: /← Back/i }).click();
  }

  // ── Individual card navigators (convenience wrappers) ─────────────────────

  async navigateToTestTypes() {
    await this.clickCard(/Test Types/i);
  }

  async navigateToTestStrategies() {
    await this.clickCard(/Test Strategies/i);
  }

  async navigateToDevRoadmap() {
    await this.clickCard(/Dev Testing Roadmap/i);
  }

  async navigateToAutomationDecision() {
    await this.clickCard(/Automation Decision/i);
  }

  async navigateToTestDataManagement() {
    await this.clickCard(/Test Data Management/i);
  }
}
