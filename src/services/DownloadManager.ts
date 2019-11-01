import ServiceBase from '@/services/ServiceBase';
import FileInfo from '@/models/FileInfo';
import {
    ActionType,
    UpdateAction,
    UpdateActionCopyFile,
    UpdateActionCreateFile,
    UpdateActionDeleteFile,
    UpdateActionUpdateFile
} from '@/models/UpdateActions';

import path from 'path';
import fs from 'fs';
import request from 'request'
import { settings } from 'cluster';

interface DownloadManagerSettings {
    concurrentDownloadCount : number;
    rootPath : string;
    applicationId : string;

    onError : Function;
    onFinish : Function;
    onProgress : Function;
}

class DownloadManager extends ServiceBase {
    private settings : DownloadManagerSettings;
    private allFiles : FileInfo[];

    private _totalFileSize : number = 0;
    private _isFinished : boolean = false;

    constructor(settings : DownloadManagerSettings) {
        super()
        this.settings = settings;
        this.allFiles = [];
    }

    public get totalFileSize() : number {
        return 0;
    }
    public get downloadedSize() : number {
        return 0;
    }
    public get isFinished() : boolean {
        return false;
    }
    

    async pushFile(fileInfo : FileInfo) {
        this.allFiles.push(fileInfo);
        this._totalFileSize += fileInfo.compressedSize;
    }

    public start() {
        this._isFinished = false;
        this.download().then(() => {
            this._isFinished = true;
        })
    }
    public pause() {

    }
    public stop() {

    }


    private async download() {
        for(let i in this.allFiles) {
            let file = this.allFiles[i];
            
            await this.downloadFile(file);
        }
    }

    private downloadFile(file : FileInfo) {
        let url = process.env.VUE_APP_API_LINK + '/files/' + this.settings.applicationId + '/' + file.fileId
        let filePath = path.join(this.settings.rootPath, file.directoryPath, file.fileName);

        return new Promise(function(resolve, reject) {
            request({
                "rejectUnauthorized": false, 
                uri: url
            })
            .pipe(fs.createWriteStream(filePath))
            .on('data', (chunk : Buffer)=>{
                
            })
            .on('error', function(err) {
                reject(err);
            })
            .on('close', () => {
                resolve();
            });
        });
    }
}

export {
    DownloadManager,
    DownloadManagerSettings
}