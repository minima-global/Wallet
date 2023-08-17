import { TxPOW } from '../../types/minima';

// Minima Events
interface InitResponse {
    event: 'inited';
}

interface MiningResponse {
    event: 'MINING';
    data: MiningData;
}
interface MiningData {
    mining: boolean;
    txpow: TxPOW;
}

interface NewBlockResponse {
    event: 'NEWBLOCK';
    data: NewBlockData;
}

interface MDSTimerResponse {
    event: 'MDS_TIMER_10SECONDS';
    data: Object;
}
interface MDS60TimerResponse {
    event: 'MDS_TIMER_60SECONDS';
    data: Object;
}

interface NewBlockData {
    txpow: TxPOW;
}

interface MinimaLogResponse {
    event: 'MINIMALOG';
    data: MinimaLogData;
}
interface MinimaLogData {
    message: string;
}

interface NewBalanceResponse {
    event: 'NEWBALANCE';
    data: NewBalanceData;
}
interface NewBalanceData {
    // TODO
}

interface MaximaHosts {
    event: 'MAXIMAHOSTS';
    data: any;
}

interface MaximaResponse {
    event: 'MAXIMA';
    data: MaximaData;
}
interface MaximaData {
    application: string;
    data: string;
    from: string;
    msgid: string;
    random: string;
    time: string;
    timemilli: number;
    to: string;
}

interface NewMDSFail {
    event: 'MDSFAIL';
    data: {
        command: string;
        error: number;
        params: string;
    };
}

//////////////////////// empty functions before registration //////////////////////
let whenNewBlock = (d: NewBlockData) => {
    // console.log("NEWBLOCK event ... please resgister custom callback", d);
};
let whenMining = (d: MiningData) => {
    // console.log("MINIMG event ... please resgister custom callback", d);
};
let whenMaxima = (d: MaximaData) => {
    // console.log("MAXIMA event ... please resgister custom callback", d);
};
let whenNewBalance = (d: NewBalanceData) => {
    // console.log("NEW BALANCE event ... please resgister custom callback", d);
};
let whenInit = () => {
    console.log('INIT event ... please register custom callback');
};
let whenMinimaLog = (d: MinimaLogData) => {
    // console.log("MINIMA LOG event ... please resgister custom callback", d);
};

let whenMDSTimer = (d: any) => {
    // console.log("MINIMA MDS TIMER event ... please register custom callback", d);
};

let whenFail = (d: any) => {
    // console.log("MINIMA MDS TIMER event ... please register custom callback", d);
};

const initializeMinima = () => {
    /** to debug on dev server */
    // MDS.DEBUG_HOST = '127.0.0.1';
    // MDS.DEBUG_PORT = 9003;
    // MDS.DEBUG_MINIDAPPID =
    //     '0x3D371EEA7D75F85147E9930A5E69FB9AEB813FC91FF2972F0BFFA6E22EA913474FAC55ADD8B55EBC445B44300C961122A96BE04401B70856BD3021AD42D548415661F96A44F3A0497005508475C7280F0D4F71190C872031440FB115638ED4D5E0ED5F3671FCA6C8F0B28E070785AF9EC1565F424AB8717A8D22014D6DF85DF7';

    MDS.init(
        (
            nodeEvent:
                | InitResponse
                | MiningResponse
                | NewBlockResponse
                | MinimaLogResponse
                | NewBalanceResponse
                | MaximaResponse
                | MDSTimerResponse
                | MDS60TimerResponse
                | MaximaHosts
                | NewMDSFail
        ) => {
            switch (nodeEvent.event) {
                case 'inited':
                    // will have to dispatch from here..
                    whenInit();
                    break;
                case 'NEWBLOCK':
                    const newBlockData = nodeEvent.data;
                    whenNewBlock(newBlockData);
                    break;
                case 'MDSFAIL':
                    const errorData = nodeEvent.data;

                    whenFail(errorData);
                    break;
                case 'MINING':
                    const miningData = nodeEvent.data;
                    whenMining(miningData);
                    break;
                case 'MAXIMA':
                    const maximaData = nodeEvent.data;
                    whenMaxima(maximaData);
                    break;
                case 'NEWBALANCE':
                    const newBalanceData = nodeEvent.data;

                    whenNewBalance(newBalanceData);
                    break;
                case 'MINIMALOG':
                    const minimaLogeData = nodeEvent.data;
                    whenMinimaLog(minimaLogeData);
                    break;
                case 'MDS_TIMER_10SECONDS':
                    const mdstimerdata = nodeEvent.data;
                    whenMDSTimer(mdstimerdata);
                    break;
                case 'MDS_TIMER_60SECONDS':
                    break;
                case 'MAXIMAHOSTS':
                    break;
                default:
                // console.error('Unknown event type: ', nodeEvent);
            }
        }
    );
};

///////////////////////// application registers custom callbacks ///////////////////////

function onNewBlock(callback: (data: NewBlockData) => void) {
    whenNewBlock = callback;
}

function onFail(callback: (data: NewMDSFail) => void) {
    whenFail = callback;
}

function onMining(callback: (data: MiningData) => void) {
    whenMining = callback;
}

function onMaxima(callback: (data: MaximaData) => void) {
    whenMaxima = callback;
}

function onNewBalance(callback: (data: NewBalanceData) => void) {
    whenNewBalance = callback;
}

function onInit(callback: () => void) {
    whenInit = callback;

    initializeMinima();
}

function onMDSTimer(callback: (data: any) => void) {
    whenMDSTimer = callback;
}

function onMinimaLog(callback: (data: MinimaLogData) => void) {
    whenMinimaLog = callback;
}

export const events = {
    onNewBlock,
    onMining,
    onMaxima,
    onNewBalance,
    onInit,
    onMinimaLog,
    onMDSTimer,
    onFail,
};
