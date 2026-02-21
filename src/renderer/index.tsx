import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

import './variables.css';

// Setting the root for React application
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('app')
);
