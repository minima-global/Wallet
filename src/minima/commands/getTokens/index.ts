export const getTokens = () => {
    return new Promise((resolve, reject) => {
        MDS.cmd('tokens', (res) => {
            if (!res.status) reject(res.error ? res.error : 'RPC Failed');

            resolve(res.response);
        });
    });
};

export default getTokens;
