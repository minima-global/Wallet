import { format } from 'date-fns';
import identifyLeadingAmount from '../identifyLeadingAmount';
import { DetailsTxPOW, TxPOW } from '../../../../types/minima';
import getTxPOWDetailsType from '../../getTxPOWDetailsType';

const splitDataByDate = (txpows: TxPOW[], details: DetailsTxPOW[]) => {
    const requiredData = txpows.map((_t, i) => {
        const transactionType = getTxPOWDetailsType(details[i]);

        return {
            txpowid: _t.txpowid,
            tokenName:
                _t.body.txn.outputs[0].tokenid === '0x00'
                    ? 'Minima'
                    : _t.body.txn.outputs[0].token
                    ? _t.body.txn.outputs[0].token.name.name
                    : 'N/A',
            amount: identifyLeadingAmount(i, details),
            tokenid: _t.body.txn.outputs[0].tokenid,
            timeMilli: _t.header.timemilli,
            type:
                transactionType === 'custom'
                    ? 'Custom transaction'
                    : transactionType === 'tokencreate'
                    ? 'Token Creation'
                    : 'Value Transfer',
        };
    });

    let dataByDate: {
        [key: string]: {
            txpowid: string;
            tokenName: string;
            amount: string;
            tokenid: string;
            timeMilli: string;
            type: string;
        }[];
    } = {};

    requiredData.map((txpow) => {
        const date = format(parseInt(txpow.timeMilli), 'MMMM do yyyy');

        if (dataByDate[date]) {
            return dataByDate[date].push(txpow);
        }

        dataByDate = {
            ...dataByDate,
            [date]: [txpow],
        };
    });

    return dataByDate;
};

export default splitDataByDate;
