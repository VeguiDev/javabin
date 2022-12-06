export type ARCHS = ("x86" | "x64" | "aarch64" | "arm" | "arm-musl"|string);
export type PLATFORMS = ("windows" | "linux" | "macos"|string);
export type EXTRAPLATFORMS = ("darwin" | "win" | "windows" | "win32" | "linux" | "macos"|string);
export type FORMATSWINDOWS = ("msi"|"zip"|"zip.pub"|"zip.sig");
export type FORMATSLINUX = ("deb"|"rpm"|"tar.gz"|"tar.gz.pub"|"tar.gz.sig");
export type FORMATSMACOS = ("pkg"|"tar.gz"|"tar.gz.pub"|"tar.gz.sig");
export type FORMATS = (FORMATSLINUX|FORMATSWINDOWS|FORMATSMACOS);

export interface FormatJSON {
    [value:string]: {
        checksum:string;
        checksum_sha256:string;
        resource:string;
    }
}

export interface JavaArchitectures {
    [value:ARCHS]: {
        [value:("jre"|"jdk"|"headless"|"headful"|"jmods"|string)]: {
            [value:number|string]: FormatJSON
        }
    }
}

export interface JavaDownloadLinks {
    [value:(PLATFORMS|"jmc"|string)]: JavaArchitectures|any;
    jmc: JavaDownloadLinks;
}