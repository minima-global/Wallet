import * as types from '../../../types/minima';
import { format } from 'date-fns';

export const extractByMonthAndDay = (txpows: types.TxPOW[]): Map<any, any> => {
    const map = new Map();
    for (const txpow of txpows) {
        const date = format(parseInt(txpow.header.timemilli), 'MMMM do yyyy');
        const alreadyExists = map.has(date);
        if (alreadyExists) {
            const valueArr = map.get(date);
            valueArr.push(txpow);
        }
        if (!alreadyExists) {
            map.set(date, [txpow]);
        }
    }
    return map;
};

export default extractByMonthAndDay;
