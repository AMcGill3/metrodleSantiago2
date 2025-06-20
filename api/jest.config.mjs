import dotenv from "dotenv";
dotenv.config({ path: "./.env.test" });

/** @type {import('jest').Config} */
const config = {
  transform: {},
  testEnvironment: "node",
  verbose: true, // Give more useful output
  maxWorkers: 1, // Make sure our tests run one after another
  setupFilesAfterEnv: ["../api/tests/mongodb_helper.js"],
  testEnvironment: "node",
};

export default config;
