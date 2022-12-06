import chalk from "chalk";
import { Command } from "commander";
import { JavaVersion } from "../../class/JavaVersions";
import { clist } from "../util/createList";

const parentCommand = new Command("list");

const cmd = new Command("platform");

cmd.action(async () => {
  const java = await JavaVersion.getInstance();
  console.log(chalk.blue("Supported Platforms:"));

  const arr = java.listPlatforms();

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
    .argument("[arch]", "Optional |architecture argument")
    .argument("[release]", "Optional | jdk/jre release argument")
    .argument("[version]", "Optional | jdk/jre release version argument")
    .argument("[format]", "Optional |jdk/jre release version format argument")
    .action(async (plat, arch, rel, ver, format) => {
      const java = await JavaVersion.getInstance();

      if (!plat) {
        console.log(chalk.blue("Supported Platforms & Architectures:"));

        const arr = java.listArchs();

        if (arr.jmc) {
          delete arr.jmc;
        }

        console.log(clist(arr, 1));
      } else if (!arch) {
        try {
          const arr = java.listPlatformArchs(plat);

          console.log(chalk.blue("Supported Architectures for " + plat + ":"));
          console.log(clist(arr, 1));
        } catch (e) {
          console.log(chalk.red("Invalid platform!"));
        }
      } else {
        try {
          const platx = java.platform(plat, arch);

          let arr:({
            jdk:string[],
            jre:string[]
          }|string[]) = platx.listVersions();

          if (rel) {
            if (rel.toLowerCase() == "jre") {
              arr = platx.listJreVersions();
            } else if (rel.toLowerCase() == "jdk") {
              arr = platx.listJdkVersions();
            }

            if (ver) {
                let jl;
              let arr;
                
              try {
                switch (rel.toLowerCase()) {
                    case "jdk":
                      jl = platx.jdk(ver);
                      break;
                    case "jre":
                      jl = platx.jre(ver);
                      break;
                  }

                  arr = jl?.listFormats();

                  if(format && arr?.includes(format)) {

                    arr = jl?.format(format);

                    console.log(chalk.blue("Java Binary information:"));
                    console.log(clist(arr, 1));
                    return;

                  } else if(format) {
                    console.log(chalk.red(format+" is an invalid format!"));
                    return;
                  }

                  arr = jl?.listFormats();

                  console.log(
                    chalk.blue(
                      "Supported Formats of " +
                        rel.toUpperCase() + " "+ver+
                        " for " +
                        plat +
                        "/" +
                        arch +
                        ":"
                    )
                  );
                  console.log(clist(arr, 1));
              } catch(e) {
                console.log(chalk.red(ver+" version not supported!"));
              }
              return;
            }

            console.log(
              chalk.blue(
                "Supported Versions of " +
                  rel.toUpperCase() +
                  " for " +
                  plat +
                  "/" +
                  arch +
                  ":"
              )
            );
            console.log(clist(arr, 1));
            return;
          }

          console.log(
            chalk.blue("Supported Versions for " + plat + "/" + arch + ":")
          );
          console.log(clist(arr, 1));
        } catch (e) {
          console.log(chalk.red("Invalid platform!"));
        }
      }
    })
);

parentCommand.addCommand(cmd);

export { parentCommand as ListCMD };
