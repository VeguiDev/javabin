import { JavaBinariesFormats } from '../class/JavaBinariesFormats';
import { Platform } from '../class/Platform';
import JavaVersion from '../index';

let java:JavaVersion;
let platform:Platform;

beforeAll(async () => {
    java = await JavaVersion.getInstance();
    platform = java.platform("linux", "x64");
});

describe("Check if all methods of Platforms works", () => {

    it("ListJdkVersions method works", () => {
        expect(platform.listJdkVersions()).toBeInstanceOf(Array);
        expect(typeof platform.listJdkVersions()[0] == "string").toBe(true);
    })

    it("ListJreVersions method works", () => {
        expect(java.platform("win", "x64").listJreVersions()).toBeInstanceOf(Array);
        if(java.platform("win", "x64").listJreVersions().length > 0) {
            expect(typeof java.platform("win", "x64").listJreVersions()[0] == "string").toBe(true);
        }
    })

    it("ListVersions method works", () => {
        expect(platform.listVersions()).toBeInstanceOf(Object);
        let keys = Object.keys(platform.listVersions());
        expect(keys.includes("jre")).toBe(true);
        expect(keys.includes("jdk")).toBe(true);
    })

    it("check if jdk method works", () => {
        let jdk = platform.jdk(11);

        expect(jdk).toBeInstanceOf(JavaBinariesFormats);
    });

    it("check if jre method works", () => {
        let jre = java.platform("win", "x64").jre(8);

        expect(jre).toBeInstanceOf(JavaBinariesFormats);
    });

});