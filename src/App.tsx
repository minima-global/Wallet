import { createContext, useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { SnackbarProvider } from 'notistack';
import AppNavigation from './AppNavigation';
import { MinimaToken } from './types/minima';
import Notifications from './layout/Notifications';

import { callBalance } from './minima/rpc-commands';

import { useAppDispatch, useAppSelector } from './minima/redux/hooks';
import { callAndStoreBalance, selectBalance } from './minima/redux/slices/balanceSlice';
import { events } from './minima/libs/events';
import { toggleNotification } from './minima/redux/slices/notificationSlice';

// Create a context provider to give balance updates to consumers in the app
const BalanceUpdates = createContext<MinimaToken[]>([]);

interface AllBalance {
    prevBalance: MinimaToken[];
    newBalance: MinimaToken[];
}

export default function App() {
    // const [myBalance, setMyBalance] = useState<AllBalance>({ prevBalance: [], newBalance: [] });
    const [isMining, setIsMining] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    useEffect(() => {
        events.onNewBalance(() => {
            const balanceNotification = {
                message: 'New balance update',
                severity: 'info',
                type: 'info',
            };
            dispatch(
                toggleNotification(balanceNotification.message, balanceNotification.severity, balanceNotification.type)
            );
            dispatch(callAndStoreBalance(0));
            dispatch(callAndStoreBalance(2 * 60 * 1000)); // 2 mins
            dispatch(callAndStoreBalance(3 * 60 * 1000)); // 3 mins
            dispatch(callAndStoreBalance(5 * 60 * 1000)); // 5 mins
            dispatch(callAndStoreBalance(10 * 60 * 1000)); // 10 mins
        });
    }, []);

    // const myBalance = useAppSelector(selectBalance);
    // const oldBalance = JSON.stringify(myBalance);
    // const newBalance = JSON.stringify(myBalance);
    // let isDifferent = false;
    // so we don't get a toast message for the first time we load app since prevBalance is empty && will be different
    // if (oldBalance !== '[]') {
    //     isDifferent = oldBalance !== newBalance;
    // }

    // call and store balance with timer
    // const callAndStoreBalance = useCallback((time: number) => {
    //     setTimeout(() => {
    //         callBalance()
    //             .then((data: any) => {
    //                 setMyBalance((oldVal) => {
    //                     return { prevBalance: oldVal.newBalance, newBalance: data.response };
    //                 });
    //             })
    //             .catch((err) => {
    //                 console.error(err);
    //             });
    //     }, time);
    // }, []);

    // useEffect(() => {
    //     // MDS.DEBUG_HOST = '127.0.0.1';
    //     // MDS.DEBUG_PORT = 9003;
    //     // MDS.DEBUG_MINIDAPPID = '0x3D520CF721D06484C18AF669442CD28B3DDED1A2516B263BF58398AA66F32C31';

    //     MDS.init((msg: any) => {
    //         const evt = msg.event;

    //         switch (evt) {
    //             case 'inited':
    //                 // get balance straight away
    //                 callAndStoreBalance(0);
    //                 break;
    //             case 'NEWBALANCE':
    //                 callAndStoreBalance(0);
    //                 callAndStoreBalance(2 * 60 * 1000); // 2 min
    //                 callAndStoreBalance(3 * 60 * 1000); // 3 min
    //                 callAndStoreBalance(5 * 60 * 1000); // 5 min
    //                 callAndStoreBalance(10 * 60 * 1000); // 10 min
    //                 break;
    //             case 'NEWBLOCK':
    //                 break;
    //             case 'MINING':
    //                 const isMining = msg.data.mining;
    //                 const isTransaction = msg.data.txpow.body.txn.inputs.length > 0 ? true : false;

    //                 // console.log(msg.data.txpow);

    //                 // console.log('Is mining?', msg.data.mining);
    //                 // console.log('am i transaction?', msg.data.txpow.body.txn.inputs.length > 0);

    //                 if (isMining && isTransaction) {
    //                     // console.log(`Node is mining your transaction...`);
    //                     setIsMining(true);
    //                 }

    //                 if (!isMining && isTransaction) {
    //                     // console.log(`Node has finished mining your transaction...`);
    //                     setIsMining(false);
    //                 }

    //                 break;
    //             default:
    //         }
    //     });
    // }, [callAndStoreBalance]);

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <CssBaseline />
                <AppNavigation isMining={isMining} />
                <Notifications></Notifications>
                {/* <BalanceUpdates.Provider value={myBalance.newBalance}>
                </BalanceUpdates.Provider> */}
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export { BalanceUpdates };
