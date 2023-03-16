import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAppSelector } from '../../minima/redux/hooks';
import { selectHistory } from '../../minima/redux/slices/historySlice';
import { TxPOW } from '../../types/minima';
import { MiTransactionSummary } from '../components/history';
import Decimal from 'decimal.js';
import checkAddress from '../../minima/commands/checkAddress';
import exportToCsv from '../../shared/utils/jsonToCsv';
import DataObjectIcon from '@mui/icons-material/DataObject';
import DisplayFullJson from '../components/DisplayFullJson';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { NoResults } from '../../shared/components/layout/MiToken';

const HistoryTransactionDetailSimple = () => {
    const location = useLocation();
    const historyTransactions = useAppSelector(selectHistory);
    const [viewTransaction, setTransaction] = useState<undefined | TxPOW>(undefined);
    const [transactionType, setTransactionType] = useState<false | string>(false);
    const [transactionSummary, setTransactionSummary] = useState<any>();
    const [openAdvancedModal, setAdvanced] = useState(false);

    const handleExportingToCSV = (e: any) => {
        exportToCsv(e, transactionSummary);
    };

    const handleFullJSONView = () => setAdvanced(true);

    useEffect(() => {
        setTransaction(historyTransactions.find((t) => t.txpowid === location.state.txpowid));

        setTransactionSummary([
            {
                id: viewTransaction?.txpowid,
                amount: viewTransaction?.body.txn.outputs[0].amount,
                tokenid: viewTransaction?.body.txn.outputs[0].amount,
                address: viewTransaction?.body.txn.outputs[0].miniaddress,
                date: viewTransaction?.header.date,
                type: transactionType,
                block: viewTransaction?.header.block,
                burn: viewTransaction?.burn,
                json: JSON.stringify(viewTransaction),
            },
        ]);
    }, [historyTransactions]);

    useEffect(() => {
        if (viewTransaction) {
            if (viewTransaction?.body.txn.outputs[0].tokenid === '0xFF') {
                return setTransactionType('Token');
            }
            checkAddress(viewTransaction?.body.txn.outputs[0].address).then((res) => {
                if (res.relevant) {
                    setTransactionType('Receive');
                }

                if (!res.relevant) {
                    setTransactionType('Send');
                }
            });
        }
    }, [viewTransaction]);

    return (
        <>
            <DisplayFullJson open={openAdvancedModal} closeModal={() => setAdvanced(false)} json={viewTransaction} />
            {viewTransaction && (
                <Stack spacing={2}>
                    <Card variant="outlined">
                        <CardHeader
                            title={
                                <Stack spacing={2}>
                                    <MiTransactionSummary>
                                        <Stack mb={2} gap={0.5} flexDirection="row" alignItems="center">
                                            <h6>Quick Summary</h6>
                                            <DataObjectIcon onClick={handleFullJSONView} color="primary" />
                                        </Stack>
                                        <ul>
                                            <li>
                                                <p>Transaction ID (TxPoW)</p>
                                                <p>{viewTransaction.txpowid}</p>
                                            </li>
                                            <li>
                                                <p>Amount</p>
                                                <p>
                                                    {viewTransaction.body.txn.outputs[0].tokenid === '0x00'
                                                        ? viewTransaction.body.txn.outputs[0].amount
                                                        : viewTransaction.body.txn.outputs[0].tokenamount}
                                                </p>
                                            </li>
                                            <li>
                                                <p>Type</p>

                                                {transactionType ? <p>{transactionType}</p> : <p>...</p>}
                                            </li>
                                            <li>
                                                <p>Sent to</p>

                                                <p>{viewTransaction.body.txn.outputs[0].miniaddress}</p>
                                            </li>
                                            <li>
                                                <p>Token</p>

                                                <p>
                                                    {viewTransaction.body.txn.outputs[0].tokenid === '0x00'
                                                        ? 'Minima'
                                                        : viewTransaction.body.txn.outputs[0].token?.name.name}
                                                </p>
                                            </li>
                                            <li>
                                                <p>Block:</p>

                                                <p>{viewTransaction.header.block}</p>
                                            </li>
                                            <li>
                                                <p>Date:</p>

                                                <p>
                                                    {format(parseInt(viewTransaction.header.timemilli), 'hh:mm:s a')} •{' '}
                                                    {format(parseInt(viewTransaction.header.timemilli), 'dd/MM/yy')}
                                                </p>
                                            </li>

                                            <li>
                                                <p>Burn</p>

                                                <p>{viewTransaction.burn}</p>
                                            </li>
                                        </ul>
                                    </MiTransactionSummary>
                                    <Button onClick={handleExportingToCSV} color="inherit" variant="outlined">
                                        Download Receipt
                                    </Button>
                                </Stack>
                            }
                        />
                    </Card>

                    {viewTransaction.hasbody && viewTransaction.body.txn && (
                        <Stack spacing={1}>
                            <Accordion
                                disabled={!viewTransaction.body.txn.inputs.length}
                                sx={{ background: 'rgba(255, 255, 255, 0.5)', boxShadow: 'none' }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreOutlined />}>Inputs</AccordionSummary>
                                <AccordionDetails>
                                    <MiTransactionSummary>
                                        <ul id="input">
                                            {viewTransaction.body.txn.inputs.map((input, i) => (
                                                <ul key={input.coinid} id="iterator">
                                                    <li id="list-subheader">{i + 1}.</li>
                                                    <li>
                                                        <p>Coin ID</p>
                                                        <p>{input.coinid}</p>
                                                    </li>
                                                    <li>
                                                        <p>Token ID</p>
                                                        <p>{input.tokenid}</p>
                                                    </li>
                                                    {input.token !== null && (
                                                        <li>
                                                            <p>Token Name</p>
                                                            <p>{input.token.name.name}</p>
                                                        </li>
                                                    )}
                                                    {input.tokenid === '0x00' && (
                                                        <li>
                                                            <p>Token Name</p>
                                                            <p>Minima</p>
                                                        </li>
                                                    )}
                                                    <li>
                                                        <p>Address</p>
                                                        <p>{input.address}</p>
                                                    </li>
                                                    <li>
                                                        <p>Mini Address</p>
                                                        <p>{input.miniaddress ? input.miniaddress : 'N/A'}</p>
                                                    </li>
                                                    <li>
                                                        <p>Spent</p>
                                                        <p>{input.spent ? 'Yes' : 'No'}</p>
                                                    </li>
                                                    <li>
                                                        <p>Store State</p>
                                                        <p>{input.storestate ? 'Yes' : 'No'}</p>
                                                    </li>
                                                    <li>
                                                        <p>Amount</p>
                                                        <p>{input.amount}</p>
                                                    </li>
                                                    {input.tokenamount && (
                                                        <li>
                                                            <p>Token Amount</p>
                                                            <p>{input.tokenamount}</p>
                                                        </li>
                                                    )}
                                                </ul>
                                            ))}
                                        </ul>
                                    </MiTransactionSummary>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion
                                disabled={!viewTransaction.body.txn.outputs.length}
                                sx={{ background: 'rgba(255, 255, 255, 0.5)', boxShadow: 'none' }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreOutlined />}>Outputs</AccordionSummary>
                                <AccordionDetails>
                                    <MiTransactionSummary>
                                        <ul id="input">
                                            {viewTransaction.body.txn.outputs.map((input, i) => (
                                                <ul key={input.coinid} id="iterator">
                                                    <li id="list-subheader">{i + 1}.</li>
                                                    <li>
                                                        <p>Coin ID</p>
                                                        <p>{input.coinid}</p>
                                                    </li>
                                                    <li>
                                                        <p>Token ID</p>
                                                        <p>{input.tokenid}</p>
                                                    </li>
                                                    {input.token !== null && (
                                                        <li>
                                                            <p>Token Name</p>
                                                            <p>{input.token.name.name}</p>
                                                        </li>
                                                    )}
                                                    {input.tokenid === '0x00' && (
                                                        <li>
                                                            <p>Token Name</p>
                                                            <p>Minima</p>
                                                        </li>
                                                    )}
                                                    <li>
                                                        <p>Address</p>
                                                        <p>{input.address}</p>
                                                    </li>
                                                    <li>
                                                        <p>Mini Address</p>
                                                        <p>{input.miniaddress ? input.miniaddress : 'N/A'}</p>
                                                    </li>
                                                    <li>
                                                        <p>Spent</p>
                                                        <p>{input.spent ? 'Yes' : 'No'}</p>
                                                    </li>
                                                    <li>
                                                        <p>Store State</p>
                                                        <p>{input.storestate ? 'Yes' : 'No'}</p>
                                                    </li>
                                                    <li>
                                                        <p>Amount</p>
                                                        <p>{input.amount}</p>
                                                    </li>
                                                    {input.tokenamount && (
                                                        <li>
                                                            <p>Token Amount</p>
                                                            <p>{input.tokenamount}</p>
                                                        </li>
                                                    )}
                                                </ul>
                                            ))}
                                        </ul>
                                    </MiTransactionSummary>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion
                                disabled={!viewTransaction.body.txn.state.length}
                                sx={{ background: 'rgba(255, 255, 255, 0.5)', boxShadow: 'none' }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreOutlined />}>State Variables</AccordionSummary>
                                <AccordionDetails>
                                    <MiTransactionSummary>
                                        <ul id="input">
                                            {!viewTransaction.body.txn.state.length && (
                                                <NoResults>
                                                    <h6>None Available</h6>
                                                    <p>this transaction doesn't hold any state variables.</p>
                                                </NoResults>
                                            )}
                                            {!!viewTransaction.body.txn.state.length &&
                                                viewTransaction.body.txn.state.map((input, i) => (
                                                    <ul key={input.port} id="iterator">
                                                        <li id="list-subheader">{input.port}</li>
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
                                </AccordionDetails>
                            </Accordion>
                        </Stack>
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
