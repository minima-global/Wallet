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
    //     '0x194CFCD966AA8211CBC7840FAE694D85F74FCFAC9C6C65F0E422ABB9F3DC256CA0238E984213FB5FD5D9D794225AC4F4FD7A5AA871F957D33736BCA3E661EFA7F79CC121E04C5BAD52C1F2D53BFEBF231CA51BD78BF611D5C71AC0B9B00D224B420E9A33C7ADAA6CF0CA07D8B93C6BE24B1428135A0E0C6AFECB139D2397077F';

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
                    console.error('Unknown event type: ', nodeEvent);
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
