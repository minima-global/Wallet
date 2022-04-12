import {
    Snackbar,
    Alert,
    IconButton,
    Toolbar,
    AppBar,
    Grid,
    Drawer,
    Box,
    Container,
    Typography,
    Portal,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Balance from './pages/Balance';
import Send from './pages/Send';
import Status from './pages/Status';
import Receive from './pages/Receive';
import TokenCreation from './pages/TokenCreation';
import TokenDetail from './pages/components/TokenDetail';

import { DRAWERWIDTH } from './shared/constants';
import SideMenu from './layout/SideMenu';
import useMinimaInit from './minima/useMinimaInit';
import { BalanceUpdates } from './App';

export interface RouteType {
    path: string;
    sidebarName: string;
    element: JSX.Element;
}

const AppNavigation = () => {
    const [open, setOpen] = useState(false);
    const [pageTitle, setPageTitle] = useState('Balance');
    // open modal
    const [showNewBalanceSnack, setShowNewBalanceSnack] = useState(false);
    const updates = useContext(BalanceUpdates);

    // Back Button
    const [onDetail, setOnDetail] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const handleDrawerToggle = () => {
        setOpen((op) => !op);
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
            name: 'Mint Token',
        },
    ];

    useEffect(() => {
        // if it's empty no need to show a new balance notification
        if (!updates.length) {
            return;
        }
        setShowNewBalanceSnack(true);
        setTimeout(() => setShowNewBalanceSnack(false), 3000);
    }, [updates]);

    useEffect(() => {
        getPageTitle();
        if (location.pathname.substring(0, 9) === '/balance/') {
            // console.log('Token Detail page');
            setOnDetail(true);
            setPageTitle('Token Details');
        } else {
            setOnDetail(false);
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
            <Portal>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    autoHideDuration={3000}
                    open={showNewBalanceSnack}
                >
                    <Alert severity="success" sx={{ backgroundColor: '#317AFF', width: '100%', color: '#fff' }}>
                        Balance update!
                    </Alert>
                </Snackbar>
            </Portal>
            <AppBar position="static" sx={appwidth}>
                <Toolbar sx={start}>
                    {onDetail ? null : (
                        <IconButton
                            sx={{ display: { xs: 'block', sm: 'none' } }}
                            color="inherit"
                            aria-label="menu"
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    {onDetail ? (
                        <IconButton
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            <ArrowBackIcon sx={{ color: '#fff' }} />
                        </IconButton>
                    ) : null}
                    <Typography variant="h6">{pageTitle}</Typography>
                </Toolbar>
            </AppBar>
            <Grid component="main" container sx={appwidth}>
                <Grid item xs={12}>
                    <Container>
                        <Routes>
                            <Route path="/" element={<Navigate replace to="/balance" />} />
                            <Route path="/balance" element={<Balance />} />
                            <Route path="balance/:tokenid" element={<TokenDetail />} />
                            <Route path="/send" element={<Send />} />
                            <Route path="/receive" element={<Receive />} />
                            <Route path="/status" element={<Status />} />
                            <Route path="/tokencreate" element={<TokenCreation />} />
                        </Routes>
                    </Container>
                </Grid>
            </Grid>
            <Box component="nav" sx={nav} aria-label="mailbox folders">
                <Drawer
                    variant="temporary"
                    open={open}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={drawerdisplay}
                >
                    <SideMenu handleDrawerToggle={handleDrawerToggle} />
                </Drawer>
                <Drawer variant="permanent" sx={drawerdisplaydesktop}>
                    <SideMenu handleDrawerToggle={handleDrawerToggle} />
                </Drawer>
            </Box>
        </>
    );
};
const nav = {
    width: { sm: DRAWERWIDTH },
    flexShrink: { sm: 0 },
};
const start = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
};
const appwidth = {
    width: { sm: `calc(100% - ${DRAWERWIDTH}px)` },
    ml: { sm: `${DRAWERWIDTH}px` },
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
