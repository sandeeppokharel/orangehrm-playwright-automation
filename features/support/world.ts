import { setWorldConstructor, World } from "@cucumber/cucumber";
import type { Browser, BrowserContext, Page } from "playwright";
import type { OrangeHrmPage } from "../../src/pages/orangehrm.page.js";

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  orangehrm!: OrangeHrmPage;
  baseUrl = this.parameters.baseUrl as string;
}

setWorldConstructor(CustomWorld);
