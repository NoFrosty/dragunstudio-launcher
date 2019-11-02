import FileInfo from '@/models/FileInfo';
import MainServiceBase from './MainServiceBase';
import RendererNotificationManager from './RendererNotificationManager';
import { Logger } from 'winston';

import path from 'path';
import fs from 'fs';
const util = require('util');
const request = require('request')
var progress = require('request-progress');
const fsExtra = require('fs-extra');
require('https').globalAgent.options.rejectUnauthorized = false;


interface DiffInfo {
    diffId : string
    diffSize : number
}
interface DownloadManagerSettings {
    concurrentDownloadCount : number;
    rootPath : string;
    diffPath : string;
    applicationId : string;
}

interface DownloadManagerContext {
    executionSettings?: DownloadManagerSettings;
    totalFileSize: number;
    totalFileCount: number;
    downloadedSingleFileSize: number;
    downloadedTotalFileSize: number;
    downloadedFileCount: number;
    isDownloading: boolean;
    allFiles: (FileInfo | DiffInfo)[];

    onProgress? : (progress: DownloadManagerOnProgressEvent) => void;
}

interface DownloadManagerOnProgressEvent {
    err: any;
    totalFileCount: number;
    totalFileSize: number;
    downloadedSize: number;
    downloadedCount: number;
    isFinished: boolean;
}

class DownloadManager extends MainServiceBase {
    private lastProgressTrigger : number = 0;

    private _intervalId : number = 0;
    private context : DownloadManagerContext;

    constructor(notificationManager : RendererNotificationManager, logger : Logger) {
        super(notificationManager, logger);
        this.context = DownloadManager.createEmptyContext();
    }

    reset() {
        this.context = DownloadManager.createEmptyContext();
    }

    async pushFile(fileInfo : FileInfo) {
        this.logger.debug("Pushing file", fileInfo)
        if (this.context) {
            this.context.allFiles.push(fileInfo);
            this.context.totalFileSize += fileInfo.compressedSize;
            this.context.totalFileCount++;
        }
    }
    async pushDiff(diffInfo : DiffInfo) {
        if (this.context) {
            this.context.allFiles.push(diffInfo);
            this.context.totalFileSize += diffInfo.diffSize;
            this.context.totalFileCount++;
        }
    }

    public start(settings: DownloadManagerSettings, onProgress? : (progress: DownloadManagerOnProgressEvent) => void) {
        this.context.executionSettings = settings;
        this.context.onProgress = onProgress;

        this.logger.info("Starting download!")
        this.context.isDownloading = true;
        
        this.download().then(() => {
            this.sendProgressUpdate();
            this.context.isDownloading = false;
            this.logger.info("Download ended!")
        }).catch(err => {
            this.logger.error(err)
        })
    }
    public stop() {
        this.reset();
        throw new Error("Not implemented");
    }

    
    private sendProgressUpdate() {
        this.logger.debug("Download progress interval!")
        if (this.context.isDownloading) {
            if (this.context.onProgress) {
                let progress : DownloadManagerOnProgressEvent = {
                    err: null,
                    downloadedSize: this.context.downloadedTotalFileSize + this.context.downloadedSingleFileSize,
                    downloadedCount: this.context.downloadedFileCount,
                    totalFileSize: this.context.totalFileSize,
                    totalFileCount: this.context.totalFileCount,
                    isFinished: !this.context.isDownloading
                };
                this.context.onProgress(progress);
            }
        }
    }
    private sendErrorUpdate(err: any) {
        if (this.context.onProgress) {
            let progress : DownloadManagerOnProgressEvent = {
                err: err,
                downloadedSize: this.context.downloadedTotalFileSize + this.context.downloadedSingleFileSize,
                downloadedCount: this.context.downloadedFileCount,
                totalFileSize: this.context.totalFileSize,
                totalFileCount: this.context.totalFileCount,
                isFinished: !this.context.isDownloading
            };
            this.context.onProgress(progress);
        }
    }


    private static isFile(file: FileInfo | DiffInfo): file is FileInfo {
        return (file as FileInfo).fileId !== undefined;
    }

    private async download() {
        try {
            this.logger.info(util.format("Will download %s files", this.context.allFiles.length))
            for(let i in this.context.allFiles) {
                let file = this.context.allFiles[i] as FileInfo;
                await this.downloadFile(file);
            }
        }
        catch(err) {
            this.logger.error(err);
            this.sendErrorUpdate(err);
        }
    }

    private async downloadFile(file : FileInfo | DiffInfo) {
        this.logger.debug("New file to download!", file)
        if(this.context.executionSettings) {
            let url : string;
            let directoryPath : string;
            let filePath : string;
            let size : number;

            if (DownloadManager.isFile(file)) {
                url = process.env.VUE_APP_API_LINK + '/files/' + this.context.executionSettings.applicationId + '/' + file.fileId + '/download'
                directoryPath = path.join(this.context.executionSettings.rootPath, file.directoryPath);
                filePath = path.join(directoryPath, file.fileName);
                size = file.compressedSize
            }
            else {
                url = process.env.VUE_APP_API_LINK + '/files/diff/' + this.context.executionSettings.applicationId + '/' + file.diffId
                directoryPath = this.context.executionSettings.diffPath;
                filePath = path.join(directoryPath, file.diffId);
                size = file.diffSize
            }

            if(!fs.existsSync(directoryPath)){
                fs.mkdirSync(directoryPath, { recursive: true });
            }

            this.logger.info(util.format("Downloading file: '%s'", filePath));
            return new Promise( (resolve, reject) => {
                let strm = progress(
                    request(url, { autoClose: true })
                    .on("error", function(err : any) { reject(err); }),
                    { throttle: 250 }
                )
                strm
                .on('progress', (state : any) => {
                    this.context.downloadedSingleFileSize = state.size.transferred;
                    this.sendProgressUpdate();
                })
                .pipe(
                    fs.createWriteStream(filePath, { autoClose: true })
                    .on("error", function(err) { reject(err); })
                )
                .on('close', () => {
                    this.context.downloadedFileCount++;
                    this.context.downloadedTotalFileSize = size;
                    this.context.downloadedSingleFileSize = 0;
                    resolve();
                })
                .on('error', (err:any) => {
                    reject(err);
                })
            });
        }
    }

    private static createEmptyContext(settings?: DownloadManagerSettings) : DownloadManagerContext {
        let context : DownloadManagerContext = {
            isDownloading: false,
            downloadedFileCount: 0,
            downloadedSingleFileSize: 0,
            downloadedTotalFileSize: 0,
            totalFileSize: 0,
            totalFileCount: 0,
            allFiles: [],
            executionSettings: settings
        }
        return context;
    }

    public static async deleteDirectory(directoryPath: string) {
        return fsExtra.remove(directoryPath);
    }
}

export {
    DownloadManager,
    DownloadManagerSettings,
    DownloadManagerOnProgressEvent
}