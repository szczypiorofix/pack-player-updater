import { format as formatUrl } from 'url';
import path from 'path';
import fs from 'fs';
import ElectronLog from 'electron-log';
import { app, BrowserWindow, dialog, nativeImage } from 'electron';
import { autoUpdater } from 'electron-updater';

import { APP_VERSION, DEBUG_MODE, WABCO_USER_DATA_FILENAME } from '../../shared/constants';
import { IIpcMessage, IPC_MESSAGE_KEYS, IPC_CHANNEL_KEYS } from '../../shared/types';

interface IWindowProperties {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    fullscreenable: boolean;
    maximizable: boolean;
    resizable: boolean;
}

// =========== Defined window sizes
const WINDOW_LOGIN_PROPS: IWindowProperties = {
    width: 380,
    height: 480,
    minWidth: 380,
    minHeight: 480,
    maxWidth: 380,
    maxHeight: 480,
    fullscreenable: false,
    maximizable: false,
    resizable: true,
};

const WINDOW_STANDARD_PROPS: IWindowProperties = {
    width: 1600,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    maxWidth: 1980,
    maxHeight: 1200,
    fullscreenable: true,
    maximizable: true,
    resizable: true,
};

// ================================

/**
 * Main window class.
 * In this class a new Electron application and application window is initialized.
 */
export default class ElectronWindow {
    private mainWindow: BrowserWindow | null;

    private windowProperties: IWindowProperties;

    // Check if Electron is running in development mode (for showing/hiding devtools)
    private readonly development: boolean = process.env.NODE_ENV !== 'production';

    private fullScreen: boolean = false;

    // Check if window is in login size (small, not resizable, not fullscreenable window)
    private windowInStandardSize: boolean = true;

    private checkAutoUpdater: boolean;

    public constructor(skipLoginWindow: boolean) {
        this.mainWindow = null;

        // Window size at start
        this.windowProperties = WINDOW_LOGIN_PROPS;
        if (skipLoginWindow) {
            this.windowProperties = WINDOW_STANDARD_PROPS;
        }

        this.checkAutoUpdater = true;

        // There can be only one instance of the app (because of the HTTP server instance)
        if (!app.requestSingleInstanceLock()) {
            ElectronLog.warn('Another instance of the application running detected. Closing app.');
            app.quit();
        }

        // quit application when all windows are closed
        app.on('window-all-closed', () => {
            // on macOS it's common for applications to stay open until the user explicitly quits
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            // on macOS it is common to re-create a window even after all windows have been closed
            if (this.mainWindow === null) {
                this.mainWindow = this.createMainWindow();
            }
        });

        /**
         * Disable Electron menu
         */
        app.on('browser-window-created', (e, window) => {
            window.setMenu(null);
        });

        app.on('ready', () => {
            this.mainWindow = this.createMainWindow();
            if (this.checkAutoUpdater) {
                autoUpdater.on('error', (err) => {
                    dialog.showErrorBox('Błąd aktualizacji', err == null ? "nieznany błąd" : (err.stack || err).toString());
                });

                autoUpdater.on('update-available', () => {
                    dialog.showMessageBox({ message: 'Znalazłem aktualizację! Pobieram w tle...' });
                });

                autoUpdater.on('update-not-available', () => {
                    dialog.showMessageBox({ message: 'Brak aktualizacji. Masz najnowszą wersję.' });
                });

                autoUpdater.on('update-downloaded', () => {
                    dialog.showMessageBox({
                    type: 'info',
                    title: 'Aktualizacja gotowa',
                    message: 'Pobrano nową wersję. Aplikacja zostanie zrestartowana.',
                    buttons: ['Zrestartuj']
                    }).then(() => {
                    setImmediate(() => autoUpdater.quitAndInstall());
                    });
                });

                autoUpdater.checkForUpdatesAndNotify();
            }
        });
    }

    private createMainWindow() {
        const icon = nativeImage.createFromPath(path.resolve(__dirname, 'zflogo.ico'));
        const window = new BrowserWindow({
            title: 'ZF Player ' + APP_VERSION,
            width: this.windowProperties.width,
            height: this.windowProperties.height,
            fullscreenable: this.windowProperties.fullscreenable,
            minWidth: this.windowProperties.minWidth,
            minHeight: this.windowProperties.minHeight,
            maxWidth: this.windowProperties.maxWidth,
            maxHeight: this.windowProperties.maxHeight,
            show: false,
            frame: false,
            autoHideMenuBar: true,
            maximizable: this.windowProperties.maximizable,
            minimizable: true,
            resizable: this.windowProperties.resizable,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                devTools: true,
            },
            icon: icon,
        });

        /**
         * Show or hide DevTools
         */
        app.whenReady().then(() => {
            if (this.development) {
                window.webContents.openDevTools({ mode: 'detach' });
            }
        });

        // Check if Electron should load file from localhost or from static file
        if (this.development) {
            window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
        } else {
            window.loadURL(
                formatUrl({
                    pathname: path.join(__dirname, 'index.html'),
                    protocol: 'file',
                    slashes: true,
                })
            );
        }

        // Keyboard events
        window.webContents.on('before-input-event', (event, input: Electron.Input) => {
            if (input.type === 'keyDown') {
                if (
                    input.code === 'ArrowLeft' ||
                    input.code === 'ArrowRight' ||
                    input.code === 'ArrowDown' ||
                    input.code === 'ArrowUp' ||
                    input.code === 'Space' ||
                    input.code === 'Escape' ||
                    input.code === 'Delete' ||
                    (input.code === 'F10' && DEBUG_MODE.isOn) ||
                    input.code === 'Comma' ||
                    input.code === 'Period'
                ) {
                    const message: IIpcMessage = {
                        type: IPC_MESSAGE_KEYS.KEPRESSED,
                        data: [input],
                    };
                    window.webContents.send(IPC_CHANNEL_KEYS.message_name, message);
                } else {
                    if (input.code === 'F11') {
                        if (this.mainWindow) {
                            if (DEBUG_MODE.isOn) {
                                ElectronLog.info('Restarting application - user hit F11 button.');
                            }
                            const wd = this.mainWindow;
                            this.clearCacheData(wd)
                                .then(() => {
                                    wd.webContents.reload();
                                })
                                .catch((err) => {
                                    ElectronLog.error(err);
                                });
                        }
                    }
                }
            }
        });

        window.once('ready-to-show', () => {
            this.mainWindow?.show();
        });

        // null mainWindow object if close event was launched
        window.on('closed', () => {
            this.mainWindow = null;
        });

        // Settings for devtools
        window.webContents.on('devtools-opened', () => {
            window.focus();
            setImmediate(() => {
                window.focus();
            });
        });
        this.clearCacheData(window);

        if (DEBUG_MODE.isOn) {
            ElectronLog.info('Window object created successfully.');
        }

        return window;
    }

    private clearCacheData(window?: Electron.BrowserWindow): Promise<void> {
        if (window) {
            const session = window.webContents.session;
            return session.clearStorageData({
                storages: [
                    'appcache',
                    'cookies',
                    'filesystem',
                    'indexdb',
                    // "localstorage",
                    'shadercache',
                    'websql',
                    'serviceworkers',
                    'cachestorage',
                ],
            });
        }
        return new Promise(() => {
            return 'Window object is null!';
        });
    }

    public setFullScreen(fullScreen: boolean): void {
        this.fullScreen = fullScreen;
        this.mainWindow?.setFullScreen(this.fullScreen);
    }

    public toggleFullScreen(): void {
        this.fullScreen = !this.fullScreen;
        this.mainWindow?.setFullScreen(this.fullScreen);
    }

    public minimize(): void {
        this.mainWindow?.minimize();
    }

    public close(): void {
        ElectronLog.info('Closing application...');
        if (this.mainWindow) {
            this.mainWindow.close();
            ElectronLog.info('Application closed.');
            app.exit(0);
        }
    }

    public getMainWindow(): BrowserWindow | null {
        return this.mainWindow;
    }

    public isDevelopment(): boolean {
        return this.development;
    }

    public isFullScreen(): boolean {
        return this.fullScreen;
    }

    public isWindowInStandardSize(): boolean {
        return this.windowInStandardSize;
    }

    public getWindowProperties(): IWindowProperties {
        return this.windowProperties;
    }

    private windowChangeSizeAndRefresh(props: IWindowProperties) {
        this.windowProperties = props;
        if (this.mainWindow) {
            this.mainWindow.setMinimumSize(this.windowProperties.minWidth, this.windowProperties.minHeight);
            this.mainWindow.setMaximumSize(this.windowProperties.maxWidth, this.windowProperties.maxHeight);
            this.mainWindow.resizable = this.windowProperties.resizable;
            this.mainWindow.maximizable = this.windowProperties.maximizable;
            this.mainWindow.fullScreenable = this.windowProperties.fullscreenable;
            this.mainWindow.setSize(this.windowProperties.width, this.windowProperties.height);
            this.mainWindow.center();
        }
    }

    public setStandardWindowSize(): void {
        this.windowChangeSizeAndRefresh(WINDOW_STANDARD_PROPS);
    }

    public setLoginWindowSize(): void {
        this.windowChangeSizeAndRefresh(WINDOW_LOGIN_PROPS);
    }

    public getWidth(): number {
        let w: number = 0;
        if (this.mainWindow) {
            w = this.mainWindow.getSize()[0];
        }
        return w;
    }

    public getHeight(): number {
        let h: number = 0;
        if (this.mainWindow) {
            h = this.mainWindow.getSize()[1];
        }
        return h;
    }

    public getWindow(): BrowserWindow | null {
        return this.mainWindow;
    }

    public restartApp(): void {
        if (this.mainWindow) {
            let success = false;
            try {
                fs.unlinkSync(`./${WABCO_USER_DATA_FILENAME}`);
                success = true;
            } catch (err) {
                ElectronLog.error(`Window (restartApp): cannot delete ./${WABCO_USER_DATA_FILENAME} file.`);
                ElectronLog.error(err);
            }
            if (success) {
                this.clearCacheData();
                if (DEBUG_MODE.isOn) {
                    ElectronLog.info('Cache cleared');
                }
                this.setLoginWindowSize();
                this.mainWindow.webContents.reload();
                this.mainWindow.center();
            }
        }
    }
}
