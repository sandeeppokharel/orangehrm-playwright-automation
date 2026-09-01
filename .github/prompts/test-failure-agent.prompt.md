# OrangeHRM test failure analysis prompt

Analyze the latest OrangeHRM test run and propose the minimal, root-cause fix.

## Goal

Review the failing Cucumber or Playwright output, identify the underlying issue, and suggest the smallest change that makes the suite pass without introducing flakiness.

## Constraints

- Prefer root cause analysis over guesswork.
- Match real OrangeHRM route and widget behavior instead of assumptions from older versions.
- Prefer stable Playwright locators and page object adjustments before changing scenarios.
- Keep fixes aligned with this repo structure: `features/`, `src/pages/`, and `src/api/`.

## Inputs to inspect

- latest failing scenario output
- current page object methods
- current step definitions
- the live OrangeHRM app behavior if needed

## Tasks

1. Read the failing assertion and identify the actual mismatch.
2. Determine whether the issue is caused by:
   - stale route expectation
   - stale widget text
   - missing route suffix / dynamic URL behavior
   - locator mismatch
   - session / token/auth issue
3. Suggest the minimal code change in the correct layer.
4. Explain why the fix is robust and not flaky.
5. Provide a specific recommendation for:
   - page object change
   - step definition change
   - or app behavior expectation update

## Output format

Return:

- root cause
- evidence from the failure
- recommended fix
- exact file(s) to edit
- why this fix matches the real OrangeHRM behavior today
- a short validation command to run afterwards
