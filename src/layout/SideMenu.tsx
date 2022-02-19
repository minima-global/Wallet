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
// import Routes from '../AppRoutes';
// import useBlockNumber from '../minima/useBlockNumber';
import { ReactComponent as LandscapeLogo } from '../assets/images/LANDSCAPE-01.svg';
import useMinimaInit from '../minima/useMinimaInit';

import WalletIcon from '../assets/images/minimaWallet-01.png';
import LensIcon from '@mui/icons-material/Lens';

interface DrawerItem {
    pathname: string;
    name: string;
    onClick?: () => void;
}

interface IProps {
    handleDrawerToggle: () => void;
}

const SideMenu = ({ handleDrawerToggle }: IProps) => {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const connected = useMinimaInit();
    const activeRoute = (routeName: string) => {
        return routerLocation.pathname === routeName || routeName === '' ? true : false;
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
            name: 'Mint Token',
            onClick: () => navigate('/tokencreate'),
        },
    ];

    return (
        <Grid
            container
            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '95vh' }}
        >
            <Grid item>
                <Toolbar>
                    <img src={WalletIcon} alt="walletIcon" id="walletIcon" />
                    <Typography sx={style.appName} variant="h6">
                        Wallet
                    </Typography>
                </Toolbar>
                <Divider />

                <List>
                    {DrawerItems.map((route: DrawerItem, i) => {
                        return (
                            <ListItemButton onClick={route.onClick} key={i}>
                                <ListItemIcon>
                                    <Radio sx={{ p: 0 }} checked={activeRoute(route.pathname)} />
                                </ListItemIcon>

                                <ListItemText primary={route.name}></ListItemText>
                            </ListItemButton>
                        );
                    })}
                </List>

                <Divider />
            </Grid>
            <Grid item>
                <Box sx={{ display: 'flex', margin: 1 }}>
                    <Chip
                        variant="outlined"
                        icon={
                            connected ? (
                                <LensIcon sx={{ width: 14, height: 14, fill: '#b6f4ee' }} />
                            ) : (
                                <LensIcon sx={{ width: 14, height: 14, fill: 'red' }} />
                            )
                        }
                        label={connected ? 'Connected' : 'Offline'}
                    />
                </Box>

                <Grid container sx={{ pl: 2, pr: 2, mt: 4 }} alignItems="flex-end">
                    <Grid item xs={4}>
                        <Box sx={{ fontSize: 12, letterSpacing: 0.02, lineHeight: 1.5 }}>Powered by</Box>
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
    },
};
