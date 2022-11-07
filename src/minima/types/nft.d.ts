/**
 * Standard Implementation of an NFT on Minima
 * this should help for any written minidapp to interface with the same NFT interface
 */

type TokenType = 'NFT' | 'STANDARDTOKEN';
 interface MiNFT extends MiCustomToken { 
  external_url : string;
  owner: string;
}

interface MiCustomToken {
  name: string;
  amount: string;
  url: string;
  description: string;
  burn: string;
  type: TokenType;
  ticker?: string;
  webvalidate?: string;
}

export {MiNFT, MiCustomToken}