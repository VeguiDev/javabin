import { Command } from "commander";
import { JavaVersion } from "../../class/JavaVersions";
import os from "os";
import { Platform } from "../../class/Platform";
import inquirer from "inquirer";
import cliProgress from "cli-progress";
import { JavaBinariesFormats } from "../../class/JavaBinariesFormats";
import chalk from "chalk";

let cmd = new Command("download");

cmd.aliases(["down", "d"]);
cmd.argument("<version>", "Version of java you want download.");
cmd.option("-P, --platform <platform>", "Set the platform");
cmd.option("-A, --arch <arch>", "Set the architecture");
cmd.option("-F, --format <format>", "Set the format");
cmd.option("-O, --path <path>", "Set the download path");

cmd.action(async (ver, opts) => {
  let java = await JavaVersion.getInstance();

  let platformSUPPORTED = ["darwin", "win32", "linux", "win", "windows", "mac", "macos"];

  let archSUPPORTED = ["x64", "x86", "arm", "aarch64", "arm64"];

  let platform = opts.platform || os.platform();

  if (opts.platform && !opts.arch) {
    if (!platformSUPPORTED.includes(opts.platform)) {
      console.log(
        chalk.red("Your platform is not supported for Amazon Corretto.")
      );
      return;
    }

    let archs = java.listPlatformArchs(opts.platform);

    let par = await inquirer.prompt({
      type: "list",
      name: "arch",
      message: "What architecture you prefer?",
      choices: archs,
    });

    opts.arch = par.arch;
  }

  if (!archSUPPORTED.includes(opts.arch)) {
    console.log(
      chalk.red("Your architecture is not supported for Amazon Corretto.")
    );
    return;
  }

  if (opts.arch && !opts.platform) {
    console.log(
      chalk.red(
        "If you specify an architecture you have to specify a platform."
      )
    );
    return;
  }

  let arch = opts.arch || os.arch();

  let archx: string;

  let platf: Platform;

  switch (arch) {
    case "arm":
      archx = "arm";
      break;
    case "aarch64":
    case "arm64":
      archx = "aarch64";
      break;
    case "x64":
      archx = "x64";
      break;
    case "x86":
      archx = "x86";
      break;
    default:
      console.log(
        chalk.red("Your architecture is not supported for Amazon Corretto.")
      );
      return;
      break;
  }

  switch (platform) {
    case "darwin":
    case "mac":
    case "macos":
      platf = java.platform(platform, archx);
      break;
    case "linux":
      platf = java.platform("linux", archx);
      break;
    case "win32":
    case "win":
    case "windows":
      platf = java.platform("win", archx);
      break;
    default:
      console.log(
        chalk.red("Your platform is not supported for Amazon Corretto.")
      );
      return;
      break;
  }

  let versions = platf.listVersions();

  let disponibleJRE = false;

  if (versions.jre.includes(ver)) {
    disponibleJRE = true;
  }
  let rel: any;

  if (disponibleJRE) {
    rel = await inquirer.prompt({
      type: "list",
      name: "release",
      message: "What release you prefer?",
      choices: ["JRE", "JDK"],
    });
  }

  if (!versions.jdk.includes(ver)) {
    console.log(chalk.red(ver + " is an invalid or not available version!"));
    return;
  }

  let JavaFormats: JavaBinariesFormats;

  if (disponibleJRE && rel.release == "JRE") {
    JavaFormats = platf.jre(ver);
  } else {
    JavaFormats = platf.jdk(ver);
  }

  let q:any;

  if (!opts.format) {
    q = await inquirer.prompt({
      type: "list",
      name: "format",
      message: "What format you prefer?",
      choices: JavaFormats.listFormats(),
    });
  }

  if (!JavaFormats.listFormats().includes(opts.format || q.format)) {
    console.log(
      chalk.red(opts.format || q.format, " is an invalid format for this JavaBinary.")
    );
    return;
  }

  let JavaBinary = JavaFormats.format(opts.format || q.format);

  let progressBar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    ),
    total = 0;

  if(!opts.path) console.log(chalk.yellow("You did not specify a download path, it will download in the current working directory!"));

  let iDownload = await JavaBinary.download(opts.path);

  iDownload.on("start", (e) => {
    total = Number(e.total);
    console.log(chalk.blueBright("Downloading ", e.filename));
    progressBar.start(total, 0);
  });

  iDownload.on("tick", (tick) => {
    progressBar.update(tick.tick);
  });

  iDownload.on("complete", (e) => {
    progressBar.stop();
    console.log(chalk.green("Donwload completed!"));
    console.log(chalk.gray(e.path));
  });

  iDownload.start();
});

export { cmd as DownloadCommand };
