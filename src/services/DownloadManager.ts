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
var progress = require('request-progress');


interface DownloadManagerSettings {
    concurrentDownloadCount : number;
    rootPath : string;
    applicationId : string;

    onError? : Function;
    onFinish? : Function;
    onProgress? : (progress: DownloadManagerOnProgressEvent) => void;
}

interface DownloadManagerOnProgressEvent {
    totalFileCount: number;
    totalFileSize: number;
    downloadedSize: number;
    downloadedCount: number;
}

class DownloadManager extends ServiceBase {
    private settings : DownloadManagerSettings;
    private allFiles : FileInfo[];

    private lastProgressTrigger : number = 0;

    private _intervalId : number = 0;
    private _totalFileSize : number = 0;
    private _downloadedFileSize : number = 0;
    private _totalDownloadedSize : number = 0;
    private _downloadedFileCount : number = 0;
    private _isDownloading : boolean = false;

    constructor(settings : DownloadManagerSettings) {
        super()
        this.settings = settings;
        this.allFiles = [];
    }

    public get totalFileSize() : number {
        return this._totalFileSize;
    }
    public get totalFileCount() : number {
        return this.allFiles.length;
    }
    public get totalDownloadedFileSize() : number {
        return this._totalDownloadedSize;
    }
    public get downloadedFileCount() : number {
        return this._downloadedFileCount;
    }
    public get downloadedSize() : number {
        return this._downloadedFileSize;
    }
    public get isDownloading() : boolean {
        return this._isDownloading;
    }
    

    async pushFile(fileInfo : FileInfo) {
        this.allFiles.push(fileInfo);
        this._totalFileSize += fileInfo.compressedSize;
    }

    public start() {
        this.logger.info("Starting download!")
        if (this.settings.onProgress) {
            this._intervalId = setInterval(this.doProgressUpdate, 250, this);
        }
        this._isDownloading = true;
        this.download().then(() => {
            clearInterval(this._intervalId);
            this.doProgressUpdate(this);
            this.logger.info("Download ended!")
            this._isDownloading = false;
        })
    }
    public pause() {

    }
    public stop() {

    }

    private doProgressUpdate($this : DownloadManager) {
        $this.logger.info("Download progress interval!")
        if ($this._isDownloading) {
            if ($this.settings.onProgress) {
                let progress : DownloadManagerOnProgressEvent = {
                    downloadedSize: $this.downloadedSize + $this.totalDownloadedFileSize,
                    downloadedCount: $this.downloadedFileCount,
                    totalFileSize: $this.totalFileSize,
                    totalFileCount: $this.totalFileCount,
                };
                $this.settings.onProgress(progress);
            }
        }
    }


    private async download() {
        for(let i in this.allFiles) {
            let file = this.allFiles[i];
            
            await this.downloadFile(file);
        }
    }

    private downloadFile(file : FileInfo) {
        let url = process.env.VUE_APP_API_LINK + '/files/' + this.settings.applicationId + '/' + file.fileId
        let directoryPath = path.join(this.settings.rootPath, file.directoryPath);
        let filePath = path.join(directoryPath, file.fileName);

        if(!fs.existsSync(directoryPath)){
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        let $this = this;

        return new Promise(function(resolve, reject) {
            progress(request({
                "rejectUnauthorized": false, 
                uri: url
            }), {
                throttle: 250
            })
            .on('progress', (state:any) => {
                $this._downloadedFileSize = state.size.transferred;
            })
            .on('error', (err:any) => {
                reject(err);
            })
            .on('close', () => {
                $this._downloadedFileCount++;
                $this._totalDownloadedSize += $this._downloadedFileSize;
                $this._downloadedFileSize = 0;

                resolve();
            })
            .pipe(fs.createWriteStream(filePath))
        });
    }
}

export {
    DownloadManager,
    DownloadManagerSettings,
    DownloadManagerOnProgressEvent
}