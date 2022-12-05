#!/usr/bin/env node

import {program} from 'commander';
import { DownloadCommand } from './commands/download';

program.description("CLI for download and get information of Amazon Corretto.");
program.version("1.0.0");
program.addCommand(DownloadCommand);
program.parse();