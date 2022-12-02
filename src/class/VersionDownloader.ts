import axios from 'axios';
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
        

    }
}