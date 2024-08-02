import { Fragment, useContext, useState } from 'react';
import { appContext } from '../../../AppContext';
import { format, isSameWeek, isSameYear } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import TransactionListItem from '../TransactionListItem';

const formatDate = (timeMilli: string, shouldShowWeekDay: boolean, shouldDisplayYear: boolean) => {
    return format(
        parseInt(timeMilli),
        `${shouldShowWeekDay ? 'EEEE dd' : 'MMM dd'} ${!shouldDisplayYear ? ' yyyy' : ''}`
    );
};
const useTransactionHistory = () => {
    const { historyFacade } = useContext(appContext);
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState('');

    const createElement = (setViewTxpow: (arg0: string) => any) => {
        return Object.keys(historyFacade).map((key) => {
            const transactions = historyFacade[key];
            const displayDate = transactions[0]
                ? formatDate(
                      transactions[0].timeMilli,
                      isSameWeek(new Date(), new Date(parseInt(transactions[0].timeMilli))),
                      isSameYear(new Date(), new Date(parseInt(transactions[0].timeMilli)))
                  )
                : '';

            const filteredTransactions = transactions.filter(
                (t) => t.txpowid.includes(filterText) || t.tokenName.includes(filterText)
            );

            if (filteredTransactions.length === 0) return null;

            return (
                <Fragment key={key}>
                    <div>
                        <div className="flex items-center justify-center">
                            <hr className="border-[0.1px] border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                            <span className="mx-4 text-center text-[#1B1B1B] dark:text-neutral-400 font-bold text-[12px] flex-shrink-0">
                                {displayDate}
                            </span>
                            <hr className="border-[0.1px] border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                        </div>
                        <ul className="flex flex-col gap-4">
                            {filteredTransactions.map((t) => (
                                <TransactionListItem viewTxpow={(id: string) => setViewTxpow(id)} key={t.txpowid} transaction={t} />
                            ))}
                        </ul>
                    </div>
                </Fragment>
            );
        });
    };

    return { createElement, setFilterText };
};

export default useTransactionHistory;
