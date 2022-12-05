import axios from "axios";
import { ARCHS, EXTRAPLATFORMS, PLATFORMS } from "../interfaces/JavaVersions";
import { Platform } from "./Platform";

export class JavaVersion {
  static rawUrlLastVersionReleases =
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

axios.defaults.baseURL = JavaVersion.rawUrlLastVersionReleases;

export {axios};