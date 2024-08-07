import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import AnimatePageIn from '../../components/UI/Animations/AnimatePageIn';
import { useLocation } from 'react-router-dom';
import TransactionSearchBar from '../../components/TransactionSearchBar';
import SecondaryButton from '../../components/UI/SecondaryButton';
import { useTransactionHistory } from './context';
import Lottie from 'lottie-react';
import Loading from '../../components/UI/Lottie/Loading.json';
import Detail from './Detail';
import FilterBy from './FilterBy';

const Transactions = () => {
    const location = useLocation();
    const { loading, filterLoading, filterText, filteredElements, viewTxpow, triggerLoadingMore, setViewTxpow, filterBy, hasMore } = useTransactionHistory();
    const [promptFilterBy, setPromptFilterBy] = useState(false);

    useEffect(() => {
        if (viewTxpow) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [viewTxpow]);

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
                    {filterLoading && (
                        <div className="flex justify-center flex-col my-4 items-center">
                            <Lottie className="animate-spin w-[64px] h-[64px]" animationData={Loading} loop={true} />
                            <p className='text-[#1B1B1B] animate-pulse text-sm dark:text-neutral-300 text-center'>Searching...</p>
                        </div>
                    )}
                    {filteredElements && filteredElements.length > 0 && (
                        <div className="space-y-4">{filteredElements}</div>
                    )}
                    {(filterText.length > 0 || filterBy !== null) && filteredElements.length === 0 && !filterLoading && (
                        <p className="text-[#1B1B1B] text-sm dark:text-neutral-300 text-center">No results found</p>
                    )}
                    {loading && (
                        <div className="flex justify-center flex-col mt-4 items-center">
                            <Lottie className="animate-spin w-[64px] h-[64px]" animationData={Loading} loop={true} />
                            <p className='text-[#1B1B1B] text-sm dark:text-neutral-300 text-center animate-pulse'>Loading more...</p>
                        </div>
                    )}
                    {!hasMore && !filterText.length && (
                        <div className="mb-8">
                            <p className="text-center text-sm text-[#1B1B1B] dark:text-neutral-600">
                                No more transactions to load
                            </p>
                        </div>
                    )}

                    {hasMore && !filterLoading && !filterText.length && filteredElements && !loading && <div className='mb-4 flex justift-center'><SecondaryButton onClick={triggerLoadingMore} type="button">Load More</SecondaryButton></div>}                    
                </div>
            </AnimatePageIn>
        </>
    );
};

export default Transactions;
