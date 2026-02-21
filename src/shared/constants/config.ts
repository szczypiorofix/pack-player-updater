import path from 'path';
import packageJson from '../../../package.json';

function getAppVersionFromPackageJson() {
    return packageJson?.version || '';
}

export type IDebugMode = {
    isOn: boolean;
    withoutUserChecking: boolean;
};

export let DEBUG_MODE: IDebugMode = {
    isOn: true,
    withoutUserChecking: false, // running the app in 'no-user' mode (without user verification)
};

export const APP_VERSION = getAppVersionFromPackageJson();

export const SERVER_PORT = 37864;

export const LOCALHOST_PATH = `http://localhost:${SERVER_PORT}/`;

export const TEMP_COURSE_PACKAGE_FILE_NAME = 'temp.zip';

export const WABCO_USER_DATA_FILENAME = '/wabco.dat';

export const SETTINGS_JSON_FILE: string = 'settings.json';

export const DEFAULT_USER_ID = 0;

export const DIR_DATA = 'data';

export const DIR_USER_DATA: string = 'userdata';

export const DIR_DATA_COURSES: string = path.join('data', 'courses');

export const DIR_DATA_USERDATA: string = path.join('data', 'userdata');

export const DIR_DATA_PUBLIC_LOCALES: string = path.join('data', 'public', 'locales');

export const DIR_TEMP: string = 'temp';

export const DIR_USER_SLIDES: string = 'userslides';

export const DIR_SKETCHES: string = 'sketches';

export const DIR_UPLOADS: string = 'uploads';

export const DIR_LISTS: string = 'lists';

export const DIR_LOGS: string = 'logs';

export const DIR_LOCALES: string = 'locales';
