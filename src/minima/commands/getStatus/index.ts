import { Status } from '../../../@types/minima';

export const getStatus = (): Promise<Status> => {
    return new Promise((resolve, reject) => {
        window.MDS.cmd('status', (res: any) => {
            if (!res.status) reject(res.error ? res.error : 'RPC Failed');

            resolve(res.response);
        });
    });
};

export default getStatus;
