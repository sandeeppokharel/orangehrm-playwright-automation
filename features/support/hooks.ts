import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { chromium } from "playwright";
import type { CustomWorld } from "./world.js";
import { OrangeHrmPage } from "../../src/pages/orangehrm.page.ts";

let browser: Awaited<ReturnType<typeof chromium.launch>>;

setDefaultTimeout(30_000);

BeforeAll(async function () {
  browser = await chromium.launch({
    headless: process.env.HEADLESS !== "false",
  });
});

Before(async function (this: CustomWorld) {
  this.browser = browser;
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  this.orangehrm = new OrangeHrmPage(this.page, this.baseUrl);
});

After(async function (this: CustomWorld) {
  await this.context?.close();
});

AfterAll(async function () {
  await browser?.close();
});
