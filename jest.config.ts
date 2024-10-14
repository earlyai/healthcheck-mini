import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  automock: false,
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!tests/**",
    "!<rootDir>/src/components/",
    "!<rootDir>/src/types/",
    "!<rootDir>/src/models/",
    "!<rootDir>/src/components"
],
// moduleNameMapper: {
//   "^@/components/(.*)$": "<rootDir>/src/components/$1",
//   "^@/components/ui/(.*)$": "<rootDir>/src/components/ui/$1",
//   "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
//   "^@/checks/(.*)$": "<rootDir>/src/checks/$1",
// },
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest"
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/\\.ignore\\.early\\.",
    "<rootDir>/tests/",
    "<rootDir>/src/types/",
    "<rootDir>/src/models/",
    "<rootDir>/src/components",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/\\.ignore\\.early\\."
  ],
  watchPathIgnorePatterns: [
    "<rootDir>/\\.early\\.coverage/",
    "/\\.ignore\\.early\\."
  ],
  roots: ["src", "tests"],
  testRegex: "tests/.*\\.test\\.(j|t)sx?$"
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
