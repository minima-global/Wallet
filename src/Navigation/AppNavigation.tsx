import { IconButton, Grid, Drawer, Box, Typography, Stack, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Balance from '../pages/Balance';
import Send from '../pages/Send';
import Status from '../pages/Status';
import Receive from '../pages/Receive';
import TokenCreation from '../pages/TokenCreation';
import TokenDetail from '../pages/TokenDetail';
import { DRAWERWIDTH } from '../shared/constants';
import SideMenu from '../layout/SideMenu';
import Offline from '../pages/Offline';
import NFTs from '../pages/NFT';
import MiningCog from '../pages/components/mining/MiningCog';
import { useAppSelector } from '../minima/redux/hooks';
import { selectMiningState } from '../minima/redux/slices/miningSlice';
import CreateNFT from '../pages/components/nfts/CreateNFT';
import NFTDetail from '../pages/NFTDetail';
import { selectBalance } from '../minima/redux/slices/balanceSlice';
import { NoResults } from '../shared/components/layout/MiToken';

import styles from './Navigation.module.css';
import History from '../pages/History';
import HistoryTransactionDetail from '../pages/HistoryTransactionDetail';
import HistoryTransactionDetailSimple from '../pages/HistoryTransactionDetailSimple';
import useMinimaStatusCheck from '../hooks/useMinimaStatusCheck';
import Unavailable from '../pages/components/Unavailable';

export interface RouteType {
    path: string;
    sidebarName: string;
    element: JSX.Element;
}

const AppNavigation = () => {
    const [open, setOpen] = useState(false);
    const [pageTitle, setPageTitle] = useState('Balance');
    const isMining = useAppSelector(selectMiningState);
    const { nodeStatus, MDSStatus } = useMinimaStatusCheck();

    // Back Button
    const [onDetail, setOnDetail] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const handleDrawerOpen = () => {
        return open === false ? setOpen(true) : null;
    };

    const handleDrawerClose = () => {
        return open === true ? setOpen(false) : null;
    };

    const DrawerItems = [
        {
            pathname: '/balance',
            name: 'Balance',
        },
        {
            pathname: '/send',
            name: 'Send',
        },
        {
            pathname: '/receive',
            name: 'Receive',
        },
        {
            pathname: '/status',
            name: 'Status',
        },
        {
            pathname: '/tokencreate',
            name: 'Create Token',
        },
        {
            pathname: '/nfts',
            name: 'NFTs',
        },
        {
            pathname: '/createnft',
            name: 'Create NFT',
        },
        {
            pathname: '/history',
            name: 'Transaction History',
        },
        {
            pathname: '/offline',
            name: 'Node Status',
        },
    ];

    useEffect(() => {
        getPageTitle();
        setOnDetail(false);
        if (location.pathname.substring(0, 9) === '/balance/') {
            setOnDetail(true);
            setPageTitle('Token Details');
        }
        if (location.pathname.substring(0, 6) === '/nfts/') {
            setOnDetail(true);
            setPageTitle('NFT Details');
        }

        if (location.pathname.substring(0, 10) === '/createnft') {
            setOnDetail(true);
        }
        if (location.pathname.substring(0, 9) === '/history/') {
            setPageTitle('Transaction Details');
            setOnDetail(true);
        }
    }, [location]);

    const getPageTitle = () => {
        DrawerItems.forEach((p) => {
            if (p.pathname === location.pathname) {
                setPageTitle(p.name);
            }
        });
    };

    return (
        <>
            {nodeStatus === 'offline' && MDSStatus === 'offline' && (
                <Stack mt={2} alignItems="center" justifyContent="center">
                    <CircularProgress size={16} />
                </Stack>
            )}
            {nodeStatus === 'online' && MDSStatus === 'offline' && (
                <Unavailable>
                    <Stack spacing={1} alignItems="center">
                        <img src="./assets/failed.svg" />
                        <Stack>
                            <NoResults>
                                <h6>MDS Unavailable</h6>
                                <p>
                                    Make sure you are logged into your Mini hub and your node is online. <br /> Once you
                                    have logged in, close and re-open this minidapp.
                                </p>
                                <p>
                                    If you are running the Mini hub on Safari make sure you accept security on{' '}
                                    <a>https://127.0.0.1:9004</a>
                                </p>
                            </NoResults>
                        </Stack>
                    </Stack>
                </Unavailable>
            )}
            {nodeStatus === 'online' && MDSStatus === 'online' && (
                <Stack>
                    <header className={styles['navigation']}>
                        <Grid container>
                            <Grid xs={0} md={2} item />
                            <Grid
                                xs={12}
                                md={8}
                                item
                                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <Stack direction="row">
                                    {onDetail ? null : (
                                        <IconButton
                                            sx={{ display: { xs: 'flex', sm: 'none' }, padding: 0, marginRight: 0.5 }}
                                            color="inherit"
                                            aria-label="menu"
                                            onClick={handleDrawerOpen}
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                    )}
                                    {onDetail ? (
                                        <IconButton
                                            sx={{ padding: 0, marginRight: 0.5 }}
                                            onClick={() => {
                                                navigate(-1);
                                            }}
                                        >
                                            <ArrowBackIcon sx={{ color: '#fff' }} />
                                        </IconButton>
                                    ) : null}
                                    <Typography variant="body1" sx={{ fontWeight: '700' }}>
                                        {pageTitle}
                                    </Typography>
                                </Stack>

                                <MiningCog isMining={isMining} />
                            </Grid>
                            <Grid xs={0} md={2} item />
                        </Grid>
                    </header>

                    <Stack className={styles['content']}>
                        <Routes>
                            <Route path="/" element={<Navigate replace to="/balance" />} />
                            <Route path="/balance" element={<Balance />} />
                            <Route path="balance/:tokenid" element={<TokenDetail />} />
                            <Route path="/send" element={<Send />} />
                            <Route path="send/:tokenid" element={<Send />} />
                            <Route path="/receive" element={<Receive />} />
                            <Route path="/status" element={<Status />} />
                            <Route path="/tokencreate" element={<TokenCreation />} />
                            <Route path="/nfts" element={<NFTs />}></Route>
                            <Route path="nfts/:tokenid" element={<NFTDetail />} />
                            <Route path="/createnft" element={<CreateNFT />} />
                            {/* <Route path="/history" element={<History />}>
                                <Route path=":transactionid" element={<HistoryTransactionDetailSimple />} />
                            </Route> */}
                            <Route path="/offline" element={<Offline />} />
                            <Route path="*" element={<Navigate replace to="/balance" />} />
                        </Routes>
                    </Stack>
                    <Box component="nav" className={styles['drawer']}>
                        <Drawer
                            variant="temporary"
                            open={open}
                            onClose={handleDrawerClose}
                            ModalProps={{ keepMounted: true }}
                            sx={drawerdisplay}
                        >
                            <SideMenu handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
                        </Drawer>
                        <Drawer variant="permanent" sx={drawerdisplaydesktop}>
                            <SideMenu handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
                        </Drawer>
                    </Box>
                </Stack>
            )}
        </>
    );
};

const drawerdisplay = {
    display: { xs: 'block', sm: 'none' },
    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWERWIDTH },
};
const drawerdisplaydesktop = {
    display: { xs: 'none', sm: 'block' },
    '& .MuiDrawer-paper': { width: DRAWERWIDTH },
};

export default AppNavigation;
