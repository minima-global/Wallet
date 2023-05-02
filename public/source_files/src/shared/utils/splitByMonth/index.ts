import { DetailsTxPOW } from './../../../types/minima/index';
import * as types from '../../../types/minima';
import { format } from 'date-fns';

export const extractByMonthAndDay = (txpows: { detail: types.DetailsTxPOW; txpow: types.TxPOW }[]): Map<any, any> => {
    const map = new Map();
    for (const fullTxpow of txpows) {
        const date = format(parseInt(fullTxpow.txpow.header.timemilli), 'MMMM do yyyy');
        const alreadyExists = map.has(date);
        if (alreadyExists) {
            const valueArr = map.get(date);
            valueArr.push(fullTxpow);
        }
        if (!alreadyExists) {
            map.set(date, [fullTxpow]);
        }
    }
    return map;
};

export default extractByMonthAndDay;
