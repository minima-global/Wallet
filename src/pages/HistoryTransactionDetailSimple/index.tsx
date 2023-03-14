import { Card, CardContent, CardHeader, CircularProgress, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAppSelector } from '../../minima/redux/hooks';
import { selectHistory } from '../../minima/redux/slices/historySlice';
import { TxPOW } from '../../types/minima';
import { MiTransactionSummary } from '../components/history';
import Decimal from 'decimal.js';

const HistoryTransactionDetailSimple = () => {
    const location = useLocation();
    const historyTransactions = useAppSelector(selectHistory);
    const [viewTransaction, setTransaction] = useState<undefined | TxPOW>(undefined);

    useEffect(() => {
        setTransaction(historyTransactions.find((t) => t.txpowid === location.state.txpowid));
    }, [historyTransactions]);

    return (
        <>
            {viewTransaction && (
                <Stack spacing={2}>
                    <Card variant="outlined">
                        <CardHeader
                            title={
                                <>
                                    <MiTransactionSummary>
                                        <h6>TxPoW Summary</h6>
                                        <ul>
                                            <li>
                                                <p>TxPoW ID:</p>
                                                <p>{viewTransaction.txpowid}</p>
                                            </li>
                                            <li>
                                                <p>Type:</p>

                                                {viewTransaction.isblock && viewTransaction.istransaction && (
                                                    <p>TxPoW Block</p>
                                                )}
                                                {!viewTransaction.isblock && viewTransaction.istransaction && (
                                                    <p>Basic TxPoW Unit</p>
                                                )}
                                                {!viewTransaction.isblock && !viewTransaction.istransaction && (
                                                    <p>Pulse</p>
                                                )}
                                            </li>
                                            <li>
                                                <p>Block:</p>

                                                <p>{viewTransaction.header.block}</p>
                                            </li>
                                            <li>
                                                <p>Date:</p>

                                                <p>
                                                    {format(
                                                        parseInt(viewTransaction.header.timemilli),
                                                        'MMMM dd, yyyy hh:m:s a'
                                                    )}
                                                </p>
                                            </li>
                                            <li>
                                                <p>Total Known Unconfirmed Transactions:</p>

                                                <p>{viewTransaction.body.txnlist.length}</p>
                                            </li>
                                            <li>
                                                <p>Total MMR Proofs:</p>

                                                <p>{viewTransaction.body.witness.mmrproofs.length}</p>
                                            </li>
                                            <li>
                                                <p>Total Signatures:</p>

                                                <p>{viewTransaction.body.witness.signatures.length}</p>
                                            </li>
                                            <li>
                                                <p>Total Output(s) Amount (Minima):</p>

                                                <p>
                                                    {viewTransaction.body.txn.outputs
                                                        .reduce(
                                                            (accumulator, currentVal) =>
                                                                new Decimal(accumulator).plus(currentVal.amount),
                                                            new Decimal(0)
                                                        )
                                                        .toString()}
                                                </p>
                                            </li>
                                            {!!viewTransaction.body.txn.outputs.filter((o) => o.tokenid !== '0x00')
                                                .length && (
                                                <li>
                                                    <p>Total Output(s) Amount (Token):</p>

                                                    <p>
                                                        {viewTransaction.body.txn.outputs
                                                            .filter((o) => o.tokenid !== '0x00' && o.tokenamount)
                                                            .reduce(
                                                                (accumulator, currentVal) =>
                                                                    new Decimal(accumulator).plus(
                                                                        currentVal.tokenamount
                                                                    ),
                                                                new Decimal(0)
                                                            )
                                                            .toString()}
                                                    </p>
                                                </li>
                                            )}
                                            <li>
                                                <p>Burn:</p>

                                                <p>{viewTransaction.burn}</p>
                                            </li>
                                        </ul>
                                    </MiTransactionSummary>
                                </>
                            }
                        />
                    </Card>

                    {viewTransaction.hasbody && viewTransaction.body.txn && (
                        <Card variant="outlined">
                            <CardHeader
                                title={
                                    <Stack>
                                        <MiTransactionSummary>
                                            <h6>Transaction</h6>
                                            <ul>
                                                <li>
                                                    <p>Transaction ID:</p>
                                                    <p>{viewTransaction.body.txn.transactionid}</p>
                                                </li>
                                            </ul>
                                        </MiTransactionSummary>
                                        <MiTransactionSummary>
                                            <h6 id="input">Input(s)</h6>

                                            <ul id="input">
                                                {viewTransaction.body.txn.inputs.map((input, i) => (
                                                    <ul key={input.coinid} id="iterator">
                                                        <li id="list-subheader">Input {i + 1}</li>
                                                        <li>
                                                            <p>Coin ID:</p>
                                                            <p>{input.coinid}</p>
                                                        </li>
                                                        <li>
                                                            <p>Token ID:</p>
                                                            <p>{input.tokenid}</p>
                                                        </li>
                                                        {input.token !== null && (
                                                            <li>
                                                                <p>Token Name:</p>
                                                                <p>{input.token.name.name}</p>
                                                            </li>
                                                        )}
                                                        {input.tokenid === '0x00' && (
                                                            <li>
                                                                <p>Token Name:</p>
                                                                <p>Minima</p>
                                                            </li>
                                                        )}
                                                        <li>
                                                            <p>Address:</p>
                                                            <p>{input.address}</p>
                                                        </li>
                                                        <li>
                                                            <p>Mini Address:</p>
                                                            <p>{input.miniaddress ? input.miniaddress : 'N/A'}</p>
                                                        </li>
                                                        <li>
                                                            <p>Spent:</p>
                                                            <p>{input.spent ? 'Yes' : 'No'}</p>
                                                        </li>
                                                        <li>
                                                            <p>Store State:</p>
                                                            <p>{input.storestate ? 'Yes' : 'No'}</p>
                                                        </li>
                                                        <li>
                                                            <p>Amount:</p>
                                                            <p>{input.amount}</p>
                                                        </li>
                                                        {input.tokenamount && (
                                                            <li>
                                                                <p>Token Amount:</p>
                                                                <p>{input.tokenamount}</p>
                                                            </li>
                                                        )}
                                                    </ul>
                                                ))}
                                            </ul>
                                        </MiTransactionSummary>
                                        <MiTransactionSummary>
                                            <h6 id="input">Output(s)</h6>

                                            <ul id="input">
                                                {viewTransaction.body.txn.outputs.map((input, i) => (
                                                    <ul key={input.coinid} id="iterator">
                                                        <li id="list-subheader">Output {i + 1}</li>
                                                        <li>
                                                            <p>Coin ID:</p>
                                                            <p>{input.coinid}</p>
                                                        </li>
                                                        <li>
                                                            <p>Token ID:</p>
                                                            <p>{input.tokenid}</p>
                                                        </li>
                                                        {input.token !== null && (
                                                            <li>
                                                                <p>Token Name:</p>
                                                                <p>{input.token.name.name}</p>
                                                            </li>
                                                        )}
                                                        {input.tokenid === '0x00' && (
                                                            <li>
                                                                <p>Token Name:</p>
                                                                <p>Minima</p>
                                                            </li>
                                                        )}
                                                        <li>
                                                            <p>Address:</p>
                                                            <p>{input.address}</p>
                                                        </li>
                                                        <li>
                                                            <p>Mini Address:</p>
                                                            <p>{input.miniaddress ? input.miniaddress : 'N/A'}</p>
                                                        </li>
                                                        <li>
                                                            <p>Spent:</p>
                                                            <p>{input.spent ? 'Yes' : 'No'}</p>
                                                        </li>
                                                        <li>
                                                            <p>Store State:</p>
                                                            <p>{input.storestate ? 'Yes' : 'No'}</p>
                                                        </li>
                                                        <li>
                                                            <p>Amount:</p>
                                                            <p>{input.amount}</p>
                                                        </li>
                                                        {input.tokenamount && (
                                                            <li>
                                                                <p>Token Amount:</p>
                                                                <p>{input.tokenamount}</p>
                                                            </li>
                                                        )}
                                                    </ul>
                                                ))}
                                            </ul>
                                        </MiTransactionSummary>
                                        <MiTransactionSummary>
                                            <h6 id="input">State Variable(s)</h6>

                                            <ul id="input">
                                                {viewTransaction.body.txn.state.map((input, i) => (
                                                    <ul key={input.port} id="iterator">
                                                        <li id="list-subheader">State Variable {input.port}</li>
                                                        <li>
                                                            <p>Port:</p>
                                                            <p>{input.port}</p>
                                                        </li>
                                                        <li>
                                                            <p>Type:</p>
                                                            <p>{input.type}</p>
                                                        </li>
                                                        <li>
                                                            <p>Data:</p>
                                                            <p>{input.data}</p>
                                                        </li>
                                                    </ul>
                                                ))}
                                            </ul>
                                        </MiTransactionSummary>
                                    </Stack>
                                }
                            />
                        </Card>
                    )}

                    {viewTransaction.hasbody && (
                        <Card variant="outlined">
                            <CardHeader
                                title={
                                    <Stack>
                                        <MiTransactionSummary>
                                            <h6>Known Unconfirmed Transactions</h6>
                                            <ul>
                                                <li>
                                                    <p>Total:</p>
                                                    <p>{viewTransaction.body.txnlist.length}</p>
                                                </li>
                                                {viewTransaction.body.txnlist.map((t, i) => (
                                                    <li>
                                                        <p>Transaction {i + 1}:</p>
                                                        <p>t</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </MiTransactionSummary>
                                    </Stack>
                                }
                            />
                        </Card>
                    )}
                </Stack>
            )}

            {!viewTransaction && (
                <Stack alignItems="center" justifyContent="center">
                    <CircularProgress size={32} />
                </Stack>
            )}
        </>
    );
};

export default HistoryTransactionDetailSimple;
