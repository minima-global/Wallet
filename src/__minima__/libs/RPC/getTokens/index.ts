export const getTokens = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        (window as any).MDS.cmd('balance tokendetails:true', (resp: any) => {
            if (!resp.status) {
                reject('Fetching balance cmd failed');
            }

            // Filter out tokens where tokenid is not '0x00' and decimals are 0 in the details
            const nonFungible = resp.response.filter((t: any) => 
                t.tokenid !== '0x00' && t.details && t.details.decimals === 0
            );

            resolve(nonFungible);
        });
    });
};

export default getTokens;