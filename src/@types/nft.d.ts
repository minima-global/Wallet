/**
 * Standard Implementation of an NFT on Minima
 * this should help for any written minidapp to interface with the same NFT interface
 */

interface NonFungibleToken extends MinimaToken {
    external_url: string;
    owner: string;
}

interface MinimaToken {
    name: string;
    url: string;
    description: string;
    ticker?: string;
    webvalidate?: string;
}

export { NonFungibleToken, MinimaToken };
