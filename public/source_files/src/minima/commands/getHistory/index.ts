import { DetailsTxPOW, TxPOW } from '../../../types/minima';

export const getHistory = (): Promise<Map<string, { detail: DetailsTxPOW; txpow: TxPOW }>> => {
    return new Promise((resolve, reject) => {
        MDS.cmd('history', (res) => {
            if (!res.status) reject(res.error ? res.error : 'RPC Failed');

            resolve(res.response.txpows);
        });
    });
};

export default getHistory;
