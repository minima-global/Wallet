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
export const splitCoin = async (tokenid: string, sendable: string, burn: string) => {
  const fetchAddr: any = await callGetAddress();
  const mAddr = fetchAddr.response.miniaddress;

  let finalTotalToSend = new Decimal(0);
  if (burn.length > 0 && tokenid === MINIMA__TOKEN_ID) {
    // minus the burn, get total to send back after splitting
    finalTotalToSend = new Decimal(sendable).minus(new Decimal(burn));
    //console.log(finalTotalToSend.toString())
    return rpc(`send address:${mAddr} tokenid:${tokenid} amount:${finalTotalToSend.toString()} split:${2} burn:${burn}`);
  }

  if (burn.length > 0 && tokenid !== MINIMA__TOKEN_ID) {
    return rpc(`send address:${mAddr} tokenid:${tokenid} amount:${sendable} split:${2} burn:${burn}`);


  }

  return rpc(`send address:${mAddr} tokenid:${tokenid} amount:${sendable} split:${2}`);  
}
