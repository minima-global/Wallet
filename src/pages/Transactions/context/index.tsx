// TransactionHistoryContext.tsx
import React, { createContext, useContext, useMemo, useState, ReactNode, useRef, useEffect, useCallback } from 'react';
import { format, isSameWeek, isSameYear } from 'date-fns';
import TransactionListItem from '../TransactionListItem';
import { appContext } from '../../../AppContext';
import useFormatMinimaNumber from '../../../__minima__/libs/utils/useMakeNumber';
import splitDataByDate from '../../../shared/utils/_txpowHelperFunctions/splitDataByDate';

const formatDate = (timeMilli: string, shouldShowWeekDay: boolean, shouldDisplayYear: boolean) => {
    return format(
        parseInt(timeMilli),
        `${shouldShowWeekDay ? 'EEEE dd' : 'MMM dd'} ${!shouldDisplayYear ? ' yyyy' : ''}`
    );
};

// Create context
const TransactionHistoryContext = createContext<any | undefined>(undefined);

interface HistoryState {
    txpows: any[]; // Replace `any` with the actual type if possible
    details: any[]; // Replace `any` with the actual type if possible
    size: number;
}
// Create provider
export const TransactionHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { loaded } = useContext(appContext);

    // track if history already loaded..
    const historyLoaded = useRef(false);
    const [history, setHistory] = useState<HistoryState>({ txpows: [], details: [], size: 0 });

    const { makeMinimaNumber } = useFormatMinimaNumber();

    const [loading, setLoading] = useState(false);
    const [filterLoading, setFilterLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [limit] = useState(20); // Number of items to fetch per request
    const [hasMore, setHasMore] = useState(true);

    const [filterText, setFilterText] = useState<string>('');
    const [filterBy, setFilterBy] = useState<'Value Transfer' | 'Custom' | 'Token Creation' | null>(null);
    const [hideBy, setHideBy] = useState<Record<'id' | 'address', string> | null>(null);

    const [viewTxpow, setViewTxpow] = useState<string | false>(false);
    const [filteredElements, setFilteredElements] = useState<JSX.Element[]>([]);
    // fetch history first time loading page and then not again
    useEffect(() => {
        if (!historyLoaded.current && loaded && loaded.current) {
            getHistory(limit, offset)
                .then((response: any) => {
                    setHistory(response);
                    historyLoaded.current = true; // Set to true after the first load
                })
                .catch((error: any) => {
                    console.error('Error fetching history:', error);
                });
        }
    }, [loaded]);

    const getHistory = (max = 20, offset = 0): Promise<any> => {
        return new Promise((resolve, reject) => {
            (window as any).MDS.cmd(`history max:${max} offset:${offset}`, (resp: any) => {
                if (resp.status) {
                    if (!resp.response.txpows.length) {
                        reject(new Error('No results found'));
                    }

                    resolve({
                        txpows: resp.response.txpows,
                        details: resp.response.details,
                    });
                } else {
                    reject(new Error('Failed to fetch history'));
                }
            });
        });
    };

    useEffect(() => {
        const searchAndFilterTransactions = async () => {
            if (!history) return;

            let searchResults: any[] = [];
            let searchDetails: any[] = [];

            if (filterText.length === 0) {
                // Normal filtering logic when there's no filterText
                if (!history.txpows.length) {
                    setFilteredElements([]);
                    return;
                }

                // Filter txpows based on search text
                const filteredTxpows = history.txpows.filter((txpow: any) => txpow.txpowid.includes(filterText));

                // Generate a set of indices for filtered txpows
                const filteredIndices = filteredTxpows.map((txpow: any) => history.txpows.indexOf(txpow));

                // Filter details based on the indices of filtered txpows
                const filteredDetails = history.details.filter((_: any, index: number) =>
                    filteredIndices.includes(index)
                );

                // Split data by date for display
                const historyFacade = splitDataByDate(filteredTxpows, filteredDetails);

                const elements = Object.keys(historyFacade)
                    .map((key) => {
                        const transactions = historyFacade[key];
                        const displayDate = transactions[0]
                            ? formatDate(
                                  transactions[0].timeMilli,
                                  isSameWeek(new Date(), new Date(parseInt(transactions[0].timeMilli))),
                                  isSameYear(new Date(), new Date(parseInt(transactions[0].timeMilli)))
                              )
                            : '';

                        let filteredTransactions = transactions;

                        if (filterBy) {
                            filteredTransactions = transactions.filter((t) => t.type.includes(filterBy));
                        }

                        if (filteredTransactions.length === 0) return null;

                        return (
                            <div key={key}>
                                <div className="flex items-center justify-center">
                                    <hr className="border-[0.1px] border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                                    <span className="mx-4 text-center text-[#1B1B1B] dark:text-neutral-400 font-bold text-[12px] flex-shrink-0">
                                        {displayDate}
                                    </span>
                                    <hr className="border-[0.1px] border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                                </div>
                                <ul className="flex flex-col gap-4">
                                    {filteredTransactions.map((t) => (
                                        <TransactionListItem
                                            key={t.txpowid}
                                            transaction={t}
                                            preprocessedAmount={makeMinimaNumber(t.amount, 3)}
                                            setViewTxpow={setViewTxpow}
                                        />
                                    ))}
                                </ul>
                            </div>
                        );
                    })
                    .filter((el): el is JSX.Element => el !== null); // Ensure the array contains only JSX.Elements

                setFilteredElements(elements);
            } else {
                // Search logic when filterText is present
                setFilterLoading(true);
                let currentOffset = 0;
                let moreData = true;

                while (moreData) {
                    try {
                        const response = await getHistory(20, currentOffset);
                        const { txpows, details } = response;
                        const matchingTxpows = txpows.filter((o: any) => o.txpowid.includes(filterText));

                        if (matchingTxpows.length > 0) {
                            searchResults = [...searchResults, ...matchingTxpows];
                            searchDetails = [
                                ...searchDetails,
                                ...matchingTxpows.map((txpow: any) => details[txpows.indexOf(txpow)]),
                            ];
                        }

                        if (txpows.length < 20) {
                            moreData = false;
                        } else {
                            currentOffset += 20;
                        }
                    } catch (error) {
                        moreData = false;
                    }
                }

                // Split data by date for display
                const historyFacade = splitDataByDate(searchResults, searchDetails);

                const elements = Object.keys(historyFacade)
                    .map((key) => {
                        const transactions = historyFacade[key];
                        const displayDate = transactions[0]
                            ? formatDate(
                                  transactions[0].timeMilli,
                                  isSameWeek(new Date(), new Date(parseInt(transactions[0].timeMilli))),
                                  isSameYear(new Date(), new Date(parseInt(transactions[0].timeMilli)))
                              )
                            : '';

                        let filteredTransactions = transactions;

                        if (filterBy) {
                            filteredTransactions = transactions.filter((t) => t.type.includes(filterBy));
                        }

                        if (filteredTransactions.length === 0) return null;

                        return (
                            <div key={key}>
                                <div className="flex items-center justify-center">
                                    <hr className="border-[0.1px] border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                                    <span className="mx-4 text-center text-[#1B1B1B] dark:text-neutral-400 font-bold text-[12px] flex-shrink-0">
                                        {displayDate}
                                    </span>
                                    <hr className="border-[0.1px] border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                                </div>
                                <ul className="flex flex-col gap-4">
                                    {filteredTransactions.map((t) => (
                                        <TransactionListItem
                                            key={t.txpowid}
                                            transaction={t}
                                            preprocessedAmount={makeMinimaNumber(t.amount, 3)}
                                            setViewTxpow={setViewTxpow}
                                        />
                                    ))}
                                </ul>
                            </div>
                        );
                    })
                    .filter((el): el is JSX.Element => el !== null); // Ensure the array contains only JSX.Elements

                setFilteredElements(elements);
                setFilterLoading(false);
            }
        };

        searchAndFilterTransactions();
    }, [filterText, history, filterBy]);

    // load more transactions on scroll to bottom event
    const loadMoreTransactions = useCallback(() => {
        if (loading || !hasMore) return; // Prevent loading if already loading or no more items

        setLoading(true);
        getHistory(limit, offset)
            .then((response: any) => {
                const { txpows, details } = response;

                // Deduplicate txpows and details
                setHistory((prev): any => {
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
                setOffset((prev) => prev + limit);
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

    const triggerLoadingMore = () => {
        loadMoreTransactions();
    }

    return (
        <TransactionHistoryContext.Provider
            value={{
                filterLoading,
                loading,
                hasMore,
                viewTxpow,
                filterText,
                filterBy,
                filteredElements,
                triggerLoadingMore,
                setHasMore,
                setFilterBy,
                setViewTxpow,
                setFilterText,
            }}
        >
            {children}
        </TransactionHistoryContext.Provider>
    );
};

// Custom hook to use the context
export const useTransactionHistory = () => {
    const context = useContext(TransactionHistoryContext);
    if (!context) {
        throw new Error('useTransactionHistory must be used within a TransactionHistoryProvider');
    }
    return context;
};
