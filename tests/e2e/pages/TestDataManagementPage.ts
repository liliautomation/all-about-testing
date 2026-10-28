import { Page } from "@playwright/test";
import { SubPage } from "./SubPage";

export class TestDataManagementPage extends SubPage {
  constructor(page: Page) {
    super(page);
  }

  async expectHeadingVisible() {
    await this.expectHeading(/🗄️ Test Data Management/i);
  }
}
