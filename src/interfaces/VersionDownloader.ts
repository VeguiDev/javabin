import { JavaBinary } from "../class/JavaVersions";

export type Events = ("tick" | "complete");
export interface EventI {
    eventName: Events;
    cb: (value: EventCallback) => void;

}
export interface TickEvent {
    total: number;
    tick: number;
}
export interface DownloadCompleteEvent {

    path: string;
    filename: string;
    javaBinary: JavaBinary;

}
export type EventCallback = (TickEvent|DownloadCompleteEvent);
