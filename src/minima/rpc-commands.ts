// import { MDS } from '../../public/mds';

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
    console.log(data)
    return req(`tokencreate name:{"name":"${data.name.name}", "description":"${data.name.description}", "url":"${data.name.url}"} amount:${data.amount} burn:${data.burn}`);
}
export const callCreateNFT = (data: any) => {
    return req(`tokencreate name:{"name":"${data.name}", "description":"${data.description}", "url":"${data.url}", "nft":"true"} amount:1 decimals:0`);
}
export const callBalance = () => {
    return req(`balance`);
}


export const req = (command: string) => {
    
    return new Promise((resolve) => {
        
        MDS.cmd(command, (resp: any) => {
            resolve(resp);
        });
    
    });
  }