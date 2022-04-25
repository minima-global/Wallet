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
import Offline from './pages/Offline';

export interface RouteType {
    path: string;
    sidebarName: string;
    element: JSX.Element;
}

const AppNavigation = ({ showNewBalanceSnack }: { showNewBalanceSnack: boolean }) => {
    const [open, setOpen] = useState(false);
    const [pageTitle, setPageTitle] = useState('Balance');

    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        showNewBalanceSnack && setShowToast(true);
    }, [showNewBalanceSnack]);

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
        {
            pathname: '/offline',
            name: 'Node Status',
        },
    ];

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
                    open={showToast}
                    onClose={(event, reason) => {
                        // `reason === 'escapeKeyDown'` if `Escape` was pressed

                        setShowToast(false);
                        // call `event.preventDefault` to only close one Snackbar at a time.
                    }}
                >
                    <Alert severity="success" sx={{ backgroundColor: '#317AFF', width: '100%', color: '#fff' }}>
                        Your balance has changed.
                    </Alert>
                </Snackbar>
            </Portal>
            <AppBar position="static" sx={appwidth}>
                <Toolbar sx={start} variant="dense">
                    {onDetail ? null : (
                        <IconButton
                            sx={{ display: { xs: 'flex', sm: 'none' } }}
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
                    <Typography mb={0.25} variant="h4">
                        {pageTitle}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid component="main" container sx={appwidth}>
                <Grid item xs={12}>
                    <Container>
                        <Routes>
                            <Route path="/" element={<Navigate replace to="/balance" />} />
                            <Route path="/offline" element={<Offline />} />
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
                {/* Drawer on desktop is always open */}
                <Drawer variant="permanent" sx={drawerdisplaydesktop}>
                    <SideMenu handleDrawerToggle={() => {}} />
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
