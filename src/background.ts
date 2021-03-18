'use strict'
declare const __static: string;
import logger from './services/logger'
import mainNotificationManager from './services/MainNotificationManager'
import { app, protocol, BrowserWindow, ipcMain, dialog, Tray, Menu } from 'electron'
import {
    createProtocol,
    installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import { DownloadManager, DownloadManagerContext, DownloadManagerSettings, DownloadManagerOnProgressEvent, DownloadManagerOnStopEvent } from './services/DownloadManager'
import FileInfo from './models/FileInfo'
import DiffInfo from './models/DiffInfo'
import { settings } from 'cluster'
import path from 'path'
import { autoUpdater } from "electron-updater"
const windowStateKeeper = require('electron-window-state');
const isDevelopment = process.env.NODE_ENV !== 'production'
const AutoLaunch = require('auto-launch');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null
let downloadManager: DownloadManager;

let reduceInsteadOfClose:boolean = false;
let launchWithWindows:boolean = false;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

let tray : Tray | null = null;

function createWindow() {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1600,
        defaultHeight: 900
    });
    // Create the browser window.
    win = new BrowserWindow({
        title: 'Warp Launcher',
        frame: false,
        fullscreenable: true,
        x: mainWindowState.x,
        y: mainWindowState.y,
        height: mainWindowState.height,
        width: mainWindowState.width,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            //TODO
            webSecurity: false
        },
        backgroundColor: '#141212',
        icon: path.join(__static, 'images/icon.png')
    })
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
        setInterval(() => {
            autoUpdater.checkForUpdatesAndNotify();
        }, 1000 * 60 * 15);
        
    }
    
    mainWindowState.manage(win);

    win.on('closed', () => {
        win = null
    })
    

    win.on('close', (event : Event) => {
        if(win && reduceInsteadOfClose){
            if(!tray){
                event.preventDefault();
                win.hide();
                tray = createTray();
            }
            else{
                if(tray.isDestroyed()){
                    event.preventDefault();
                    win.hide();
                    tray = createTray();
                }
            }
        }
    });

    win.on('restore', (event: Event) => {
        if(win){
            win.show();
            if(tray){
                tray.destroy();
            }
        }
    });
}

app.allowRendererProcessReuse = false

//TODO
app.commandLine.appendSwitch('ignore-certificate-errors');
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

autoUpdater.on("update-downloaded", () => {
    let response = dialog.showMessageBox(
    {
        type: 'question',
        buttons: ['Yes, please', 'No, thanks'],
        defaultId: 0,
        cancelId: 1,
        title: 'Update',
        message: 'Do you want update?',
        detail: 'It does not really matter'
    }).then(result => {
        if (result.response === 0) {
            autoUpdater.quitAndInstall(true,true);
        }
    });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        // Devtools extensions are broken in Electron 6.0.0 and greater
        // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
        // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
        // If you are not using Windows 10 dark mode, you may uncomment these lines
        // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
        // try {
        //   await installVueDevtools()
        // } catch (e) {
        //   console.error('Vue Devtools failed to install:', e.toString())
        // }

    }
    let autoLaunch = new AutoLaunch({
        name: 'Warp Launcher',
        path: app.getPath('exe'),
    });
    if(launchWithWindows)
        autoLaunch.enable();
    else
        autoLaunch.disable();
    autoLaunch.isEnabled().then((isEnabled : boolean) => {
        if (isEnabled) 
            return;
    });
    createWindow()
    initializeDownloadManager();
    initializeAppSettings();
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}


process.on('uncaughtException', function(err) {
    // eslint-disable-next-line
    console.error("err", err);
})

function initializeDownloadManager() {
    downloadManager = new DownloadManager(mainNotificationManager, logger);
    
    ipcMain.on('start-download', (event, payload: { files: (FileInfo | DiffInfo)[], settings: DownloadManagerSettings }) => {
        downloadManager.start(
            payload.files,
            payload.settings,
            (progress: DownloadManagerOnProgressEvent) => {
                event.sender.send("download-progress", progress);
            },
            (stop: DownloadManagerOnStopEvent) => {
                event.sender.send("download-stop", stop);
            },
        );
    });
    ipcMain.on('delete-directory', async (event, directoryPath: string) => {
        try {
            await DownloadManager.deleteDirectory(directoryPath)
            event.sender.send("delete-directory-finished", null)
        }
        catch(err) {
            event.sender.send("delete-directory-finished", err)
        }
    });
}

function initializeAppSettings() {
    //reduceInsteadOfClose

    ipcMain.on('application-setup', (event, payload: {isMinimizeInsteadClose : boolean, isLaunchWithWindows:boolean}) => {
        reduceInsteadOfClose = payload.isMinimizeInsteadClose;
        launchWithWindows = payload.isLaunchWithWindows;
    });
}

function createTray() : Tray {
    let appIcon = new Tray(path.join(__static, "images/icon.png"));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show', click: function () {
                if(win){
                    win.show();
                    if(tray){
                        tray.destroy();
                    }
                }
            }
        },
        {
            label: 'Exit', click: function () {
                app.quit();
            }
        }
    ]);

    appIcon.on('double-click', function (event) {
        if(win){
            win.show();
            if(tray){
                tray.destroy();
            }
        }
    });
    appIcon.setToolTip('Tray Tutorial');
    appIcon.setContextMenu(contextMenu);
    return appIcon;
}