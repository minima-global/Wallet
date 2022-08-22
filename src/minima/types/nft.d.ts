/**
 * Standard Implementation of an NFT on Minima
 * this should help for any written minidapp to interface with the same NFT interface
 */


interface NFT {
  name: string;
  description?: string;
  external_url?: string;
  image: string;
  owner: string;
  nft: string;
  webvalidate: string;
}