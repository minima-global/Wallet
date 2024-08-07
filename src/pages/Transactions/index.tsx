import { useContext, useEffect, useState } from 'react';
import AnimatePageIn from '../../components/UI/Animations/AnimatePageIn';
import { useLocation } from 'react-router-dom';
import TransactionSearchBar from '../../components/TransactionSearchBar';
import SecondaryButton from '../../components/UI/SecondaryButton';
import { appContext } from '../../AppContext';
import { TransactionHistoryProvider, useTransactionHistory } from './context';
import Lottie from 'lottie-react';

import Loading from '../../components/UI/Lottie/Loading.json';
import Detail from './Detail';
import FilterBy from './FilterBy';

const Transactions = () => {
    const location = useLocation();

    const { historyFacade, getHistory, loaded } = useContext(appContext);
    const { filterText, filteredElements, viewTxpow, setViewTxpow, filterBy } = useTransactionHistory();
    const [promptFilterBy, setPromptFilterBy] = useState(false);

    useEffect(() => {
        if (viewTxpow) {
            document.body.classList.add('overflow-hidden');
        }
    }, [viewTxpow]);

    useEffect(() => {
        if (loaded.current) {            
            getHistory();
        }
    }, [loaded]);

    return (
        <>
            <FilterBy display={promptFilterBy} dismiss={() => setPromptFilterBy(false)} />

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
                                <SecondaryButton onClick={() => setPromptFilterBy(true)} type="button">
                                    Filter By
                                </SecondaryButton>
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

                    {historyFacade && <div className="space-y-4 overflow-y-scroll">{filteredElements ? filteredElements : null}</div>}
                    {(!!filterText.length || filterBy !== null) && filteredElements.length === 0 && (
                        <p className="text-[#1B1B1B] text-sm dark:text-neutral-300 text-center">No results found</p>
                    )}
                </div>
            </AnimatePageIn>
        </>
    );
};
export default Transactions;
