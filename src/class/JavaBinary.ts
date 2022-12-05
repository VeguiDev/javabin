import { ARCHS, PLATFORMS } from "../interfaces/JavaVersions";
import { Downloader } from "./VersionDownloader";
import {axios} from './JavaVersions';

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
    return axios.defaults.baseURL + this.resource;
  }

  async download() {
    return await Downloader.download(this, process.cwd());
  }
}