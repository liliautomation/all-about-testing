import { Page, expect } from "@playwright/test";
import { SubPage } from "./SubPage";

export class TestTypesPage extends SubPage {
  constructor(page: Page) {
    super(page);
  }

  async expectHeadingVisible() {
    await this.expectHeading(/🧩 Test Types/i);
  }

  async expectContentLoaded() {
    await expect(this.page.getByText("Unit Testing")).toBeVisible({
      timeout: 15_000,
    });
  }
}
