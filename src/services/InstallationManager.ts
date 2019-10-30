import { Store } from 'vuex';
import ApplicationState from '@/store/ApplicationState';
import { InstallationInfo } from '@/models/InstallationInfo';
import axios from 'axios';
import fs from 'fs';
var request = require('request');

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
            fs.mkdirSync(installationPath, { recursive: true })
        }
        for(let file of files){
            var filePath = installationPath;
            if(file.directoryPath !="")
                filePath += file.directoryPath
            if(!fs.existsSync(filePath)){
                fs.mkdirSync(filePath, { recursive: true });
            }
            await this.downloadFile({
                remoteFile: process.env.VUE_APP_API_LINK + '/files/' + applicationId + '/' + file.fileId,
                localFile: filePath + '/' + file.fileName,
                onProgress: function (received,total){
                    var percentage = (received * 100) / total;
                    console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
                }
            }).then(function(){
                console.log("File succesfully downloaded" + installationPath + '/' +file.fileName);
            });
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

    /**
     * Promise based download file method
     */
    public downloadFile(configuration){
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

            req.on('response', function ( data ) {
                // Change the total bytes value to get progress later.
                total_bytes = parseInt(data.headers['content-length' ]);
            });

            // Get progress if callback exists
            if(configuration.hasOwnProperty("onProgress")){
                req.on('data', function(chunk) {
                    // Update the received bytes
                    received_bytes += chunk.length;

                    configuration.onProgress(received_bytes, total_bytes);
                });
            }else{
                req.on('data', function(chunk) {
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