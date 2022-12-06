import { ARCHS, PLATFORMS, JavaArchitectures } from "../interfaces/JavaVersions";
import { JavaBinariesFormats } from "./JavaBinariesFormats";

export class Platform {
  platform: PLATFORMS;
  arch: ARCHS;

  private json: JavaArchitectures;
  constructor(json: JavaArchitectures, arch: ARCHS|string, plat: PLATFORMS|string) {
    this.json = json;
    this.arch = arch;
    this.platform = plat;
  }

  listJdkVersions() {
    if (!this.json[this.arch].jdk) return [];
    return Object.keys(this.json[this.arch].jdk);
  }

  listJreVersions() {
    if (!this.json[this.arch].jre) return [];
    return Object.keys(this.json[this.arch].jre);
  }

  listVersions() {
    return {
      jdk: this.listJdkVersions(),
      jre: this.listJreVersions(),
    };
  }

  jdk(
    version: "8" | "11" | "15" | "16" | "17" | "18" | "19" | string | number
  ) {
    const formats = this.json[this.arch].jdk[version];

    if (!formats) throw new Error("Invalid Version");
    return new JavaBinariesFormats(this, formats);
  }

  jre(
    version: "8" | "11" | "15" | "16" | "17" | "18" | "19" | string | number
  ) {
    const formats = this.json[this.arch].jre[version];

    if (!formats) throw new Error("Invalid Version");
    return new JavaBinariesFormats(this, formats);
  }
}
