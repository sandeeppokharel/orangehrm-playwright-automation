#!/usr/bin/env node
import http from "node:http";

const port = Number(process.env.MCP_PORT || 3000);
const host = process.env.MCP_HOST || "127.0.0.1";

function extractSummary(payload) {
  const logText = payload.logs || "";
  const summary = {
    scenarios: null,
    steps: null,
    failed: null,
    passed: null,
  };

  const scenarioMatch = logText.match(/(\d+) scenarios?/i);
  const stepMatch = logText.match(/(\d+) steps?/i);
  const failedMatch = logText.match(/(\d+) failed?/i);
  const passedMatch = logText.match(/(\d+) passed?/i);

  if (scenarioMatch) summary.scenarios = Number(scenarioMatch[1]);
  if (stepMatch) summary.steps = Number(stepMatch[1]);
  if (failedMatch) summary.failed = Number(failedMatch[1]);
  if (passedMatch) summary.passed = Number(passedMatch[1]);

  return summary;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        ok: true,
        service: "mcp-agent-server",
        port,
        host,
      }),
    );
    return;
  }

  if (req.method === "POST" && url.pathname === "/agent/analyze") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const payload = JSON.parse(body || "{}");
        const status = payload.exitCode === 0 ? "passed" : "failed";
        const summary = extractSummary(payload);

        console.log(`[agent] test run status: ${status}`);
        console.log(`[agent] command: ${payload.testCommand || "unknown"}`);
        console.log(
          `[agent] summary: scenarios=${summary.scenarios ?? "n/a"}, steps=${summary.steps ?? "n/a"}, passed=${summary.passed ?? "n/a"}, failed=${summary.failed ?? "n/a"}`,
        );

        if (payload.logs) {
          const preview = payload.logs.slice(-2000);
          console.log("[agent] log preview:\n" + preview);
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            ok: true,
            status,
            exitCode: payload.exitCode ?? 0,
            summary,
            reportExists: payload.reportExists ?? false,
            reportPath: payload.reportPath ?? null,
          }),
        );
      } catch (error) {
        console.error("[agent] invalid JSON payload", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "invalid JSON" }));
      }
    });

    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: false, error: "not found" }));
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.warn(
      `Port ${port} is already in use on ${host}. Stop the existing MCP agent or set MCP_PORT to a free port.`,
    );
    process.exit(0);
  }

  console.error("[agent] server error:", error);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(
    `MCP agent server listening on http://${host}:${port}/agent/analyze`,
  );
});
