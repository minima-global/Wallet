/**
 * 
 * Minima Utility Functions
 * Useful extra fncs not available in api
 * 
 */

import { callGetAddress, req } from './rpc-commands';

interface SplitParams {
  tokenid: string; // tokenid of token you want to split its coins
  sendable: string; // total sendable
  split: number; // split by... default 2
}

/**
 * Split a coin by 2
 */
const splitCoin = async (tokenid: string, sendable: string, coins: string, burn: string | number) => {
  console.log(coins);
  const fetchAddr: any = await callGetAddress();
  const mAddr = fetchAddr.response.miniaddress;

  const splitNumber = parseInt(coins) * 2; // scale by 2

  // split coin, send back to self
  return req(`send address:${mAddr} tokenid:${tokenid} amount:${sendable} split:${splitNumber > 20 ? 20 : splitNumber} burn:${burn}`);
}

export {
  splitCoin
}
