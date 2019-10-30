import { Store } from 'vuex';
import ApplicationState from '@/store/ApplicationState';
import { InstallationInfo } from '@/models/InstallationInfo';
import axios from 'axios';
import fs from 'fs';

class InstallationManager {
    private $store : Store<ApplicationState>;

    constructor(store : Store<ApplicationState>) {
        this.$store = store;
    }


    public async installApplication(applicationId : string, installationPath : string) : InstallationInfo {
        if (this.$store.state.installedApplications.find(x => x.applicationId == applicationId)) {
            throw "Application is already installed";
        }
        let result = await axios.get(process.env.VUE_APP_API_LINK + '/version/' + applicationId);
        let version = result.data;
        //console.log("version", version);

        result = await axios.get(process.env.VUE_APP_API_LINK + '/files/' + version.versionId);
        let files = result.data;
        //console.log("files", files);
        
        let totalCompressedSize = 0;
        for(let file of files){
            totalCompressedSize += file.compressedSize;
        }
        //console.log("totalCompressedSize", totalCompressedSize);

        let totalSize = 0;
        for(let file of files){
            totalSize += file.size;
        }
        //console.log("totalSize", totalSize);


        //console.log("installationPath", installationPath);
        //console.log("fs.existsSync(installationPath)", fs.existsSync(installationPath));
        
        if(!fs.existsSync(installationPath)){
            fs.mkdirSync(installationPath);
        }
        throw "YOU SHALL NOT PASS !";
        for(let file of files){
            let downloadedfile = await axios.get(process.env.VUE_APP_API_LINK + '/files/' + applicationId + '/' + file.fileId);
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