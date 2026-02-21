import ElectronLog from 'electron-log';
import { NextFunction, Request, Response } from 'express';

import { DEBUG_MODE } from '../../../shared/constants';

export function loggerMiddleware(request: Request, response: Response, next: NextFunction) {
    if (DEBUG_MODE.isOn) {
        ElectronLog.info(
            `(file) Request: (${request.method}) ${request.hostname}:${request.connection.localPort}${request.originalUrl}`
        );
    }
    next();
}

export function headerMiddleware(request: Request, response: Response, next: NextFunction) {
    response.header('Content-Type', 'application/json');
    next();
}
