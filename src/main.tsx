import React from 'react';
import ReactDOM from 'react-dom';
import { Navigate, Route, RouterProvider, createHashRouter, createRoutesFromElements } from 'react-router-dom';
import App from './App';
import './index.css';
import AppProvider from './AppContext';
import Balance from './pages/Balance';
import TokenDetail from './pages/TokenDetail';
import Send from './pages/Send';
import Receive from './pages/Receive';
import ValidateAddress from './pages/ValidateAddress';
import Status from './pages/Status';
import TokenCreation from './pages/TokenCreation/TokenCreation';
import NFTs from './pages/NFT';
import CreateNFT from './pages/NFT/CreateNFT';
import History from './pages/History';
import HistoryTransactionDetailSimple from './pages/HistoryTransactionDetailSimple';

const router = createHashRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route index element={<Navigate replace to="balance" />} />
            <Route path="balance" element={<Balance />} />
            <Route path="balance/:tokenid" element={<TokenDetail />} />
            <Route path="send" element={<Send />} />
            <Route path="receive" element={<Receive />} />
            <Route path="validate" element={<ValidateAddress />} />
            <Route path="status" element={<Status />} />
            <Route path="tokencreate" element={<TokenCreation />} />
            <Route path="nfts" element={<NFTs />} />
            <Route path="nfts/createnft" element={<CreateNFT />} />
            <Route path="history" element={<History />}>
                <Route path=":transactionid" element={<HistoryTransactionDetailSimple />} />
            </Route>
            <Route path="*" element={<Navigate replace to="balance" />} />
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
