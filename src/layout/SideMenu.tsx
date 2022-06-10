import {
    Toolbar,
    Typography,
    ListItemText,
    Box,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    Radio,
    Grid,
    Chip,
    ListItemButton,
} from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ReactComponent as LandscapeLogo } from '../assets/images/LANDSCAPE-01.svg';

import WalletIcon from '../assets/images/minimaWallet-01.png';
import LensIcon from '@mui/icons-material/Lens';

interface DrawerItem {
    pathname: string;
    name: string;
    onClick?: () => void;
}

interface IProps {
    handleDrawerOpen: () => void;
    handleDrawerClose: () => void;

    // blockNumber: number;
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
                <Toolbar sx={{ backgroundColor: '#fff', padding: '0px 16px!important' }} variant="dense">
                    <img src={WalletIcon} alt="walletIcon" id="walletIcon" />
                    <Typography sx={style.appName} variant="h4">
                        Wallet
                    </Typography>
                </Toolbar>
                <Divider />

                <List sx={{ backgroundColor: '#fefefe', padding: '8px 8px' }}>
                    {DrawerItems.map((route: DrawerItem, i) => {
                        return (
                            <ListItemButton
                                onClick={() => {
                                    handleDrawerOnNavigation(route.pathname);
                                }}
                                key={i}
                                selected={activeRoute(route.pathname)}
                            >
                                <ListItemIcon>
                                    <Radio sx={{ p: 0 }} checked={activeRoute(route.pathname)} />
                                </ListItemIcon>

                                <ListItemText primary={route.name} />
                            </ListItemButton>
                        );
                    })}
                </List>

                <Divider />
            </Grid>
            <Grid item sx={{ backgroundColor: '#fff', pb: 1 }}>
                {/* <Box sx={{ pl: 2 }}>{blockNumber === -1 ? 'Latest Block: ...' : 'Latest Block: ' + blockNumber}</Box> */}
                <Grid container sx={{ pl: 2, pr: 2, mt: 4, mb: 0, backgroundColor: '#fff' }} alignItems="flex-end">
                    <Grid item xs={4}>
                        <Box sx={{ letterSpacing: 0.02, lineHeight: 1.5 }}>Powered by</Box>
                    </Grid>
                    <Grid item xs={8}>
                        <LandscapeLogo></LandscapeLogo>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SideMenu;

const style = {
    appName: {
        fontWeight: '800',
        marginLeft: 1,
        mb: 0.25,
        ml: 2.5,
    },
};
