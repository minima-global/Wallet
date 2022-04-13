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

/**
 * 
 * TODO - fix up issue with what you send to tokencreate
 * Error: Invalid JSON parameter for tokencreate @ name:{/"name/":/"wqerqwe/",/"description/":/"/",/"url/":/"/"} 
 * org.minima.utils.json.parser.ParseException: Unexpected character (/) at position 1.
 * 
 */
/**
 * 
 * TODO I know pass any as record<string, any> doesn't work right
 * must be concise when using Record type
 * update mds-api to type any for name
 */

interface Test {
    name: any;
    amount: number;
}
export const callToken = (data: Test) => {
    return Minima.tokencreate({
        name: {
            name: data.name.name, 
            description: data.name.description, 
            url: data.name.url
        }, 
        amount: `${data.amount}`});
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
