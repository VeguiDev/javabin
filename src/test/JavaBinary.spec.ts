import { JavaBinary } from "../class/JavaBinary";
import { JavaVersion } from "../class/JavaVersions";

import axios from "axios";
import stream from 'stream';
import { IncomingDownload } from "../class/VersionDownloader";

jest.mock("axios");
jest.mock("stream");
jest.mock("fs");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedStream = stream as jest.Mocked<typeof stream>;

describe("Check if all methods of JavaVersion works", () => {
    let bin = new JavaBinary("windows","x64","zip","adafsadf","sadads","test.txt");

    it("check if getDownloadUrl works", () => {
        expect(typeof bin.getDownloadUrl() == "string").toBe(true);
    })

    it("mock download function", () => {

        let stream = new mockedStream.Readable();
    
        let resp = {
            headers: {
                "content-length": "11"
            },
            data: stream
        };

        mockedAxios.get.mockResolvedValue(resp);

        let idown = bin.download("test");

        idown.then((idom) => {
            idom.on("start", (val) => {
                expect(val).toBeInstanceOf(Object);
            })

            idom.on("tick", (val) => {
                expect(val).toBeInstanceOf(Object);
            })
        });
        expect(idown).resolves.toBeInstanceOf(IncomingDownload);
        
    })

})