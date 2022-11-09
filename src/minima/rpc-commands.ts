import { MinimaToken } from "./types/minima2";

export {callSend, callGetAddress, callStatus, createCustomToken, getWalletBalance, callTokenValidate};

const callSend = (data: any) => {
    return req(`send amount:${data.amount} address:${data.address} tokenid:${data.tokenid} burn:${data.burn}`);
}
 const callGetAddress = () => {
    return req(`getaddress`);
}
 const callStatus = () => {
    return req(`status`);
}

const createCustomToken = (name: string, amount: string, decimals?: string, webvalidate?: string) => {
    return rpc(`tokencreate name:${name} amount:${amount} ${decimals ? 'decimals:' + decimals : ''} ${webvalidate ? 'webvalidate:' + webvalidate : ''}`);
}

/** Get Balance */

const getWalletBalance = (): Promise<MinimaToken[]> => {

    return new Promise((resolve, reject) => {
        rpc(`balance`).then((wallet) => {
    
            resolve(wallet);
    
        }).catch((err) => {
    
            reject(err);
    
        })
    });

}
const callTokenValidate = (tokenid: string) => {
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
