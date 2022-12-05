import { JavaVersion } from "../class/JavaVersions";
import { Platform } from "../class/Platform";
import { PLATFORMS } from "../interfaces/JavaVersions";

describe("Checking if JavaVersion Instance works fine", () => {
  let java: JavaVersion;

  beforeAll(async () => {
    java = await JavaVersion.getInstance();
  });

  it("JavaVersion.getInstance returns JavaVersion", () => {
    expect(java).toBeInstanceOf(JavaVersion);
  });

  it("checks if listPlatforms returns Array", () => {
    expect(java.listPlatforms()).toBeInstanceOf(Array);
    console.log(java.listPlatforms()[0]);
    expect(typeof java.listPlatforms()[0] == "string").toBe(true);
  });

  it("check if method listArchs works", () => {
    expect(java.listArchs()).toBeInstanceOf(Object);

    expect(java.listArchs().windows).toBeInstanceOf(Array);
  });

  it("check if method listPlatformArchs works", () => {
    let platformsToCheck: PLATFORMS[] = ["windows", "linux", "macos"];

    for (let platform of platformsToCheck) {
      expect(java.listPlatformArchs(platform)).toBeInstanceOf(Array);
      expect(typeof java.listPlatformArchs(platform)[0] == "string").toBe(true);
    }
  });

  it("check if method platform works", () => {
    let platformsToCheck: PLATFORMS[] = ["windows", "linux", "macos"];

    for (let platform of platformsToCheck) {
        let plat = java.platform(platform, "x64");
        expect(plat).toBeInstanceOf(Platform);
    }
  });
});
