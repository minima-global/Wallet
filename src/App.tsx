import { createContext, useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { SnackbarProvider } from 'notistack';
import AppNavigation from './AppNavigation';
import { MinimaToken } from './types/minima';
import Notifications from './layout/Notifications';

import { MDS } from './minima/mds';
import { callBalance } from './minima/rpc-commands';
// Create a context provider to give balance updates to consumers in the app
const BalanceUpdates = createContext<MinimaToken[]>([]);

interface AllBalance {
    prevBalance: MinimaToken[];
    newBalance: MinimaToken[];
}

export default function App() {
    const [myBalance, setMyBalance] = useState<AllBalance>({ prevBalance: [], newBalance: [] });

    const oldBalance = JSON.stringify(myBalance.prevBalance);
    const newBalance = JSON.stringify(myBalance.newBalance);
    let isDifferent = false;
    // so we don't get a toast message for the first time we load app since prevBalance is empty && will be different
    if (oldBalance !== '[]') {
        isDifferent = oldBalance !== newBalance;
    }
    // console.log(`Has balanced changed? `, isDifferent);
    // console.log('Balance', myBalance);

    // call and store balance with timer
    const callAndStoreBalance = useCallback((time: number) => {
        setTimeout(() => {
            // console.log('APP.tsx Calling balance!');
            callBalance()
                .then((data: any) => {
                    // console.log(`Myblanace data`, data);
                    setMyBalance((oldVal) => {
                        return { prevBalance: oldVal.newBalance, newBalance: data.response };
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
        }, time);
    }, []);

    useEffect(() => {
        MDS.init((msg: any) => {
            // console.log(msg);
            const evt = msg.event;

            switch (evt) {
                case 'inited':
                    // get balance straight away
                    callAndStoreBalance(0);
                    break;
                case 'NEWBALANCE':
                    callAndStoreBalance(0);
                    callAndStoreBalance(2 * 60 * 1000); // 2 min
                    callAndStoreBalance(3 * 60 * 1000); // 3 min
                    callAndStoreBalance(5 * 60 * 1000); // 5 min
                    callAndStoreBalance(10 * 60 * 1000); // 10 min
                    break;
                case 'NEWBLOCK':
                    break;
                case 'MINING':
                    break;
                default:
            }
        });
    }, [callAndStoreBalance]);

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <CssBaseline />
                <BalanceUpdates.Provider value={myBalance.newBalance}>
                    <AppNavigation />
                    <Notifications showNewBalanceSnack={isDifferent}></Notifications>
                </BalanceUpdates.Provider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export { BalanceUpdates };
