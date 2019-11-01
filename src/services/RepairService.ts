import { Store } from 'vuex';
import ApplicationState from '@/store/ApplicationState';
import ApplicationLibrary from './ApplicationLibrary';

export default class RepairService {
    private $store : Store<ApplicationState>;
    private applicationLibrary : ApplicationLibrary;

    constructor(store : Store<ApplicationState>, applicationLibrary : ApplicationLibrary) {
        this.$store = store;
        this.applicationLibrary = applicationLibrary;
    }

    CheckAll() {
    }
    
    CheckStore() {
        for(var i = 0; i < this.$store.state.installedApplications.length; i++) {
            let app = this.$store.state.installedApplications[i];
            if (!app.path) {
                this.$store.commit("removeApplication", app);
                i--;
            }
        }
    }

    async CheckIfSelectedApplicationStillExists() {
        let applications = await this.applicationLibrary.getAllGameList();
        if (applications.length == 0) {
            this.$store.commit('setSelectedApplicationId', null);
        }
        else {
            let app = applications.find(x => x.applicationId == this.$store.state.selectedApplicationId);
            if (!app) {
                this.$store.commit('setSelectedApplicationId', applications[0].applicationId);
            }
        }
    }
}