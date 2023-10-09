import { MinimaToken } from '../../../../@types/minima';

export const getMinimaBalance = (): Promise<MinimaToken[]> => {
    return new Promise((resolve, reject) => {
        MDS.cmd('balance', (res: any) => {
            if (!res.status) reject('RPC Unavailable');

            resolve(res.response);
        });
    });
};

export default getMinimaBalance;
