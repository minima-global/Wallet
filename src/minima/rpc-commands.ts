import { RpcResponse, MinimaToken } from './../types/minima/index';
import { STATUS, BALANCE, RPCHOST, SEND, HELP, ADDRESS, TOKENCREATE } from './constants';
import Minima from './minimanew.js';
// call any generic minima command
/**
 * TODO
 * Set a generic type for RPC calls + switch between the calling fnc
 * set at any for now..
 */
export const callCommand = (command: string) => {
    return new Promise((resolve, reject) => {
        Minima.cmd(command, (data: any) => {
            if (data.status) {
                resolve(data);
            } else {
                reject(data);
            }
        });
    });
};

export const callToken = (data: any) => () => {
    const command = `${TOKENCREATE}+name:${JSON.stringify(data.name)}+amount:${data.amount}`;
    return callCommand(command);
};

interface SendData {
    address: string;
    amount: string;
    tokenid: string;
}

export const callSend = (data: SendData) => {
    const command = `${SEND}+address:${data.address}+amount:${data.amount}+tokenid:${data.tokenid}`;
    return callCommand(command);
};

export const callAddress = () => {
    return callCommand(ADDRESS);
};

export const callStatus = () => {
    return callCommand(STATUS);
};

// interface RpcBalance extends RpcResponse {
//     tokens: MinimaToken[];
// }
export const callBalance: any = () => {
    return callCommand(BALANCE);
};

export const callHelp = () => {
    return callCommand(HELP);
};
