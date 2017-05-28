// @flow

import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './App';

import './index.css';

injectTapEventPlugin();

ReactDOM.render(
    (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    ), document.getElementById('root')
);
