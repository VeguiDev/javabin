import { FormatJSON } from "../interfaces/JavaVersions";
import { JavaBinary } from "./JavaBinary";
import { Platform } from "./Platform";

export class JavaBinariesFormats {
    private formats:FormatJSON;
    private parent:Platform;

    constructor(parent:Platform, formats:FormatJSON) {
        this.formats = formats;
        this.parent = parent;
    }

    listFormats() {
      return Object.keys(this.formats);
    }

    format(format:string) {
        if(!Object.keys(this.formats).includes(format)) throw new Error("Invalid format or not avaible");

        const bin = this.formats[format];

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