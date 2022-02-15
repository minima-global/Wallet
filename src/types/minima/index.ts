/**
 * Minima Objects
 */
 export interface Status {
  version: string; // minima version
  devices: number; // how many devices are connected to peer
  length: number; // chain length
  weight: number; // chain weight
  // configuration: string; //
  minima: number; // total amount of minima from genesis block
  coins: number; // total coins in the mmr database
  data: string; // Where the users data is stored
  memory: {
    ram: string;
    disk: string;
    files: {
      txpowdb: string;
      archivedb: string;
      cascade: string;
      chaintree: string;
      wallet: string;
      userdb: string;
      p2pdb: string;
    };
  };
  chain: { // chain data
    block: number;
    branches: number;
    difficulty: string;
    hash: string;
    length: number;
    size: number;
    speed: string;
    time: string;
    weight: number;
    cascade: {
      start: number;
      length: number;
      weight: string;
    };
  };
  txpow: {
    mempool: number;
    ramdb: number;
    txpowdb: number;
    archivedb: number;
  };

  network: {
    connected: number;
    connecting: number;
    host: string;
    hostset: boolean;
    port: number;
    rpc: boolean;
    p2p?: {
      deviceHashRate: number;
      address: string;
      isAcceptingInLinks: boolean;
      numInLinks: number;
      numOutLinks: number;
      numNotAcceptingConnP2PLinks: number;
      numNoneP2PLinks: number;
      numKnownPeers: number;
      numAllLinks: number;
      nio_inbound: number;
      nio_outbound: number;
    };
  };
}

interface Token {
  name: string;
}

export interface MinimaToken {
  token: string & CustomTokenJson;
  tokenid: string;
  confirmed: string;
  unconfirmed: string;
  sendable: string;
  total: string;
}
interface CustomTokenJson {
  name: string;
  description: string;
  icon: string;
}