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
enum ActionType {
    CreateFile = 0,
    DeleteFile = 1,
    UpdateFile = 2,
    CopyFile = 3
}

class InstallationManager {
    private $store : Store<ApplicationState>;

    constructor(store : Store<ApplicationState>) {
        this.$store = store;
    }
    public percentage:number = 0;
    public totalReceived:number = 0;
    public totalReceivedForActualFile:number = 0;
    public total:number = 0;
    public isDownloading:boolean = false;

    public async installApplication(applicationId : string, installationPath : string){
        if (this.$store.state.installedApplications.find(x => x.applicationId == applicationId)) {
            throw "Application is already installed";
        }
        this.isDownloading = true;
        let result = await axios.get(process.env.VUE_APP_API_LINK + '/version/' + applicationId);
        let newVersion = result.data;

        result = await axios.get(process.env.VUE_APP_API_LINK + '/files/' + newVersion.versionId);
        let files = result.data;
        /*
        result = await axios.get(process.env.VUE_APP_API_LINK + '/version/' + null + '/' + newVersion.versionId);
        let updateActions = result.data;
        console.log(updateActions);
        */
        for(let file of files){
            this.total += file.compressedSize;
        }
        
        if(!fs.existsSync(installationPath)){
            fs.mkdirSync(installationPath, { recursive: true })
        }
        let installation : InstallationInfo = {
            applicationId: applicationId,
            exeName: "",
            path: installationPath,
            version: newVersion.version
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
                onProgress: (received:number,total:number) =>{
                    var percentage = (received * 100) / total;
                    //console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
                    this.totalReceivedForActualFile = received;
                    this.percentage = (((this.totalReceived + this.totalReceivedForActualFile) * 100) / this.total)
                    console.log(this.percentage);
                }
            }
            await this.downloadFile(config).then((result) =>{
                //console.log("File succesfully downloaded" + installationPath + '/' +file.fileName);
                this.totalReceived += this.totalReceivedForActualFile;
                this.totalReceivedForActualFile = 0;
            });
        }
        this.isDownloading = false;
    }

    public async checkUpdateAvailable(applicationId : string){
        let installation = this.$store.state.installedApplications.find(x => x.applicationId == applicationId);
        if (!installation) {
            throw "Application is not installed";
        }
    }

    public async updateApplication(applicationId : string){
        let installation = this.$store.state.installedApplications.find(x => x.applicationId == applicationId);
        if (!installation) {
            throw "Application is not installed";
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

    public octetConverter(size:number){
        size = Math.abs(size);
        var sizeOfSuffixe = [1, 1024, 1024*1024, 1024*1024*1024, 1024*1024*1024*1024];
        var suffixe = ['octets', 'Ko', 'Mo', 'Go', 'To'];
        for(var i=0; i<suffixe.length; i++){
            if(size<sizeOfSuffixe[i]) 
            return {
                size:(size/sizeOfSuffixe[i-1]).toFixed(2),
                suffixe: suffixe[i-1]
            }
        }
    }

    public getTotal(){
        return this.octetConverter(this.total);
    }

    public getTotalReceived(){
        return this.octetConverter(this.totalReceived);
    }

    public getPercentage(): number{
        return this.percentage;
    }
}
export default InstallationManager;