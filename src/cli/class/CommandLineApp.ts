
import {Command, program} from 'commander';
import { DownloadCommand } from '../commands/download';
import { ListCMD } from '../commands/list';

export class CLIApp {

    static instance:CLIApp;

    static getInstance() {
        if(!this.instance) {
            this.instance = new CLIApp();
        }

        return this.instance;
    }

    static isRunned() {
        return this.getInstance().runned;
    }

    program:Command = program;
    runned:boolean = false;
    verbose:boolean = false;

    constructor() {
        this.SetupConfig();
        this.AddCommands();
        this.AddOptions();
    }

    private SetupConfig() {

        this.program.description("CLI for download and get information of Amazon Corretto.");
        this.program.version("1.0.2", "-v, --version", "Show actual version of CLI.");
    }

    protected AddCommands() {
        this.program.addCommand(DownloadCommand);
        this.program.addCommand(ListCMD);
    }

    protected AddOptions() {
        this.program.option("-V, --verbose", "Show debug information");
    }

    run() {
        if(!this.runned) {
            this.runned = true;

            this.program.parse();

            let opts = this.program.opts();

            if(opts.verbose) {
                this.verbose = true;
            }

        }
    }

}