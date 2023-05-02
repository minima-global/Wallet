import { MINIMA__TOKEN_ID } from './../shared/constants';
/**
 *
 * Minima Utility Functions
 * Useful extra fncs not available in api
 *
 */

import { callGetAddress, rpc } from './rpc-commands';

import Decimal from 'decimal.js';

/**
 * Split a coin by 2
 */
export const splitCoin = async (tokenid: string, sendable: string, burn: string, password: string) => {
    let miniaddress = '';
    try {
        miniaddress = await callGetAddress();
    } catch (error: any) {
        throw new Error(error);
    }
    let finalAmountToSend = new Decimal(0);
    const hasBurn = burn && burn.length ? burn : false;
    const hasPassword = password && password.length ? password : false;
    finalAmountToSend =
        hasBurn && MINIMA__TOKEN_ID === '0x00' ? new Decimal(sendable).minus(new Decimal(burn)) : new Decimal(sendable);

    return rpc(
        `send address:${miniaddress} tokenid:${tokenid} amount:${finalAmountToSend.toString()} split:${2} ${
            hasBurn ? 'burn:' + burn : ''
        } ${hasPassword ? 'password:' + hasPassword : ''}`
    ).catch((err) => {
        throw new Error(err);
    });
};
