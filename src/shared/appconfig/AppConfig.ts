import { IDoceboAPIServerSettings } from '../serverSettings';

export interface IAppConfigAppHost {
    id: number;
    name: string;
    description: string;
    doceboDomain: string;
    packageHost: string;
    packagePath: string;
    packagePathBeta: string;
}

export interface IAppConfigAppHosts {
    selectedId: number;
    beta: boolean;
    hosts: IAppConfigAppHost[];
}

export interface IAppConfigApp {
    name: string;
    ver: string;
    debugMode: boolean;
    doceboHosts: IAppConfigAppHosts;
}

export enum APP_CONFIG_ERROR {
    NO_ERRORS,
    READ_FILE_ERROR,
    PARSING_ERROR,
}

export interface IAppConfigErr {
    error: APP_CONFIG_ERROR;
    msg: string;
}

export interface IAppConfigContent {
    app: IAppConfigApp;
}

export interface IAppConfig {
    err: IAppConfigErr;
    app: IAppConfigApp;
    currentServer: IDoceboAPIServerSettings;
}

