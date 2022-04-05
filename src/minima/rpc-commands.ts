import { SendArgs, Commands, TokenCreateArgs } from '@minima-global/mds-api';


const Minima = new Commands(); // this will create a cmds reference
// call any generic minima command
/**
 * TODO
 * Set a generic type for RPC calls + switch between the calling fnc
 * set at any for now..
 */
// export const callCommand = (command: string): Promise<RpcResponse> => {
//     return new Promise((resolve, reject) => {
//         Minima.cmd(command, (data: RpcResponse) => {
//             if (data.status) {
//                 resolve(data);
//             } else {
//                 reject(data);
//             }
//         });
//     });
// };

export const callToken = (data: TokenCreateArgs) => {
    // const command = `${TOKENCREATE}+name:${JSON.stringify(data.name)}+amount:${data.amount}`;
    return Minima.tokencreate({name: `${JSON.stringify(data.name)}`, amount: `${data.amount}`});
};

export const callSend = (data: SendArgs) => {
    return Minima.send({ amount: data.amount, address: `${data.address}`, tokenid: `${data.tokenid}`});
};

export const callAddress = () => {
    return Minima.newaddress();
};

export const callStatus = () => {
    return Minima.status();
};

export const callBalance: any = () => {
    return Minima.balance();
};

export const callHelp = () => {
    return Minima.help();
};
