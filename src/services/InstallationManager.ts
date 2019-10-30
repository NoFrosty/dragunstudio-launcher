import { Store } from 'vuex';
import ApplicationState from '@/store/ApplicationState';
import { InstallationInfo } from '@/models/InstallationInfo';
import axios from 'axios';
import fs from 'fs';
var rimraf = require("rimraf");
var request = require('request');

type DownloadData = {
    remoteFile:string,
    localFile:string,
    onProgress:(received: number, total: number) => void,
}

class InstallationManager {
    private $store : Store<ApplicationState>;

    constructor(store : Store<ApplicationState>) {
        this.$store = store;
    }
    
    public async installApplication(applicationId : string, installationPath : string){
        if (this.$store.state.installedApplications.find(x => x.applicationId == applicationId)) {
            throw "Application is already installed";
        }
        let result = await axios.get(process.env.VUE_APP_API_LINK + '/version/' + applicationId);
        let version = result.data;

        result = await axios.get(process.env.VUE_APP_API_LINK + '/files/' + version.versionId);
        let files = result.data;
        
        let totalCompressedSize = 0;
        for(let file of files){
            totalCompressedSize += file.compressedSize;
        }

        let totalSize = 0;
        for(let file of files){
            totalSize += file.size;
        }
        
        if(!fs.existsSync(installationPath)){
            fs.mkdirSync(installationPath, { recursive: true })
        }
        let installation : InstallationInfo = {
            applicationId: applicationId,
            exeName: "",
            path: installationPath
        };
        this.$store.commit('addNewApplication', installation);

        for(let file of files){
            var filePath = installationPath;
            if(file.directoryPath !="")
                filePath += file.directoryPath
            if(!fs.existsSync(filePath)){
                fs.mkdirSync(filePath, { recursive: true });
            }
            let config:DownloadData = {
                localFile: filePath + '/' + file.fileName,
                remoteFile: process.env.VUE_APP_API_LINK + '/files/' + applicationId + '/' + file.fileId,
                onProgress: function (received:number,total:number){
                    var percentage = (received * 100) / total;
                    console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
                }
            }
            await this.downloadFile(config).then(function(){
                console.log("File succesfully downloaded" + installationPath + '/' +file.fileName);
            });
        }
    }

    public uninstallApplication(applicationId : string) {
        let installation = this.$store.state.installedApplications.find(x => x.applicationId == applicationId);
        if (!installation) {
            throw "Application is not installed";
        }
        
        rimraf.sync(installation.path);
        // TODO: Do real unsintall here!
        this.$store.commit('removeApplication', installation);
    }

    /**
     * Promise based download file method
     */
    public downloadFile(configuration:DownloadData){
        return new Promise(function(resolve, reject){
            // Save variable to know progress
            var received_bytes = 0;
            var total_bytes = 0;

            var req = request({
                method: 'GET',
                "rejectUnauthorized": false, 
                uri: configuration.remoteFile
            });

            var out = fs.createWriteStream(configuration.localFile);
            req.pipe(out);

            req.on('response', function (data) {
                // Change the total bytes value to get progress later.
                total_bytes = parseInt(data.headers['content-length' ]);
            });

            // Get progress if callback exists
            if(configuration.hasOwnProperty("onProgress")){
                req.on('data', function(chunk:Buffer) {
                    // Update the received bytes
                    received_bytes += chunk.length;

                    configuration.onProgress(received_bytes, total_bytes);
                });
            }else{
                req.on('data', function(chunk:Buffer) {
                    // Update the received bytes
                    received_bytes += chunk.length;
                });
            }

            req.on('end', function() {
                resolve();
            });
        });
    }
}
export default InstallationManager;