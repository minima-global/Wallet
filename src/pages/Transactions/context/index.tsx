// TransactionHistoryContext.tsx
import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
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

// Create provider
export const TransactionHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { history } = useContext(appContext);
    const { makeMinimaNumber } = useFormatMinimaNumber();
    const [filterText, setFilterText] = useState<string>('');
    const [filterBy, setFilterBy] = useState<'Value Transfer' | 'Custom' | 'Token Creation' | null>(null);
    const [viewTxpow, setViewTxpow] = useState<string | false>(false);

    const filteredElements = useMemo(() => {
        if (!history || !history.txpows.length) return [];

        // Filter txpows based on search text
        const filteredTxpows = history.txpows.filter((txpow) => txpow.txpowid.includes(filterText));

        // Generate a set of indices for filtered txpows
        const filteredIndices = filteredTxpows.map((txpow) => history.txpows.indexOf(txpow));

        // Filter details based on the indices of filtered txpows
        const filteredDetails = history.details.filter((_, index) => filteredIndices.includes(index));

        // Combine txpows and details into a single array for sorting
        const combined = filteredTxpows.map((txpow, index) => ({
            txpow,
            detail: filteredDetails[index],
        }));

        // Sort combined array by date (assuming txpow has a timeMilli property)
        combined.sort((a, b) => {
            const dateA = new Date(parseInt(a.txpow.timeMilli));
            const dateB = new Date(parseInt(b.txpow.timeMilli));
            return dateB.getTime() - dateA.getTime(); // Sort descending
        });

        // Unpack combined array back into txpows and details
        const sortedTxpows = combined.map((item) => item.txpow);
        const sortedDetails = combined.map((item) => item.detail);

        // Split data by date for display
        const historyFacade = splitDataByDate(sortedTxpows, sortedDetails);

        return Object.keys(historyFacade)
            .map((key) => {
                const transactions = historyFacade[key];
                const displayDate = transactions[0]
                    ? formatDate(
                          transactions[0].timeMilli,
                          isSameWeek(new Date(), new Date(parseInt(transactions[0].timeMilli))),
                          isSameYear(new Date(), new Date(parseInt(transactions[0].timeMilli)))
                      )
                    : '';

                let filteredTransactions = transactions.filter(
                    (t) =>
                        t.txpowid.includes(filterText) ||
                        t.tokenName.includes(filterText) ||
                        t.tokenid.includes(filterText)
                );

                if (filterBy) {
                    filteredTransactions = filteredTransactions.filter((t) => t.type.includes(filterBy));
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
    }, [history, filterText, filterBy]);



    return (
        <TransactionHistoryContext.Provider
            value={{ viewTxpow, filterText, filterBy, setFilterBy, setViewTxpow, filteredElements, setFilterText }}
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
