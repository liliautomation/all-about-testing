import { expect, Page } from "@playwright/test";

export class StrategyAdvisorPage {
  constructor(private page: Page) {}

  async chooseProfile(projectType = "web", stage = "new", releaseCadence = "weekly", teamSize = "small") {
    await this.page.getByRole("combobox", { name: "Project type", exact: true }).selectOption(projectType);
    await this.page.getByRole("combobox", { name: "Lifecycle stage", exact: true }).selectOption(stage);
    await this.page.getByRole("combobox", { name: "Release cadence", exact: true }).selectOption(releaseCadence);
    await this.page.getByRole("combobox", { name: "Delivery team", exact: true }).selectOption(teamSize);
  }

  async build() {
    await this.page.getByRole("button", { name: /Build my test strategy/i }).click();
  }

  async expectEmptyProfile() {
    for (const label of ["Project type", "Lifecycle stage", "Release cadence", "Delivery team"]) {
      await expect(this.page.getByRole("combobox", { name: label, exact: true })).toHaveValue("");
    }
  }

  async expectResult(visible: boolean) {
    const result = this.page.getByRole("heading", { name: /should use/ });
    if (visible) await expect(result).toBeVisible();
    else await expect(result).toHaveCount(0);
  }
}
