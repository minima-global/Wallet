import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { SnackbarProvider } from 'notistack';
import AppNavigation from './Navigation/AppNavigation';
import Notifications from './layout/Notifications';

import { useAppDispatch } from './minima/redux/hooks';
import { callAndStoreBalance, onNewBlock } from './minima/redux/slices/balanceSlice';
import { events } from './minima/libs/events';

import { toggleNotification } from './minima/redux/slices/notificationSlice';
import { updateMiningState } from './minima/redux/slices/miningSlice';
import { callAndStoreTokens } from './minima/redux/slices/tokenSlice';

export default function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        events.onNewBlock(() => {
            dispatch(onNewBlock());
        });
        events.onNewBalance(() => {
            const balanceNotification = {
                message: 'New balance update',
                severity: 'info',
                type: 'info',
            };
            dispatch(
                toggleNotification(balanceNotification.message, balanceNotification.severity, balanceNotification.type)
            );
            dispatch(callAndStoreBalance());
            dispatch(callAndStoreTokens());
        });

        events.onMining((data) => {
            const isMining = data.mining;
            const isTransaction = data.txpow.body.txn.inputs.length > 0 ? true : false;
            if (isMining && isTransaction) {
                dispatch(updateMiningState(true));
            }

            if (!isMining && isTransaction) {
                dispatch(updateMiningState(false));
            }
        });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <CssBaseline />
                <AppNavigation />
                <Notifications></Notifications>
            </SnackbarProvider>
        </ThemeProvider>
    );
}
