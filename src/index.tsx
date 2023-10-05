import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { store } from './minima/redux/store';
import { Provider } from 'react-redux';

/*
 * HashRouter to allow us to run the index.html directly from the file system.
 *
 * BrowserRouter can be used where we have a web server that can always serve the index.html,
 * no matter which url is in the browser
 */

const Main = () => {
    return (
        <React.StrictMode>
            <HashRouter>
                <App />
            </HashRouter>
        </React.StrictMode>
    );
};

ReactDOM.render(<Main />, document.getElementById('root'));
