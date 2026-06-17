import { Page, expect } from "@playwright/test";
import { SubPage } from "./SubPage";

export class TestStrategiesPage extends SubPage {
  constructor(page: Page) {
    super(page);
  }

  async expectHeadingVisible() {
    await this.expectHeading(/🗺️ Test Strategies/i);
  }

  async expectContentLoaded() {
    await expect(
      this.page.getByRole("heading", {
        name: /Test-Driven Development \(TDD\)/i,
      }),
    ).toBeVisible({ timeout: 15_000 });
  }
}
