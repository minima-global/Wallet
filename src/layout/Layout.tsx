import { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, Box, Container } from '@mui/material';
import { appName } from '../shared/constants';
import Routes from '../AppRoutes';
import { RouteType } from '../AppRoutes';
import { useLocation, useRoutes } from 'react-router-dom';
import SideMenu from './SideMenu';
import MenuIcon from '@mui/icons-material/Menu';

import WalletIcon from '../assets/images/minimaWallet-01.png';

const drawerWidth = 240;

export default function Layout() {
    const myRoutes = useRoutes(Routes);
    const [isOpen, setIsOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsOpen((op) => !op);
    };

    const location = useLocation().pathname;

    const getPageName = (allRoutes: RouteType[], currentPath: string) => {
        const foundRoute = allRoutes.find((route) => route.path === currentPath);
        if (typeof foundRoute === 'undefined') {
            console.error('Can not find route for path ' + currentPath);
        } else {
            return foundRoute.sidebarName;
        }
    };

    return (
        <>
            <AppBar
                position="static"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <IconButton
                        sx={{ display: { xs: 'block', sm: 'none' } }}
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography>{getPageName(Routes, location)}</Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="main"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Container maxWidth="xl">{myRoutes}</Container>
            </Box>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    variant="temporary"
                    open={isOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    <SideMenu handleDrawerToggle={handleDrawerToggle}></SideMenu>
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    <SideMenu handleDrawerToggle={handleDrawerToggle}></SideMenu>
                </Drawer>
            </Box>
        </>
    );
}
