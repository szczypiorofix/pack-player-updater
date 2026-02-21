// IPC interfaces for frontend-backend comminications (sending signals about requests, responses, changing window size etc.)

export interface IIpcMessage {
    type: IPC_MESSAGE_KEYS | IPC_MESSAGE_DOWNLOAD | IPC_MESSAGE_MAIN | IPC_MESSAGE_REQUESTS;
    data: any[];
}

export interface IIpcReply {
    type: IPC_REPLY_KEYS | IPC_REPLY_DOWNLOAD | IPC_REPLY_MAIN | IPC_REPLY_REQUESTS;
    data: any[];
}

export enum IPC_REPLY_DOWNLOAD {
    START_REPLY = -10,
}

export enum IPC_REPLY_MAIN {
    TOGGLE_FULL_SCREEN_REPLY = -20,
    ENABLE_FULL_SCREEN_REPLY = -21,
    DISABLE_FULL_SCREEN_REPLY = -22,
    MINIMIZE_WINDOW_REPLY = -23,
    CLOSE_WINDOW_REPLY = -24,
    WINDOW_STANDARD_SIZE_REPLY = -25,
    WINDOW_LOGIN_SIZE_REPLY = -26,
    RESTART_APPLICATION_REPLY = -27,
    SYNC_CONFIG_REPLY = -28,
}

export enum IPC_REPLY_REQUESTS {
    LOGIN_REPLY = -30,
    SESSION_REPLY = -31,
    COURSES_TO_DOWNLOAD_REPLY = -32,
    DOWNLOAD_FILE_REPLY = -33
}

export enum IPC_REPLY_KEYS {
    KEYPRESSED_REPLY = -40,
}

export enum IPC_MESSAGE_DOWNLOAD {
    START = 10,
    PROGRESS = 11,
    CANCEL = 12,
    PAUSED = 13,
    COMPLETE = 14,
    ERROR = 15,
}

export enum IPC_MESSAGE_MAIN {
    TOGGLE_FULL_SCREEN = 20,
    ENABLE_FULL_SCREEN = 21,
    DISABLE_FULL_SCREEN = 22,
    MINIMIZE_WINDOW = 23,
    CLOSE_WINDOW = 24,
    WINDOW_STANDARD_SIZE = 25,
    WINDOW_LOGIN_SIZE = 26,
    RESTART_APPLICATION = 27,
    SYNC_CONFIG = 28,
}

export enum IPC_MESSAGE_REQUESTS {
    LOGIN = 30,
    SESSION = 31,
    COURSES_TO_DOWNLOAD = 32,
    DOWNLOAD_FILE = 33,
}

export enum IPC_MESSAGE_KEYS {
    KEPRESSED = 40,
}

export const IPC_CHANNEL_KEYS = {
    message_name: 'channel-keys-message',
    message: IPC_MESSAGE_KEYS,
    reply_name: 'channel-keys-reply',
    reply: IPC_REPLY_KEYS,
};

export const IPC_CHANNEL_MAIN = {
    message_name: 'channel-main-message',
    message: IPC_MESSAGE_MAIN,
    reply_name: 'channel-main-reply',
    reply: IPC_REPLY_MAIN,
};

export const IPC_CHANNEL_REQUESTS = {
    message_name: 'channel-requests-message',
    message: IPC_MESSAGE_REQUESTS,
    reply_name: 'channel-requests-reply',
    reply: IPC_REPLY_REQUESTS,
};

export const IPC_CHANNEL_DOWNLOAD = {
    message_name: 'channel-download-message',
    message: IPC_MESSAGE_DOWNLOAD,
    reply_name: 'channel-download-reply',
    reply: IPC_REPLY_DOWNLOAD,
};
