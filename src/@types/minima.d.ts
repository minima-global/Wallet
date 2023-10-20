interface RewardIncentiveCashUserRewards {
    dailyRewards: number;
    previousRewards: number;
    communityRewards: number;
    inviterRewards: number;
}
interface DetailIncentiveCashUserRewards {
    inviteCode?: string;
    lastPing?: string;
    rewards?: RewardIncentiveCashUserRewards;
}
export interface IncentiveCashUserRewards {
    uid: string;
    details?: DetailIncentiveCashUserRewards;
}

export interface ArchiveDB {
    size: number;
    start: string;
    startdate: string;
    end: string;
}

export interface RPC {
    enabled: boolean;
    port: number;
}
export interface Traffic {
    from: string;
    totalread: string;
    totalwrite: string;
    write: string;
}

export interface P2P {
    address: string;
    isAcceptingInLinks: boolean;
    numInLinks: number;
    numOutLinks: number;
    numNotAcceptingConnP2PLinks: number;
    numNoneP2PLinks: number;
    numKnownPeers: number;
    numUnvalidatedPeers: number;
    numAllLinks: number;
    nio_inbound: number;
    nio_outbound: number;
}

export interface Memory {
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
}
export interface Chain {
    block: number;
    time: string;
    hash: string;
    speed: string;
    difficulty: string;
    size: number;
    length: number;
    weight: number;
    branches: number;
    cascade: {
        start: number;
        length: number;
        weight: string;
    };
}

export interface Txpow {
    mempool: number;
    ramdb: number;
    txpowdb: number;
    archivedb: ArchiveDB;
}

export interface Network {
    host: string;
    hostset: boolean;
    port: number;
    connecting: number;
    connected: number;
    rpc: RPC;
    traffic: Traffic;
    p2p: P2P | 'disabled';
}

export interface Status {
    version: string;
    length: number;
    weight: number;
    locked: boolean;
    minima: number;
    coins: number;
    data: string;
    uptime: string;
    memory: Memory;
    chain: Chain;
    txpow: Txpow;
    network: Network;
}

interface NetworkPeer {
    welcome: string;
    uid: string;
    incoming: boolean;
    host: string;
    port: number;
    minimaport: number;
    valid: true;
    connected: string;
}

interface MinimaToken {
    token: any;
    coins: string;
    tokenid: string;
    confirmed: string;
    unconfirmed: string;
    sendable: string;
    total: string;
}

interface Token {
    name: any;
    coinid: string;
    total: string;
    decimals: number;
    script?: string;
    totalamount?: string;
    coinid?: string;
    scale: string;
    created?: string;
    tokenid: string;
}

interface NetworkStatus {
    version: string;
    time: string;
    uptime: string;
    conf: string;
    host: string;
    minimaport: number;
    rpcport: number;
    websocketport: number;
    minidappserver: number;
    automine: boolean;
    root: string;
    tip: string;
    total: string;
    lastblock: number;
    lasttime: string;
    cascade: string;
    difficulty: string;
    txpowdb: number;
    ram: string;
    mempooltxn: number;
    mempoolcoins: number;
    chainspeed: number;
    chainlength: number;
    chainweight: string;
    connections: number;
    txpowfiles?: string;
    txpowfolder?: string;
    IBD?: string;
}

interface Address {
    script: string;
    hexaddress: string;
    miniaddress: string;
}

interface Coin {
    coinid: string;
    address: string;
    miniaddress: string;
    amount: string;
    tokenid: string;
    token: Token;
    tokenamount: string;
    storestate: boolean;
    state: State[];
    spent: boolean;
    mmrentry: string;
    created: string;
}

interface MMRProof {
    blocktime: string;
    entry: string;
    data: {
        hashonly: boolean;
        value: string;
        finalhash: string;
        spent: boolean;
        coin: Coin;
    };
    inblock: string;
    prevstate: [];
}

interface PublicKey {
    bits: number;
    uses: string;
    allowed: string;
    publickey: string;
}

interface SignatureWitnessProof {
    data: string;
    hashbits: number;
    proofchain: [];
    chainsha: string;
    finalhash: string;
}

interface SignatureWitness {
    signature: string;
    proof: SignatureWitnessProof;
}

interface Script {
    script: string;
    proof: Proof;
}
export interface Scripts {
    script: string;
    address: string;
    miniaddress: string;
    simple: boolean;
    default: boolean;
    publickey: string;
    track: boolean;
}

interface Proof {
    data: string;
    hashbits: number;
    proofchain: [];
    chainsha: string;
    finalhash: string;
}

interface Witness {
    signatures: SignatureWitness[];
    mmrproofs: MMRProof[];
    tokens: [];
    scripts: Script[];
}

interface Magic {
    prng: string;
    maxtxpow: number;
    maxtxn: number;
    maxkissvm: number;
}

interface WitnessBurn {
    signatures: [];
    mmrproofs: [];
    tokens: [];
    scripts: [];
}

interface TransactionBurn {
    inputs: [];
    outputs: [];
    state: [];
    linkhash: string;
}

interface TransactionInput {
    coinid: string;
    address: string;
    mxaddress: string;
    amount: string;
    tokenid: string;
    floating: boolean;
    storestate: boolean;
}

interface TransactionOutput {
    coinid: string;
    address: string;
    mxaddress: string;
    amount: string;
    tokenid: string;
    floating: boolean;
    storestate: boolean;
}

interface Transaction {
    inputs: TransactionInput[];
    outputs: TransactionOutput[];
    state: State[];
    linkhash: string;
    tokengen?: TokenGenerator;
}

interface TransactionBody {
    txndiff: string;
    txn: Transaction;
    witness: Witness;
    burntxn: TransactionBurn;
    burnwitness: WitnessBurn;
    txnlist: [];
    magic: Magic;
}

interface SuperParents {
    difficulty: number;
    count: number;
    parent: string;
}

interface TransactionHeader {
    block: string;
    blkdiff: string;
    cascadelevels: number;
    superparents: SuperParents[];
    chainid: string;
    parentchainid: string;
    mmr: string;
    total: string;
    mmrpeaks: string;
    nonce: string;
    timemilli: string;
    date: string;
}

interface Txpow {
    txpowid: string;
    isblock: boolean;
    istransaction: boolean;
    superblock: number;
    size: number;
    header: TransactionHeader;
    hasbody: boolean;
    body: TransactionBody;
}

interface Value {
    token: string;
    name: any;
    amount: string;
}

interface TokenGenerator {
    tokenid: string;
    token: string;
    description: string;
    icon: string;
    proof: string;
    total: string;
    decimals: string;
    script: string;
    coinid: string;
    totalamount: string;
    scale: string;
}

interface State {
    port: number;
    type: number;
    data: string;
}
