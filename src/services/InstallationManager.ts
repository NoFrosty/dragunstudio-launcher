import { Store } from 'vuex';
import ApplicationState from '@/store/ApplicationState';

class InstallationManager {
    private $store : Store<ApplicationState>;

    constructor(store : Store<ApplicationState>) {
        this.$store = store;
    }
}
export default InstallationManager;