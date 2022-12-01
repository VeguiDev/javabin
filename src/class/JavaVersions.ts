import axios from 'axios';

export class JavaVersion {

    private rawUrlLastVersionReleases = "https://raw.githubusercontent.com/corretto/corretto-downloads/main/latest_links/indexmap_with_checksum.json";

    constructor() {

    }

    async fetchVersions() {
        try {
            let versionsRes= await fetch(this.rawUrlLastVersionReleases);

            return versionsRes.json();
        } catch(err) {
            console.error(err);
            return null;
        }
    }

}