import { useState, useEffect } from 'react';
import Minima from './minimanew.js';

Minima.setRpcHost();

const useMinimaInit = () => {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        Minima.init((msg: any) => {
            if (msg.event == 'connected') {
                setConnected(true);
            }
        });
    }, []);

    return connected;
};

export default useMinimaInit;
