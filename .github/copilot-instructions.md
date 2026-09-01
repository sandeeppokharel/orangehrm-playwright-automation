# Copilot instructions for this OrangeHRM Playwright project

## Project purpose

This repository contains a Cucumber + Playwright test suite for OrangeHRM demo flows. The goal is to keep tests readable, stable, and aligned with real browser behavior.

## Core rules

- Prefer Playwright role-based selectors and stable locators over fragile CSS selectors.
- Prefer page object methods for UI interactions and assertions.
- Keep scenarios in Cucumber feature files business-readable.
- Prefer real browser behavior over mocked assumptions.
- When working with OrangeHRM, match real routes and app behavior rather than assumptions from older versions.
- Keep the local MCP result-hook flow separate from the browser exploration flow.

## Architecture

- `features/` contains Cucumber feature files and step definitions.
- `src/pages/` contains page object models.
- `src/api/` contains API helper code.
- `scripts/` contains local MCP result-hook tooling.
- `reports/` stores generated Cucumber HTML report output.

## OrangeHRM-specific guidance

- Login is performed against `https://opensource-demo.orangehrmlive.com`.
- Use the hidden `_token` field when validating login via API against the real app.
- Prefer checking the URL and visible heading after module navigation, not brittle exact match assumptions.
- For dashboard widgets, use tolerant locator matching over exact text-only assumptions when the UI changes slightly.
- When validating a module page, accept route suffixes like `/empNumber/7` for personal details pages.

## MCP / autonomous testing guidance

- The local MCP result-hook exists in `scripts/test-with-agent.mjs` and `scripts/mcp-agent-server.mjs`.
- Keep that agent flow separate from browser exploration.
- If using Playwright MCP to explore OrangeHRM, discover selectors first and then convert findings into page objects.
- The agent should prefer direct user-visible text and accessible roles before CSS selectors.
- Generated tests should be robust to the real OrangeHRM layout and dynamic widget rendering.

## Commands

- `npm test` - full suite
- `npm run test:ui` - OrangeHRM UI suite
- `npm run test:api` - API suite
- `npm run typecheck` - TypeScript validation
- `MCP_PORT=3001 npm run mcp:agent` - start the local MCP listener
- `MCP_AGENT_URL=http://127.0.0.1:3001/agent/analyze npm run test:agent` - run suite with agent notification

## Quality bar

- Do not write flaky tests.
- Prefer explicit waits for real navigation/visibility.
- Keep debugging output useful and concise.
- If the app behavior changes, update selectors and assertions in the page object layer first.
