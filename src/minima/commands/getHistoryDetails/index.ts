import { DetailsTxPOW, TxPOW } from '../../../types/minima';

export const getHistoryDetails = (): Promise<Map<string, { detail: DetailsTxPOW; txpow: TxPOW }>> => {
    return new Promise((resolve, reject) => {
        (window as any).MDS.cmd('history', (res: any) => {
            if (!res.status) reject(res.error ? res.error : 'RPC Failed');

            resolve(res.response.details);
        });
    });
};

export default getHistoryDetails;
