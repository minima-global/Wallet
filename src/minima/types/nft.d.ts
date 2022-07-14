/**
 * Standard Implementation of an NFT on Minima
 * this should help for any written minidapp to interface with the same NFT interface
 */

/** TODO - Create more attribute types etc. */
interface Attribute {
  trait_type: string;
  value: string | number; 
}

interface NFT {
  creation_date: number;
  owner: string;
  name: string;
  image_url: string;
  description?: string;
  external_url?: string;
  attributes?: Attribute[];
  background_color?: string;
  youtube_url?: string;
}