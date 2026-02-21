import express, { Express } from 'express';
import http, { Server } from 'http';

import errorhandler from 'errorhandler';
import responseTime from 'response-time';

import { APP_VERSION, SERVER_PORT } from '../../shared/constants';
import { loggerMiddleware } from './middleware/app.middleware';

export default class ExpressServer {
    private app: Express;
    private server: Server;

    public constructor() {
        this.app = express();
        this.server = http.createServer(this.app).listen(SERVER_PORT, () => {
            console.log(`ZF Player ${APP_VERSION} server listening on port ${SERVER_PORT}`);
        });
        this.setMiddleware();
        this.setRoutes();
    }

    private setMiddleware() {
        // Error handling
        this.app.use(errorhandler());

        // Response time in response headers
        this.app.use(responseTime());
        this.app.use(express.json());

        // Logger middleware
        this.app.use(loggerMiddleware);
    }

    private setRoutes() {
        this.app.use('/public', express.static('./data/public'));
    }

    public close() {
        this.server.close();
    }
}
