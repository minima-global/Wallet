import { useState, useEffect } from 'react';
import checkAddress from '../../../../minima/commands/checkAddress';

import styles from './TransactionImage.module.css';

interface IProps {
    type: false | 'in' | 'out' | 'token' | 'custom';
}

const TransactionImage = ({ type }: IProps) => {
    return (
        <>
            {type && (
                <img
                    src={
                        type === 'in'
                            ? './assets/in.svg'
                            : type === 'out'
                            ? './assets/out.svg'
                            : type === 'token'
                            ? './assets/create.svg'
                            : './assets/custom.svg'
                    }
                    className={styles['img']}
                />
            )}
            {!type && <img />}
        </>
    );
};

export default TransactionImage;
