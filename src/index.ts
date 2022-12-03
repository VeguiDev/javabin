import { JavaVersion } from "./class/JavaVersions";


JavaVersion.getInstance().then(java => {
    console.log(java.listArchs());
})