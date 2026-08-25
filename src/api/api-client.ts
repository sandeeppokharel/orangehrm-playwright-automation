export class ApiClient {
  private readonly baseUrl: string;
  private readonly cookies = new Map<string, string>();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get(path: string): Promise<Response> {
    const response = await fetch(this.url(path), {
      headers: this.headers(),
    });
    this.storeCookies(response);
    return response;
  }

  async login(username: string, password: string): Promise<Response> {
    await this.get("/auth/login");
    const response = await fetch(this.url("/auth/validate"), {
      method: "POST",
      headers: {
        ...this.headers(),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ username, password }),
      redirect: "manual",
    });
    this.storeCookies(response);
    return response;
  }

  private headers(): Record<string, string> {
    const cookie = [...this.cookies]
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
    return cookie
      ? {
          Accept: "application/json",
          Cookie: cookie,
          "X-Requested-With": "XMLHttpRequest",
        }
      : { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" };
  }

  private url(path: string): URL {
    const base = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    return new URL(path.replace(/^\//, ""), base);
  }

  private storeCookies(response: Response): void {
    for (const setCookie of response.headers.getSetCookie()) {
      const [nameValue] = setCookie.split(";");
      const separator = nameValue.indexOf("=");
      if (separator > 0) {
        this.cookies.set(
          nameValue.slice(0, separator),
          nameValue.slice(separator + 1),
        );
      }
    }
  }
}
