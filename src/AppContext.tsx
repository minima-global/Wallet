import { createContext, useRef, useState, useEffect, ReactElement } from 'react';

import * as rpc from './__minima__/libs/RPC';
import * as fileManager from './__minima__/libs/fileManager';
import { makeTokenImage } from './shared/functions';
import { MinimaToken, Scripts, Token } from './@types/minima';
import { sql } from './__minima__/libs/SQL';
import { DetailsTxPOW, TxPOW } from './types/minima';
import { getTxPOWDetailsType } from './shared/utils';

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
    const [NFTs, setNFTs] = useState<any[]>([]);
    const [balance, setBalance] = useState<MinimaToken[]>([]);
    const [history, setHistory] = useState<TxPOW[]>([]);

    const [historyFacade, setHistoryFacade] = useState<
        | {
              txpowid: string;
              tokenName: string;
              amount: string;
              address: string;
              tokenid: string;
              timeMilli: string;
          }[]
        | null
    >();
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

    useEffect(() => {
        if (!loaded.current) {
            loaded.current = true;
            (window as any).MDS.init((msg: any) => {
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
                if (msg.event === 'MINING') {
                    // setNotificationMessage(
                    //     <>
                    //         <svg
                    //             className="fill-black animate-pulse"
                    //             xmlns="http://www.w3.org/2000/svg"
                    //             height="24"
                    //             viewBox="0 -960 960 960"
                    //             width="24"
                    //         >
                    //             <path d="M42-120v-112q0-33 17-62t47-44q51-26 115-44t141-18q77 0 141 18t115 44q30 15 47 44t17 62v112H42Zm80-80h480v-32q0-11-5.5-20T582-266q-36-18-92.5-36T362-320q-71 0-127.5 18T142-266q-9 5-14.5 14t-5.5 20v32Zm240-240q-66 0-113-47t-47-113h-10q-9 0-14.5-5.5T172-620q0-9 5.5-14.5T192-640h10q0-45 22-81t58-57v38q0 9 5.5 14.5T302-720q9 0 14.5-5.5T322-740v-54q9-3 19-4.5t21-1.5q11 0 21 1.5t19 4.5v54q0 9 5.5 14.5T422-720q9 0 14.5-5.5T442-740v-38q36 21 58 57t22 81h10q9 0 14.5 5.5T552-620q0 9-5.5 14.5T532-600h-10q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T442-600H282q0 33 23.5 56.5T362-520Zm300 160-6-30q-6-2-11.5-4.5T634-402l-28 10-20-36 22-20v-24l-22-20 20-36 28 10q4-4 10-7t12-5l6-30h40l6 30q6 2 12 5t10 7l28-10 20 36-22 20v24l22 20-20 36-28-10q-5 5-10.5 7.5T708-390l-6 30h-40Zm20-70q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9Zm72-130-8-42q-9-3-16.5-7.5T716-620l-42 14-28-48 34-30q-2-5-2-8v-16q0-3 2-8l-34-30 28-48 42 14q6-6 13.5-10.5T746-798l8-42h56l8 42q9 3 16.5 7.5T848-780l42-14 28 48-34 30q2 5 2 8v16q0 3-2 8l34 30-28 48-42-14q-6 6-13.5 10.5T818-602l-8 42h-56Zm28-90q21 0 35.5-14.5T832-700q0-21-14.5-35.5T782-750q-21 0-35.5 14.5T732-700q0 21 14.5 35.5T782-650ZM362-200Z" />
                    //         </svg>
                    //         <h1 className="text-black">Mining your transaction!</h1>
                    //     </>
                    // );
                    // setTimeout(() => setNotificationMessage(false), 5000);
                }

                if (msg.event === 'MDS_SHUTDOWN') {
                    setShuttingDown(true);
                }

                if (msg.event === 'MDSFAIL') {
                    setMinidappSystemFailed(true);
                }

                if (msg.event === 'inited') {
                    rpc.isWriteMode().then((appIsInWriteMode) => {
                        setAppIsInWriteMode(appIsInWriteMode);
                    });

                    (async () => {
                        await sql(`CREATE TABLE IF NOT EXISTS cache (name varchar(255), data longtext);`);

                        const nicknameAddresses: any = await sql(
                            `SELECT * FROM cache WHERE name = 'NICKNAME_ADDRESSES'`
                        );
                        const favoriteTokens: any = await sql(`SELECT * FROM cache WHERE name= 'FAVORITE_TOKENS'`);

                        if (nicknameAddresses) {
                            setDefaultAddressesWithName(JSON.parse(nicknameAddresses.DATA));
                        }

                        if (favoriteTokens) {
                            setFavoriteTokens(JSON.parse(favoriteTokens.DATA));
                        }
                    })();

                    // callAndStoreBalance
                    getBalance();
                    // callAndStoreNFTs
                    getTokens();
                    // callAndStoreSimpleAddresses
                    getSimpleAddresses();

                    checkVaultLocked();

                    get50BlockBurnAvg();
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
        window.MDS.cmd('burn', (resp: any) => {
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
    /**
     * {
	txpowid: string;
	tokenName: string;
	amount: string;
	address: string;
	tokenid: string;
	timeMilli: string;
}
     */

    const getHistory = () => {
        MDS.cmd('history', (resp: any) => {
            if (resp.status) {
                const txpowDetail = resp.response.details;
                setHistoryFacade(
                    resp.response.txpows.map((_t: any, i: number) => {
                        const transactionType = getTxPOWDetailsType(txpowDetail[i]);
                        const valueTransfer = transactionType === 'normal';
                        const custom = transactionType === 'custom';
                        const amount = custom
                            ? ''
                            : valueTransfer
                            ? txpowDetail[i].difference[Object.keys(txpowDetail[i].difference)[0]]
                            : txpowDetail[i].difference['0xFF'];

                        return {
                            txpowid: _t.txpowid,
                            tokenName:
                                _t.body.txn.outputs[0].tokenid === '0x00'
                                    ? 'Minima'
                                    : _t.body.txn.outputs[0].token
                                    ? _t.body.txn.outputs[0].token.name.name
                                    : 'N/A',
                            amount: amount,
                            tokenid: _t.body.txn.outputs[0].tokenid,
                            timeMilli: _t.header.timemilli,
                        };
                    })
                );
                setHistory(resp.response);
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
            const _NFTs: any = tokens.filter((token) => token.tokenid !== '0x00' && token.token.decimals === 0);
            setNFTs(_NFTs);
        });
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
                getHistory,

                notificationMessage,

                // drawer
                openDrawer,
                setOpenDrawer,

                avgBurn,

                // Cache
                _favoriteTokens,
                toggleFavourite,
                _nicknameAddress,
                editNickname,
                setShowEditNickname,
                showEditNickname,
            }}
        >
            {children}
        </appContext.Provider>
    );
};

export default AppProvider;
