import { ipcRenderer } from 'electron'
import { InstallationInfo } from '@/models/InstallationInfo';
import axios from 'axios';
import fs from 'fs';
import { VersionInfo } from '@/models/VersionInfo';
import ApplicationLibrary from './ApplicationLibrary';
import { DownloadManagerSettings, DownloadManagerOnProgressEvent, DownloadManagerOnStopEvent } from './DownloadManager';
import { UpdateAction, UpdateActionCreateFile, UpdateActionUpdateFile, UpdateActionDeleteFile, UpdateActionCopyFile } from '@/models/UpdateActions';
import RendererServiceBase from './RendererServiceBase';
import DiffInfo from '@/models/DiffInfo';
import FileInfo from '@/models/FileInfo';
import path from 'path';
import { ApplicationInfo } from '@/models/ApplicationInfo';
const bspatch = require('bspatch');
const format = require('string-format');
const CryptoJS = require('crypto-js');

enum ActionType {
    CreateFile = 0,
    DeleteFile = 1,
    UpdateFile = 2,
    CopyFile = 3
}

class InstallationManager extends RendererServiceBase {
    public isDownloading:boolean = false;

    public onProgress!: (progress: DownloadManagerOnProgressEvent) => void;

    constructor() {
        super();
        this.registerIpcMainDeleteDirectoryCallback();
        this.registerIpcMainDownloadUpdate();
    }

    public getInstallationInfo(applicationId: string) : InstallationInfo | undefined {
        return this.store.state.installedApplications.find(x => x.applicationId == applicationId);
    }

    private registerIpcMainDeleteDirectoryCallback() {
        ipcRenderer.on('delete-directory-finished', (event: any, err: any) => {
            if (err) {
                this.logger.error(err);
            }
        });
    }

    private registerIpcMainDownloadUpdate() {
        ipcRenderer.on('download-progress', (event: any, progress: DownloadManagerOnProgressEvent) => {
            this.logger.info("Application is downloading");
            this.onProgress(progress);
        });
        ipcRenderer.on('download-stop', (event: any, progress: DownloadManagerOnStopEvent) => {
            this.logger.info("Application is downloaded");
            this.onProgress(progress);
            this.applyActions(progress);
            
        });
    }

    private async applyActions(downloadManagerEvent:DownloadManagerOnStopEvent){
        const {fileInfos, diffInfos} = this.getDiffInfo(downloadManagerEvent.allFiles);
        let lastVersion = await this.getLastVersion(downloadManagerEvent.executionSettings.applicationId);
        let installation = this.store.state.installedApplications.find((x: InstallationInfo) => x.applicationId == downloadManagerEvent.executionSettings.applicationId);
        if(!installation) {
            throw "Application is not installed";
        }
        let url = format("{root}/update?fromVersionId={fromVersionId}&toVersionId={toVersionId}", {
            root: process.env.VUE_APP_API_LINK,
            fromVersionId: installation.versionId,
            toVersionId: lastVersion.versionId
        });
        let updateResponse = await axios.get(url);
        let updateActions = updateResponse.data as UpdateAction[];
        for(let action of updateActions) {
            switch(action.actionType) {
                case ActionType.CreateFile:
                    //Normally all work is already done !
                    break;
                case ActionType.UpdateFile:
                    var updateAction = action as UpdateActionUpdateFile;
                    var downloadedDiffInfo = this.findByDiffId(diffInfos, updateAction.diffId);
                    if (downloadedDiffInfo){
                        var updateDirectoryPath = path.join(downloadManagerEvent.executionSettings.rootPath, updateAction.newFile.directoryPath);
                        var updateFilePath = path.join(updateDirectoryPath, updateAction.newFile.fileName);
                        var diffPath = path.join(downloadManagerEvent.executionSettings.diffPath, downloadedDiffInfo.diffId);
                        bspatch.patchSync(updateFilePath, updateFilePath, diffPath); // Sync
                        this.logger.info('File : ' + updateFilePath + ' patched!');
                    }
                    break;
                case ActionType.DeleteFile:
                    var deleteAction = action as UpdateActionDeleteFile;
                    var deleteDirectoryPath = path.join(downloadManagerEvent.executionSettings.rootPath, deleteAction.file.directoryPath);
                    var deleteFilePath = path.join(deleteDirectoryPath, deleteAction.file.fileName);
                    // TODO: Fix here. Should await
                    fs.unlink(deleteFilePath,function (err) {
                        if (err) throw err;
                        //console.log('File : ' + deleteFilePath + ' deleted!');
                    });
                    break;
                case ActionType.CopyFile:
                    var copyAction = action as UpdateActionCopyFile;
                    var sourceFilePath = path.join(path.join(downloadManagerEvent.executionSettings.rootPath, copyAction.sourceFile.directoryPath), copyAction.sourceFile.fileName);
                    var destinationFilePath = path.join(path.join(downloadManagerEvent.executionSettings.rootPath, copyAction.destinationFile.directoryPath), copyAction.destinationFile.fileName);
                    // TODO: Fix here. Should await
                    fs.copyFile(sourceFilePath, destinationFilePath, function (err) {
                        if (err) throw err;
                        //console.log('File : ' + sourceFilePath + ' copyed to : ' + destinationFilePath + '!');
                    });
                    break;
            }
        }
        this.store.commit('changeApplicationVersion', {applicationId : installation.applicationId, versionId: lastVersion.versionId}); 
    }
    private findByDiffId(array:DiffInfo[], diffId:string){
        return array.find(x => x.diffId == diffId);
    }
    private findByFileId(array:FileInfo[], fileId:string){
        return array.find(x => x.fileId == fileId);
    }

    private getDiffInfo(files:(FileInfo|DiffInfo)[]){
        var fileInfos:FileInfo[] = [];
        var diffInfos:DiffInfo[] = [];
        for(var file of files){
            switch(file.type){
                case 'DiffInfo':
                        diffInfos.push(file);
                    break;
                case 'FileInfo':
                        fileInfos.push(file);
                    break;
            }
        }
        return{
            fileInfos: fileInfos,
            diffInfos: diffInfos
        }
    }



    public async installApplicationMultiThread(
        applicationId : string,
        installationPath : string,
        onProgress: (progress: DownloadManagerOnProgressEvent) => void) {

        this.onProgress = onProgress;

        this.logger.info("Application installation started!")

        if (this.store.state.installedApplications.find((x: InstallationInfo) => x.applicationId == applicationId)) {
            throw "Application is already installed";
        }
        let lastVersion = await this.getLastVersion(applicationId);

        this.logger.info("Last version fetched!", lastVersion);


        let installation : InstallationInfo = {
            applicationId: applicationId,
            exeName: "",
            path: installationPath,
            version: lastVersion.version,
            versionId: lastVersion.versionId
        };
        this.store.commit('addNewApplication', installation);

        this.logger.info("Application is added to store as installation!", installation);

        let url = format("{root}/update?toVersionId={toVersionId}", {
            root: process.env.VUE_APP_API_LINK,
            toVersionId: lastVersion.versionId
        });
        let updateResponse = await axios.get(url);
        let updateActions = updateResponse.data as UpdateAction[];

        this.logger.info("Update actions are fetched: " + updateActions.length);
        
        let downloadManagerSettings : DownloadManagerSettings = {
            applicationId: applicationId,
            concurrentDownloadCount: 2,
            rootPath: installationPath,
            diffPath: installationPath + "/diff_temp"
        }

        let allFiles: (FileInfo | DiffInfo)[] = [];
        for(let action of updateActions) {
            switch(action.actionType) {
                case ActionType.CreateFile:
                    var createAction = action as UpdateActionCreateFile;
                    allFiles.push(createAction.newFile);
                    break;
                case ActionType.UpdateFile:
                    var updateAction = action as UpdateActionUpdateFile;
                    var diff :DiffInfo = {
                        type: "DiffInfo",
                        diffId: updateAction.diffId,
                        diffSize: updateAction.diffSize
                    }
                    allFiles.push(diff);
                    break;
            }
        }

        ipcRenderer.send('start-download', { files: allFiles, settings: downloadManagerSettings });
    }

    public getFileHash(path:string){
        fs.readFile(path, 'utf8', (err:any, data:string) => {
            if (err) throw err;
            return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
        });
    }

    public async checkUpdateAvailable(applicationId : string){
        let installation = this.store.state.installedApplications.find((x: InstallationInfo) => x.applicationId == applicationId);
        if (!installation) {
            throw "Application is not installed";
        }
        let responsepromise = await axios.get(process.env.VUE_APP_API_LINK + '/update/CheckUpdateAvailable/' + ApplicationLibrary.getOperatingSystem() + '/' + applicationId + '/' + installation.versionId);
        return responsepromise.data;
    }

    public uninstallApplication(applicationId : string) {
        let installation = this.store.state.installedApplications.find((x: InstallationInfo) => x.applicationId == applicationId);
        if (!installation) {
            throw "Application is not installed";
        }

        ipcRenderer.send('delete-directory', installation.path);

        this.store.commit('removeApplication', installation);
    }

    public async updateApplication(
        applicationId : string,
        onProgress: (progress: DownloadManagerOnProgressEvent) => void) {

        this.onProgress = onProgress;

        this.logger.info("Application update started!")

        var installation = this.store.state.installedApplications.find((x: InstallationInfo) => x.applicationId == applicationId);
        if(!installation) {
            throw "Application is not installed";
        }
        let lastVersion = await this.getLastVersion(applicationId);

        this.logger.info("Last version fetched!", lastVersion);

        let url = format("{root}/update?fromVersionId={fromVersionId}&toVersionId={toVersionId}", {
            root: process.env.VUE_APP_API_LINK,
            fromVersionId: installation.versionId,
            toVersionId: lastVersion.versionId
        });
        let updateResponse = await axios.get(url);
        let updateActions = updateResponse.data as UpdateAction[];

        this.logger.info("Update actions are fetched: " + updateActions.length);
        
        let downloadManagerSettings : DownloadManagerSettings = {
            applicationId: applicationId,
            concurrentDownloadCount: 2,
            rootPath: installation.path,
            diffPath: installation.path + "/diff_temp"
        }

        let allFiles: (FileInfo | DiffInfo)[] = [];
        for(let action of updateActions) {
            switch(action.actionType) {
                case ActionType.CreateFile:
                    var createAction = action as UpdateActionCreateFile;
                    allFiles.push(createAction.newFile);
                    break;
                case ActionType.UpdateFile:
                    var updateAction = action as UpdateActionUpdateFile;
                    var diff :DiffInfo = {
                        type: "DiffInfo",
                        diffId: updateAction.diffId,
                        diffSize: updateAction.diffSize
                    }
                    allFiles.push(diff);
                    break;
            }
        }

        ipcRenderer.send('start-download', { files: allFiles, settings: downloadManagerSettings });

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