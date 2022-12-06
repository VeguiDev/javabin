import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { JavaBinary } from './JavaBinary';
import { DownloadCompleteEvent, Events, StartEvent, TickEvent } from '../interfaces/VersionDownloader';

const BASEURL = "https://corretto.aws";

export class Downloader {

    static async download(binary:JavaBinary, downloadPath?:string) {
        
        const url = path.join(BASEURL, binary.resource);
        const filename = path.basename(url);

        if(downloadPath && !fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath, {
                recursive: true
            });
        }

        const dpath = downloadPath ? path.join(downloadPath, filename) : path.join(process.cwd(), filename);

        const iDownload = await IncomingDownload.downloadJavaBinary(binary, binary.resource, dpath, filename);
        return iDownload;
    }
}

export class IncomingDownload {
    private events:{
        eventName:string,
        cb:(value:(TickEvent|DownloadCompleteEvent|StartEvent)) => void
    }[] = [];

    writer?:fs.WriteStream;
    path:string;
    javaBin:JavaBinary;
    totalLength:number;
    count:number;
    url:string;
    filename:string;

    constructor(url:string, path:string, bin:JavaBinary, filename:string) {
        this.url = url;
        this.path = path;
        this.javaBin = bin;
        this.totalLength = -1;
        this.count = 0;
        this.filename = filename;
    }

    async start() {
        const {data,headers} = await axios.get(this.url,{
            baseURL: BASEURL,
            responseType: "stream"
        })

        this.totalLength = Number(headers["content-length"]);

        this.writer = fs.createWriteStream(this.path)
        this.trigger("start", {
            total: this.totalLength,
            javaBinary: this.javaBin,
            filename: this.filename
        });
        data.on("data", (chunk:Buffer) => {
            this.count+=chunk.length;
            this.trigger("tick", {
                total: this.totalLength,
                tick: this.count,
                percent: this.count/this.totalLength
            });
        });

        data.pipe(this.writer);
        data.on("close", () => {
            this.trigger("complete", {
                filename: this.filename,
                path: this.path,
                javaBinary: this.javaBin
            });
        });
    }

    static async downloadJavaBinary(bin:JavaBinary, url:string, path:string, filename:string) {
        return new IncomingDownload(url, path, bin, filename);
    }
    
    on(event_name:("tick"|"complete"|"start"), cb:(val?:any) => void):void {

        this.events.push({
            eventName: event_name,
            cb
        });

    }

    trigger(event:"tick", value:TickEvent):void
    trigger(event:"complete", value:DownloadCompleteEvent):void
    trigger(event:"start", value:StartEvent):void
    trigger(event:Events, value:(TickEvent|DownloadCompleteEvent|StartEvent)):void {
        this.events.filter(e => e.eventName == event).every(e => e.cb(value));
    }

}  