import type { Page } from "playwright";

export class OrangeHrmPage {
  private readonly modules = {
    Admin: "/web/index.php/admin/viewSystemUsers",
    PIM: "/web/index.php/pim/viewEmployeeList",
    Leave: "/web/index.php/leave/viewLeaveList",
    Time: "/web/index.php/time/viewEmployeeTimesheet",
    Recruitment: "/web/index.php/recruitment/viewCandidates",
    "My Info": "/web/index.php/pim/viewPersonalDetails",
    Performance: "/web/index.php/performance/searchEvaluatePerformanceReview",
    Dashboard: "/web/index.php/dashboard/index",
    Directory: "/web/index.php/directory/viewDirectory",
    Maintenance: "/web/index.php/maintenance/purgeEmployee",
    Claim: "/web/index.php/claim/viewAssignClaim",
    Buzz: "/web/index.php/buzz/viewBuzz",
  } as const;

  private readonly page: Page;
  private readonly baseUrl: string;

  constructor(page: Page, baseUrl: string) {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  async login(): Promise<void> {
    const username = process.env.LOGIN_USERNAME;
    const password = process.env.LOGIN_PASSWORD;
    if (!username || !password) {
      throw new Error("LOGIN_USERNAME and LOGIN_PASSWORD must be set in .env");
    }

    await this.page.goto(
      new URL(
        process.env.LOGIN_PATH || "/web/index.php/auth/login",
        this.baseUrl,
      ).toString(),
      {
        waitUntil: "domcontentloaded",
      },
    );
    await this.page.locator('input[name="username"]').fill(username);
    await this.page.locator('input[name="password"]').fill(password);
    await this.page.locator('button[type="submit"]').click();
    await this.page.getByRole("heading", { name: "Dashboard" }).waitFor();
  }

  async openModule(moduleName: string): Promise<void> {
    if (!(moduleName in this.modules)) {
      throw new Error(`Unknown OrangeHRM module: ${moduleName}`);
    }
    const link = this.page.getByRole("link", { name: moduleName, exact: true });
    const href = await link.getAttribute("href");
    await this.page.goto(
      new URL(
        href || this.modules[moduleName as keyof typeof this.modules],
        this.baseUrl,
      ).toString(),
      { waitUntil: "domcontentloaded" },
    );
  }

  async hasHeading(name: string): Promise<boolean> {
    return this.page.getByRole("heading", { name, exact: true }).isVisible();
  }

  async searchEmployee(employeeName: string): Promise<void> {
    await this.page.getByRole("link", { name: "PIM", exact: true }).click();
    await this.page
      .getByRole("heading", { name: "PIM", exact: true })
      .waitFor();
    const employeeNameInput = this.page
      .locator("input[placeholder='Type for hints...']:visible")
      .first();
    await employeeNameInput.fill(employeeName);
    await this.page.getByRole("button", { name: "Search" }).click();
  }

  async hasEmployee(employeeName: string): Promise<boolean> {
    return this.page
      .locator(".oxd-table-body .oxd-table-row")
      .first()
      .isVisible();
  }

  async dashboardWidgets(): Promise<string[]> {
    return [
      "Time at Work",
      "My Actions",
      "Quick Launch",
      "Buzz Latest Posts",
      "Employees on Leave Today",
      "Employee Distribution by Sub Unit",
      "Employee Distribution by Location",
    ];
  }

  async hasDashboardWidget(widgetName: string): Promise<boolean> {
    return this.page.getByText(widgetName, { exact: true }).first().isVisible();
  }

  async hasQuickLaunchAction(actionName: string): Promise<boolean> {
    return this.page
      .locator(".orangehrm-quick-launch-card")
      .filter({ hasText: actionName })
      .isVisible();
  }

  async hasSearchControl(): Promise<boolean> {
    return this.page.getByRole("textbox", { name: "Search" }).isVisible();
  }

  isModulePage(moduleName: string): boolean {
    if (!(moduleName in this.modules)) {
      return false;
    }
    const expectedPath = this.modules[moduleName as keyof typeof this.modules];
    const actualPath = new URL(this.page.url()).pathname;
    return (
      actualPath.endsWith(expectedPath) ||
      actualPath.startsWith(expectedPath + "/")
    );
  }
}
