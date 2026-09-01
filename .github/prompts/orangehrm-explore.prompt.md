# OrangeHRM Playwright MCP exploration prompt

Explore the OrangeHRM demo app in this repo and help me make the Playwright tests more robust.

## Goal

- inspect the real OrangeHRM UI
- find stable selectors and route patterns
- suggest page object improvements
- keep the results aligned with this repo structure

## Use the app at:

https://opensource-demo.orangehrmlive.com

## Follow these steps:

1. Open the login page and inspect the username, password, and submit button selectors.
2. Log in with Admin / admin123 and confirm the dashboard URL and heading.
3. Inspect the dashboard widgets and identify stable visible text or headings to assert against.
4. Navigate to PIM and inspect the employee search flow.
5. Find the exact selectors for the search input, search button, and results rows.
6. Inspect My Info and identify the robust URL pattern for personal details pages.
7. Summarize findings in a format directly usable in:
   - src/pages/orangehrm.page.ts
   - features/orangehrm/orangehrm.steps.ts
   - features/orangehrm/orangehrm.feature

## Rules

- Prefer role-based and text-based selectors over CSS.
- Prefer real user-visible behavior, not stale assumptions.
- Use actual route suffixes like /empNumber/7 when relevant.
- Do not assume old OrangeHRM paths; match what the app currently renders.
- Output concise, actionable recommendations with exact locator examples.
- If there are flaky assumptions, call them out and suggest a better pattern.

## Constraints

- Work against `https://opensource-demo.orangehrmlive.com`.
- Use real browser behavior; do not assume stale routes.
- Prefer role-based selectors and accessible text.
- Capture exact selectors that are resilient to UI drift.
- Keep the output concise and actionable for the repo structure.

## Tasks

1. Open the login page and inspect the login form.
2. Find selectors for username, password, submit button, and any hidden auth token.
3. Log in with `Admin` / `admin123` and confirm the dashboard URL and heading.
4. Inspect dashboard widgets and list stable visible text to assert on.
5. Navigate to the PIM section, search for `Linda Anderson`, and identify the result table selectors.
6. Inspect the My Info route and identify a robust URL pattern for personal details.
7. Summarize the findings in a format ready for:
   - `src/pages/orangehrm.page.ts`
   - `features/orangehrm/orangehrm.steps.ts`
   - `features/orangehrm/orangehrm.feature`

## Output format

Return:

- discovered selectors
- exact page URLs / route patterns
- stable assertion targets
- recommended Playwright locator examples
- suggested page object method names
- possible flaky assumptions to avoid

## Final requirement

Do not just describe the UI; produce actionable test design advice that fits this repository structure.
