import { createContext, useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { SnackbarProvider } from 'notistack';
import AppNavigation from './AppRoutes';
import useMinimaInit from './minima/useMinimaInit';
import { MinimaToken } from './types/minima';
import { nodeEvent, ws } from '@minima-global/mds-api';
import { Commands } from '@minima-global/mds-api';

// Create a context provider to give balance updates to consumers in the app
const BalanceUpdates = createContext<MinimaToken[]>([]);

let mdsApi: Commands;

export default function App() {
    const [myBalance, setMyBalance] = useState<MinimaToken[]>([]);

    try {
        mdsApi = new Commands();
    } catch (e) {
        console.log(`Failed to create commands object`);
    }

    useEffect(() => {
        if (ws)
            ws.onmessage = (evt: any) => {
                let data = JSON.parse(evt.data);
                //console.log(data);

                // console.log('Data after parse', data);
                // console.log('Data after stringify', JSON.stringify(data.data));

                // Event type
                const event = data.event;
                // Data sent with event
                data = data.data;
                switch (event) {
                    case 'NEWBALANCE':
                        //console.log('New balance available.');

                        mdsApi
                            .balance()
                            .then((data) => {
                                // console.log(`Setting balance..`, data);
                                setMyBalance(data);
                            })
                            .catch((err) => {
                                console.error(err);
                                // setMyBalance([]);
                            });

                        break;
                    default:
                    //console.error('Unknown event type: ', evt.event);
                }
            };
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <CssBaseline />
                <BalanceUpdates.Provider value={myBalance && myBalance.length ? myBalance : []}>
                    <AppNavigation />
                </BalanceUpdates.Provider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export { BalanceUpdates };
