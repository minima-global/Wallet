import { useEffect, useState } from 'react';
import { Card, CardHeader, Button, CardContent } from '@mui/material';
import { Stack } from '@mui/system';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';
import GridLayout from '../../layout/GridLayout';
import { MiSearchBarWithIcon, MiSearchBar, NoResults } from '../../shared/components/layout/MiToken';

import { useAppDispatch, useAppSelector } from '../../minima/redux/hooks';
import { callAndStoreHistory, selectHistory } from '../../minima/redux/slices/historySlice';

import { MiTransactionHeader, MiTransactionList } from '../components/history';

import { format } from 'date-fns';

import { containsText } from '../../shared/functions';
import splitByMonth from '../../shared/utils/splitByMonth';
import { TxPOW } from '../../types/minima';

const History = () => {
    const dispatch = useAppDispatch();
    const [filterText, setFilterText] = useState('');
    const navigate = useNavigate();
    const historyTxpows = useAppSelector(selectHistory);
    const isViewingTransactionDetail = useMatch('/history/:transactionid');
    const [splitByMonths, setSplitByMonth] = useState<Map<string, TxPOW[]>[]>([]);

    useEffect(() => {
        dispatch(callAndStoreHistory());
    }, []);

    useEffect(() => {
        const split = splitByMonth(
            historyTxpows.slice().sort((a, b) => b.header.timemilli.localeCompare(a.header.timemilli))
        );
        setSplitByMonth(split);
    }, [historyTxpows]);

    return (
        <GridLayout
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
                                                    placeholder="Search by txpowid"
                                                />
                                            </MiSearchBarWithIcon>
                                        </Stack>

                                        <CardContent>
                                            <MiTransactionHeader>
                                                <h6 id="txpowid">TxPow ID</h6>
                                                {/* <h6 id="name">Type</h6> */}
                                                <h6 id="transactions">Transactions</h6>
                                                <h6 id="time">Time</h6>
                                            </MiTransactionHeader>

                                            <MiTransactionList>
                                                {!filterText.length &&
                                                    splitByMonths.map((n) => {
                                                        for (const [key, value] of n) {
                                                            if (value.length)
                                                                return (
                                                                    <>
                                                                        <div key={key} className="month">
                                                                            {key +
                                                                                ` ${format(
                                                                                    parseInt(value[0].header.timemilli),
                                                                                    'yyyy'
                                                                                )}`}
                                                                        </div>
                                                                        {value.map((t) => (
                                                                            <li
                                                                                onClick={() =>
                                                                                    navigate(t.txpowid, {
                                                                                        state: { txpowid: t.txpowid },
                                                                                    })
                                                                                }
                                                                                key={t.txpowid}
                                                                            >
                                                                                <p id="txpowid">{t.txpowid}</p>

                                                                                {/* <p id="name">
                                                                                    {t.isblock && t.istransaction
                                                                                        ? 'Block'
                                                                                        : !t.isblock && t.istransaction
                                                                                        ? 'Basic'
                                                                                        : 'Pulse'}
                                                                                </p> */}

                                                                                <p>{t.body.txnlist.length}</p>
                                                                                <p id="time">
                                                                                    {format(
                                                                                        parseInt(t.header.timemilli),
                                                                                        'E do'
                                                                                    )}{' '}
                                                                                    <br />
                                                                                    {format(
                                                                                        parseInt(t.header.timemilli),
                                                                                        'hh:m aa'
                                                                                    )}
                                                                                </p>
                                                                            </li>
                                                                        ))}
                                                                    </>
                                                                );
                                                        }
                                                    })}

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

                                                                {/* <p id="name">
                                                                    {t.isblock && t.istransaction
                                                                        ? 'TxPoW Unit'
                                                                        : !t.isblock && t.istransaction
                                                                        ? 'Basic'
                                                                        : 'Pulse'}
                                                                </p> */}

                                                                <p>{t.body.txnlist.length}</p>
                                                                <p id="time">
                                                                    {format(parseInt(t.header.timemilli), 'MMM yyyy')}{' '}
                                                                    <br />
                                                                    {format(parseInt(t.header.timemilli), 'E do')}{' '}
                                                                    <br />
                                                                    {format(parseInt(t.header.timemilli), 'hh:m aa')}
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
