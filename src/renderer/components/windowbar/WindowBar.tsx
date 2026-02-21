import React from 'react';
import { ipcRenderer } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMinimize } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { APP_VERSION } from '../../../shared/constants';
import { IPC_CHANNEL_MAIN } from '../../../shared/types';

import css from './WindowBar.css';

export const WindowBar = () => {
    ipcRenderer.on(IPC_CHANNEL_MAIN.reply_name, (_, arg) => {
        console.log('WindowBar: Async message from Electron app: ' + JSON.stringify( arg ) );
    });

    const minimizeWindow = () => {
    };

    const closeWindow = () => {
    };

    return (
        <div className={css.windowBar}>
            <div className={css.title}>
                Pack Player {APP_VERSION}{' '}
            </div>
            <div className={css.appButtonsDiv}>
                <div className={css['app-button']}>
                    <div className={css.minimize} onClick={minimizeWindow}>
                        <FontAwesomeIcon icon={faWindowMinimize} />
                    </div>
                    <div className={css.close} onClick={closeWindow}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            </div>
        </div>
    );
};
