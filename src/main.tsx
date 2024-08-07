import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppProvider from './AppContext';
import App from './App';
import * as utils from './utilities';
import { createHashRouter, createRoutesFromElements, Route, Navigate, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Receive from './pages/Receive';
import Send from './pages/Send';
import Balance from './pages/Balance';
import TokenStudio from './pages/TokenStudio';
import Transactions from './pages/Transactions';
import { TransactionHistoryProvider } from './pages/Transactions/context';
import Collections from './pages/Collections';

const router = createHashRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={<App />}
        loader={() => {
          return localStorage.getItem(utils.getAppUID());
        }}
      >
        <Route index element={<Navigate to="/dashboard/balance" />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="balance" element={<Balance />} />
          <Route path="receive" element={<Receive/>} />
          <Route path="transactions" element={<TransactionHistoryProvider><Transactions /></TransactionHistoryProvider>} />    
          <Route path="send" element={<Send />} />
          <Route path="tokenstudio" element={<TokenStudio />} />
          <Route path="collections" element={<Collections />} />
        </Route>      
        <Route path="*" element={<Navigate to="/dashboard/balance" replace />} />
      </Route>
    )
  );

const Main = () => {
    return (
        <React.StrictMode>
            <AppProvider>
                <RouterProvider router={router} />                            
            </AppProvider>
        </React.StrictMode>
    );
};

ReactDOM.render(<Main />, document.getElementById('root'));
