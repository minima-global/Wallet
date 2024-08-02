import { useContext, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import AnimatePageIn from '../../components/UI/Animations/AnimatePageIn';
import { useLocation } from 'react-router-dom';
import TransactionSearchBar from '../../components/TransactionSearchBar';
import SearchIcon from '../../components/UI/Icons/SearchIcon';
import SecondaryButton from '../../components/UI/SecondaryButton';
import { appContext } from '../../AppContext';
import useTransactionHistory from './hooks';
import Lottie from 'lottie-react';

import Loading from '../../components/UI/Lottie/Loading.json';
import Detail from './Detail';

const Transactions = () => {
    const location = useLocation();

    const { historyFacade, historyDetails, history, getHistory, loaded } = useContext(appContext);
    const { createElement } = useTransactionHistory();

    const [viewTxpow, setViewTxpow] = useState<string | false>(false);

    console.log(historyFacade);

    useEffect(() => {
        if (loaded.current) {
            setTimeout(() => {
                getHistory();
            }, 2000);
        }
    }, [loaded]);

    return (
        <>
            <Detail txpowid={viewTxpow} dismiss={() => setViewTxpow(false)} />

            <AnimatePageIn display={location.pathname.includes('/dashboard/transactions')}>
                <div className="mx-3 mt-8">
                    <div className="grid grid-cols-[1fr_auto] items-center">
                        <h6 className="font-bold tracking-wide dark:text-neutral-300">Transaction History</h6>
                    </div>

                    <div className="my-3 overflow-x-auto">
                        <div className="flex items-center overflow-auto hide-scrollbar gap-2 w-full">
                            <TransactionSearchBar />
                            <div className="flex flex-shrink-0 gap-2">
                                <SecondaryButton onClick={() => null} type="button">
                                    Hide
                                </SecondaryButton>
                                <SecondaryButton onClick={() => null} type="button">
                                    Download
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>

                    {!historyFacade && (
                        <div className="flex justify-center">
                            <Lottie
                                className="w-[64px] h-[64px] self-center place-self-center justify-self-center"
                                animationData={Loading}
                                loop={true}
                            />
                        </div>
                    )}
                    {historyFacade && <div className="space-y-4">{createElement(setViewTxpow)}</div>}
                </div>
            </AnimatePageIn>
        </>
    );
};
export default Transactions;
