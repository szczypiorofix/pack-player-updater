export enum COURSE_FOR_DOWNLOAD_STATE {
    UNAVAILABLE,
    READY_TO_DOWNLOAD,
    READY,
    READY_TO_UPDATE,
}

export interface IAppSettings {
    offlineDaysAllowed: number;
    betaTesting: boolean;
    betaTestingName: string;
}

export const DEFAULT_OFFLINE_DATS_ALLOWED = 7;

export const MAXIMUM_OFFLINE_DAYS_ALLOWED = 14;

export const DEFAULT_APP_SETTINGS: IAppSettings = {
    offlineDaysAllowed: DEFAULT_OFFLINE_DATS_ALLOWED,
    betaTesting: false,
    betaTestingName: '',
};
