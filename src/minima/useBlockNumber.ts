import { useState, useEffect } from 'react';
import { callStatus } from './rpc-commands';

const useBlockNumber = () => {
    const [blockNumber, setBlockNumber] = useState(-1);

    useEffect(() => {
        setInterval(() => {
            callStatus().then(
                (data: any) => {
                    setBlockNumber(data.response.chain.block);
                },
                (err) => {
                    console.error(err);
                    setBlockNumber(-1);
                }
            );
        }, 10000);
    }, []);

    return blockNumber;
};

export default useBlockNumber;
