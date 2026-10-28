import { Page, expect } from "@playwright/test";

/** Base class providing the back-navigation action shared by all sub-pages. */
export abstract class SubPage {
  constructor(protected page: Page) {}

  async clickBack() {
    await this.page.getByRole("button", { name: /← Back/i }).click();
  }

  async expectBackButtonVisible() {
    await expect(
      this.page.getByRole("button", { name: /← Back/i }),
    ).toBeVisible();
  }

  protected async expectHeading(name: RegExp, timeout = 15_000) {
    await expect(
      this.page.getByRole("heading", { name }),
    ).toBeVisible({ timeout });
  }
}
