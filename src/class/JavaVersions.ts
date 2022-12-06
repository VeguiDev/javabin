import axios from "axios";
import { ARCHS, EXTRAPLATFORMS, JavaArchitectures, JavaDownloadLinks, PLATFORMS } from "../interfaces/JavaVersions";
import { JavaBinariesFormats } from "./JavaBinariesFormats";
import { Platform } from "./Platform";

export class JavaVersion {
  static rawUrlLastVersionReleases =
    "https://raw.githubusercontent.com/corretto/corretto-downloads/main/latest_links/indexmap_with_checksum.json";
  downloadLinks: JavaDownloadLinks;

  constructor(downloadlinks: JavaDownloadLinks) {
    this.downloadLinks = downloadlinks;
  }

  private static async fetchDownloadsLinks() {
    try {
      const downloads = await axios.get(this.rawUrlLastVersionReleases);

      return downloads.data;
    } catch (err) {
      throw new Error("Can't get raw data from github");
    }
  }

  static async getInstance() {
    const downlink = await this.fetchDownloadsLinks();
    if (!downlink)
      throw new Error(
        "Can't get latest Amazon Corretto from Github, Check your internet connection"
      );
    return new JavaVersion(downlink);
  }

  listArchs() {
    const archs: {
      [value:string]: ARCHS[]
    } = {};

    for (const format of Object.keys(this.downloadLinks)) {
      archs[format] = Object.keys(this.downloadLinks[format]);
    }

    return archs;
  }

  listPlatforms() {
    return Object.keys(this.downloadLinks);
  }

  listPlatformArchs(platform: PLATFORMS) {
    if (!Object.keys(this.downloadLinks).includes(platform))
      throw new Error(platform + " is an invalid platform!");

    return Object.keys(this.downloadLinks[platform]);
  }

  /**
   * Returns JMC binaries (Only x64)
   */
  JMC(platform: PLATFORMS) {
    return new JavaBinariesFormats(new Platform(this.downloadLinks.jmc[platform], "x64", platform), this.downloadLinks.jmc[platform].x64);
  }

  platform(platform: EXTRAPLATFORMS|string, arch: ARCHS|string) {
    switch (platform) {
      case "win":
      case "windows":
      case "win32":
        return new Platform(this.downloadLinks["windows"], arch, "windows");
        break;
      case "darwin":
      case "macos":
        return new Platform(
          this.downloadLinks[platform.toLowerCase()],
          arch,
          "macos"
        );
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

axios.defaults.baseURL = JavaVersion.rawUrlLastVersionReleases;

export { axios };
