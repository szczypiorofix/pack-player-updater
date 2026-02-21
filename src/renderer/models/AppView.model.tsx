import { IAppSettings } from '../../shared/settings/SettingsData.model';
import { ICourseNames } from '../../shared/types/course';

// Defined enum for application windows (views)
export enum AppViewEnum {
    LOADING,
    SESSION,
    LOGIN,
    CHOOSE,
    VIEWER,
}

// main App state object interface
export interface IAppViewSettings {
    // for switching views
    view: AppViewEnum;

    // application settings
    appSettings: IAppSettings;

    /**
     * IF windows is in full screen mode
     */
    windowFullScreen: boolean;
}

// Interface with a function for switching views from child components (SettingsViewer, ChoosePresentation, LoginView and AppViewer)
export interface ICourseProps {
    currentAppView: AppViewEnum;

    /**
     * Function for changing application state
     * @param viewState AppViewEnum : enum which indicates which view should be displayed
     */
    switchAppState: (viewState: AppViewEnum, userName: string) => void;

    switchWindowFullScreen: (fs: boolean) => void;

    windowInFullScreen: boolean;

    currentCourse: ICourseNames | null;

    userName: string;
}
