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

    private _totalFileSize : number = 0;
    private _downloadedFileSize : number = 0;
    private _downloadedFileCount : number = 0;
    private _isFinished : boolean = false;

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
    public get downloadedFileCount() : number {
        return this._downloadedFileCount;
    }
    public get downloadedSize() : number {
        return this._downloadedFileSize;
    }
    public get isFinished() : boolean {
        return this._isFinished;
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
        let directoryPath = path.join(this.settings.rootPath, file.directoryPath);
        let filePath = path.join(directoryPath, file.fileName);

        if(!fs.existsSync(directoryPath)){
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        let $this = this;

        return new Promise(function(resolve, reject) {
            request({
                "rejectUnauthorized": false, 
                uri: url
            })
            .on('data', (chunk : Buffer) => {
                $this._downloadedFileSize += chunk.length;
                if ($this.settings.onProgress) {
                    if (Date.now() - $this.lastProgressTrigger > 250) {
                        $this.lastProgressTrigger = Date.now();
                        let progress : DownloadManagerOnProgressEvent = {
                            downloadedSize: $this.downloadedSize,
                            downloadedCount: $this.downloadedFileCount,
                            totalFileSize: $this.totalFileSize,
                            totalFileCount: $this.totalFileCount
                        };
                        $this.settings.onProgress(progress);
                    }
                }
            })
            .on('error', function(err) {
                reject(err);
            })
            .on('close', () => {
                $this._downloadedFileCount++;
                if ($this.settings.onProgress) {
                    let progress : DownloadManagerOnProgressEvent = {
                        downloadedSize: $this.downloadedSize,
                        downloadedCount: $this.downloadedFileCount,
                        totalFileSize: $this.totalFileSize,
                        totalFileCount: $this.totalFileCount
                    };
                    $this.settings.onProgress(progress);
                }
                resolve();
            })
            .pipe(fs.createWriteStream(filePath));
        });
    }
}

export {
    DownloadManager,
    DownloadManagerSettings,
    DownloadManagerOnProgressEvent
}