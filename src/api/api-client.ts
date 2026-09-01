import type { APIResponse, Page } from "playwright";

export class ApiClient {
  private readonly baseUrl: string;
  private readonly page: Page;

  constructor(baseUrl: string, page: Page) {
    this.baseUrl = baseUrl;
    this.page = page;
  }

  async get(path: string): Promise<APIResponse> {
    return this.page.request.get(this.url(path), {
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      failOnStatusCode: false,
    });
  }

  async login(username: string, password: string): Promise<APIResponse> {
    const loginUrl = new URL(
      "/web/index.php/auth/login",
      this.baseUrl,
    ).toString();
    await this.page.goto(loginUrl, { waitUntil: "domcontentloaded" });

    const csrfToken = await this.page
      .locator('input[name="_token"]')
      .inputValue();

    return this.page.request.post(
      new URL("/web/index.php/auth/validate", this.baseUrl).toString(),
      {
        form: {
          _token: csrfToken,
          username,
          password,
        },
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        failOnStatusCode: false,
      },
    );
  }

  private url(path: string): string {
    const base = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    return new URL(path.replace(/^\//, ""), base).toString();
  }
}
