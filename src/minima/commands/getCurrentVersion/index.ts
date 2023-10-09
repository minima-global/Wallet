export const getCurrentNodeVersion = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        (window as any).MDS.cmd('status', (res: any) => {
            if (!res.status) reject(res.error ? res.error : 'RPC Failed');

            resolve(res.response.version);
        });
    });
};

export default getCurrentNodeVersion;
