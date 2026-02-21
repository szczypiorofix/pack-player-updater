import React from 'react';

import css from './LoginView.css';

export const LoginView = (): JSX.Element => {
    const formView = (): JSX.Element => {
        return (
            <div className={css.formDiv}>
                <div className={css.info}>
                    <h1>PACK PLAYER - UPDATER</h1>
                </div>
                <div className={css.form}>
                    <p>This is the new application...</p>
                    <p>A new version !!! 1.0.2 !!!</p>
                </div>
            </div>
        );
    };

    return (
        <div className={css.loginBody}>
            <div className={css.login} draggable={false}>
                <div className={css['login-con']}>
                    {formView()}
                </div>
            </div>
        </div>
    );
};
