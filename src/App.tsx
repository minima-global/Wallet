import { createContext, useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { SnackbarProvider } from 'notistack';
import AppNavigation from './AppRoutes';
import { MinimaToken } from './types/minima';
import { commands, ws } from '@minima-global/mds-api';
import { useLocation, useNavigate } from 'react-router-dom';

// Create a context provider to give balance updates to consumers in the app
const BalanceUpdates = createContext<MinimaToken[]>([]);

export default function App() {
    const [myBalance, setMyBalance] = useState<MinimaToken[]>([]);
    const [blockNumber, setBlockNumber] = useState(-1);
    const navigate = useNavigate();

    // call and store balance with timer
    const callAndStoreBalance = useCallback(
        (time: number) => {
            setTimeout(() => {
                console.log('CALLING BALANCE');
                commands
                    .balance()
                    .then((data) => {
                        setMyBalance(data);
                    })
                    .catch((err) => {
                        console.error(err);
                        console.log('navigating');
                        navigate('/offline');
                    });
            }, time);
        },
        [commands, navigate]
    );

    // call getBalance on page reload (router navigate)
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === '/balance') {
            callAndStoreBalance(0);
        }
    }, [location]);

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
                        setBlockNumber(parseInt(data.txpow.header.block));
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
                <BalanceUpdates.Provider value={myBalance && myBalance.length ? myBalance : []}>
                    <AppNavigation blockNumber={blockNumber} />
                </BalanceUpdates.Provider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export { BalanceUpdates };
