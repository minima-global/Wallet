import { useState, useEffect } from 'react';
import checkAddress from '../../../../minima/commands/checkAddress';

import styles from './TransactionImage.module.css';

interface IProps {
    address: string;
    tokenid: string;
}

type Transaction = 'Receive' | 'Send' | 'Token';
const TransactionImage = ({ address, tokenid }: IProps) => {
    const [type, setType] = useState<false | Transaction>(false);

    useEffect(() => {
        if (tokenid === '0xFF') {
            return setType('Token');
        }
        checkAddress(address).then((res) => {
            if (res.relevant) {
                setType('Receive');
            }

            if (!res.relevant) {
                setType('Send');
            }
        });
    }, []);

    return (
        <>
            {type && (
                <img
                    src={
                        type === 'Receive'
                            ? './assets/in.svg'
                            : type === 'Send'
                            ? './assets/out.svg'
                            : './assets/create.svg'
                    }
                    className={styles['img']}
                />
            )}
            {!type && <img />}
        </>
    );
};

export default TransactionImage;
