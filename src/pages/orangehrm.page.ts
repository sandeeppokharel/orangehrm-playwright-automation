import { expect, type Locator, type Page } from "@playwright/test";

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

  modulePath(moduleName: string): string {
    if (!(moduleName in this.modules)) {
      throw new Error(`Unknown OrangeHRM module: ${moduleName}`);
    }

    return this.modules[moduleName as keyof typeof this.modules];
  }

  heading(name: string): Locator {
    return this.page.getByRole("heading", { name, exact: true });
  }

  searchControl(): Locator {
    return this.page.getByRole("textbox", { name: "Search" });
  }

  dashboardWidget(widgetName: string): Locator {
    return this.page
      .locator("body")
      .getByText(widgetName, { exact: false })
      .first();
  }

  quickLaunchAction(actionName: string): Locator {
    return this.page
      .locator("body")
      .getByText(actionName, { exact: false })
      .first();
  }

  employeeRows(): Locator {
    return this.page.locator(".oxd-table-row");
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
      { waitUntil: "domcontentloaded" },
    );

    await expect(this.page.locator('input[name="username"]')).toBeVisible();
    await this.page.locator('input[name="username"]').fill(username);
    await this.page.locator('input[name="password"]').fill(password);
    await this.page.locator('button[type="submit"]').click();

    await expect(this.page).toHaveURL(/\/web\/index\.php\/dashboard\/index$/, {
      timeout: 15_000,
    });
    await expect(this.heading("Dashboard")).toBeVisible({ timeout: 15_000 });
  }

  async openModule(moduleName: string): Promise<void> {
    const expectedPath = this.modulePath(moduleName);
    const link = this.page.getByRole("link", { name: moduleName, exact: true });
    const href = await link.getAttribute("href");

    await this.page.goto(
      new URL(href || expectedPath, this.baseUrl).toString(),
      { waitUntil: "domcontentloaded" },
    );

    await expect
      .poll(() => this.isModulePage(moduleName), {
        timeout: 10_000,
      })
      .toBeTruthy();
  }

  async searchEmployee(employeeName: string): Promise<void> {
    await this.page.getByRole("link", { name: "PIM", exact: true }).click();
    await expect(this.heading("PIM")).toBeVisible();

    const employeeNameInput = this.page
      .locator("input[placeholder='Type for hints...']:visible")
      .first();

    await expect(employeeNameInput).toBeVisible();
    await employeeNameInput.fill(employeeName);
    await this.page.getByRole("button", { name: "Search" }).click();
  }

  async hasEmployee(employeeName: string): Promise<boolean> {
    return this.employeeRows().first().isVisible();
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

  isModulePage(moduleName: string): boolean {
    const expectedPath = this.modulePath(moduleName);
    const actualPath = new URL(this.page.url()).pathname;

    if (
      actualPath.endsWith(expectedPath) ||
      actualPath.startsWith(expectedPath + "/")
    ) {
      return true;
    }

    if (moduleName === "My Info") {
      return /\/web\/index\.php\/pim\/viewPersonalDetails(?:\/.*)?$/.test(
        actualPath,
      );
    }

    return false;
  }
}
