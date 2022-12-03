import { JavaVersion } from "./class/JavaVersions";


JavaVersion.getInstance().then(java => {
    console.log(java.platform("linux", "x64").jdk(8));
})