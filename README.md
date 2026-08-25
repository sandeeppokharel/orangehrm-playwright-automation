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

## Structure

- `features/<area>/*.feature`: business-readable scenarios grouped by area
- `features/<area>/*.steps.ts`: step implementations grouped with their feature
- `features/support`: Cucumber world and lifecycle hooks
- `src/pages`: Page Object Model classes for browser pages
- `src/api`: API client utilities
- `cucumber.config.js`: test discovery and reporting configuration
