/**
 * Standard Implementation of an NFT on Minima
 * this should help for any written minidapp to interface with the same NFT interface
 */

interface MiNFT extends MiCustomToken {
    external_url: string;
    owner: string;
}

interface MiCustomToken {
    name: string;
    url: string;
    description: string;
    ticker?: string;
    webvalidate?: string;
}

export { MiNFT, MiCustomToken };
