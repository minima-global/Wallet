/**
 * Minima RPC
 */

interface TokenParams {
  readonly name: string;
  readonly description: string;
  readonly url: string;
}
interface SendParams {
  readonly amount: string;
  readonly address: string;
  readonly tokenid?: string;
}
// send, tokencreate has params
// response has a txpow (send, tokencreate only transcrionTxpow), newaddress, status, balance, help, 
export interface RpcResponse {
  command: string;
  status: boolean;
  response?: Status | TxPOW | TransactionTxPOW | MinimaToken[] | MinimaAddress | Help;
  message?: string;
  params?: TokenParams | SendParams;
  error?: string;
}
export interface CustomTokenData {
  readonly name: string;
  readonly description: string;
  readonly url: string;
}
export interface TokenData {
  readonly name: CustomTokenData;
  readonly amount: string;
}

export interface SendData {
  readonly address: string;
  readonly amount: string;
  readonly tokenid: string;
}

export interface RpcBalance extends RpcResponse {
  tokens: MinimaToken[];
}

/**
 * Minima Objects
 */

interface MinimaAddress {
  readonly publickey: string;
  readonly script: string;
  readonly address: string;
  readonly track: boolean;
}
/**
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@ STATUS @@@@@@@@@@@@@@@@@@@@@@@@@@
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

/**
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@ TXPOW @@@@@@@@@@@@@@@@@@@@@@@@@@
 */
interface SuperParentsHeader {
  readonly difficulty: number;
  readonly count: number;
  readonly parent: string;
}
interface MagicHeader {
  readonly desiredmaxtxpow: string;
  readonly desiredmaxtxn: number;
  readonly desiredmintxpowwork: string;
  readonly maxtxpow: string;
  readonly maxtxn: string;
  readonly mintxpowwork: string;
}
interface HeaderTxPOW {
  readonly block: number;
  readonly blkdiff: string;
  readonly cascadelevels:number;
  readonly superparents: SuperParentsHeader[];
  readonly magic: MagicHeader;
  readonly mmr: string;
  readonly total: string;
  readonly txbodyhash: string;
  readonly nonce: string;
  readonly timemilli: string;
  readonly date: string;
}
interface TokenInputTransactionTxPOW {
  readonly name: JSON;
  readonly coinid: string;
  readonly total: string;
  readonly decimals: number;
  readonly script: string;
  readonly totalamount: string;
  readonly scale: number;
  readonly tokenid: string;
}
interface InputOutputTransactionTxPOW {
  readonly coinid: string;
  readonly amount: string;
  readonly address: string;
  readonly tokenid: string;
  readonly token: TokenInputTransactionTxPOW | null;
  readonly floating: boolean;
  readonly storestate: boolean;
  readonly state: any[]; // what is this
  readonly mmrentry: string;
  readonly spent: boolean;
  readonly created: string;
}

interface DataProof {
  readonly data: string;
  readonly value: string;
}
interface Proof {
  readonly left: boolean;
  readonly data: DataProof;
}

interface Signatures {
  readonly publickey: string;
  readonly rootkey: string;
  readonly proof: ProofTxPOW;
  readonly signature: string;
}
interface SignatureTxPOW {
  signatures: Signatures;
}
interface CoinMMRProofTxPOW extends InputOutputTransactionTxPOW {
    proof: ProofTxPOW;
}
interface MMRProofTxPOW {
  coin: CoinMMRProofTxPOW;
}
interface ProofTxPOW {
  readonly blocktime: string;
  readonly proof: Proof[];
  readonly prooflength: number;
}
interface ScriptTxPOW {
  readonly script: string;
  readonly address: string;
  readonly proof: ProofTxPOW;
}
interface WitnessTxPOW {
  readonly signatures: SignatureTxPOW[];
  readonly mmrproofs: MMRProofTxPOW[];
  readonly scripts: ScriptTxPOW[];
}
interface StateTransactionTxPOW {
  port: number;
  type: number;
  data: string;
  keeper: boolean;
}
interface TransactionTxPOW {
  readonly inputs: InputOutputTransactionTxPOW[];
  readonly outputs: InputOutputTransactionTxPOW[];
  readonly state: StateTransactionTxPOW[];
  readonly linkhash: string;
  readonly transactionid: string;
}

type BurnTransactionTxPOW = TransactionTxPOW;
type BurnWitnessTxPOW = BurnTransactionTxPOW;
interface TransactionTxPOW {
  readonly txpowid: string; //TODO
}
interface BodyTxPOW {
  readonly prng: string;
  readonly txndiff: string;
  readonly txn: TransactionTxPOW;
  readonly witness: WitnessTxPOW;
  readonly burntxn: BurnTransactionTxPOW;
  readonly burnwitness: BurnWitnessTxPOW;
  readonly txnlist: string[]; // TODO
}
export interface TxPOW {
  txpowid: string;
  isblock: boolean;
  istransaction: boolean;
  superblock: number;
  size: number;
  header: HeaderTxPOW;
  hasbody: boolean;
  body: BodyTxPOW;
}

export interface MinimaToken {
  readonly token: string & CustomTokenJson;
  readonly tokenid: string;
  readonly confirmed: string;
  readonly unconfirmed: string;
  readonly sendable: string;
  readonly total: string;
}
interface CustomTokenJson {
  readonly name: string;
  readonly url?: string;
  readonly description?: string;
}

interface Help {
  readonly help: string;
  readonly status: string;
  readonly printtree: string;
  readonly trace: string;
  readonly automine: string;
  readonly hashtest: string;
  readonly txpow: string;
  readonly coins: string;
  readonly tokens: string;
  readonly keys: string;
  readonly newaddress: string;
  readonly send: string;
  readonly balance: string;
  readonly tokencreate: string;
  readonly hash: string;
  readonly scripts: string;
  readonly runscript: string;
  readonly tutorial: string;
  readonly mmrcreate: string;
  readonly mmrproof: string;
  readonly coinimport: string;
  readonly coinexport: string;
  readonly cointrack: string;
  readonly sign: string;
  readonly verify: string;
  readonly txnlist: string;
  readonly  txncreate: string;
  readonly  txndelete: string;
  readonly  txncheck: string;
  readonly  txninput: string;
  readonly  txnoutput: string;
  readonly  txnstate: string;
  readonly  txnscript: string;
  readonly  txnsign: string;
  readonly  txnclear: string;
  readonly  txnpost: string;
  readonly  txnimport: string;
  readonly  txnexport: string;
  readonly  network: string;
  readonly  maxima: string;
  readonly  message: string;
  readonly  connect: string;
  readonly  disconnect: string;
  readonly  rpc: string;
  readonly  webhooks: string;
  readonly  sshtunnel: string;
  readonly  backup: string;
  readonly  restore: string;
  readonly  incentivecash: string;
  readonly  quit: string;
};

/**
 * Function Component props
 */
export interface MiniModalProp {
  readonly status: string;
  readonly header: string;
  readonly subtitle: string;
  handleClose: () => void;
  handleOpen: () => void;
  open: boolean;
}

