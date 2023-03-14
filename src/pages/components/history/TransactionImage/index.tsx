import { useState, useEffect } from 'react';
import checkAddress from '../../../../minima/commands/checkAddress';

import styles from './TransactionImage.module.css';

interface IProps {
    address: string;
}

type Transaction = 'Receive' | 'Send' | 'Token';
const TransactionImage = ({ address }: IProps) => {
    const [type, setType] = useState<false | Transaction>(false);

    useEffect(() => {
        if (address === '0xFF') {
            return setType('Token');
        }
        checkAddress(address).then((res) => {
            if (res.relevant) return setType('Receive');
        });

        setType('Send');
    }, []);

    return (
        <img
            src={type === 'Receive' ? '' : type === 'Send' ? '' : type === 'Token' ? '' : ''}
            className={styles[type === 'Receive' || type === 'Token' ? 'receive' : 'send']}
        />
    );
};

export default TransactionImage;
