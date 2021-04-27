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

const bsdiff = require('bsdiff-node');
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
        const lastVersion = await this.getLastVersion(downloadManagerEvent.executionSettings.applicationId);
        const installation = this.store.state.installedApplications.find((x: InstallationInfo) => x.applicationId == downloadManagerEvent.executionSettings.applicationId);
        if(!installation) {
            throw "Application is not installed";
        }
        let url;
        if(lastVersion.versionId == installation.versionId){
            url = format("{root}/update?toVersionId={toVersionId}", {
                root: process.env.VUE_APP_API_LINK,
                toVersionId: lastVersion.versionId
            });
        }
        else{
            url = format("{root}/update?fromVersionId={fromVersionId}&toVersionId={toVersionId}", {
                root: process.env.VUE_APP_API_LINK,
                fromVersionId: installation.versionId,
                toVersionId: lastVersion.versionId
            });
        }
        const updateResponse = await axios.get(url);
        const updateActions = updateResponse.data as UpdateAction[];
        for(const action of updateActions) {
            switch(action.actionType) {
                case ActionType.CreateFile:
                    //Normally all work is already done !
                    break;
                case ActionType.UpdateFile: {
                    const updateAction : UpdateActionUpdateFile = action as UpdateActionUpdateFile;
                    const downloadedDiffInfo :DiffInfo|undefined = this.findByDiffId(diffInfos, updateAction.diffId);
                    if (downloadedDiffInfo){
                        const updateDirectoryPath : string = path.join(downloadManagerEvent.executionSettings.rootPath, updateAction.newFile.directoryPath);
                        const updateFilePath : string = path.join(updateDirectoryPath, updateAction.newFile.fileName);
                        const diffPath : string = path.join(downloadManagerEvent.executionSettings.diffPath, downloadedDiffInfo.diffId);
                        bsdiff.patchSync(updateFilePath, updateFilePath, diffPath); // Sync
                        this.logger.info('File : ' + updateFilePath + ' patched!');
                    }
                    break;
                }
                case ActionType.DeleteFile: {
                    const deleteAction : UpdateActionDeleteFile = action as UpdateActionDeleteFile;
                    const deleteDirectoryPath : string = path.join(downloadManagerEvent.executionSettings.rootPath, deleteAction.file.directoryPath);
                    const deleteFilePath : string = path.join(deleteDirectoryPath, deleteAction.file.fileName);
                    // TODO: Fix here. Should await
                    fs.unlink(deleteFilePath,function (err) {
                        if (err) throw err;
                        //console.log('File : ' + deleteFilePath + ' deleted!');
                    });
                    break;
                }
                case ActionType.CopyFile: {
                    const copyAction : UpdateActionCopyFile = action as UpdateActionCopyFile;
                    const sourceFilePath : string = path.join(path.join(downloadManagerEvent.executionSettings.rootPath, copyAction.sourceFile.directoryPath), copyAction.sourceFile.fileName);
                    const destinationFilePath : string = path.join(path.join(downloadManagerEvent.executionSettings.rootPath, copyAction.destinationFile.directoryPath), copyAction.destinationFile.fileName);
                    // TODO: Fix here. Should await
                    fs.copyFile(sourceFilePath, destinationFilePath, function (err) {
                        if (err) throw err;
                        //console.log('File : ' + sourceFilePath + ' copyed to : ' + destinationFilePath + '!');
                    });
                    break;
                }
            }
        }
        this.store.commit('changeApplicationVersion', {applicationId : installation.applicationId, versionId: lastVersion.versionId, version: lastVersion.version}); 
    }
    private findByDiffId(array:DiffInfo[], diffId:string){
        return array.find(x => x.diffId == diffId);
    }
    private findByFileId(array:FileInfo[], fileId:string){
        return array.find(x => x.fileId == fileId);
    }

    private getDiffInfo(files:(FileInfo|DiffInfo)[]){
        const fileInfos:FileInfo[] = [];
        const diffInfos:DiffInfo[] = [];
        for(const file of files){
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
        const lastVersion = await this.getLastVersion(applicationId);

        this.logger.info("Last version fetched!", lastVersion);


        const installation : InstallationInfo = {
            applicationId: applicationId,
            exeName: "",
            path: installationPath,
            version: lastVersion.version,
            versionId: lastVersion.versionId
        };
        this.store.commit('addNewApplication', installation);

        this.logger.info("Application is added to store as installation!", installation);

        const url = format("{root}/update?toVersionId={toVersionId}", {
            root: process.env.VUE_APP_API_LINK,
            toVersionId: lastVersion.versionId
        });
        const updateResponse = await axios.get(url);
        const updateActions = updateResponse.data as UpdateAction[];

        this.logger.info("Update actions are fetched: " + updateActions.length);
        
        const downloadManagerSettings : DownloadManagerSettings = {
            applicationId: applicationId,
            concurrentDownloadCount: 2,
            rootPath: installationPath,
            diffPath: installationPath + "/diff_temp"
        }

        const allFiles: (FileInfo | DiffInfo)[] = [];
        for(const action of updateActions) {
            switch(action.actionType) {
                case ActionType.CreateFile: {
                    const createAction = action as UpdateActionCreateFile;
                    allFiles.push(createAction.newFile);
                    break;
                }
                case ActionType.UpdateFile:{
                    const updateAction = action as UpdateActionUpdateFile;
                    const diff :DiffInfo = {
                        type: "DiffInfo",
                        diffId: updateAction.diffId,
                        diffSize: updateAction.diffSize
                    }
                    allFiles.push(diff);
                    break;
                }
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
        const installation = this.store.state.installedApplications.find((x: InstallationInfo) => x.applicationId == applicationId);
        if (!installation) {
            throw "Application is not installed";
        }
        const responsepromise = await axios.get(process.env.VUE_APP_API_LINK + '/update/CheckUpdateAvailable/' + ApplicationLibrary.getOperatingSystem() + '/' + applicationId + '/' + installation.versionId);
        return responsepromise.data;
    }

    public uninstallApplication(applicationId : string) {
        const installation = this.store.state.installedApplications.find((x: InstallationInfo) => x.applicationId == applicationId);
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

        const installation = this.store.state.installedApplications.find((x: InstallationInfo) => x.applicationId == applicationId);
        if(!installation) {
            throw "Application is not installed";
        }
        const lastVersion = await this.getLastVersion(applicationId);

        this.logger.info("Last version fetched!", lastVersion);

        const url = format("{root}/update?fromVersionId={fromVersionId}&toVersionId={toVersionId}", {
            root: process.env.VUE_APP_API_LINK,
            fromVersionId: installation.versionId,
            toVersionId: lastVersion.versionId
        });
        const updateResponse = await axios.get(url);
        const updateActions = updateResponse.data as UpdateAction[];
        this.logger.info(updateActions);

        this.logger.info("Update actions are fetched: " + updateActions.length);
        
        const downloadManagerSettings : DownloadManagerSettings = {
            applicationId: applicationId,
            concurrentDownloadCount: 2,
            rootPath: installation.path,
            diffPath: installation.path + "/diff_temp"
        }

        const allFiles: (FileInfo | DiffInfo)[] = [];
        for(const action of updateActions) {
            switch(action.actionType) {
                case ActionType.CreateFile: {
                    const createAction = action as UpdateActionCreateFile;
                    allFiles.push(createAction.newFile);
                    break;
                }
                case ActionType.UpdateFile: {
                    const updateAction = action as UpdateActionUpdateFile;
                    const diff :DiffInfo = {
                        type: "DiffInfo",
                        diffId: updateAction.diffId,
                        diffSize: updateAction.diffSize
                    }
                    allFiles.push(diff);
                    break;
                }
            }
        }

        ipcRenderer.send('start-download', { files: allFiles, settings: downloadManagerSettings });

    }

    private async getLastVersion(applicationId : string) : Promise<VersionInfo> {
        const os = ApplicationLibrary.getOperatingSystem();
        const url = format("{root}/version/last?applicationId={appId}&operatingSystem={os}", {
            root: process.env.VUE_APP_API_LINK,
            appId: applicationId,
            os: os
        });
        
        const version = await axios.get(url);
        return version.data as VersionInfo;
    }
}
export default InstallationManager;