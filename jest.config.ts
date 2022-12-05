export default {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  roots: ["./src/test"],
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  reporters: ["default", "jest-junit"],
};
