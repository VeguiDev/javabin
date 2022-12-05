#!/usr/bin/env node

import {program} from 'commander';
import { DownloadCommand } from './commands/download';
import { ListCMD } from './commands/list';

program.description("CLI for download and get information of Amazon Corretto.");
program.version("1.0.0");
program.addCommand(DownloadCommand);
program.addCommand(ListCMD);
program.parse();