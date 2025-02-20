import { Balance, Block, MinimaEvents, Script } from "@minima-global/mds"
import { MDS } from "@minima-global/mds"
import { createContext, useCallback, useEffect, useRef, useState } from "react"
import useOldWalletMigration from "./hooks/useOldWalletMigration"

(window as any).MDS = MDS;

export const appContext = createContext<{
  loaded: boolean,
  currencyType: string,
  block: Block | null,
  setCurrencyType: (type: string) => void,
  balance: Balance[],
  maxContacts: any,
  heavierChain: boolean,
  language: string,
  setLanguage: (language: string) => void,
  fetchBalance: () => void,
  address: string,
  setAddress: (address: string) => void,
  hamburgerOpen: boolean,
  setHamburgerOpen: React.Dispatch<React.SetStateAction<boolean>>,
  isPending: { uid: string, callback: () => void } | null,
  setIsPending: React.Dispatch<React.SetStateAction<{ uid: string, callback: () => void } | null>>,
  isSuccess: { callback: () => void } | true | null,
  setIsSuccess: React.Dispatch<React.SetStateAction<{ callback: () => void } | true | null>>,
  history: any[] | null,
  setHistory: React.Dispatch<React.SetStateAction<any[] | null>>,
  getHistory: (order?: 'asc' | 'desc') => void,
  activeMonth: string | null,
  setActiveMonth: React.Dispatch<React.SetStateAction<string | null>>,
  hiddenTokens: string[],
  setHiddenTokens: React.Dispatch<React.SetStateAction<string[]>>,
  verified: Record<string, number>,
  gridMode: 'list' | 'grid',
  setGridMode: React.Dispatch<React.SetStateAction<'list' | 'grid'>>,
  activeTab: 'main' | 'hidden',
  setActiveTab: React.Dispatch<React.SetStateAction<'main' | 'hidden'>>,
  addresses: string[],
  isDenied: boolean,
  setIsDenied: React.Dispatch<React.SetStateAction<boolean>>,
  favourites: string[],
  setFavourites: React.Dispatch<React.SetStateAction<string[]>>,
  isError: { display: boolean, message?: string } | null,
  setIsError: React.Dispatch<React.SetStateAction<{ display: boolean, message?: string } | null>>,
  addressNames: Record<string, string>,
  setAddressNames: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  fullAddresses: Script[],
  setFullAddresses: React.Dispatch<React.SetStateAction<Script[]>>,
}>({
  loaded: false,
  currencyType: '1',
  block: null,
  setCurrencyType: () => { },
  balance: [],
  maxContacts: null,
  heavierChain: false,
  language: 'en',
  setLanguage: () => { },
  fetchBalance: () => { },
  address: '',
  hamburgerOpen: false,
  setHamburgerOpen: () => { },
  isPending: null,
  setIsPending: () => { },
  isSuccess: null,
  setIsSuccess: () => { },
  history: null,
  setHistory: () => { },
  getHistory: () => { },
  activeMonth: null,
  setActiveMonth: () => { },
  hiddenTokens: [],
  setHiddenTokens: () => { },
  verified: {},
  gridMode: 'list',
  setGridMode: () => { },
  activeTab: 'main',
  setActiveTab: () => { },
  addresses: [],
  setAddress: () => { },
  isDenied: false,
  setIsDenied: () => { },
  favourites: [],
  setFavourites: () => { },
  isError: null,
  setIsError: () => { },
  addressNames: {},
  setAddressNames: () => { },
  fullAddresses: [],
  setFullAddresses: () => { },
})

const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const initialised = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [gridMode, setGridMode] = useState<'list' | 'grid'>('list');
  const [activeTab, setActiveTab] = useState<'main' | 'hidden'>('main');
  const [addresses, setAddresses] = useState<string[]>([]);
  const [fullAddresses, setFullAddresses] = useState<Script[]>([]);

  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  // MDS action modalss
  const [isPending, setIsPending] = useState<{ uid: string, callback: () => void } | null>(null);
  const [isSuccess, setIsSuccess] = useState<{ callback: () => void } | true | null>(null);
  const [isError, setIsError] = useState<{ display: boolean, message?: string } | null>(null);
  const [isDenied, setIsDenied] = useState<boolean>(false);

  const [currencyType, setCurrencyType] = useState<string>('1');
  const [balance, setBalance] = useState<Balance[]>([]);
  const [block, setBlock] = useState<Block | null>(null);
  const [maxContacts, setMaxContacts] = useState<any>(null);
  const [heavierChain, setHeavierChain] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');
  const [address, setAddress] = useState<string>('');

  const [history, setHistory] = useState<any[] | null>(null);
  const [activeMonth, setActiveMonth] = useState<string | null>(null);

  const [addressNames, setAddressNames] = useState<Record<string, string>>({});
  const [hiddenTokens, setHiddenTokens] = useState<string[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);

  const [verified, setVerified] = useState<Record<string, number>>({
    '0x00': 2
  });

  // must be after setFavourites and setAddressNames
  useOldWalletMigration({
    loaded,
    setFavourites,
    setAddressNames,
  });

  const fetchBalance = useCallback(() => {
    MDS.cmd.balance({
      params: {
        tokendetails: 'true',
      }
    }, (balance) => {
      setBalance(balance.response);
    });
  }, []);

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;

      MDS.init(async (msg) => {
        if (msg.event === MinimaEvents.INITED) {
          setLoaded(true)

          fetchBalance();

          // create hidden token keypair item
          MDS.keypair.get('hidden_tokens').then((keypair) => {
            if (keypair.value) {
              setHiddenTokens(JSON.parse(keypair.value));
            } else {
              MDS.keypair.set('hidden_tokens', '[]');
            } 
          });

          MDS.keypair.get('favourites').then((keypair) => {
            if (keypair.value) {
              setFavourites(JSON.parse(keypair.value));
            } else {
              MDS.keypair.set('favourites', '[]');
            }
          });

          MDS.keypair.get('address_names').then((keypair) => {
            if (keypair.value) {
              setAddressNames(JSON.parse(keypair.value));
            } else {
              MDS.keypair.set('address_names', '{}');
            }
          });

          MDS.cmd.block((block) => {
            setBlock(block.response);
          });

          MDS.cmd.getaddress((address) => {
            setAddress(address.response.miniaddress);
          });

          MDS.cmd.maxcontacts((maxContacts) => {
            setMaxContacts(maxContacts.response);
          });

          MDS.cmd.scripts((scripts) => {
            setAddresses(scripts.response.filter((script) => script.simple && script.default).map((script) => script.miniaddress));
            setFullAddresses(scripts.response.filter((script) => script.simple && script.default).map((script) => script));
          });

          MDS.sql(`SELECT * FROM txpows ORDER BY timemilli desc`).then((txpows) => {
            setHistory(txpows.rows.map((r) => ({ ...r, HEADER: JSON.parse(r.HEADER), BODY: JSON.parse(r.BODY), DETAILS: JSON.parse(r.DETAILS) })));
          });
        }

        if (msg.event === MinimaEvents.NEWCOIN) {
          fetchBalance();
        }

        if (msg.event === MinimaEvents.NEWBLOCK) {
          fetchBalance();
        }

        if (msg.event === 'MDS_PENDING') {
          window.dispatchEvent(new CustomEvent('MDS_PENDING', { detail: msg.data }));
        }

        if (msg.event === MinimaEvents.NEWBLOCK) {
          setBlock({
            block: msg.data.txpow.header.block,
            hash: msg.data.txpow.header.txbodyhash,
            date: msg.data.txpow.header.date,
            timemilli: msg.data.txpow.header.timemilli,
          });
        }

        if (msg.event === 'MDS_HEAVIER_CHAIN' as any) {
          setHeavierChain(true);
        }
      })
    }
  }, [fetchBalance, setHiddenTokens]);

  useEffect(() => {
    if (hiddenTokens.length > 0) {
      MDS.keypair.set('hidden_tokens', JSON.stringify(hiddenTokens));
    }
  }, [hiddenTokens]);

  useEffect(() => {
    if (favourites.length > 0) {
      MDS.keypair.set('favourites', JSON.stringify(favourites));
    }
  }, [favourites]);

  useEffect(() => {
    if (Object.keys(addressNames).length > 0) {
      MDS.keypair.set('address_names', JSON.stringify(addressNames));
    }
  }, [addressNames]);

  useEffect(() => {
    const currencyType = localStorage.getItem('minima_currency_type');

    if (currencyType) {
      setCurrencyType(currencyType)
    }
  }, []);

  useEffect(() => {
    const language = localStorage.getItem('minima_language');

    if (language) {
      setLanguage(language)
    }
  }, []);

  useEffect(() => { 
    balance.forEach((token) => {
      if (typeof token.token === 'object' && token.token.webvalidate) {
        MDS.cmd.tokenvalidate({
          params: {
            tokenid: token.tokenid
          }
        }).then((response) => {
          setVerified({
            ...verified,
            [token.tokenid]: response.response.web.valid ? 2 : 1
          });
        });
      }
    });
  }, [balance]);

  const getHistory = useCallback((order = 'desc') => {
    MDS.sql(`SELECT * FROM txpows ORDER BY timemilli ${order}`).then((txpows) => {
      // let history = txpows.rows.map((r) => ({ ...r, HEADER: JSON.parse(r.HEADER), BODY: JSON.parse(r.BODY), DETAILS: JSON.parse(r.DETAILS) }));
      // history[history.length - 1].HEADER = { timemilli: 1712985600000 };
      // MDS.sql(`UPDATE txpows SET HEADER = '${JSON.stringify(history[history.length - 1].HEADER)}' WHERE txpowid = '${history[history.length - 1].TXPOWID}'`, function (res) {
      //   console.log(res);
      // });

      setHistory(txpows.rows.map((r) => ({ ...r, HEADER: JSON.parse(r.HEADER), BODY: JSON.parse(r.BODY), DETAILS: JSON.parse(r.DETAILS) })));
    });
  }, []);

  const context = {
    loaded,
    currencyType,
    setCurrencyType,
    balance,
    block,
    maxContacts,
    heavierChain,
    language,
    setLanguage,
    fetchBalance,
    address,
    setAddress,
    hamburgerOpen,
    setHamburgerOpen,
    isPending,
    setIsPending,
    isSuccess,
    setIsSuccess,
    history,
    getHistory,
    setHistory,
    hiddenTokens,
    setHiddenTokens,
    verified,
    gridMode,
    setGridMode,
    activeTab,
    setActiveTab,
    addresses,
    activeMonth,
    setActiveMonth,
    isDenied,
    setIsDenied,
    favourites,
    setFavourites,
    isError,
    setIsError,
    addressNames,
    setAddressNames,
    fullAddresses,
    setFullAddresses,
  }

  return <appContext.Provider value={context}>{children}</appContext.Provider>
}

export default AppProvider
