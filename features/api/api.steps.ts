import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { APIResponse } from "playwright";
import { ApiClient } from "../../src/api/api-client.ts";
import type { CustomWorld } from "../support/world.js";

let response: APIResponse;
let client: ApiClient;

function configuredClient(world: CustomWorld): ApiClient {
  return new ApiClient(process.env.API_BASE_URL || world.baseUrl, world.page);
}

When("I request the API login page", async function (this: CustomWorld) {
  client = configuredClient(this);
  response = await client.get("/auth/login");
});

When(
  "I authenticate through the OrangeHRM API",
  async function (this: CustomWorld) {
    const username = process.env.LOGIN_USERNAME;
    const password = process.env.LOGIN_PASSWORD;
    if (!username || !password) {
      throw new Error("LOGIN_USERNAME and LOGIN_PASSWORD must be set in .env");
    }

    client = configuredClient(this);
    response = await client.login(username, password);
  },
);

When("I request the authenticated dashboard API", async function () {
  response = await client.get("/dashboard/index");
});

Given(
  "I have an authenticated API session",
  async function (this: CustomWorld) {
    const username = process.env.LOGIN_USERNAME;
    const password = process.env.LOGIN_PASSWORD;
    if (!username || !password) {
      throw new Error("LOGIN_USERNAME and LOGIN_PASSWORD must be set in .env");
    }

    client = configuredClient(this);
    response = await client.login(username, password);

    expect(response.status()).toBe(200);
    expect(response.url()).toMatch(/\/dashboard\/index$/);
  },
);

When(
  "I request the dashboard API endpoint {string}",
  async function (endpoint: string) {
    response = await client.get(`/${endpoint}`);
  },
);

Then(
  "the API response status should be {int}",
  function (expectedStatus: number) {
    expect(response.status()).toBe(expectedStatus);
  },
);

Then("the API login should redirect to the dashboard", function () {
  expect(response.url()).toMatch(/\/dashboard\/index$/);
});

Then("the API response should be successful", function () {
  expect(response.status()).toBeGreaterThanOrEqual(200);
  expect(response.status()).toBeLessThan(400);
});
