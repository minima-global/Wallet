export const getTokens = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        (window as any).MDS.cmd('coins relevant:true', (res: any) => {
            if (!res.status) reject('RPC Unavailable');

            resolve(res.response);
        });
    });
};

export default getTokens;
