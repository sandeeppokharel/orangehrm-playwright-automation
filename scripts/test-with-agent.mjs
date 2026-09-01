#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const reportPath = path.join(process.cwd(), "reports", "cucumber-report.html");

function log(message) {
  console.log(message);
}

if (dryRun) {
  log("Dry run: wrapper is ready to run 'npm test'.");
  log(`Agent hook: ${process.env.MCP_AGENT_URL || "not configured"}`);
  log(`Report path: ${reportPath}`);
  process.exit(0);
}

const child = spawn(npmCommand, ["test"], {
  stdio: ["inherit", "pipe", "pipe"],
  shell: false,
});

let logs = "";

child.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);
  logs += text;
});

child.stderr.on("data", (chunk) => {
  const text = chunk.toString();
  process.stderr.write(text);
  logs += text;
});

child.on("exit", async (code) => {
  const exitCode = code ?? 0;
  const payload = {
    testCommand: "npm test",
    exitCode,
    reportExists: fs.existsSync(reportPath),
    reportPath,
    logs,
    generatedAt: new Date().toISOString(),
    cwd: process.cwd(),
    nodeVersion: process.version,
    platform: process.platform,
    environment: {
      MCP_AGENT_URL: Boolean(process.env.MCP_AGENT_URL),
      HEADLESS: process.env.HEADLESS ?? "true",
    },
  };

  const agentUrl = process.env.MCP_AGENT_URL;

  if (!agentUrl) {
    log("\nMCP_AGENT_URL is not set. Agent hook skipped.");
    process.exit(exitCode);
  }

  try {
    const response = await fetch(agentUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        `\nAgent request failed: ${response.status} ${response.statusText}`,
      );
    } else {
      log("\nAgent notification sent successfully.");
    }
  } catch (error) {
    console.error("\nFailed to notify MCP agent:", error);
  }

  process.exit(exitCode);
});
