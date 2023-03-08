export const checkAddress = (address: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        MDS.cmd(`checkaddress address:${address}`, (res) => {
            if (!res.status) reject(res.error ? res.error : 'RPC Failed');

            resolve(res.response);
        });
    });
};

export default checkAddress;
