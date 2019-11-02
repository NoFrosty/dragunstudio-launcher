import ApplicationLibrary from './ApplicationLibrary';
import RendererServiceBase from './RendererServiceBase';

export default class RepairService extends RendererServiceBase {
    private applicationLibrary : ApplicationLibrary;

    constructor(applicationLibrary : ApplicationLibrary) {
        super()
        this.applicationLibrary = applicationLibrary;
    }

    CheckAll() {
    }
    
    CheckStore() {
        for(var i = 0; i < this.store.state.installedApplications.length; i++) {
            let app = this.store.state.installedApplications[i];
            if (!app.path) {
                this.store.commit("removeApplication", app);
                i--;
            }
        }
    }

    async CheckIfSelectedApplicationStillExists() {
        let applications = await this.applicationLibrary.getAllGameList();
        if (applications.length == 0) {
            this.store.commit('setSelectedApplicationId', null);
        }
        else {
            let app = applications.find(x => x.applicationId == this.store.state.selectedApplicationId);
            if (!app) {
                this.store.commit('setSelectedApplicationId', applications[0].applicationId);
            }
        }
    }
}