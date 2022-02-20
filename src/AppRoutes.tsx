import { IconButton, Toolbar, AppBar, Grid, Drawer, Box, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

import Balance from './pages/Balance';
import Send from './pages/Send';
import Status from './pages/Status';
import Receive from './pages/Receive';
import TokenCreation from './pages/TokenCreation';
import TokenDetails from './pages/TokenDetails';

import { DRAWERWIDTH } from './shared/constants';
import SideMenu from './layout/SideMenu';

export interface RouteType {
    path: string;
    sidebarName: string;
    element: JSX.Element;
}

const AppNavigation = () => {
    const [open, setOpen] = useState(false);
    const [pageTitle, setPageTitle] = useState('Balance');
    const location = useLocation();
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
        getPageTitle();
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
            <AppBar position="static" sx={appwidth}>
                <Toolbar sx={start}>
                    <IconButton
                        sx={{ display: { xs: 'block', sm: 'none' } }}
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">{pageTitle}</Typography>
                </Toolbar>
            </AppBar>
            <Grid component="main" container sx={appwidth}>
                <Grid item xs={12}>
                    <Container>
                        <Routes>
                            <Route path="/" element={<Navigate to="/balance" />} />
                            <Route path="/balance" element={<Balance />} />
                            <Route path="/tokendetails" element={<TokenDetails />}></Route>
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
    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWERWIDTH },
};

export default AppNavigation;
