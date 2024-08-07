// TransactionHistoryContext.tsx
import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { format, isSameWeek, isSameYear } from 'date-fns';
import TransactionListItem from '../TransactionListItem';
import { appContext } from '../../../AppContext';
import useFormatMinimaNumber from '../../../__minima__/libs/utils/useMakeNumber';

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
    const { historyFacade } = useContext(appContext);
    const { makeMinimaNumber } = useFormatMinimaNumber();
    const [filterText, setFilterText] = useState<string>('');
    const [filterBy, setFilterBy] = useState<'Value Transfer' | 'Custom' | 'Token Creation' | null>(null);
    const [viewTxpow, setViewTxpow] = useState<string | false>(false);

    // Memoize filtered elements
    const filteredElements = useMemo<JSX.Element[]>(() => {
        if (!historyFacade) return [];
        return Object.keys(historyFacade).map((key) => {
            const transactions = historyFacade[key];
            const displayDate = transactions[0]
                ? formatDate(
                      transactions[0].timeMilli,
                      isSameWeek(new Date(), new Date(parseInt(transactions[0].timeMilli))),
                      isSameYear(new Date(), new Date(parseInt(transactions[0].timeMilli)))
                  )
                : '';

            let filteredTransactions = transactions.filter(
                (t:any) => t.txpowid.includes(filterText) || t.tokenName.includes(filterText) || t.tokenid.includes(filterText)
            );

            if (filterBy) {
                filteredTransactions = filteredTransactions.filter(
                    (t:any) => t.type.includes(filterBy)
                );
            }

            if (filteredTransactions.length === 0) return null;

            return (
                <React.Fragment key={key}>
                    <div>
                        <div className="flex items-center justify-center">
                            <hr className="border-[0.1px] border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                            <span className="mx-4 text-center text-[#1B1B1B] dark:text-neutral-400 font-bold text-[12px] flex-shrink-0">
                                {displayDate}
                            </span>
                            <hr className="border-[0.1px] border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                        </div>
                        <ul className="flex flex-col gap-4">
                            {filteredTransactions.map((t: any) => (
                                <TransactionListItem
                                    key={t.txpowid}
                                    transaction={t}
                                    preprocessedAmount={makeMinimaNumber(t.amount, 3)}
                                    setViewTxpow={setViewTxpow}
                                />
                            ))}
                        </ul>
                    </div>
                </React.Fragment>
            );
        }).filter((el): el is JSX.Element => el !== null); // Ensure the array contains only JSX.Elements
    }, [historyFacade, filterText, filterBy]);

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
