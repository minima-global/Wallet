import React, { useEffect, useState } from 'react';
import { Card, CardHeader, Button, CardContent, Pagination, CircularProgress } from '@mui/material';
import { Stack } from '@mui/system';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';
import GridLayout from '../../layout/GridLayout';
import {
    MiSearchBarWithIcon,
    MiSearchBar,
    NoResults,
    MiTokenAmount,
    MiTokenNameAmountWrapper,
    MiTimeWrapper,
} from '../../shared/components/layout/MiToken';

import { useAppDispatch, useAppSelector } from '../../minima/redux/hooks';
import { callAndStoreHistory, selectHistory } from '../../minima/redux/slices/historySlice';
import { MiTransactionList } from '../components/history';
import { format } from 'date-fns';
import { containsText } from '../../shared/functions';
import { extractByMonthAndDay } from '../../shared/utils/splitByMonth';
import { TxPOW } from '../../types/minima';
import TransactionImage from '../components/history/TransactionImage';
import TransactionAmount from '../components/history/TransactionAmount';

const History = () => {
    const dispatch = useAppDispatch();
    const [filterText, setFilterText] = useState('');
    const navigate = useNavigate();
    const historyTxpows = useAppSelector(selectHistory);
    const isViewingTransactionDetail = useMatch('/history/:transactionid');
    const [splitByMonths, setSplitByMonth] = useState<Map<string, TxPOW[]>>();

    const [loading, setLoading] = useState(true);

    const [paginationPageSize, setPaginationSize] = useState(20);
    const [paginationPageNumber, setPaginationNumber] = useState(1);
    const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPaginationNumber(value);
    };

    useEffect(() => {
        dispatch(callAndStoreHistory());
    }, []);

    useEffect(() => {
        const split = extractByMonthAndDay(
            historyTxpows
                .slice()
                .sort((a, b) => b.header.timemilli.localeCompare(a.header.timemilli))
                .slice((paginationPageNumber - 1) * paginationPageSize, paginationPageSize * paginationPageNumber)
        );

        setTimeout(() => setLoading(false), 1000);
        setSplitByMonth(split);
    }, [historyTxpows, paginationPageNumber]);

    const createElements = (arr: Map<string, TxPOW[]>) => {
        let elements = [];

        for (let [key, value] of arr) {
            const txpow = arr.get(key);
            const day = txpow && format(parseInt(txpow[0].header.timemilli), 'iiii do');

            elements.push(
                <React.Fragment key={key}>
                    <div className="month">{day}</div>
                    {value.map((t: any) => (
                        <li
                            key={t.txpowid + 'key'}
                            onClick={() =>
                                navigate(t.txpowid, {
                                    state: {
                                        txpowid: t.txpowid,
                                    },
                                })
                            }
                        >
                            <Stack flexDirection="row" gap={2} sx={{ minWidth: 0 }} alignItems="center">
                                <TransactionImage
                                    tokenid={t.body.txn.outputs[0].tokenid}
                                    address={t.body.txn.outputs[0].address}
                                />

                                <MiTokenNameAmountWrapper>
                                    <p>
                                        {t.body.txn.outputs[0].tokenid === '0x00'
                                            ? 'Minima'
                                            : t.body.txn.outputs[0].token.name.name}
                                    </p>

                                    {t.body.txn.outputs[0].tokenid === '0x00' && (
                                        <TransactionAmount
                                            address={t.body.txn.outputs[0].address}
                                            amount={t.body.txn.outputs[0].amount}
                                        />
                                    )}
                                    {t.body.txn.outputs[0].tokenid !== '0x00' && (
                                        <TransactionAmount
                                            address={t.body.txn.outputs[0].address}
                                            amount={t.body.txn.outputs[0].tokenamount}
                                        />
                                    )}
                                </MiTokenNameAmountWrapper>
                            </Stack>

                            <MiTimeWrapper>
                                <p id="time">{format(parseInt(t.header.timemilli), 'hh:mm aa')}</p>
                            </MiTimeWrapper>
                        </li>
                    ))}
                </React.Fragment>
            );
        }

        return elements;
    };

    return (
        <GridLayout
            loading={loading}
            children={
                <>
                    {!isViewingTransactionDetail && (
                        <Card variant="outlined">
                            <CardHeader
                                title={
                                    <Stack spacing={1}>
                                        <Stack flexDirection="row" alignItems="center" justifyContent="center">
                                            <MiSearchBarWithIcon>
                                                <MiSearchBar
                                                    value={filterText}
                                                    onChange={(v: any) => {
                                                        setFilterText(v.target.value);
                                                    }}
                                                    placeholder="Search by transaction id"
                                                />
                                            </MiSearchBarWithIcon>
                                        </Stack>

                                        <CardContent sx={{ p: 0, overFlow: 'auto' }}>
                                            <MiTransactionList>
                                                {!filterText.length && splitByMonths && createElements(splitByMonths)}

                                                {!filterText.length && !historyTxpows.length && (
                                                    <NoResults>
                                                        <h6>No transactions in your history yet</h6>
                                                    </NoResults>
                                                )}

                                                {!filterText.length && historyTxpows.length > paginationPageSize && (
                                                    <Stack mt={5} alignItems="center">
                                                        <Pagination
                                                            shape="rounded"
                                                            variant="outlined"
                                                            size="small"
                                                            count={Math.floor(
                                                                historyTxpows.length / paginationPageSize
                                                            )}
                                                            page={paginationPageNumber}
                                                            onChange={handlePaginationChange}
                                                        />
                                                    </Stack>
                                                )}

                                                {!!filterText.length &&
                                                    historyTxpows
                                                        .filter((t) => containsText(t.txpowid, filterText))
                                                        .map((t) => (
                                                            <li
                                                                onClick={() =>
                                                                    navigate(t.txpowid, {
                                                                        state: { txpowid: t.txpowid },
                                                                    })
                                                                }
                                                                key={t.txpowid}
                                                            >
                                                                <p id="txpowid">{t.txpowid}</p>

                                                                <p>{t.body.txnlist.length}</p>
                                                                <p id="time">
                                                                    {format(parseInt(t.header.timemilli), 'MMM yyyy')}
                                                                    <br />
                                                                    {format(parseInt(t.header.timemilli), 'E do')}
                                                                    <br />
                                                                    {format(parseInt(t.header.timemilli), 'hh:mm aa')}
                                                                </p>
                                                            </li>
                                                        ))}

                                                {!!filterText.length &&
                                                    historyTxpows.filter((t) => containsText(t.txpowid, filterText))
                                                        .length === 0 && (
                                                        <NoResults>
                                                            <h6>No results</h6>
                                                            <p>Please try your search again.</p>
                                                        </NoResults>
                                                    )}
                                            </MiTransactionList>
                                        </CardContent>
                                    </Stack>
                                }
                            />
                        </Card>
                    )}

                    {isViewingTransactionDetail && <Outlet />}
                </>
            }
        />
    );
};

export default History;
