import { PLATFORMS } from "../interfaces/JavaVersions";
import { JavaBinary } from "./JavaBinary";
import { Platform } from "./Platform";

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