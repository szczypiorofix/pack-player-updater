'use strict';
import ElectronLog from 'electron-log';
import path from 'path';

import ExpressServer from './server/ExpressServer';
import { DIR_LOGS, DEBUG_MODE } from '../shared/constants';
import ElectronWindow from './window/ElectronWindow';

function initializeLogger() {
    ElectronLog.transports.file.resolvePath = () => path.join(DIR_LOGS, 'main.applog.log');

    ElectronLog.catchErrors({
        showDialog: false,
        onError(
            error: Error,
            versions?: { app: string; electron: string; os: string },
            submitIssue?: (url: string, data: any) => void
        ) {
            ElectronLog.error(`Error: ${error.name} (electron: ${JSON.stringify(versions?.app)}, os: ${(JSON.stringify(versions?.os))}), message: ${error.message}`);
        },
    });
}


function handleApplicationArguments() {
    const args = { prop1: process.argv };
    if (args && args.prop1 && args.prop1[1]) {
        if (args.prop1[1].toLowerCase() === '-debug') {
            DEBUG_MODE.isOn = true;
        }
    }
}

function LaunchApplication() {
    initializeLogger();

    handleApplicationArguments();

    new ExpressServer();
    new ElectronWindow(DEBUG_MODE.withoutUserChecking); // if 'no-user' mode is active - just put window in standard size

    if (DEBUG_MODE.withoutUserChecking) {
        ElectronLog.info(`Application is running in 'no-user' mode (without user verification).`);
    }
}

LaunchApplication();
