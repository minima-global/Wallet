import {
    Avatar,
    Toolbar,
    Typography,
    ListItemText,
    Divider,
    List,
    ListItemIcon,
    Radio,
    Grid,
    ListItemButton,
    Stack,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
// import { ReactComponent as LandscapeLogo } from '../assets/images/LANDSCAPE-01.svg';

import styles from './SideMenu.module.css';

interface DrawerItem {
    pathname: string;
    name: string;
    onClick?: () => void;
}

interface IProps {
    handleDrawerOpen: () => void;
    handleDrawerClose: () => void;
}

const SideMenu = ({ handleDrawerClose, handleDrawerOpen }: IProps) => {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const activeRoute = (routeName: string) => {
        return routerLocation.pathname === routeName ? true : false;
    };

    //TODO CLOSE MENU ON NAVIGATION
    const handleDrawerOnNavigation = (path: string) => {
        navigate(path);
        handleDrawerClose();
    };

    const DrawerItems: DrawerItem[] = [
        {
            pathname: '/balance',
            name: 'Balance',
            onClick: () => navigate('/balance'),
        },
        {
            pathname: '/send',
            name: 'Send',
            onClick: () => navigate('/send'),
        },
        {
            pathname: '/receive',
            name: 'Receive',
            onClick: () => navigate('/receive'),
        },
        {
            pathname: '/status',
            name: 'Status',
            onClick: () => navigate('/status'),
        },
        {
            pathname: '/tokencreate',
            name: 'Create Token',
            onClick: () => navigate('/tokencreate'),
        },
        {
            pathname: '/nfts',
            name: 'NFTs',
            onClick: () => navigate('/nfts'),
        },
    ];

    return (
        <Stack height="100%" justifyContent="space-between">
            <Stack>
                <Toolbar className={styles['header-toolbar']} variant="dense">
                    <Stack pl={1.5} alignItems="center" justifyContent="center" flexDirection="row" gap={0.8}>
                        <Avatar sx={{ height: 32, width: 32 }} variant="rounded" src="./assets/wallet.svg"></Avatar>
                        <h6>Wallet</h6>
                    </Stack>
                </Toolbar>
                <Divider />

                <List className="MiniSideMenu" sx={{ padding: '8px 8px' }}>
                    {DrawerItems.map((route: DrawerItem, i) => {
                        return (
                            <ListItemButton
                                onClick={() => {
                                    handleDrawerOnNavigation(route.pathname);
                                }}
                                key={i}
                                selected={activeRoute(route.pathname)}
                            >
                                <ListItemIcon sx={{ minWidth: '34px!important' }}>
                                    <Radio sx={{ p: 0 }} checked={activeRoute(route.pathname)} />
                                </ListItemIcon>

                                <ListItemText primary={route.name} />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Stack>

            <Stack className={styles['landscape-icon-wrapper']} direction="row">
                <img src="./assets/minima-landscape.png" />
            </Stack>
        </Stack>
    );
};

export default SideMenu;
