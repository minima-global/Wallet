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
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Routes from '../AppRoutes';
// import useBlockNumber from '../minima/useBlockNumber';
import { ReactComponent as LandscapeLogo } from './LANDSCAPE-01.svg';
import useMinimaInit from '../minima/useMinimaInit';

import WalletIcon from '../assets/images/minimaWallet-01.png';
import LensIcon from '@mui/icons-material/Lens';

interface IProps {
    handleDrawerToggle: () => void;
}

const SideMenu = ({ handleDrawerToggle }: IProps) => {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    // const blockNumber = useBlockNumber();
    const connected = useMinimaInit();
    const activeRoute = (routeName: any) => {
        return routerLocation.pathname === routeName ? true : false;
    };

    const onMenuItemClicked = (path: string) => () => {
        navigate(path);
        handleDrawerToggle();
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '95vh' }}>
            <Box>
                <Toolbar>
                    <img src={WalletIcon} alt="walletIcon" id="walletIcon" />
                    <Typography sx={style.appName} variant="h6">
                        Wallet
                    </Typography>
                </Toolbar>
                <Divider />

                <List>
                    {Routes.map((route, i) => {
                        return (
                            <ListItem button onClick={onMenuItemClicked(route.path)} key={i}>
                                <ListItemIcon>
                                    <Radio sx={{ p: 0 }} checked={activeRoute(route.path)} />
                                </ListItemIcon>

                                <ListItemText primary={route.sidebarName} />
                            </ListItem>
                        );
                    })}
                </List>

                <Divider />
            </Box>
            <Box>
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
                {/* <Button variant="contained" sx={{ ml: 2, mr: 2, mt: 4 }}>
                Urgent CTA
            </Button> */}

                <Grid container sx={{ pl: 2, pr: 2, mt: 4 }} alignItems="flex-end">
                    <Grid item xs={4}>
                        <Box sx={{ fontSize: 12, letterSpacing: 0.02, lineHeight: 1.5 }}>Powered by</Box>
                    </Grid>
                    <Grid item xs={8}>
                        <LandscapeLogo></LandscapeLogo>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default SideMenu;

const style = {
    appName: {
        fontWeight: '800',
        marginLeft: 1,
    },
};
