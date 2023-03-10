import { Scripts } from '../../../@types/minima';
import { TxPOW } from '../../../types/minima';

export const getHistory = (): Promise<TxPOW[]> => {
    return new Promise((resolve, reject) => {
        MDS.cmd('history', (res) => {
            if (!res.status) reject(res.error ? res.error : 'RPC Failed');

            resolve(res.response.txpows);
        });
    });
};

export default getHistory;
