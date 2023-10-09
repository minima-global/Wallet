export const getHistory = () => {
    return new Promise((resolve, reject) => {
        window.MDS.cmd('history', (res: any) => {
            if (!res.status) reject(res.error ? res.error : 'RPC Failed');

            resolve(res.response.txpows);
        });
    });
};

export default getHistory;
