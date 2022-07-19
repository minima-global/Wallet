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
import { ReactComponent as LandscapeLogo } from '../assets/images/LANDSCAPE-01.svg';

import { ReactComponent as WalletSvg } from '../assets/images/wallet.svg';

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
        <Grid
            container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexGrow: '',
                height: '100vh',
                backgroundColor: '#fff',
            }}
        >
            <Grid item>
                <Toolbar sx={{ borderRight: '0.5px solid #363A3F' }} variant="dense">
                    <Avatar sx={{ ml: 1, height: 32, width: 32 }} variant="rounded">
                        <WalletSvg className="wallet-svg" />
                    </Avatar>
                    <Typography sx={{ ml: 1 }} variant="h6">
                        Wallet
                    </Typography>
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
            </Grid>
            <Stack sx={{ padding: '16px 16px' }} direction="row">
                <LandscapeLogo className="minima-landscape" />
            </Stack>
        </Grid>
    );
};

export default SideMenu;
