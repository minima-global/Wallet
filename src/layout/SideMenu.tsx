import {
    Toolbar,
    Typography,
    ListItemText,
    Button,
    Box,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    Radio,
    Grid,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Routes from '../AppRoutes';
// import useBlockNumber from '../minima/useBlockNumber';
import { ReactComponent as LandscapeLogo } from './LANDSCAPE-01.svg';
import useMinimaInit from '../minima/useMinimaInit';

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
        <>
            <Toolbar />
            <Toolbar />
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

            <Typography pl={2} mt={10}>
                {/* Latest Block: {blockNumber} */}
                {connected ? 'Connected' : 'Not Connected'}
            </Typography>
            <Button variant="contained" sx={{ ml: 2, mr: 2, mt: 4 }}>
                Urgent CTA
            </Button>

            <Grid container sx={{ pl: 2, pr: 2, mt: 4 }} alignItems="flex-end">
                <Grid item xs={4}>
                    <Box sx={{ fontSize: 12, letterSpacing: 0.02, lineHeight: 1.5 }}>Powered by</Box>
                </Grid>
                <Grid item xs={8}>
                    <LandscapeLogo></LandscapeLogo>
                </Grid>
            </Grid>
        </>
    );
};

export default SideMenu;
