import { Txpow } from '../../@types/minima';

////////////// response interfaces //////////
interface InitResponse {
    event: 'inited';
}

interface MiningResponse {
    event: 'MINING';
    data: MiningData;
}
interface MiningData {
    mining: boolean;
    txpow: Txpow;
}

interface NewBlockResponse {
    event: 'NEWBLOCK';
    data: NewBlockData;
}

interface MDSTimerResponse {
    event: 'MDS_TIMER_10SECONDS';
    data: Object;
}

interface NewBlockData {
    txpow: Txpow;
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
    // console.log('INIT event ... please resgister custom callback');
};
let whenMinimaLog = (d: MinimaLogData) => {
    // console.log("MINIMA LOG event ... please resgister custom callback", d);
};

///////////////////////////

const initializeMinima = () => {
    if (process.env.NODE_ENV == 'development') {
        // console.log(process.env.REACTAPP_MINIDAPPID)
        MDS.DEBUG_HOST = '127.0.0.1';
        MDS.DEBUG_PORT = 9003;
        MDS.DEBUG_MINIDAPPID = process.env.REACT_APP_MINIDAPPID;
    }
    MDS.DEBUG_HOST = '127.0.0.1';
    MDS.DEBUG_PORT = 9003;
    MDS.DEBUG_MINIDAPPID =
        '0x93EEC189D601FC10EF1FE87D68EF985FE38334EDF465D9050C7A68D8B9CE2D43F2770197DA6274106D6CB724B6753755C4BE6D94933CEC08AB9F437D6EB7E582567619D7967C4EE1253FBEB352FEA02D4017A29A6CEF68993D5EB9D38869F2751EB9A2E351C5CA2A71F1FD0CE2172B030AE99F37A225E7A1D9F540325F8FAC89';

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
                | MaximaHosts
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
                    break;
                case 'MAXIMAHOSTS':
                    break;
                default:
                    console.error('Unknown event type: ', nodeEvent);
            }
        }
    );
};

// Do registration
// initializeMinima();

///////////////////////// application registers custom callbacks ///////////////////////

function onNewBlock(callback: (data: NewBlockData) => void) {
    whenNewBlock = callback;
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
};
