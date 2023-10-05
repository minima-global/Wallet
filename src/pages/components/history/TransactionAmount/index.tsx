import { useState, useEffect } from 'react';
import * as rpc from '../../../../__minima__/libs/RPC';

import styles from './TransactionAmount.module.css';

interface IProps {
    address: string;
    amount: string;
}

type Transaction = 'Receive' | 'Send';
const TransactionAmount = ({ address, amount }: IProps) => {
    const [type, setType] = useState<false | Transaction>(false);

    useEffect(() => {
        rpc.checkAddress(address)
            .then((res) => {
                if (res.relevant) return setType('Receive');
            })
            .catch((err) => {});

        setType('Send');
    }, [address]);

    return (
        <p id="amount" className={styles[type === 'Receive' ? 'receive' : 'send']}>
            {amount === '0' ? 'Balance unchanged' : amount}
        </p>
    );
};

export default TransactionAmount;
