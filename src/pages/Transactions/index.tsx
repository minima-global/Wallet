import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import AnimatePageIn from '../../components/UI/Animations/AnimatePageIn';
import { useLocation } from 'react-router-dom';
import TransactionSearchBar from '../../components/TransactionSearchBar';
import SecondaryButton from '../../components/UI/SecondaryButton';
import { appContext } from '../../AppContext';
import { useTransactionHistory } from './context';
import Lottie from 'lottie-react';
import Loading from '../../components/UI/Lottie/Loading.json';
import Detail from './Detail';
import FilterBy from './FilterBy';

const Transactions = () => {
    const location = useLocation();

    const { getHistory, loaded, hasMore, setHasMore, setHistory, historyLoaded } = useContext(appContext);
    const { filterText, filteredElements, viewTxpow, setViewTxpow, filterBy } = useTransactionHistory();
    const [promptFilterBy, setPromptFilterBy] = useState(false);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [limit] = useState(20); // Number of items to fetch per request

    useEffect(() => {
        if (viewTxpow) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [viewTxpow]);

    // fetch history first time loading page and then not again
    useEffect(() => {
        if (!historyLoaded.current && (loaded && loaded.current)) {
            getHistory(limit, offset)
                .then((response: any) => {
                    console.log(response);
                    setHistory(response);
                    historyLoaded.current = true; // Set to true after the first load
                })
                .catch((error: any) => {
                    console.error('Error fetching history:', error);
                });
        }
    }, [loaded, limit, offset]);

    // load more transactions on scroll to bottom event
    const loadMoreTransactions = useCallback(() => {
        if (loading || !hasMore) return; // Prevent loading if already loading or no more items
    
        setLoading(true);
        getHistory(limit, offset)
            .then((response: any) => {
                const { txpows, details } = response;
    
                // Deduplicate txpows and details
                setHistory((prev: any) => {
                    const existingTxpows = new Set(prev.txpows.map((txpow: any) => txpow.txpowid));
                    const newTxpows = txpows.filter((txpow: any) => !existingTxpows.has(txpow.txpowid));
                    const newDetails = newTxpows.map((txpow: any) => details[txpows.indexOf(txpow)]);
    
                    return {
                        txpows: [...prev.txpows, ...newTxpows],
                        details: [...prev.details, ...newDetails],
                    };
                });
    
                // Check if more items are available
                setHasMore(txpows.length >= limit);
                setOffset(prev => prev + limit);
                setLoading(false);
            })
            .catch((error: any) => {
                console.error('Error fetching history:', error);
                setLoading(false);
            });
    }, [loading, hasMore, limit, offset]);
    
    // load more transactions when scrolling to bottom of screen...
    const handleScroll = useCallback(
        debounce(() => {
            const bottom =
                window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50; // 50px from bottom
            if (bottom) {
                loadMoreTransactions();
            }
        }, 300), // Adjust debounce time as needed
        [loadMoreTransactions]
    );

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Slow down the API calls.. 
    function debounce(func: Function, wait: number) {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }
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
                    {filteredElements && filteredElements.length > 0 && (
                        <div className="space-y-4">{filteredElements}</div>
                    )}
                    {(filterText.length > 0 || filterBy !== null) && filteredElements.length === 0 && (
                        <p className="text-[#1B1B1B] text-sm dark:text-neutral-300 text-center">No results found</p>
                    )}
                    {loading && (
                        <div className="flex justify-center mt-4">
                            <Lottie className="w-[64px] h-[64px]" animationData={Loading} loop={true} />
                            Loading more...
                        </div>
                    )}
                    {!hasMore && !filterText.length && (
                        <div className="mb-8">
                            <p className="text-center text-sm text-[#1B1B1B] dark:text-neutral-600">
                                No more transactions to load
                            </p>
                        </div>
                    )}{' '}
                    {/* Optional: Show message when no more items */}
                </div>
            </AnimatePageIn>
        </>
    );
};

export default Transactions;
