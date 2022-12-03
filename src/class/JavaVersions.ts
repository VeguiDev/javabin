import axios from "axios";
import { Downloader } from "./VersionDownloader";
import { ARCHS, EXTRAPLATFORMS, PLATFORMS } from "../interfaces/JavaVersions";

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

  listArchs() {
    let archs:any = {};

    for(let format of Object.keys(this.downloadLinks)) {
      archs[format] = Object.keys(this.downloadLinks[format]);
    }

    return archs;
  }

  listPlatforms() {
    return Object.keys(this.downloadLinks);
  }

  listPlatformArchs(platform:PLATFORMS) {
    if(!Object.keys(this.downloadLinks).includes(platform)) throw new Error(platform+" is an invalid platform!");

    return Object.keys(this.downloadLinks[platform]);
  }

  platform(
    platform: EXTRAPLATFORMS,
    arch: ARCHS
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

  listJdkVersions() {
    if(!this.json[this.arch].jdk) return [];
    return Object.keys(this.json[this.arch].jdk);
  }

  listJreVersions() {
    if(!this.json[this.arch].jre) return [];
    return Object.keys(this.json[this.arch].jre);
  }

  listVersions() {
    return {
      jdk: this.listJdkVersions(),
      jre: this.listJreVersions()
    }
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

    listFormats() {
      return Object.keys(this.formats);
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

  getDownloadUrl() {
    return axios.defaults.baseURL+this.resource;  
  }

  async download() {
    return await Downloader.download(this, process.cwd());
  }
}
