import { MinimaToken } from "./types/minima2";

export const callSend = (data: any) => {
    return req(`send amount:${data.amount} address:${data.address} tokenid:${data.tokenid} burn:${data.burn}`);
}
export const callGetAddress = () => {
    return req(`getaddress`);
}
export const callStatus = () => {
    return req(`status`);
}
export const callToken = (data: any) => {
    return req(`tokencreate name:{"name":"${data.name.name}", "description":"${data.name.description}", "url":"${data.name.url}", "ticker":"${data.name.ticker}"} amount:${data.amount} burn:${data.burn} webvalidate:${data.name.webvalidate}`);
}
export const callCreateNFT = (data: any) => {
    return req(`tokencreate name:{"name":"${data.name}", "description":"${data.description}", "external_url":"${data.external_url}", "image":"${data.image}", "owner":"${data.owner}", "nft":"true"} amount:${data.amount} decimals:0 webvalidate:${data.webvalidate}`);
}
export const callCreateNFTWithBlob = (data: any, image: string) => {
    return req(`tokencreate name:{"name":"${data.name}", "description":"${data.description}", "external_url":"${data.external_url}", "image":"${image}", "owner":"${data.owner}", "nft":"true"} amount:${data.amount} decimals:0 webvalidate:${data.webvalidate}`);
}
/** Get Balance */

export const getWalletBalance = (): Promise<MinimaToken[]> => {

    return new Promise((resolve, reject) => {
        rpc(`balance`).then((wallet) => {
    
            resolve(wallet);
    
        }).catch((err) => {
    
            reject(err);
    
        })
    });

}
export const callTokenValidate = (tokenid: string) => {
    return req(`tokenvalidate tokenid:${tokenid}`);
}


export const req = (command: string): Promise<any> => {
    
    return new Promise((resolve) => {
        
        MDS.cmd(command, (resp: any) => {
            // console.log(resp);
            resolve(resp);
            
        });
    
    });
}

/** Rpc cmd v2 */

const rpc = (command: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        MDS.cmd(command, (resp: any) => {
            
            

            if (resp.length > 0) {
                //console.log(`multi command activity.`);
                let success = true;
                let error = "";
                resp.forEach((r: any) => {
                    if (!r.status) {
                        success = false;
                        error = r.error;
                        return;
                    }
                })

                if (success) {
                    resolve(resp[resp.length-1].response)
                } else {
                    reject(error)
                }
            }

            if (resp.status && !resp.pending) {

                resolve(resp.response);
            
            }
    
            if (!resp.status && resp.pending) {
    
                reject(resp.error); 
    
            }
    
            if (!resp.status && !resp.pending) {
    
                reject(resp.message ? resp.message : resp.error ? resp.error : `RPC ${command} has failed to fire off, please open this as an issue on Minima's official repo!`);
    
            }
            
        });
    });
}
