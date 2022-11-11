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
export const splitCoin = async (tokenid: string, sendable: string, burn: string | number) => {
  // console.log(coins);
  const fetchAddr: any = await callGetAddress();
  const mAddr = fetchAddr.response.miniaddress;

  // split coin, send back to self
  return rpc(`send address:${mAddr} tokenid:${tokenid} amount:${sendable} split:${2} burn:${burn}`);
}
