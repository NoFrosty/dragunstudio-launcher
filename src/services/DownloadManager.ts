import FileInfo from '@/models/FileInfo';
import DiffInfo from '@/models/DiffInfo';
import MainServiceBase from './MainServiceBase';
import RendererNotificationManager from './RendererNotificationManager';
import { Logger } from 'winston';

import path from 'path';
import fs from 'fs';
const unzipper = require('unzipper');
const util = require('util');
const request = require('request')
var progress = require('request-progress');
const fsExtra = require('fs-extra');
require('https').globalAgent.options.rejectUnauthorized = false;
const progressSpeedUpdatePeriod = 2000;

interface DownloadManagerSettings {
    concurrentDownloadCount : number;
    rootPath : string;
    diffPath : string;
    applicationId : string;
}

interface DownloadManagerSpeedContext {
    lastCalculationTime: Date;
    lastDownloadedSize: number;
    lastSpeed: number;
}

interface DownloadManagerContext {
    executionSettings: DownloadManagerSettings;
    totalFileSize: number;
    totalFileCount: number;
    downloadedSingleFileSize: number;
    downloadedTotalFileSize: number;
    downloadedFileCount: number;
    isDownloading: boolean;
    allFiles: (FileInfo | DiffInfo)[];
    downloadedFiles: (FileInfo | DiffInfo)[];

    speedContext: DownloadManagerSpeedContext;

    onProgress? : (progress: DownloadManagerOnProgressEvent) => void;
    onStop? : (stop: DownloadManagerOnStopEvent) => void;
}

interface DownloadManagerOnProgressEvent {
    err: any;
    totalFileCount: number;
    totalFileSize: number;
    downloadedSize: number;
    downloadedCount: number;
    speed: number;
}
interface DownloadManagerOnStopEvent extends DownloadManagerOnProgressEvent {
    allFiles: (FileInfo | DiffInfo)[];
    downloadedFiles: (FileInfo | DiffInfo)[];
    executionSettings: DownloadManagerSettings;
}


class DownloadManager extends MainServiceBase {
    constructor(notificationManager : RendererNotificationManager, logger : Logger) {
        super(notificationManager, logger);
    }

    public start(
        allFiles: (FileInfo | DiffInfo)[],
        settings : DownloadManagerSettings,
        onProgress: (progress: DownloadManagerOnProgressEvent) => void,
        onStop: (progress: DownloadManagerOnStopEvent) => void) {

        let context = DownloadManager.createEmptyContext(allFiles, settings);
        context.onProgress = onProgress;
        context.onStop = onStop;

        this.logger.info("Starting download!")
        context.isDownloading = true;
        
        this.download(context).then(() => {
            this.sendStopEvent(context);
            context.isDownloading = false;
            this.logger.info("Download ended!")
        }).catch(err => {
            this.logger.error(err)
        })
    }
    public stop() {
        throw new Error("Not implemented");
    }
    
    private sendProgressUpdate(context: DownloadManagerContext) {
        this.logger.debug("Download progress interval!")
        if (context.isDownloading) {
            if (context.onProgress) {
                let progress : DownloadManagerOnProgressEvent = {
                    err: null,
                    downloadedSize: context.downloadedTotalFileSize + context.downloadedSingleFileSize,
                    downloadedCount: context.downloadedFileCount,
                    totalFileSize: context.totalFileSize,
                    totalFileCount: context.totalFileCount,
                    speed: 0
                };

                // Calculate progress speed
                let currentTime = new Date();
                let deltaTime = (currentTime.getTime() - context.speedContext.lastCalculationTime.getTime());
                if (deltaTime > progressSpeedUpdatePeriod) {
                    let deltaDownloadedSize = progress.downloadedSize - context.speedContext.lastDownloadedSize;
                    progress.speed = deltaDownloadedSize / (deltaTime / 1000);
                    // Store back values for next calculation
                    context.speedContext.lastDownloadedSize = progress.downloadedSize;
                    context.speedContext.lastCalculationTime = currentTime;
                    context.speedContext.lastSpeed = progress.speed;
                }
                else {
                    // Get speed from previous progress
                    progress.speed = context.speedContext.lastSpeed;
                }
                context.onProgress(progress);
            }
        }
    }
    private sendStopEvent(context: DownloadManagerContext) {
        this.logger.debug("Download progress (stop)!")
        if (context.onStop) {
            let progress : DownloadManagerOnStopEvent = {
                err: null,
                downloadedSize: context.downloadedTotalFileSize + context.downloadedSingleFileSize,
                downloadedCount: context.downloadedFileCount,
                totalFileSize: context.totalFileSize,
                totalFileCount: context.totalFileCount,
                allFiles: context.allFiles,
                downloadedFiles: context.downloadedFiles,
                executionSettings: context.executionSettings,
                speed: 0
            };
            context.onStop(progress);
        }
    }

    private sendErrorUpdate(context: DownloadManagerContext, err: any) {
        if (context.onStop) {
            let progress : DownloadManagerOnStopEvent = {
                err: err,
                downloadedSize: context.downloadedTotalFileSize + context.downloadedSingleFileSize,
                downloadedCount: context.downloadedFileCount,
                totalFileSize: context.totalFileSize,
                totalFileCount: context.totalFileCount,
                allFiles: context.allFiles,
                downloadedFiles: context.downloadedFiles,
                executionSettings: context.executionSettings,
                speed: 0
            };
            context.onStop(progress);
        }
    }


    private static isFile(file: FileInfo | DiffInfo): file is FileInfo {
        return (file as FileInfo).fileId !== undefined;
    }

    private async download(context: DownloadManagerContext) {
        try {
            this.logger.info(util.format("Will download %s files", context.allFiles.length))
            for(let i in context.allFiles) {
                let file = context.allFiles[i] as FileInfo;
                await this.downloadFile(context, file);
            }
        }
        catch(err) {
            this.logger.error(err);
            this.sendErrorUpdate(context, err);
        }
    }

    private async downloadFile(context: DownloadManagerContext, file : FileInfo | DiffInfo) {
        this.logger.debug("New file to download!", file)
        if(context.executionSettings) {
            let url : string;
            let directoryPath : string;
            let filePath : string;
            let size : number;

            if (DownloadManager.isFile(file)) {
                url = process.env.VUE_APP_API_LINK + '/files/' + context.executionSettings.applicationId + '/' + file.fileId + '/download'
                directoryPath = path.join(context.executionSettings.rootPath, file.directoryPath);
                filePath = path.join(directoryPath, file.fileName);
                size = file.compressedSize
            }
            else {
                url = process.env.VUE_APP_API_LINK + '/files/diff/' + context.executionSettings.applicationId + '/' + file.diffId + '/download'
                directoryPath = context.executionSettings.diffPath;
                filePath = path.join(directoryPath, file.diffId);
                size = file.diffSize
            }

            if(!fs.existsSync(directoryPath)){
                fs.mkdirSync(directoryPath, { recursive: true });
            }

            this.logger.info(util.format("Downloading file: '%s'", filePath));
            return new Promise<void>( (resolve, reject) => {
                let strm = progress(
                    request(url, { autoClose: true })
                    .on("error", function(err : any) { reject(err); }),
                    { throttle: 250 }
                )
                strm
                .on('progress', (state : any) => {
                    context.downloadedSingleFileSize = state.size.transferred;
                    this.sendProgressUpdate(context);
                })
                if(DownloadManager.isFile(file)){
                    strm.pipe(unzipper.Extract({path: context.executionSettings.rootPath}));
                }else{
                    strm.pipe(
                        fs.createWriteStream(filePath, { autoClose: true })
                        .on("error", function(err:any) { reject(err); })
                    )
                }
                strm.on('close', () => {
                    context.downloadedFileCount++;
                    context.downloadedTotalFileSize += size;
                    context.downloadedSingleFileSize = 0;
                    context.downloadedFiles.push(file);
                    resolve();
                })
                .on('error', (err:any) => {
                    this.logger.error(err);
                })
            });
        }
    }

    private static createEmptyContext(allFiles: (FileInfo | DiffInfo)[], settings: DownloadManagerSettings) : DownloadManagerContext {
        let context : DownloadManagerContext = {
            isDownloading: false,
            downloadedFileCount: 0,
            downloadedSingleFileSize: 0,
            downloadedTotalFileSize: 0,
            totalFileSize: DownloadManager.getTotalFileSize(allFiles),
            totalFileCount: allFiles.length,
            allFiles: allFiles,
            executionSettings: settings,
            downloadedFiles: [],
            speedContext: {
                lastCalculationTime: new Date(),
                lastDownloadedSize: 0,
                lastSpeed: 0
            }
        }
        return context;
    }

    private static getTotalFileSize(allFiles: (FileInfo | DiffInfo)[]) {
        return allFiles.reduce((a, b) => a + ((DownloadManager.isFile(b) ? b.compressedSize : b.diffSize) || 0), 0)
    }

    public static async deleteDirectory(directoryPath: string) {
        return fsExtra.remove(directoryPath);
    }
}

export {
    DownloadManager,
    DownloadManagerSettings,
    DownloadManagerOnProgressEvent,
    DownloadManagerOnStopEvent,
    DownloadManagerContext
}