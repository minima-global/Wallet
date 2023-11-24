import { createContext, useRef, useState, useEffect, ReactElement } from 'react';

import * as rpc from './__minima__/libs/RPC';
import { makeTokenImage } from './shared/functions';
import { Coin, MinimaToken, Scripts } from './@types/minima';
import { sql } from './__minima__/libs/SQL';
import { TxPOW } from './types/minima';
import splitDataByDate from './shared/utils/_txpowHelperFunctions/splitDataByDate';
import extractHistoryDetails from './shared/utils/_txpowHelperFunctions/extractHistoryDetails';

export const appContext = createContext({} as any);

interface IProps {
    children: ReactElement;
}
var balanceInterval: ReturnType<typeof setInterval>;
const AppProvider = ({ children }: IProps) => {
    const loaded = useRef(false);

    const [mode, setMode] = useState('desktop');

    const [appIsInWriteMode, setAppIsInWriteMode] = useState<boolean | null>(null);
    const [minidappSystemFailed, setMinidappSystemFailed] = useState<boolean | null>(null);
    const [shuttingDown, setShuttingDown] = useState<boolean | null>(null);

    // RPC DATA
    const [NFTs, setNFTs] = useState<Coin[]>([]);
    const [balance, setBalance] = useState<MinimaToken[]>([]);
    const [history, setHistory] = useState<TxPOW[]>([]);
    const [logs, setLogs] = useState<string[]>([]);

    const [historyFacade, setHistoryFacade] = useState<{
        [key: string]: {
            txpowid: string;
            tokenName: string;
            amount: string;
            tokenid: string;
            timeMilli: string;
        }[];
    }>();
    const [historyDetails, setHistoryDetails] = useState<
        {
            txpowid: string;
            amount: string;
            type: string;
            sentTo0x: string;
            sentToMx: string;
            tokenName: string;
            blockPosted: number;
            date: string;
            timemilli: string;
            burn: number;
            inputs: any[];
            outputs: any[];
            stateVars: any[];
        }[]
    >([]);
    const [simpleAddresses, setSimpleAddresses] = useState<Scripts[]>([]);
    const [avgBurn, setAvgBurn] = useState(0);
    const [vaultLocked, setVaultLocked] = useState<null | boolean>(null);

    // UI STUFF
    const [notificationMessage, setNotificationMessage] = useState<false | ReactElement>(false);
    const [openDrawer, setOpenDrawer] = useState(false);

    // SQL DATA
    const [showEditNickname, setShowEditNickname] = useState<string | false>(false);
    const [_nicknameAddress, setDefaultAddressesWithName] = useState<{ name: string; script: Scripts }[]>([]);
    const [_favoriteTokens, setFavoriteTokens] = useState<string[]>([]);
    const [_currencyFormat, setCurrencyFormat] = useState<{ decimal: string; thousands: string } | null>(null);

    useEffect(() => {
        if (!loaded.current) {
            loaded.current = true;
            (window as any).MDS.init((msg: any) => {
                if (msg.event === 'inited') {
                    rpc.isWriteMode().then((appIsInWriteMode) => {
                        setAppIsInWriteMode(appIsInWriteMode);
                    });
                    // callAndStoreBalance
                    getBalance();
                    // callAndStoreNFTs
                    getTokens();
                    // callAndStoreSimpleAddresses
                    getSimpleAddresses();

                    checkVaultLocked();

                    get50BlockBurnAvg();

                    (async () => {
                        await sql(`CREATE TABLE IF NOT EXISTS cache (name varchar(255), data longtext);`);

                        const nicknameAddresses: any = await sql(
                            `SELECT * FROM cache WHERE name = 'NICKNAME_ADDRESSES'`
                        );
                        const favoriteTokens: any = await sql(`SELECT * FROM cache WHERE name= 'FAVORITE_TOKENS'`);

                        const currFormat: any = await sql(`SELECT * FROM cache WHERE name= 'CURRENCY_FORMAT'`);

                        if (nicknameAddresses) {
                            setDefaultAddressesWithName(JSON.parse(nicknameAddresses.DATA));
                        }

                        if (favoriteTokens) {
                            setFavoriteTokens(JSON.parse(favoriteTokens.DATA));
                        }

                        if (currFormat) {
                            console.log('Setting saved config 4 currency', JSON.parse(currFormat.DATA));
                            setCurrencyFormat(JSON.parse(currFormat.DATA));
                        }
                    })();
                }
                if (msg.event === 'NEWBLOCK') {
                    // new block

                    get50BlockBurnAvg();
                }
                if (msg.event === 'NEWBALANCE') {
                    setNotificationMessage(
                        <>
                            <svg
                                className="fill-black"
                                xmlns="http://www.w3.org/2000/svg"
                                height="24"
                                viewBox="0 -960 960 960"
                                width="24"
                            >
                                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
                            </svg>
                            <h1 className="text-black">Your balance has updated!</h1>
                        </>
                    );
                    setTimeout(() => setNotificationMessage(false), 2500);
                    // balance noti
                    // callAndStoreBalance
                    getBalance();
                    // callAndStoreNFTs
                    getTokens();
                }
                if (msg.event === 'MINIMALOG') {
                    const log = msg.data.message;
                    setLogs((prevState) => [...prevState, log]);
                }

                if (msg.event === 'MDS_SHUTDOWN') {
                    setShuttingDown(true);
                }

                if (msg.event === 'MDSFAIL') {
                    setMinidappSystemFailed(true);
                }
            });
        }
    }, [loaded]);

    useEffect(() => {
        if (window.innerWidth < 568) {
            setMode('mobile');
        }
    }, []);

    const checkVaultLocked = () => {
        rpc.isVaultLocked().then((r) => {
            setVaultLocked(r);
        });
    };

    const get50BlockBurnAvg = async () => {
        (window as any).MDS.cmd('burn', (resp: any) => {
            if (resp.status) {
                setAvgBurn(resp.response['50block'].avg);
            }
        });
    };

    const getSimpleAddresses = async () => {
        rpc.getScripts().then((scripts) => {
            const allSimpleAddresses = scripts.filter((s) => s.simple && s.default);
            setSimpleAddresses(allSimpleAddresses);
        });
    };

    const getHistory = () => {
        (window as any).MDS.cmd('history', (resp: any) => {
            if (resp.status) {
                setHistoryFacade(splitDataByDate(resp.response.txpows, resp.response.details));
                setHistoryDetails(extractHistoryDetails(resp.response.txpows, resp.response.details));
                setHistory(resp.response.txpows);
            }
        });
    };

    const getBalance = async () => {
        await rpc.getMinimaBalance().then((b) => {
            b.map((t) => {
                if (t.token.url && t.token.url.startsWith('<artimage>', 0)) {
                    t.token.url = makeTokenImage(t.token.url, t.tokenid);
                }
            });

            const walletNeedsUpdating = !!b.find((t) => t.unconfirmed !== '0');

            if (!walletNeedsUpdating) {
                window.clearInterval(balanceInterval);
            }

            if (walletNeedsUpdating) {
                setBalance(b);
                if (!balanceInterval) {
                    balanceInterval = setInterval(() => {
                        getBalance();
                    }, 10000);
                }
            }

            setBalance(b);
        });
    };

    const getTokens = async () => {
        await rpc.getTokens().then((tokens) => {
            const t = tokens.map((t: any) => {
                if ('url' in t.name && t.name.url && t.name.url.startsWith('<artimage>', 0)) {
                    t.name.url = makeTokenImage(t.name.url, t.tokenid);
                }

                return t;
            });
            setNFTs(t);
        });
    };

    const updateCurrencyFormat = async (decimal: string, thousands: string) => {
        const updatedFormat = {
            decimal,
            thousands,
        };

        // update nicknames
        setCurrencyFormat(updatedFormat);

        const format = await sql(`SELECT * FROM cache WHERE name = 'CURRENCY_FORMAT'`);

        if (!format) {
            await sql(`INSERT INTO cache (name, data) VALUES ('CURRENCY_FORMAT', '${JSON.stringify(updatedFormat)}')`);
        } else {
            await sql(`UPDATE cache SET data = '${JSON.stringify(updatedFormat)}' WHERE name = 'CURRENCY_FORMAT'`);
        }
    };

    const editNickname = async (address: string, nickname: string) => {
        const updatedNicknames = {
            ..._nicknameAddress,
            [address]: nickname,
        };

        // update nicknames
        setDefaultAddressesWithName(updatedNicknames);

        const nicknames = await sql(`SELECT * FROM cache WHERE name = 'NICKNAME_ADDRESSES'`);

        if (!nicknames) {
            await sql(
                `INSERT INTO cache (name, data) VALUES ('NICKNAME_ADDRESSES', '${JSON.stringify(updatedNicknames)}')`
            );
            setShowEditNickname(false);
        } else {
            await sql(
                `UPDATE cache SET data = '${JSON.stringify(updatedNicknames)}' WHERE name = 'NICKNAME_ADDRESSES'`
            );
            setShowEditNickname(false);
        }
    };

    const toggleFavourite = async (tokenid: string) => {
        const updatedFavourites = _favoriteTokens.includes(tokenid)
            ? _favoriteTokens.filter((i: any) => i !== tokenid)
            : [..._favoriteTokens, tokenid];

        // update favourites
        setFavoriteTokens(updatedFavourites);

        const favourites = await sql(`SELECT * FROM cache WHERE name = 'FAVORITE_TOKENS'`);

        if (!favourites) {
            await sql(
                `INSERT INTO cache (name, data) VALUES ('FAVORITE_TOKENS', '${JSON.stringify(updatedFavourites)}')`
            );
        } else {
            await sql(`UPDATE cache SET data = '${JSON.stringify(updatedFavourites)}' WHERE name = 'FAVORITE_TOKENS'`);
        }
    };

    return (
        <appContext.Provider
            value={{
                vaultLocked,
                checkVaultLocked,

                appIsInWriteMode,
                minidappSystemFailed,

                mode,
                isMobile: mode === 'mobile',

                balance,
                NFTs,
                simpleAddresses,
                history,
                historyFacade,
                historyDetails,
                getHistory,
                getBalance,

                logs,

                notificationMessage,

                // drawer
                openDrawer,
                setOpenDrawer,

                avgBurn,
                loaded,

                // Cache
                _favoriteTokens,
                toggleFavourite,
                _nicknameAddress,
                editNickname,
                setShowEditNickname,
                showEditNickname,

                // currenyFormatter
                _currencyFormat,
                updateCurrencyFormat,
            }}
        >
            {children}
        </appContext.Provider>
    );
};

export default AppProvider;
