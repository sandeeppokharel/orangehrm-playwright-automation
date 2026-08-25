import "dotenv/config";

export default {
  paths: ["features/**/*.feature"],
  import: [
    "tsx/esm",
    "features/support/world.ts",
    "features/support/hooks.ts",
    "features/orangehrm/orangehrm.steps.ts",
    "features/api/api.steps.ts",
  ],
  format: ["progress", "html:reports/cucumber-report.html"],
  publishQuiet: true,
  worldParameters: {
    baseUrl:
      process.env.BASE_URL || "https://opensource-demo.orangehrmlive.com",
  },
};
