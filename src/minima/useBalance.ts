import { useState, useEffect } from 'react';
import { MinimaToken } from '../types/minima';
import { callBalance } from './rpc-commands';


const useBalance = () => {
    const [balance, setBalance] = useState<MinimaToken[]>([]);

    useEffect(() => {
        callBalance()
            .then((data: any) => {
                if (data.status) {
                    console.log(data.response);
                    setBalance(data.response);
                }
            })
            .catch((err) => {
                console.error(err);
                setBalance([]);
            });
        setInterval(() => {
            callBalance().then(
                (data: any) => {
                    if (data.status) {
                        setBalance(data.response);
                    }
                },
                (err) => {
                    console.error(err);
                    setBalance([]);
                }
            );
        }, 10000);
    }, []);

    return balance;
};

export default useBalance;
