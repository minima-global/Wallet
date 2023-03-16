import { useState, useEffect } from 'react';
import checkAddress from '../../../../minima/commands/checkAddress';

import styles from './TransactionAmount.module.css';

interface IProps {
    address: string;
    amount: string;
}

type Transaction = 'Receive' | 'Send';
const TransactionAmount = ({ address, amount }: IProps) => {
    const [type, setType] = useState<false | Transaction>(false);

    useEffect(() => {
        checkAddress(address).then((res) => {
            if (res.relevant) return setType('Receive');
        });
        setType('Send');
    }, []);

    return (
        <p id="amount" className={styles[type === 'Receive' ? 'receive' : 'send']}>
            {amount}
        </p>
    );
};

export default TransactionAmount;
