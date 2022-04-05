import { useState, useEffect } from 'react';
import { ws } from '@minima-global/mds-api';

const useMinimaInit = () => {
    const [balanceEvent, setBalanceEvent] = useState<number>(0);

    useEffect(() => {
        if (ws)
            ws.onmessage = (evt: any) => {
                let data = JSON.parse(evt.data);

                // console.log('Data after parse', data);
                // console.log('Data after stringify', JSON.stringify(data.data));

                // Event type
                const event = data.event;
                // Data sent with event
                data = data.data;
                switch (event) {
                    case 'NEWBALANCE':
                        // console.log('Balance data', data);
                        console.log('NEWBALANCE');
                        console.log('balanceEvent current value:', balanceEvent);
                        setBalanceEvent(balanceEvent + 1);
                        break;
                    default:
                        console.error('Unknown event type: ', evt.event);
                }
            };

        // Minima.init((msg: any) => {
        //     if (msg.event == 'connected') {
        //         setConnected(true);
        //     }
        // });
    }, []);

    return balanceEvent;
};

export default useMinimaInit;
