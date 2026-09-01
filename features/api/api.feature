@api
Feature: OrangeHRM API

  Scenario: Login page is available
    When I request the API login page
    Then the API response status should be 200

  Scenario: API login creates an authenticated session
    When I authenticate through the OrangeHRM API
    Then the API response status should be 200
    And the API login should redirect to the dashboard
    When I request the authenticated dashboard API
    Then the API response status should be 200

  Scenario Outline: Authenticated dashboard endpoints respond successfully
    Given I have an authenticated API session
    When I request the dashboard API endpoint "<endpoint>"
    Then the API response should be successful

    Examples:
      | endpoint           |
      | core/i18n/messages |
      | api/v2/dashboard/shortcuts |
      | api/v2/dashboard/employees/action-summary |