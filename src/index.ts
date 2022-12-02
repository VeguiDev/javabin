import { JavaVersion } from "./class/JavaVersions";


JavaVersion.getInstance().then(java => {
    console.log(java.platform("win", "x64"));
    console.log(java.platform("win", "x64").jre(8));
    console.log(java.platform("win", "x64").jre(8).format("msi").download());
})