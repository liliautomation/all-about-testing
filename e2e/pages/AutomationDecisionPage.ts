import { Page } from "@playwright/test";
import { SubPage } from "./SubPage";

export class AutomationDecisionPage extends SubPage {
  constructor(page: Page) {
    super(page);
  }

  async expectHeadingVisible() {
    await this.expectHeading(/🤖 Automation Decision/i);
  }
}
