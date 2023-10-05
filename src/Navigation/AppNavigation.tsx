import { Drawer } from '@mui/material';
import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Balance from '../pages/Balance';
import Send from '../pages/Send';
import Status from '../pages/Status';
import Receive from '../pages/Receive';
import TokenCreation from '../pages/TokenCreation/TokenCreation';
import TokenDetail from '../pages/TokenDetail';
import SideMenu from '../layout/SideMenu';
import Offline from '../pages/Offline';
import NFTs from '../pages/NFT';

import CreateNFT from '../pages/components/nfts/CreateNFT';
import NFTDetail from '../pages/NFTDetail';
import History from '../pages/History';
import HistoryTransactionDetailSimple from '../pages/HistoryTransactionDetailSimple';
import Notification from '../components/UI/Notification';
import { appContext } from '../AppContext';
import ValidateAddress from '../pages/ValidateAddress';

export interface RouteType {
    path: string;
    sidebarName: string;
    element: JSX.Element;
}

const AppNavigation = () => {
    const { openDrawer, setOpenDrawer } = useContext(appContext);
    return (
        <>
            <Notification />
            <main id="navigation" className="md:ml-[240px] h-screen">
                <Routes>
                    <Route path="/" element={<Navigate replace to="/balance" />} />
                    <Route path="/balance" element={<Balance />} />
                    <Route path="balance/:tokenid" element={<TokenDetail />} />
                    <Route path="/send/:tokenid?/:amount?/:address?/:burn?" element={<Send />} />
                    <Route path="/receive" element={<Receive />} />
                    <Route path="/validate" element={<ValidateAddress />} />
                    <Route path="/status" element={<Status />} />
                    <Route path="/tokencreate" element={<TokenCreation />} />
                    <Route path="/nfts" element={<NFTs />}></Route>
                    <Route path="nfts/:tokenid" element={<NFTDetail />} />
                    <Route path="/createnft" element={<CreateNFT />} />
                    <Route path="/history" element={<History />}>
                        <Route path=":transactionid" element={<HistoryTransactionDetailSimple />} />
                    </Route>
                    <Route path="/offline" element={<Offline />} />
                    <Route path="*" element={<Navigate replace to="/balance" />} />
                </Routes>
            </main>
            <div>
                <Drawer
                    variant="temporary"
                    open={openDrawer}
                    onClose={(event, reason) => {
                        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
                            setOpenDrawer(false);
                        }
                    }}
                    ModalProps={{ keepMounted: true }}
                    className="md:hidden grid"
                >
                    <SideMenu />
                </Drawer>
                <Drawer variant="permanent" className="hidden md:grid">
                    <SideMenu />
                </Drawer>
            </div>
        </>
    );
};

export default AppNavigation;
