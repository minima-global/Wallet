import { useEffect, useState } from 'react';
import { MiTokenNameAmountWrapper } from '../layout/MiToken';
import TransactionAmount from '../../../pages/components/history/TransactionAmount';

import * as types from '../../../types/minima';
import * as utils from '../../../shared/utils';
import TransactionImage from '../../../pages/components/history/TransactionImage';
interface IProps {
    tokenName: string;
    amount: types.DetailsTxPOW;
    address: string;
    tokenid: string;
}
const TransactionHistoryType = ({ tokenName, amount, address }: IProps) => {
    const [transactionType, setType] = useState<'normal' | 'tokencreate' | 'custom' | false>(false);
    const [imageType, setImageType] = useState<'in' | 'out' | 'token' | 'custom' | false>(false);

    useEffect(() => {
        setType(utils.getTxPOWDetailsType(amount));

        if (transactionType === 'normal') {
            if (amount.difference[Object.keys(amount.difference)[0]].substring(0, 1) === '-') {
                setImageType('out');
            }
            if (amount.difference[Object.keys(amount.difference)[0]].substring(0, 1) !== '-') {
                setImageType('in');
            }
        }
        if (transactionType === 'tokencreate') {
            setImageType('token');
        }
        if (transactionType === 'custom') {
            setImageType('custom');
        }
    }, []);

    return (
        <>
            <TransactionImage type={imageType} />
            <MiTokenNameAmountWrapper>
                {transactionType && transactionType === 'custom' && (
                    <>
                        <p>Custom Transaction</p>

                        <TransactionAmount address={address} amount="" />
                    </>
                )}
                {transactionType && transactionType === 'normal' && (
                    <>
                        <p>{tokenName}</p>

                        <TransactionAmount
                            address={address}
                            amount={amount.difference[Object.keys(amount.difference)[0]]}
                        />
                    </>
                )}
                {transactionType && transactionType === 'tokencreate' && (
                    <>
                        <p>{tokenName}</p>

                        <TransactionAmount address={address} amount={amount.difference['0xFF']} />
                    </>
                )}
            </MiTokenNameAmountWrapper>
        </>
    );
};

export default TransactionHistoryType;
