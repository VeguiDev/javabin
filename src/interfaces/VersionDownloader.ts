import { JavaBinary } from "../class/JavaBinary";

export type Events = ("tick" | "complete"|"start");
export interface EventI {
    eventName: Events;
    cb: (value: EventCallback) => void;

}
export interface StartEvent {
    total: number;
    javaBinary: JavaBinary;
    filename:string;
}
export interface TickEvent {
    total: number;
    percent:number;
    tick: number;
}
export interface DownloadCompleteEvent {

    path: string;
    filename: string;
    javaBinary: JavaBinary;

}
export type EventCallback = (TickEvent|DownloadCompleteEvent);
