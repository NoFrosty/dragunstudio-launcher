import ApplicationLibrary from './ApplicationLibrary';
import RendererServiceBase from './RendererServiceBase';

class RepairService extends RendererServiceBase {
    private applicationLibrary : ApplicationLibrary;

    constructor() {
        super()
        this.applicationLibrary = new ApplicationLibrary();
    }

    CheckAll() {
    }
    
    CheckStore() {
        for(let i = 0; i < this.store.state.installedApplications.length; i++) {
            const app = this.store.state.installedApplications[i];
            if (!app.path) {
                this.store.commit("removeApplication", app);
                i--;
            }
        }
    }

    async CheckIfSelectedApplicationStillExists() {
        const applications = await this.applicationLibrary.getAllGameList();
        if (applications.length == 0) {
            this.store.commit('setSelectedApplicationId', null);
        }
        else {
            const app = applications.find(x => x.applicationId == this.store.state.selectedApplicationId);
            if (!app) {
                this.store.commit('setSelectedApplicationId', applications[0].applicationId);
            }
        }
    }
}

export default RepairService