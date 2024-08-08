import { createContext, useRef, useState, useEffect, ReactElement, useCallback } from 'react';

import * as rpc from './__minima__/libs/RPC';
import { makeTokenImage } from './shared/functions';
import { Coin, MinimaToken, Scripts } from './@types/minima';
import { sql } from './__minima__/libs/SQL';
import extractHistoryDetails from './shared/utils/_txpowHelperFunctions/extractHistoryDetails';

import * as utils from './utilities';

export const appContext = createContext({} as any);

interface IProps {
    children: ReactElement;
}

const AppProvider = ({ children }: IProps) => {
    const loaded = useRef(false);
    const balanceInterval = useRef<NodeJS.Timeout | null>(null);
    const [loading, setLoading] = useState(false);

    const [_transferType, setTransferType] = useState<'value' | 'split' | 'consolidate'>('value');
    const [mode, setMode] = useState('desktop');
    const [isCreatingKeys, setCreatingKeys] = useState(false);
    const [appIsInWriteMode, setAppIsInWriteMode] = useState<boolean | null>(null);
    const [minidappSystemFailed, setMinidappSystemFailed] = useState<boolean | null>(null);

    const [_addressBook, setAddressBook] = useState<{ [key: string]: string }>({});

    const [shuttingDown, setShuttingDown] = useState<boolean | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Initialize state based on localStorage
        return localStorage.getItem('dark-mode') === 'true';
    });

    const [_promptMining, setPromptMining] = useState(false);
    const [_promptFavorites, setPromptFavorites] = useState(false);
    const [_promptAccountNameUpdate, setPromptAccountNameUpdate] = useState(false);
    const [_promptAddressBookAdd, setPromptAddressBookAdd] = useState(false);

    const [_promptSetting, setPromptSettings] = useState(false);
    const [_promptBalanceInfo, setPromptBalanceInfo] = useState(false);
    const [_promptHiddenTokens, setPromptHiddenTokens] = useState(false);
    const [_currentNavigation, setCurrentNavigation] = useState('balance');

    const [_transactionSubmitting, setTransactionSubmitting] = useState(false);
    const [_transactionSuccess, setTransactionSuccess] = useState(false);
    const [_transactionPending, setTransactionPending] = useState(false);
    const [_transactionError, setTransactionError] = useState<false | string>(false);

    const promptSettings = () => {
        setPromptSettings((prevState) => !prevState);
    };

    const promptBalanceInfo = () => {
        setPromptBalanceInfo((prevState) => !prevState);
    };

    const promptNavigation = (nav: string) => {
        setCurrentNavigation(nav);
    };

    // RPC DATA
    const [_maxima, setMaxima] = useState('');
    const [NFTs, setNFTs] = useState<Coin[]>([]);
    const [balance, setBalance] = useState<MinimaToken[]>([]);
    const [hiddenBalance, setHiddenBalance] = useState<MinimaToken[]>([]);

    const [logs, setLogs] = useState<string[]>([]);
    const [_seedPhrase, setSeedPhrase] = useState(null);

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
    const [_currencyFormat, setCurrencyFormat] = useState<{ decimal: string; thousands: string }>({
        decimal: '.',
        thousands: '',
    });

    const [_hiddenTokens, setHiddenTokens] = useState<Record<string, boolean> | null>(null);
    const [_hiddenTransactions, setHiddenTransactions] = useState<Record<'id' | 'amount', string> | null>(null);

    useEffect(() => {
        // Apply or remove the 'dark' class on the document element
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('dark-mode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('dark-mode', 'false');
        }
    }, [isDarkMode]); // Re-run effect when isDarkMode changes

    useEffect(() => {
        if (loaded && loaded.current) {
            getBalance();
        }
    }, [loaded, _hiddenTokens])

    useEffect(() => {
        if (!loaded.current) {
            loaded.current = true;
            (window as any).MDS.init((msg: any) => {
                if (msg.event === 'inited') {
                    rpc.isWriteMode().then((appIsInWriteMode) => {
                        setAppIsInWriteMode(appIsInWriteMode);
                    });

                    // callAndSaveMaximaName
                    getMaximaName();
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

                        const hiddenTokens: any = await sql(`SELECT * FROM cache WHERE name= 'HIDDEN_TOKENS'`);

                        const hiddenTransactions: any = await sql(
                            `SELECT * FROM cache WHERE name= 'HIDDEN_TRANSACTIONS'`
                        );

                        const addressBook: any = await sql(`SELECT * FROM cache WHERE name = 'ADDRESSBOOK'`);

                        if (addressBook) {
                            setAddressBook(JSON.parse(addressBook.DATA));
                        }

                        if (hiddenTokens) {
                            setHiddenTokens(JSON.parse(hiddenTokens.DATA));
                        }

                        if (hiddenTransactions) {
                            setHiddenTransactions(JSON.parse(hiddenTransactions.DATA));
                        }

                        if (nicknameAddresses) {
                            setDefaultAddressesWithName(JSON.parse(nicknameAddresses.DATA));
                        }

                        if (favoriteTokens) {
                            setFavoriteTokens(JSON.parse(favoriteTokens.DATA));
                        }

                        if (currFormat) {
                            setCurrencyFormat(JSON.parse(currFormat.DATA));
                        }
                    })();
                }

                if (msg.event === 'NEWBLOCK') {
                    // new block
                    // get50BlockBurnAvg();
                }
                if (msg.event === 'NEWBALANCE') {
                    getBalance();
                    getTokens();
                }
                if (msg.event === 'MINIMALOG') {
                    const log = msg.data.message;
                    setLogs((prevState) => [...prevState, log]);

                    const isCreatingKeys = log.includes('8 more initial keys created..');
                    const isDoneCreatingKeys = log.includes('All default getaddress keys created..');
                    if (isCreatingKeys) {
                        setCreatingKeys(true);
                    }

                    if (isDoneCreatingKeys) {
                        setCreatingKeys(false);
                        window.location.reload();
                    }
                }

                if (msg.event === 'MDS_SHUTDOWN') {
                    setShuttingDown(true);
                }

                if (msg.event === 'MDSFAIL') {
                    setMinidappSystemFailed(true);
                }
                if (msg.event === 'MINING') {
                    setPromptMining(msg.data.mining);
                }
            });
        }
    }, [loaded]);

    const getMaximaName = () => {
        (window as any).MDS.cmd('maxima', (resp: any) => {
            if (resp.status) {
                setMaxima(resp.response.name);
            }
        });
    };

    const checkVaultLocked = () => {
        (window as any).MDS.cmd('vault', (resp: any) => {
            setVaultLocked(resp.response.locked);

            if (!resp.response.locked) {
                setSeedPhrase(resp.response.phrase);
            }
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

    const getBalance = useCallback(async () => {
        setLoading(true);
        console.log('hiddenTokens', _hiddenTokens);
        try {
            const balances = await rpc.getMinimaBalance();
    
            // Process each token's URL if necessary
            for (const token of balances) {
                if (token.token.url) {
                    if (token.token.url.startsWith('<artimage>')) {
                        token.token.url = makeTokenImage(token.token.url, token.tokenid);
                    } else if (token.token.url.startsWith('https://ipfs.io/ipns/')) {
                        token.token.url = await utils.fetchIPFSImageUri(token.token.url);
                    }
                }
            }
    
            // Filter out hidden tokens
            const filteredBalance = _hiddenTokens
                ? balances.filter((t) => !_hiddenTokens[t.tokenid])
                : balances;
            
                // Filter out hidden tokens
            const _hiddenBalance = _hiddenTokens
                ? balances.filter((t) => _hiddenTokens[t.tokenid])
                : [];
    
            // Check if wallet needs updating
            const walletNeedsUpdating = filteredBalance.some((token) => token.unconfirmed !== '0');
    
            if (walletNeedsUpdating) {
                setBalance(filteredBalance);
                setHiddenBalance(_hiddenBalance);
    
                if (!balanceInterval.current) {
                    balanceInterval.current = setInterval(getBalance, 10000);
                }
            } else {
                if (balanceInterval.current) {
                    clearInterval(balanceInterval.current);
                    balanceInterval.current = null;
                }
            }
    
            setBalance(filteredBalance);
            setHiddenBalance(_hiddenBalance);
        } catch (error) {
            console.error('Error fetching balance:', error);
        } finally {
            setLoading(false);
        }
    }, [_hiddenTokens]);

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

    const promptHiddenTokens = () => {
        setPromptHiddenTokens((prevState) => !prevState);
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

    const hideToken = async (tokenid: string, toggle = true) => {
        const updatedData = {
            ..._hiddenTokens,
            [tokenid]: toggle,
        };

        // update nicknames
        setHiddenTokens(updatedData);

        const hidden = await sql(`SELECT * FROM cache WHERE name = 'HIDDEN_TOKENS'`);

        if (!hidden) {
            await sql(`INSERT INTO cache (name, data) VALUES ('HIDDEN_TOKENS', '${JSON.stringify(updatedData)}')`);
        } else {
            await sql(`UPDATE cache SET data = '${JSON.stringify(updatedData)}' WHERE name = 'HIDDEN_TOKENS'`);
        }
    };

    const hideTransactionsLike = async (key: 'id' | 'amount', value: string) => {
        const updatedData = {
            ..._hiddenTransactions,
            [key]: value,
        };

        // update nicknames
        setHiddenTransactions(updatedData as Record<'id' | 'amount', string>);

        const hidden = await sql(`SELECT * FROM cache WHERE name = 'HIDDEN_TRANSACTIONS'`);

        if (!hidden) {
            await sql(
                `INSERT INTO cache (name, data) VALUES ('HIDDEN_TRANSACTIONS', '${JSON.stringify(updatedData)}')`
            );
        } else {
            await sql(`UPDATE cache SET data = '${JSON.stringify(updatedData)}' WHERE name = 'HIDDEN_TRANSACTIONS'`);
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

    const updateAddressBook = async (address: string, nickname: string) => {
        const updatedData = {
            ..._addressBook,
            [address]: nickname,
        };

        setAddressBook(updatedData);

        const rows = await sql(`SELECT * FROM cache WHERE name = 'ADDRESSBOOK'`);

        if (!rows) {
            await sql(`INSERT INTO cache (name, data) VALUES ('ADDRESSBOOK', '${JSON.stringify(updatedData)}')`);
        } else {
            await sql(`UPDATE cache SET data = '${JSON.stringify(updatedData)}' WHERE name = 'ADDRESSBOOK'`);
        }

        setPromptAccountNameUpdate(false);
        setPromptAddressBookAdd(false);
    };

    const promptMenu = () => {
        setOpenDrawer((prevState) => !prevState);
    };

    const promptFavorites = () => {
        setPromptFavorites((prevState) => !prevState);
    };

    const selectTransferType = (transferType: 'value' | 'split' | 'consolidate') => {
        setTransferType(transferType);
    };

    return (
        <appContext.Provider
            value={{
                _promptBalanceInfo,
                promptBalanceInfo,

                _promptHiddenTokens,
                setPromptHiddenTokens,
                promptHiddenTokens,

                _promptSetting,
                promptSettings,

                _currentNavigation,
                promptNavigation,

                _transferType,
                selectTransferType,

                vaultLocked,
                checkVaultLocked,

                appIsInWriteMode,
                minidappSystemFailed,

                mode,
                isMobile: mode === 'mobile',

                loading,
                balance,
                hiddenBalance,
                NFTs,
                simpleAddresses,
                history,
                historyFacade,
                setHistoryFacade,
                historyDetails,
                getBalance,

                logs,
                isCreatingKeys,

                notificationMessage,

                // drawer
                openDrawer,
                setOpenDrawer,
                promptMenu,

                avgBurn,
                // check if loaded..
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

                // maxima name
                maximaName: _maxima,

                // This is a global txn status modal..
                _transactionSubmitting,
                setTransactionSubmitting,
                _transactionSuccess,
                setTransactionSuccess,
                _transactionError,
                setTransactionError,
                _transactionPending,
                setTransactionPending,

                isDarkMode,
                setIsDarkMode,

                _seedPhrase,

                _hiddenTokens,
                hideToken,
                _hiddenTransactions,
                setHiddenTransactions,
                hideTransactionsLike,

                _promptMining,
                _promptFavorites,
                updateAddressBook,
                setPromptFavorites,
                promptFavorites,
                _addressBook,
            }}
        >
            {children}
        </appContext.Provider>
    );
};

export default AppProvider;
