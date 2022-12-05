import chalk from "chalk";
import { Command } from "commander";
import { JavaVersion } from "../../class/JavaVersions";
import { clist } from "../util/createList";

const parentCommand = new Command("list");

const cmd = new Command("platform");

cmd.action(async () => {
  let java = await JavaVersion.getInstance();
  console.log(chalk.blue("Supported Platforms:"));

  let arr = java.listPlatforms();

  if (arr.includes("jmc")) {
    arr.splice(
      arr.findIndex((p) => p == "jmc"),
      1
    );
  }

  console.log(clist(arr, 1));
});

cmd.addCommand(
  new Command("architecture")
    .aliases(["arch", "archs"])
    .argument("[platform]", "Optional platform argument")
    .action(async (plat) => {
      let java = await JavaVersion.getInstance();

      if (!plat) {
        console.log(chalk.blue("Supported Platforms & Architectures:"));

        let arr = java.listArchs();

        if (arr.jmc) {
          delete arr.jmc;
        }

        console.log(clist(arr, 1));
      } else {

        

        try {
            let arr = java.listPlatformArchs(plat);
            
            console.log(chalk.blue("Supported Architectures for "+plat+":"));
            console.log(clist(arr, 1));
        } catch(e) {
            console.log(chalk.red("Invalid platform!"));
        }

      }
    })
);

parentCommand.addCommand(cmd);

export { parentCommand as ListCMD };
