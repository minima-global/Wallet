export const getTokens = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        (window as any).MDS.cmd('balance', (resp: any) => {
            if (!resp.status) reject('Fetching balance cmd failed');

            const tokenBalance = resp.response.filter((t: any) => t.tokenid !== '0x00').map((t: any) => t.tokenid);

            (window as any).MDS.cmd('tokens', (resp: any) => {
                if (!resp.status) reject('Fetching tokens failed');

                const tokens = resp.response.filter((t: any) => tokenBalance.includes(t.tokenid) && t.decimals === 0);

                resolve(tokens);
            });
        });
    });
};

export default getTokens;
