import { JavaVersion } from "./class/JavaVersions";


const javaVersion = new JavaVersion();

(async () => {

    let versions = javaVersion.fetchVersions();

    console.log(versions);

})();