import { JavaBinariesFormats } from "../class/JavaBinariesFormats";
import { JavaBinary } from "../class/JavaBinary";
import { JavaVersion } from "../class/JavaVersions";



describe("Check if all methods of JavaBinariesFormats works", () => {
    let formats:JavaBinariesFormats;
    let java:JavaVersion;

    beforeAll(async () => {
        java = await JavaVersion.getInstance();
        formats = java.platform("windows", "x64").jdk(11);
    });

    it("check if method listFormats works", () => {
        expect(formats.listFormats()).toBeInstanceOf(Array);
        expect(typeof formats.listFormats()[0] == "string").toBe(true);
    })

    it("check if method format works", () => {
        expect(formats.format("zip")).toBeInstanceOf(JavaBinary);
    })

    it("check if method format fails", () => {
        try {
            let format = java.platform("linux", "x64").jdk("11").format("zip");
        } catch(e) {
            expect(e).toBeInstanceOf(Error);
        }
    })
})