import { createContext, useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { SnackbarProvider } from 'notistack';
import AppNavigation from './AppRoutes';
import { MinimaToken } from './types/minima';
import { commands, ws } from '@minima-global/mds-api';
import { useLocation } from 'react-router-dom';

// Create a context provider to give balance updates to consumers in the app
const BalanceUpdates = createContext<MinimaToken[]>([]);

interface AllBalance {
    prevBalance: MinimaToken[];
    newBalance: MinimaToken[];
}

export default function App() {
    // console.log('App re-render');
    const [myBalance, setMyBalance] = useState<AllBalance>({ prevBalance: [], newBalance: [] });
    const [blockNumber, setBlockNumber] = useState(-1);

    const oldBalance = JSON.stringify(myBalance.prevBalance);
    const newBalance = JSON.stringify(myBalance.newBalance);

    let isDifferent = false;
    // console.log(oldBalance);
    // so we don't get a toast message for the first time we load app since prevBalance is empty && will be different
    if (oldBalance !== '[]') {
        isDifferent = oldBalance !== newBalance;
    }

    //const isDifferent = oldBalance !== newBalance;
    console.log(`Has balanced changed? `, isDifferent);

    // call and store balance with timer
    const callAndStoreBalance = useCallback(
        (time: number) => {
            setTimeout(() => {
                console.log(`CALLING BALANCE @ ${time} min timer`);
                commands
                    .balance()
                    .then((data) => {
                        setMyBalance((oldVal) => {
                            return { prevBalance: oldVal.newBalance, newBalance: data };
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }, time);
        },
        [commands]
    );

    // call getBalance on page reload (router navigate)
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === '/balance') {
            callAndStoreBalance(0);
        }
    }, [location, callAndStoreBalance]);

    useEffect(() => {
        if (ws)
            ws.onmessage = (evt: any) => {
                let data = JSON.parse(evt.data);
                console.log('Minima Event', data);
                const event = data.event;
                data = data.data;
                switch (event) {
                    case 'NEWBALANCE':
                        callAndStoreBalance(0);
                        callAndStoreBalance(2 * 60 * 1000); // 2 min
                        callAndStoreBalance(3 * 60 * 1000); // 3 min
                        callAndStoreBalance(5 * 60 * 1000); // 5 min
                        callAndStoreBalance(10 * 60 * 1000); // 10 min
                        break;
                    case 'NEWBLOCK':
                        // setBlockNumber(parseInt(data.txpow.header.block));
                        // callAndStoreBalance();
                        break;
                    case 'MINING':
                        // do nothing
                        break;
                    default:
                    //console.error('Unknown event type: ', evt.event);
                }
            };

        // get balance straight away
        callAndStoreBalance(0);
    }, [callAndStoreBalance]);

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <CssBaseline />
                <BalanceUpdates.Provider value={myBalance.newBalance}>
                    <AppNavigation showNewBalanceSnack={isDifferent} />
                </BalanceUpdates.Provider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export { BalanceUpdates };
