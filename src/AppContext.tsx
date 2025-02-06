import { Balance, Block, MinimaEvents } from "@minima-global/mds"
import { MDS } from "@minima-global/mds"
import { createContext, useCallback, useEffect, useRef, useState } from "react"

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
  hamburgerOpen: boolean,
  setHamburgerOpen: React.Dispatch<React.SetStateAction<boolean>>,
  isPending: { uid: string, callback: () => void } | null,
  setIsPending: React.Dispatch<React.SetStateAction<{ uid: string, callback: () => void } | null>>,
  isSuccess: { callback: () => void } | true | null,
  setIsSuccess: React.Dispatch<React.SetStateAction<{ callback: () => void } | true | null>>,
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
})

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const initialised = useRef(false);
  const [loaded, setLoaded] = useState(false);

  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [isPending, setIsPending] = useState<{ uid: string, callback: () => void } | null>(null);
  const [isSuccess, setIsSuccess] = useState<{ callback: () => void } | null>(null);

  const [currencyType, setCurrencyType] = useState<string>('1');
  const [balance, setBalance] = useState<Balance[]>([]);
  const [block, setBlock] = useState<Block | null>(null);
  const [maxContacts, setMaxContacts] = useState<any>(null);
  const [heavierChain, setHeavierChain] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');
  const [address, setAddress] = useState<string>('');

  const fetchBalance = useCallback(() => {
    MDS.cmd.balance((balance) => {
      setBalance(balance.response);
    });
  }, []);

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true

      MDS.init(async (msg) => {
        if (msg.event === MinimaEvents.INITED) {
          setLoaded(true)
          console.log("MDS initialised and ready! 🚀")

          fetchBalance();

          MDS.cmd.block((block) => {
            setBlock(block.response);
          });

          MDS.cmd.getaddress((address) => {
            setAddress(address.response.miniaddress);
          });

          MDS.cmd.maxcontacts((maxContacts) => {
            setMaxContacts(maxContacts.response);
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
  }, [fetchBalance]);

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
    hamburgerOpen,
    setHamburgerOpen,
    isPending,
    setIsPending,
    isSuccess,
    setIsSuccess,
  }

  return <appContext.Provider value={context}>{children}</appContext.Provider>
}

export default AppProvider
