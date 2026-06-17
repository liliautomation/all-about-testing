import { Page } from "@playwright/test";
import { SubPage } from "./SubPage";

export class RoadmapPage extends SubPage {
  constructor(page: Page) {
    super(page);
  }

  async expectHeadingVisible() {
    await this.expectHeading(/🛣️ Dev Testing Roadmap/i);
  }
}
