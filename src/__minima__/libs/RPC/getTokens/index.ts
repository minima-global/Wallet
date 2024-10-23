export const getTokens = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        (window as any).MDS.cmd('balance tokendetails:true', (resp: any) => {
            if (!resp.status) {
                reject({status: false, response: [], message: resp.error ? resp.error : "Failed to fetch token balance"});
            }

            const nonFungibles = resp.response.filter((t: any) => t.tokenid !== '0x00' && t.details && t.details.decimals === 0);

            resolve(nonFungibles);
            
        });
    });
};

export default getTokens;
