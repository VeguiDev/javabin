import { CLIApp } from "../class/CommandLineApp";

export function prDebug(msg:any, ...emsg:any[]) {

    if(!CLIApp.getInstance().verbose) return;

    console.log("[DEBUG]: ",msg,...emsg);

}