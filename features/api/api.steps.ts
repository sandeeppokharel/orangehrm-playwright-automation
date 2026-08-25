import { Given, Then, When } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import { ApiClient } from "../../src/api/api-client.ts";
import type { CustomWorld } from "../support/world.js";

let response: Response;
let client: ApiClient;

function configuredClient(world: CustomWorld): ApiClient {
  return new ApiClient(process.env.API_BASE_URL || world.baseUrl);
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
    assert.equal(response.status, 302);
    assert.match(
      response.headers.get("location") || "",
      /\/dashboard\/index$/,
      "OrangeHRM rejected the configured credentials; check LOGIN_USERNAME and LOGIN_PASSWORD in .env",
    );
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
    assert.equal(response.status, expectedStatus);
  },
);

Then("the API login should redirect to the dashboard", function () {
  const location = response.headers.get("location") || "";
  assert.match(location, /\/dashboard\/index$/);
});

Then("the API response should be successful", function () {
  assert.ok(
    response.status >= 200 && response.status < 400,
    `Expected a successful response, got ${response.status}`,
  );
});
