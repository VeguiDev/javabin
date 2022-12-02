import axios, { AxiosResponse } from 'axios';
import path from 'path';
import fs from 'fs';
import { JavaBinary } from './JavaVersions';

const BASEURL = "https://corretto.aws";

axios.defaults.baseURL = BASEURL;

export class Downloader {
    static client = axios;

    static async download(binary:JavaBinary, downloadPath:string) {
        
        let url = path.join(BASEURL, binary.resource);
        let filename = path.basename(url);
        console.log("Downloading "+filename+" from ", url);
        
        let dpath = path.join(process.cwd(), filename);

        let iDownload = await IncomingDownload.downloadJavaBinary(binary, binary.resource, dpath, filename);

        iDownload.on("tick", function(e) { 
            console.log("STATUS: "+e.tick+"/"+e.total);
        });

        iDownload.on("complete", function(e) { 
            console.log(e);
        });
    }
}
export type Events = ("tick"|"complete");

export interface EventI {
    eventName:Events;
    cb: (value:EventCallback) => void;

}

export interface TickEvent {
    total:number;
    tick:number;
}
export interface DownloadCompleteEvent {

    path:string;
    filename:string;
    javaBinary:JavaBinary;

}

export type EventCallback = (TickEvent|DownloadCompleteEvent);

export class IncomingDownload {
    private events:{
        eventName:string,
        cb:(value:any) => void
    }[] = [];

    writer:fs.WriteStream;
    path:string;
    javaBin:JavaBinary;
    totalLength:number;
    count:number;

    constructor({data, headers}:AxiosResponse, path:string, bin:JavaBinary, filename:string) {
        
        this.path = path;
        this.javaBin = bin;

        this.totalLength = Number(headers["content-length"]);
        this.count = 0;

        this.writer = fs.createWriteStream(path)
        data.on("data", (chunk:Buffer) => {
            this.count+=chunk.length;
            this.trigger("tick", {
                total: this.totalLength,
                tick: this.count
            });
        });
        data.pipe(this.writer);
        data.on("close", () => {
            this.trigger("complete", {
                filename,
                path,
                javaBinary: this.javaBin
            });
        });
    }

    static async downloadJavaBinary(bin:JavaBinary, url:string, path:string, filename:string) {
        return new IncomingDownload(await axios({
            url,
            responseType: "stream"
        }), path, bin, filename);
    }

    on(event_name:Events, cb:(value:any) => void):void {

        this.events.push({
            eventName: event_name,
            cb
        });

    }

    trigger(event:"tick", value:TickEvent):void
    trigger(event:"complete", value:DownloadCompleteEvent):void
    trigger(event:Events, value:(TickEvent|DownloadCompleteEvent)):void {
        this.events.filter(e => e.eventName == event).every(e => e.cb(value));
    }

}  