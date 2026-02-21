import React from 'react';

import { LoginView } from './components/loginview/LoginView';
import { WindowBar } from './components/windowbar/WindowBar';

import './App.css';

export const App = (): JSX.Element => {
    return <React.Fragment>
        <WindowBar></WindowBar>
        <LoginView></LoginView>
    </React.Fragment>
};
