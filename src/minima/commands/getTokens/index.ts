import { Coin } from '../../../@types/minima';

export const getTokens = (): Promise<Coin[]> => {
    return new Promise((resolve, reject) => {
        MDS.cmd('coins relevant:true', (res: any) => {
            if (!res.status) reject(res.error ? res.error : 'RPC Failed');

            resolve(res.response);
        });
    });
};

export default getTokens;
