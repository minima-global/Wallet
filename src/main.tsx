import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppProvider from './AppContext';
import App from './App';

const Main = () => {
    return (
        <React.StrictMode>
            <AppProvider>
                <App />
            </AppProvider>
        </React.StrictMode>
    );
};

ReactDOM.render(<Main />, document.getElementById('root'));
