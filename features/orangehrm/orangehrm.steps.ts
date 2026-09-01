import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
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
    expect(this.orangehrm.isModulePage(moduleName)).toBeTruthy();
  },
);

Then(
  "the sidebar search control should be displayed",
  async function (this: CustomWorld) {
    await expect(this.orangehrm.searchControl()).toBeVisible();
  },
);

Then(
  "I should see the {string} heading",
  async function (this: CustomWorld, heading: string) {
    await expect(this.orangehrm.heading(heading)).toBeVisible();
  },
);

Then(
  "the dashboard should show the {string} widget",
  async function (this: CustomWorld, widgetName: string) {
    const locator = this.orangehrm.dashboardWidget(widgetName);
    await expect(locator).toBeVisible({ timeout: 15_000 });
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
    await expect
      .poll(() => this.orangehrm.employeeRows().count(), {
        timeout: 15_000,
      })
      .toBeGreaterThan(1);
  },
);
