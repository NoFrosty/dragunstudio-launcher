import axios from 'axios';
import { Store } from 'vuex';
import ApplicationState from '@/store/ApplicationState';
import {ApplicationInfo} from "@/models/ApplicationInfo";

class ApplicationLibrary {
    private $store : Store<ApplicationState>;

    constructor(store : Store<ApplicationState>) {
        this.$store = store;
    }

    private async getAllGameList(): Promise<ApplicationInfo[]> {
        if (this.$store.state.isOffline) {
            let appData = localStorage.getItem("Applications");
            if (appData == null) {
                throw "Offline mode can't be used for first execution!";
            }
            let apps : ApplicationInfo[] = JSON.parse(appData);
            return apps;
        }
        else {
            let result = await axios.get<ApplicationInfo[]>(process.env.VUE_APP_API_LINK + '/application');
            localStorage.setItem("Applications", JSON.stringify(result.data));
            return result.data;
        }
    }

    private async getGameFromId(applicationId:string) : Promise<ApplicationInfo>{
        let apps : Promise<ApplicationInfo[]> = this.getAllGameList();
        var app = (await apps).find(x => x.applicationId == applicationId);
        if (app == null) {
            throw "No App found with this Id" + applicationId;
        }
        return app;
    }

    
}

export default ApplicationLibrary