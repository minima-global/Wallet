import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, Pagination, CircularProgress } from '@mui/material';
import { Stack } from '@mui/system';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';
import GridLayout from '../../layout/GridLayout';
import { MiSearchBarWithIcon, MiSearchBar, NoResults, MiTimeWrapper } from '../../shared/components/layout/MiToken';

import { MiTransactionList } from '../components/history';
import { format } from 'date-fns';
import { containsText } from '../../shared/functions';
import { extractByMonthAndDay } from '../../shared/utils/splitByMonth';

import * as types from '../../types/minima';
import TransactionHistoryType from '../../shared/components/TransactionHistoryType';

const History = () => {
    const [filterText, setFilterText] = useState('');
    const navigate = useNavigate();
    // const historyTxpows = useAppSelector(selectHistory);
    const isViewingTransactionDetail = useMatch('/history/:transactionid');
    const [splitByMonths, setSplitByMonth] = useState<Map<
        string,
        { detail: types.DetailsTxPOW; txpow: types.TxPOW }[]
    > | null>(null);

    const [loading, setLoading] = useState(true);

    const [paginationPageSize] = useState(20);
    const [paginationPageNumber, setPaginationNumber] = useState(1);
    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPaginationNumber(value);
    };

    // useEffect(() => {
    //     dispatch(callAndStoreHistory());
    // }, [dispatch]);

    // useEffect(() => {
    //     if (historyTxpows) {
    //         const extractTxPOWS = Array.from(historyTxpows.values());

    //         const split = extractByMonthAndDay(
    //             extractTxPOWS
    //                 .slice()
    //                 .sort((a, b) => b.txpow.header.timemilli.localeCompare(a.txpow.header.timemilli))
    //                 .slice((paginationPageNumber - 1) * paginationPageSize, paginationPageSize * paginationPageNumber)
    //         );

    //         setSplitByMonth(split);
    //         setLoading(false);
    //     }
    // }, [historyTxpows, paginationPageNumber, paginationPageSize]);

    const createElements = (arr: Map<string, { detail: types.DetailsTxPOW; txpow: types.TxPOW }[]>) => {
        let elements = [];

        let counter = 1;
        for (const [key, value] of arr) {
            const txpow = arr.get(key);
            let day = txpow && format(parseInt(txpow[0].txpow.header.timemilli), 'LLLL do');

            if (counter === 1) {
                day = txpow && format(parseInt(txpow[0].txpow.header.timemilli), 'iiii do');
            }

            elements.push(
                <React.Fragment key={key}>
                    <div className="month">{day}</div>
                    {value.map((t: { detail: types.DetailsTxPOW; txpow: types.TxPOW }) => (
                        <li
                            key={t.txpow.txpowid + 'key'}
                            onClick={() =>
                                navigate(t.txpow.txpowid, {
                                    state: {
                                        txpowid: t.txpow.txpowid,
                                    },
                                })
                            }
                        >
                            <Stack flexDirection="row" gap={2} sx={{ minWidth: 0 }} alignItems="center">
                                <TransactionHistoryType
                                    tokenName={
                                        t.txpow.body.txn.outputs[0].tokenid === '0x00'
                                            ? 'Minima'
                                            : t.txpow.body.txn.outputs[0].token
                                            ? t.txpow.body.txn.outputs[0].token.name.name
                                            : 'N/A'
                                    }
                                    amount={t.detail}
                                    address={t.txpow.body.txn.outputs[0].address}
                                    tokenid={t.txpow.body.txn.outputs[0].tokenid}
                                />
                            </Stack>
                            <MiTimeWrapper>
                                <p id="time">{format(parseInt(t.txpow.header.timemilli), 'hh:mm aa')}</p>
                            </MiTimeWrapper>
                        </li>
                    ))}
                </React.Fragment>
            );
            counter++;
        }

        return elements;
    };
    return <div />;
    // return (
    // <GridLayout
    //     loading={false}
    //     children={
    //         <>
    //             {!isViewingTransactionDetail && (
    //                 <Card variant="outlined">
    //                     <CardHeader
    //                         title={
    //                             <Stack spacing={1}>
    //                                 <Stack flexDirection="row" alignItems="center" justifyContent="center">
    //                                     <MiSearchBarWithIcon>
    //                                         <MiSearchBar
    //                                             value={filterText}
    //                                             onChange={(v: any) => {
    //                                                 setFilterText(v.target.value);
    //                                             }}
    //                                             placeholder="Search by transaction id"
    //                                         />
    //                                     </MiSearchBarWithIcon>
    //                                 </Stack>

    //                                 <CardContent sx={{ p: 0, overFlow: 'auto' }}>
    //                                     {!!historyTxpows && (
    //                                         <MiTransactionList>
    //                                             {!filterText.length &&
    //                                                 splitByMonths &&
    //                                                 createElements(splitByMonths)}

    //                                             {!filterText.length && !historyTxpows.size && (
    //                                                 <NoResults>
    //                                                     <h6>No transactions in your history yet</h6>
    //                                                 </NoResults>
    //                                             )}

    //                                             {!filterText.length && historyTxpows.size > paginationPageSize && (
    //                                                 <Stack mt={5} alignItems="center">
    //                                                     <Pagination
    //                                                         shape="rounded"
    //                                                         variant="outlined"
    //                                                         size="small"
    //                                                         count={Math.floor(
    //                                                             historyTxpows.size / paginationPageSize
    //                                                         )}
    //                                                         page={paginationPageNumber}
    //                                                         onChange={handlePaginationChange}
    //                                                     />
    //                                                 </Stack>
    //                                             )}

    //                                             {!!filterText.length &&
    //                                                 [...historyTxpows.values()]
    //                                                     .filter((t) => containsText(t.txpow.txpowid, filterText))
    //                                                     .map((t) => (
    //                                                         <React.Fragment key={t.txpow.txpowid}>
    //                                                             <li
    //                                                                 key={t.txpow.txpowid + 'key'}
    //                                                                 onClick={() =>
    //                                                                     navigate(t.txpow.txpowid, {
    //                                                                         state: {
    //                                                                             txpowid: t.txpow.txpowid,
    //                                                                         },
    //                                                                     })
    //                                                                 }
    //                                                             >
    //                                                                 <Stack
    //                                                                     flexDirection="row"
    //                                                                     gap={2}
    //                                                                     sx={{ minWidth: 0 }}
    //                                                                     alignItems="center"
    //                                                                 >
    //                                                                     <TransactionHistoryType
    //                                                                         tokenName={
    //                                                                             t.txpow.body.txn.outputs[0]
    //                                                                                 .tokenid === '0x00'
    //                                                                                 ? 'Minima'
    //                                                                                 : t.txpow.body.txn.outputs[0]
    //                                                                                       .token
    //                                                                                 ? t.txpow.body.txn.outputs[0]
    //                                                                                       .token.name.name
    //                                                                                 : 'N/A'
    //                                                                         }
    //                                                                         amount={t.detail}
    //                                                                         address={
    //                                                                             t.txpow.body.txn.outputs[0].address
    //                                                                         }
    //                                                                         tokenid={
    //                                                                             t.txpow.body.txn.outputs[0].tokenid
    //                                                                         }
    //                                                                     />
    //                                                                 </Stack>

    //                                                                 <MiTimeWrapper>
    //                                                                     <p id="time">
    //                                                                         {format(
    //                                                                             parseInt(t.txpow.header.timemilli),
    //                                                                             'hh:mm aa'
    //                                                                         )}
    //                                                                     </p>
    //                                                                 </MiTimeWrapper>
    //                                                             </li>
    //                                                         </React.Fragment>
    //                                                     ))}

    //                                             {!!filterText.length &&
    //                                                 [...historyTxpows.values()].filter((t) =>
    //                                                     containsText(t.txpow.txpowid, filterText)
    //                                                 ).length === 0 && (
    //                                                     <NoResults>
    //                                                         <h6>No results</h6>
    //                                                         <p>Please try your search again.</p>
    //                                                     </NoResults>
    //                                                 )}
    //                                         </MiTransactionList>
    //                                     )}
    //                                     {!historyTxpows && !loading && (
    //                                         <Stack alignItems="center" justifyItems="center">
    //                                             <NoResults>
    //                                                 <h6>No transactions in your history yet</h6>
    //                                             </NoResults>
    //                                         </Stack>
    //                                     )}
    //                                     {!historyTxpows && loading && (
    //                                         <Stack alignItems="center" justifyItems="center">
    //                                             <CircularProgress size={16} />
    //                                         </Stack>
    //                                     )}
    //                                 </CardContent>
    //                             </Stack>
    //                         }
    //                     />
    //                 </Card>
    //             )}

    //             {isViewingTransactionDetail && !!historyTxpows && <Outlet />}
    //         </>
    //     }
    // />
    // );
};

export default History;
