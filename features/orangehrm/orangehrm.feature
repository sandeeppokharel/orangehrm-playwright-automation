@orangehrm
Feature: OrangeHRM core modules

  Background:
    Given I am logged in to OrangeHRM

  @smoke
  Scenario: Dashboard is displayed after login
    Then I should see the "Dashboard" heading

  Scenario Outline: User can open every OrangeHRM feature
    When I open the "<module>" module
    Then the "<module>" feature page should be displayed

    Examples:
      | module       |
      | Admin        |
      | PIM          |
      | Leave        |
      | Time         |
      | Recruitment  |
      | My Info      |
      | Performance  |
      | Dashboard    |
      | Directory    |
      | Maintenance  |
      | Claim        |
      | Buzz         |

  Scenario: Sidebar search is available
    Then the sidebar search control should be displayed

  Scenario Outline: Dashboard widget is displayed
    Then the dashboard should show the "<widget>" widget

    Examples:
      | widget                              |
      | Time at Work                        |
      | My Actions                          |
      | Quick Launch                        |
      | Buzz Latest Posts                   |
      | Employees on Leave Today            |
      | Employee Distribution by Sub Unit   |
      | Employee Distribution by Location   |

  Scenario Outline: Dashboard quick launch action is available
    Then the dashboard should show the "<action>" quick launch action

    Examples:
      | action       |
      | Assign Leave |
      | Leave List   |
      | Timesheets   |
      | Apply Leave  |
      | My Leave     |
      | My Timesheet |

  Scenario: User can search employees in PIM
    When I search for employee "Linda Anderson"
    Then the employee search results should be displayed