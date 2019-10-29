import { Store } from 'vuex';
import ApplicationState from '@/store/ApplicationState';
import { InstallationInfo } from '@/models/InstallationInfo';

class InstallationManager {
    private $store : Store<ApplicationState>;

    constructor(store : Store<ApplicationState>) {
        this.$store = store;
    }


    public installApplication(applicationId : string, installationPath : string) : InstallationInfo {
        if (this.$store.state.installedApplications.find(x => x.applicationId == applicationId)) {
            throw "Application is already installed";
        }

        // TODO: Real installation here;

        let installation : InstallationInfo = {
            applicationId: applicationId,
            exeName: "",
            path: installationPath
        };
        this.$store.commit('addNewApplication', installation);

        return installation;
    }

    public uninstallApplication(applicationId : string) {
        let installation = this.$store.state.installedApplications.find(x => x.applicationId == applicationId);
        if (!installation) {
            throw "Application is not installed";
        }
        // TODO: Do real unsintall here!
        this.$store.commit('removeApplication', installation);
    }
}
export default InstallationManager;