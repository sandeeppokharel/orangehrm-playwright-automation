import { Given, Then, When } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import type { CustomWorld } from "../support/world.js";

Given("I am logged in to OrangeHRM", async function (this: CustomWorld) {
  await this.orangehrm.login();
});

When(
  "I open the {string} module",
  async function (this: CustomWorld, moduleName: string) {
    await this.orangehrm.openModule(moduleName);
  },
);

Then(
  "the {string} feature page should be displayed",
  async function (this: CustomWorld, moduleName: string) {
    assert.equal(this.orangehrm.isModulePage(moduleName), true);
  },
);

Then(
  "the sidebar search control should be displayed",
  async function (this: CustomWorld) {
    assert.equal(await this.orangehrm.hasSearchControl(), true);
  },
);

Then(
  "I should see the {string} heading",
  async function (this: CustomWorld, heading: string) {
    assert.equal(await this.orangehrm.hasHeading(heading), true);
  },
);

Then(
  "the dashboard should show the {string} widget",
  async function (this: CustomWorld, widgetName: string) {
    assert.equal(await this.orangehrm.hasDashboardWidget(widgetName), true);
  },
);

Then(
  "the dashboard should show the {string} quick launch action",
  async function (this: CustomWorld, actionName: string) {
    assert.equal(await this.orangehrm.hasQuickLaunchAction(actionName), true);
  },
);

When(
  "I search for employee {string}",
  async function (this: CustomWorld, employeeName: string) {
    await this.orangehrm.searchEmployee(employeeName);
  },
);

Then(
  "the employee search results should be displayed",
  async function (this: CustomWorld) {
    assert.equal(await this.orangehrm.hasEmployee(""), true);
  },
);
