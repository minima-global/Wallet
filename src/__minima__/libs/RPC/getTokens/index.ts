export const getTokens = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        MDS.cmd('coins relevant:true', (res) => {
            if (!res.status) reject('RPC Unavailable');

            resolve(res.response);
        });
    });
};

export default getTokens;
