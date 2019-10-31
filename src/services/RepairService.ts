import { Store } from 'vuex';
import ApplicationState from '@/store/ApplicationState';
import { ApplicationInfo } from '@/models/ApplicationInfo'

export default class RepairService {
    private $store : Store<ApplicationState>;

    constructor(store : Store<ApplicationState>) {
        this.$store = store;
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
}