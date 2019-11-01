import ServiceBase from '@/services/ServiceBase';
import { InstallationInfo } from '@/models/InstallationInfo';
import axios from 'axios';
import fs from 'fs';
import {OSType} from '@/models/OSType';
import { VersionInfo } from '@/models/VersionInfo';
import ApplicationLibrary from './ApplicationLibrary';
import { DownloadManager, DownloadManagerSettings, DownloadManagerOnProgressEvent } from './DownloadManager';
import { UpdateAction, UpdateActionCreateFile } from '@/models/UpdateActions';
import { create } from 'domain';

const format = require('string-format');
var async   = require('async');
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

class InstallationManager extends ServiceBase {
    public percentage:number = 0;
    public totalReceived:number = 0;
    public totalReceivedForActualFile:number = 0;
    public total:number = 0;
    public isDownloading:boolean = false;

    public async installApplication(applicationId : string, installationPath : string){
        if (this.store.state.installedApplications.find(x => x.applicationId == applicationId)) {
            throw "Application is already installed";
        }

        this.isDownloading = true;

        try {
            let responsepromise = await axios.get(process.env.VUE_APP_API_LINK + '/update/GetInstallationFiles/' + this.getOperatingSystem() + '/' + applicationId);
            let response = responsepromise.data;
            
            for(let file of response.files){
                this.total += file.compressedSize;
            }
            
            if(!fs.existsSync(installationPath)){
                fs.mkdirSync(installationPath, { recursive: true })
            }
            let installation : InstallationInfo = {
                applicationId: applicationId,
                exeName: "",
                path: installationPath,
                version: response.version,
                versionId: response.versionId
            };
            this.store.commit('addNewApplication', installation);

            for(let file of response.files){
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
                    }
                }
                await this.downloadFile(config).then((result) =>{
                    //console.log("File succesfully downloaded" + installationPath + '/' +file.fileName);
                    this.totalReceived += this.totalReceivedForActualFile;
                    this.totalReceivedForActualFile = 0;
                });
            }
        }
        catch(e) {
            this.notifier.Error(e.message)
            throw e;
        }
        finally {
            this.isDownloading = false;
        }
    }

    public async installApplicationMultiThread(
        applicationId : string,
        installationPath : string,
        onProgress: (progress: DownloadManagerOnProgressEvent) => void) 
        : Promise<DownloadManager> {

        if (this.store.state.installedApplications.find(x => x.applicationId == applicationId)) {
            throw "Application is already installed";
        }
        let lastVersion = await this.getLastVersion(applicationId);

        let installation : InstallationInfo = {
            applicationId: applicationId,
            exeName: "",
            path: installationPath,
            version: lastVersion.version,
            versionId: lastVersion.versionId
        };
        this.store.commit('addNewApplication', installation);

        let url = format("{root}/update?toVersionId={toVersionId}", {
            root: process.env.VUE_APP_API_LINK,
            toVersionId: lastVersion.versionId
        });
        let updateResponse = await axios.get(url);
        let updateActions = updateResponse.data as UpdateAction[];
        
        let downloadManagerSettings : DownloadManagerSettings = {
            applicationId: applicationId,
            concurrentDownloadCount: 2,
            rootPath: installationPath,
            onProgress: onProgress
        }
        let downloadManager = new DownloadManager(downloadManagerSettings)
        for(let action of updateActions) {
            switch(action.actionType) {
                case ActionType.CreateFile:
                    let createAction = action as UpdateActionCreateFile;
                    downloadManager.pushFile(createAction.newFile);
                    break;
            }
        }

        downloadManager.start();
        return downloadManager;
        

        this.isDownloading = true;

        try {
            let responsepromise = await axios.get(process.env.VUE_APP_API_LINK + '/update/GetInstallationFiles/' + this.getOperatingSystem() + '/' + applicationId);
            let response = responsepromise.data;
            
            for(let file of response.files){
                this.total += file.compressedSize;
            }
            
            if(!fs.existsSync(installationPath)){
                fs.mkdirSync(installationPath, { recursive: true })
            }
            let installation : InstallationInfo = {
                applicationId: applicationId,
                exeName: "",
                path: installationPath,
                version: response.version,
                versionId: response.versionId
            };
            this.store.commit('addNewApplication', installation);
            async.eachLimit(response.files, 20, ((file:any,callback:Function)  => {
                var filePath = installationPath;
                if(file.directoryPath !="")
                filePath += file.directoryPath
                if(!fs.existsSync(filePath)){
                    fs.mkdirSync(filePath, { recursive: true });
                }
                
                this.download(process.env.VUE_APP_API_LINK + '/files/' + applicationId + '/' + file.fileId, filePath + '/' + file.fileName, function(){
                    console.log('Finished Downloading' + file.fileName);
                    callback();
                });
            }))
        }
        catch(e) {
            this.notifier.Error(e.message)
            throw e;
        }
        finally {
            this.isDownloading = false;
        }
    }

    public download (url:string, dest:string, callbackFinish:Function){
        request({
            /* Here you should specify the exact link to the file you are trying to download */
            "rejectUnauthorized": false, 
            uri: url
        })
        .on('error', function(err:any) {console.log(err)} )
        .pipe(fs.createWriteStream(dest))
        .on('data', (chunk:Buffer)=>{
            
        })
        .on('close', callbackFinish);
    
    }

    public async checkUpdateAvailable(applicationId : string){
        let installation = this.store.state.installedApplications.find(x => x.applicationId == applicationId);
        if (!installation) {
            throw "Application is not installed";
        }
        let responsepromise = await axios.get(process.env.VUE_APP_API_LINK + '/update/CheckUpdateAvailable/' + this.getOperatingSystem() + '/' + applicationId + '/' + installation.versionId);
        return responsepromise.data;
    }

    public async updateApplication(applicationId : string){
        let installation = this.store.state.installedApplications.find(x => x.applicationId == applicationId);
        if (!installation) {
            throw "Application is not installed";
        }
        this.resetProgressData();
        let responsepromise = await axios.get(process.env.VUE_APP_API_LINK + '/update/GetUpdateFiles/' + this.getOperatingSystem() + '/' + applicationId + '/' + installation.versionId);
        let response = responsepromise.data;
        
        for(let updateAction of response.updateActions){
            switch(+ActionType[updateAction.actionType]) { 
                case ActionType.CreateFile: { 
                    let actionpromise = await axios.get(process.env.VUE_APP_API_LINK + '/update/GetUpdateActionCreate/' + updateAction.actionId);
                    let action = actionpromise.data;
                    let filepromise = await axios.get(process.env.VUE_APP_API_LINK + '/update/GetFile/' + action.fileId);
                    let file = filepromise.data;
                    var filePath = installation.path;
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
                            this.totalReceivedForActualFile = received;
                            this.percentage = (((this.totalReceived + this.totalReceivedForActualFile) * 100) / this.total)
                        }
                    }
                    await this.downloadFile(config).then((result) =>{
                        this.totalReceived += this.totalReceivedForActualFile;
                        this.totalReceivedForActualFile = 0;
                    });
                   //statements; 
                   break; 
                } 
                case ActionType.DeleteFile: { 
                   //statements; 
                   break; 
                } 
                case ActionType.CopyFile: { 
                    //statements; 
                    break; 
                } 
                case ActionType.UpdateFile: { 
                //statements; 
                    break; 
                } 
                default: { 
                   //statements; 
                   throw "Not supported type of update action";
                } 
             } 
        }
    }

    public uninstallApplication(applicationId : string) {
        let installation = this.store.state.installedApplications.find(x => x.applicationId == applicationId);
        if (!installation) {
            throw "Application is not installed";
        }
        
        rimraf.sync(installation.path);
        // TODO: Do real unsintall here!
        this.store.commit('removeApplication', installation);
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

            req.on('response', function (data : any) {
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
        return this.octetConverter(this.totalReceived + this.totalReceivedForActualFile);
    }

    public getPercentage(): number{
        return this.percentage;
    }

    public resetProgressData(){
        this.total = 0;
        this.totalReceived = 0;
        this.percentage = 0;
    }

    private async getLastVersion(applicationId : string) : Promise<VersionInfo> {
        let os = ApplicationLibrary.getOperatingSystem();
        let url = format("{root}/version/last?applicationId={appId}&operatingSystem={os}", {
            root: process.env.VUE_APP_API_LINK,
            appId: applicationId,
            os: os
        });
        
        let version = await axios.get(url);
        return version.data as VersionInfo;
    }
}
export default InstallationManager;