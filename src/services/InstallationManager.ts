import { ipcRenderer } from 'electron'
import { InstallationInfo } from '@/models/InstallationInfo';
import axios from 'axios';
import fs from 'fs';
import {OSType} from '@/models/OSType';
import { VersionInfo } from '@/models/VersionInfo';
import ApplicationLibrary from './ApplicationLibrary';
import { DownloadManagerSettings, DownloadManagerOnProgressEvent } from './DownloadManager';
import { UpdateAction, UpdateActionCreateFile } from '@/models/UpdateActions';
import { create } from 'domain';
import RendererServiceBase from './RendererServiceBase';

const format = require('string-format');
var async   = require('async');
var request = require('request');

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

    private registerIpcMainDeleteDirectoryCallback() {
        ipcRenderer.on('delete-directory-finished', (event: any, err: any) => {
            if (err) {
                this.logger.error(err);
            }
        });
    }

    private registerIpcMainDownloadUpdate() {
        ipcRenderer.on('download-progress', (event: any, progress: DownloadManagerOnProgressEvent) => {
            this.onProgress(progress);
        });
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

        for(let action of updateActions) {
            switch(action.actionType) {
                case ActionType.CreateFile:
                    let createAction = action as UpdateActionCreateFile;
                    ipcRenderer.send('push-download-file', createAction.newFile);
                    break;
                case ActionType.UpdateFile:
                    // TODO: FINISH TIS YOU LITTLE PIECE OF SHIT
                    break;
            }
        }

        ipcRenderer.send('start-download', downloadManagerSettings);
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