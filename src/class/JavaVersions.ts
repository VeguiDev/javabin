import axios from "axios";
import { Downloader } from "./VersionDownloader";

export type ARCHS = "x86" | "x64" | "aarch64" | "arm" | "arm-musl";
export type PLATFORMS = "windows" | "linux" | "macos";
export class JavaVersion {
  private static rawUrlLastVersionReleases =
    "https://raw.githubusercontent.com/corretto/corretto-downloads/main/latest_links/indexmap_with_checksum.json";
  downloadLinks: any;

  constructor(downloadlinks: any) {
    this.downloadLinks = downloadlinks;
  }

  private static async fetchDownloadsLinks() {
    try {
      let downloads = await axios.get(this.rawUrlLastVersionReleases);

      return downloads.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async getInstance() {
    let downlink = await this.fetchDownloadsLinks();
    if (!downlink)
      throw new Error(
        "Can't get latest Amazon Corretto from Github, Check your internet connection"
      );
    return new JavaVersion(downlink);
  }

  platform(
    platform: "windows" | "darwin" | "win" | "linux" | "macos",
    arch: "x86" | "x64" | "aarch64" | "arm" | "arm-musl"
  ) {
    switch (platform) {
      case "darwin":
      case "win":
      case "windows":
        return new Platform(this.downloadLinks["windows"], arch, "windows");
        break;
      default:
        return new Platform(
          this.downloadLinks[platform.toLowerCase()],
          arch,
          platform
        );
        break;
    }
  }
}

export class Platform {
  platform: PLATFORMS;
  arch: ARCHS;

  private json: any;
  constructor(json: any, arch: ARCHS, plat: PLATFORMS) {
    this.json = json;
    this.arch = arch;
    this.platform = plat;
  }

  jdk(
    version: "8" | "11" | "15" | "16" | "17" | "18" | "19" | string | number
  ) {
    let formats = this.json[this.arch].jdk[version];

    if (!formats) throw new Error("Invalid Version");
    return new JavaBinariesFormats(this, formats);
  }

  jre(
    version: "8" | "11" | "15" | "16" | "17" | "18" | "19" | string | number
  ) {
    let formats = this.json[this.arch].jre[version];

    if (!formats) throw new Error("Invalid Version");
    return new JavaBinariesFormats(this, formats);
  }
}

export class JavaBinariesFormats {
    private formats:any;
    private parent:Platform;

    constructor(parent:Platform, formats:any) {
        this.formats = formats;
        this.parent = parent;
    }

    format(format:string) {
        if(!Object.keys(this.formats).includes(format)) throw new Error("Invalid format or not avaible");

        let bin = this.formats[format];

        return new JavaBinary(
            this.parent.platform,
            this.parent.arch,
            format,
            bin.checksum,
            bin.checksum_sha256,
            bin.resource
        );
    }
}

export class JavaBinary {
  platform: PLATFORMS;
  arch: ARCHS;
  format: string;
  checksum: string;
  checksum_sha256: string;
  resource: string;

  constructor(
    platform: PLATFORMS,
    arch: ARCHS,
    format: string,
    checksum: string,
    checksum_sha256: string,
    resource: string
  ) {
    this.arch = arch;
    this.format = format;
    this.platform = platform;
    this.checksum = checksum;
    this.checksum_sha256 = checksum_sha256;
    this.resource = resource;
  }

  async download() {
    return await Downloader.download(this, process.cwd());
  }
}
