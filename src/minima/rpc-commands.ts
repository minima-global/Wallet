// import { Commands } from '@minima-global/mds-api';

import { MDS } from './mds';

// const Minima = new Commands(); // this will create a cmds reference
// interface Test {
//     name: any;
//     amount: number;
// }
// export const oCallToken = (data: Test) => {
//     return Minima.tokencreate({
//         name: {
//             name: data.name.name, 
//             description: data.name.description, 
//             url: data.name.url
//         }, 
//         amount: `${data.amount}`});
// };

// export const oCallSend = (data: SendArgs) => {
//     return Minima.send({ amount: data.amount, address: `${data.address}`, tokenid: `${data.tokenid}`});
// };

// export const oCallAddress = () => {
//     return Minima.newaddress();
// };

// export const oCallStatus = () => {
//     return Minima.status();
// };

// export const oCallBalance: any = () => {
//     return Minima.balance();
// };

// export const oCallHelp = () => {
//     return Minima.help();
// };

// export const oCallGetAddress = () => {
//     return Minima.getaddress();
// }

// export const oCallCreateNFT = (data: any) => {
//     return Minima.custom({name: "tokencreate", args: {name: {name: data.name, description: data.description, url: data.url, nft: true}, amount: 1, decimals:0 }});
// };


/** 
 * 
 * mds.js compatibility 
 * 
 */

 interface SendArgs {
    address: string;
    amount: number;
    tokenid: string;
    burn: number;
  }

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