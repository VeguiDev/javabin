import { JavaVersion } from "./class/JavaVersions";


JavaVersion.getInstance().then(java => {
    console.log(java.platform("win", "x64").jdk(11).format("zip").download("dist/x/a/fg"));
})