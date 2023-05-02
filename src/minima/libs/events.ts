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
    //     '0xA268CB13191BFF9073D8E6F461150AE85EB2100220C390B619FD9ECFC5F2DD83ACA1D1C9C4B5FEC7EDBD19C47A77E2449583F92627E577419B9D930DC2BC374610A507A9A9A9C160E6A4C2DC77BB776CB81BFF9F8163713B2E002FCADEF408F4258AE27B9EC730C3DE9855776A11E5F74B80663926B3123DD1FCA716A4456783';

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
