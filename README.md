# orangehrm-playwright-automation

OrangeHRM UI and API automation framework using TypeScript, Playwright, Cucumber
BDD, and Fetch API. Covers login, dashboard widgets, module navigation, employee
search, authenticated sessions, and dashboard API checks.

## Overview

TypeScript automation for the OrangeHRM demo application using Cucumber BDD,
Playwright, and the Fetch API.

## Prerequisites

- Node.js 20 or newer
- npm

## Setup

```sh
npm install
npx playwright install chromium
cp .env.example .env
```

The checked-in example is configured for
`https://opensource-demo.orangehrmlive.com`. Copy it to `.env`; change the
credentials when using another environment.

## Run tests

```sh
npm test
npm run test:smoke
npm run test:ui
npm run test:api
npm run test:headed
npm run typecheck
```

`test:smoke` covers the OrangeHRM dashboard. `test:ui` covers dashboard, login,
PIM employee search, Leave, and Admin navigation. `test:api` checks protected API
behavior and API login.

Login tests use `LOGIN_USERNAME`, `LOGIN_PASSWORD`, and `LOGIN_PATH` from `.env`.
The OrangeHRM demo defaults are `Admin` and `admin123`.

The HTML report is generated at `reports/cucumber-report.html`.

## CI

This repository includes a GitHub Actions workflow for automated validation on every push and pull request.

Workflow file:

- `.github/workflows/playwright-ci.yml`

The workflow installs dependencies, sets up Playwright Chromium, runs the TypeScript check, and executes the OrangeHRM UI suite with:

```sh
npm run typecheck
npm run test:ui
```

This gives the project a real CI signal for browser automation quality before merge.

## MCP agent hook for local OrangeHRM runs

This project also supports a local MCP-style agent notification flow that runs
alongside the normal test execution. The idea is to keep the UI test runner
separate from the result observer so the test command can notify an agent when it
finishes.

From the project root, start the local listener in one terminal:

```sh
MCP_PORT=3001 npm run mcp:agent
```

From the same project root, run the OrangeHRM suite through the wrapper in another terminal:

```sh
MCP_AGENT_URL=http://127.0.0.1:3001/agent/analyze npm run test:agent
```

This sends a POST payload to `/agent/analyze` with the test exit code, logs, and
report metadata. The mock agent logs the status and a summary of the run. This is
useful for local debugging, CI integration, or later wiring to a real
MCP-compatible endpoint.

The local endpoint is intentionally simple and can be replaced with a real agent
or monitoring service without changing the test wrapper command itself.

## Playwright MCP exploration workflow for OrangeHRM

The project also supports the browser-exploration pattern described in the
Playwright MCP workflow: use an AI/browser agent to navigate OrangeHRM, discover
stable selectors, and then convert those findings into better POM methods and
step definitions.

This is a separate concern from the local result-hook server. The MCP exploration
layer is used to discover the app, while the wrapper layer is used to notify a
listener after the test run finishes.

### Recommended workflow

1. From the project root, keep the local MCP listener running in one terminal:

```sh
MCP_PORT=3001 npm run mcp:agent
```

2. In a second terminal from the same project root, run the test wrapper as normal:

```sh
MCP_AGENT_URL=http://127.0.0.1:3001/agent/analyze npm run test:agent
```

3. Separately, use a Playwright MCP/browser agent against the same OrangeHRM app
   to explore and validate selectors.

Example prompts for the agent:

```text
Open https://opensource-demo.orangehrmlive.com/web/index.php/auth/login.
Find the login form and tell me the exact selectors for username, password,
and submit.
```

```text
Log in using Admin / admin123, go to the dashboard, and list the stable widget
texts and headings that can be used as assertions.
```

```text
Open the PIM section, search for Linda Anderson, and tell me the selectors for
search input, search button, and results rows.
```

```text
Inspect the My Info route and tell me the exact URL pattern for the personal
details page so the page object can be made robust.
```

### What to do with the output

Use the browser agent output to refine the page object in `src/pages` and the
step definitions in `features/orangehrm`.

Good candidates for improvement include:

- login selectors
- module URL patterns
- dashboard widget text
- PIM table row selectors
- robust assertions for dynamic pages

This keeps the repo aligned with the article’s idea: let an AI/browser tool explore
OrangeHRM first, then convert that understanding into stable, maintainable
Playwright tests.

## Repo prompt files for autonomous testing

This repository includes three prompt files for different agent workflows:

- `.github/copilot-instructions.md` — general repo rules and OrangeHRM-specific
  guidance
- `.github/prompts/orangehrm-explore.prompt.md` — browser exploration prompt for
  discovering selectors and flows
- `.github/prompts/test-failure-agent.prompt.md` — failure-analysis prompt for
  diagnosing and fixing failing tests

Use them as the reusable agent instructions for different phases of the OrangeHRM
workflow:

1. instruct the agent about the repo and project rules
2. use the exploration prompt to discover selectors and routes
3. use the failure-analysis prompt after a failing run to find the root cause

## Structure

- `features/<area>/*.feature`: business-readable scenarios grouped by area
- `features/<area>/*.steps.ts`: step implementations grouped with their feature
- `features/support`: Cucumber world and lifecycle hooks
- `src/pages`: Page Object Model classes for browser pages
- `src/api`: API client utilities
- `cucumber.config.js`: test discovery and reporting configuration
