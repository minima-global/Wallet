import { createContext, useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { SnackbarProvider } from 'notistack';
import AppNavigation from './AppRoutes';
import { MinimaToken } from './types/minima';
import { nodeEvent, ws } from '@minima-global/mds-api';
import { Commands } from '@minima-global/mds-api';

// Create a context provider to give balance updates to consumers in the app
const BalanceUpdates = createContext<MinimaToken[]>([]);

let mdsApi: Commands;

export default function App() {
    const [myBalance, setMyBalance] = useState<MinimaToken[]>([]);
    const [blockNumber, setBlockNumber] = useState(-1);

    try {
        mdsApi = new Commands();
    } catch (e) {
        console.log(`Failed to create commands object`);
    }

    useEffect(() => {
        if (ws)
            ws.onmessage = (evt: any) => {
                let data = JSON.parse(evt.data);
                console.log('Minima Event', data);
                const event = data.event;
                data = data.data;
                switch (event) {
                    case 'NEWBALANCE':
                        mdsApi
                            .balance()
                            .then((data) => {
                                setMyBalance(data);
                            })
                            .catch((err) => {
                                console.error(err);
                            });

                        break;
                    case 'NEWBLOCK':
                        setBlockNumber(parseInt(data.txpow.header.block));
                        mdsApi
                            .balance()
                            .then((data) => {
                                setMyBalance(data);
                            })
                            .catch((err) => {
                                console.error(err);
                            });

                        break;
                    case 'MINING':
                        // do nothing
                        break;
                    default:
                    //console.error('Unknown event type: ', evt.event);
                }
            };

        // get balance straight away
        mdsApi
            .balance()
            .then((data) => {
                setMyBalance(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

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
