import { hexToString } from './../shared/functions';
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
    return req(`tokencreate name:{"name":"${data.name.name}", "description":"${data.name.description}", "url":"${data.name.url}"} amount:${data.amount} burn:${data.burn} webvalidate:"${data.name.webvalidate}"`);
}
export const callCreateNFT = (data: any) => {
    return req(`tokencreate name:{"name":"${data.name}", "description":"${data.description}", "external_url":"${data.external_url}", "image":"${data.image}", "owner":"${data.owner}", "nft":"true"} amount:${data.amount} decimals:0 webvalidate:${data.webvalidate}`);
}
export const callBalance = () => {
    return req(`balance`);
}
export const callTokenValidate = (tokenid: string) => {
    return req(`tokenvalidate tokenid:${tokenid}`);
}


export const req = (command: string) => {
    
    return new Promise((resolve) => {
        
        MDS.cmd(command, (resp: any) => {
            //console.log(resp);
            resolve(resp);
            
        });
    
    });
  }