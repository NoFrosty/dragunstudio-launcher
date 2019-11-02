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
import fs, { realpath } from 'fs';
import { rejects } from 'assert';
const https = require('https')
https.globalAgent.options.rejectUnauthorized = false;
const util = require('util');
const stream = require('stream');
var streams = require('memory-streams');

const request = require('request')
var progress = require('request-progress');

const electron = require("electron");


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
    private allFiles : FileInfo[];

    private lastProgressTrigger : number = 0;

    private settings? : DownloadManagerSettings;
    private _intervalId : number = 0;
    private _totalFileSize : number = 0;
    private _downloadedFileSize : number = 0;
    private _totalDownloadedSize : number = 0;
    private _downloadedFileCount : number = 0;
    private _isDownloading : boolean = false;

    constructor() {
        super()
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

    public start(settings : DownloadManagerSettings) {
        this.settings = settings;
        this.logger.debug("Starting download!")
        if (this.settings.onProgress) {
            //this._intervalId = setInterval(this.doProgressUpdate, 250, this);
        }
        this._isDownloading = true;
        setTimeout(this.download, 1, this);
        /*
        this.download().then(() => {
            clearInterval(this._intervalId);
            this.doProgressUpdate(this);
            this.logger.debug("Download ended!")
            this._isDownloading = false;
        })*/
    }
    public pause() {

    }
    public stop() {

    }

    private doProgressUpdate($this : DownloadManager) {
        $this.logger.debug("Download progress interval!")
        if ($this._isDownloading && $this.settings) {
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


    private async download(self : DownloadManager) {
        try {
            for(let i in self.allFiles) {
                let file = self.allFiles[i];
                await self.downloadFile(file);
            }
        }
        catch(e) {
            self.logger.error(e);
            console.error(e)
        }
    }



    private downloadFile(file : FileInfo) {
        this.logger.debug("New file to download!", file)

        if (this.settings) {

            let url = process.env.VUE_APP_API_LINK + '/files/' + this.settings.applicationId + '/' + file.fileId
            let directoryPath = path.join(this.settings.rootPath, file.directoryPath);
            let filePath = path.join(directoryPath, file.fileName);

            if(!fs.existsSync(directoryPath)){
                fs.mkdirSync(directoryPath, { recursive: true });
            }

            let $this = this;
            this.logger.debug("Requesting new file download")

        //return new Promise( (resolve, reject) => {
            //progress(
                //request(url)
                let s = fs.createReadStream("D:\\Projects\\Evopeons\\Temp\\f455f96e-73db-4c1b-83b0-e2e592ee1748\\Packages\\3275efa3-e245-4e56-9af4-8fa5898c3207\\" + file.directoryPath + "\\" + file.fileName)
                s.on("error", function(err) { console.error(err); /*reject(err);*/ })
            //)
            //.on('progress', (state:any) => { console.log(state) })
            .on('data', (chunk : Buffer) => { this._downloadedFileSize += chunk.length; console.log(this._downloadedFileSize) })
            //.pipe(fs.createWriteStream(filePath, { autoClose: true }).on("error", function(err) { console.error(err); rejects(err); }))
            //.on('end', function() { w.close(); resolve(); })
            //.pipe(process.stdout)
            //.on('close', resolve )
            //.on('finish', resolve)
            //.on('end', () => { this._downloadedFileCount++; console.log("end", this._downloadedFileCount)})
            .on('end', () => { s.close(); this._downloadedFileCount++; console.log("end", this._downloadedFileCount)})
        //});
        //this._downloadedFileCount++;
        //this._totalDownloadedSize += file.compressedSize;
        
        }
            /*
            progress(req, {
                throttle: 250
            })
            .on('progress', (state:any) => {
                console.log($this);
                $this.logger.info("File downlaod progressed", state)
                $this._downloadedFileSize = state.size.transferred;
            })
            .on('error', (err:any) => {
                $this.logger.error(err)
                reject(err);
            })
            .on('close', () => {
                $this.logger.info("File download completed", file);
                $this._downloadedFileCount++;
                $this._totalDownloadedSize += file.compressedSize;
                $this._downloadedFileSize = 0;
                resolve();
            })
            .pipe(fs.createWriteStream(filePath, {
                    autoClose: true
                })
                .on('error', function (err) {
                    console.log(err);
                })
            )*/
    }
}

export {
    DownloadManager,
    DownloadManagerSettings,
    DownloadManagerOnProgressEvent
}