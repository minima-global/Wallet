import { Scripts } from '../../../@types/minima';

export const getScripts = (): Promise<Scripts[]> => {
    return new Promise((resolve, reject) => {
        MDS.cmd('scripts', (res) => {
            if (!res.status) reject(res.error ? res.error : 'RPC Failed');

            resolve(res.response);
        });
    });
};

export default getScripts;
