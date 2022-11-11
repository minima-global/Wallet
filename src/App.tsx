import { createContext, useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { SnackbarProvider } from 'notistack';
import AppNavigation from './AppNavigation';
import Notifications from './layout/Notifications';

import { useAppDispatch } from './minima/redux/hooks';
import { callAndStoreBalance, initFavoritesTableAndUpdate, onNewBlock } from './minima/redux/slices/balanceSlice';
import { events } from './minima/libs/events';

import { toggleNotification } from './minima/redux/slices/notificationSlice';
import { updateMiningState } from './minima/redux/slices/miningSlice';
import { createFavoritesTable } from './minima/libs/nft';

export default function App() {
    // const [myBalance, setMyBalance] = useState<AllBalance>({ prevBalance: [], newBalance: [] });
    const [isMining, setIsMining] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    useEffect(() => {
        events.onInit(() => {
            dispatch(callAndStoreBalance());

            // init sql tables
            createFavoritesTable();
            dispatch(initFavoritesTableAndUpdate());
        });

        events.onNewBlock(() => {
            dispatch(onNewBlock());
        });

        events.onNewBalance(() => {
            // console.log(`new balance update..`);
            const balanceNotification = {
                message: 'New balance update',
                severity: 'info',
                type: 'info',
            };
            dispatch(
                toggleNotification(balanceNotification.message, balanceNotification.severity, balanceNotification.type)
            );
            dispatch(callAndStoreBalance());
        });

        events.onMining((data) => {
            const isMining = data.mining;
            const isTransaction = data.txpow.body.txn.inputs.length > 0 ? true : false;

            // console.log(data.txpow);

            // console.log('Is mining?', data.mining);
            // console.log('am i transaction?', data.txpow.body.txn.inputs.length > 0);

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
