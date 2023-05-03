import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Card,
    CardHeader,
    CircularProgress,
    Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAppSelector } from '../../minima/redux/hooks';
import { selectHistory } from '../../minima/redux/slices/historySlice';
import { MiTransactionSummary } from '../components/history';
import exportToCsv from '../../shared/utils/jsonToCsv';
import DataObjectIcon from '@mui/icons-material/DataObject';
import DisplayFullJson from '../components/DisplayFullJson';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { NoResults } from '../../shared/components/layout/MiToken';
import useIsUserRunningWebView from '../../hooks/useIsUserRunningWebView';
import FeatureUnavailable from '../components/FeatureUnavailable';

import * as types from '../../types/minima';
import * as utils from '../../shared/utils';

const HistoryTransactionDetailSimple = () => {
    const location = useLocation();
    const historyTransactions = useAppSelector(selectHistory);
    const [viewTransaction, setTransaction] = useState<{ detail: types.DetailsTxPOW; txpow: types.TxPOW } | undefined>(
        undefined
    );
    const [transactionType, setTransactionType] = useState<'Receive' | 'Send' | 'Token Creation' | 'Custom' | false>(
        false
    );
    const [transactionAmount, settransactionAmount] = useState('');

    const [transactionSummary, setTransactionSummary] = useState<any>();
    const [openAdvancedModal, setAdvanced] = useState(false);
    const navigate = useNavigate();
    const [internalBrowserWarningModal, setInternalBrowserWarningModal] = useState(false);
    const isUserRunningWebView = useIsUserRunningWebView();

    const handleExportingToCSV = (e: any) => {
        exportToCsv(e, transactionSummary);
    };

    const handleFullJSONView = () => setAdvanced(true);

    useEffect(() => {
        if (!(location.state && 'txpowid' in location.state)) {
            navigate('/history');
        }
        if (location.state && 'txpowid' in location.state) {
            setTransaction(historyTransactions.get(location.state.txpowid));
        }
    }, [historyTransactions, location.state, navigate]);

    useEffect(() => {
        if (viewTransaction) {
            const type = utils.getTxPOWDetailsType(viewTransaction.detail);
            const difference = viewTransaction.detail.difference;
            let amount: any = '';
            let txnType: any = '';
            if (type === 'normal') {
                const isOut = difference[Object.keys(difference)[0]].substring(0, 1) === '-';
                txnType = isOut ? 'Send' : 'Receive';
                amount =
                    difference[Object.keys(difference)[0]] && difference[Object.keys(difference)[0]].length > 0
                        ? difference[Object.keys(difference)[0]]
                        : 'Balance Unchanged';

                setTransactionType(txnType);
                settransactionAmount(amount);
            }
            if (type === 'custom') {
                txnType = 'Custom';
                amount = 'Multiple';
                setTransactionType(txnType);
                settransactionAmount(amount);
            }
            if (type === 'tokencreate') {
                txnType = 'Token Creation';
                amount = difference[Object.keys(difference)[1]];
                setTransactionType(txnType);
                settransactionAmount(amount);
            }

            setTransactionSummary([
                {
                    id: viewTransaction?.txpow.txpowid,
                    amount: amount,
                    tokenid: viewTransaction?.txpow.body.txn.outputs[0].tokenid,
                    address: viewTransaction?.txpow.body.txn.outputs[0].miniaddress,
                    date: viewTransaction?.txpow.header.date,
                    type: txnType,
                    block: viewTransaction?.txpow.header.block,
                    burn: viewTransaction?.txpow.burn,
                    json: JSON.stringify(viewTransaction),
                },
            ]);
        }
    }, [viewTransaction]);

    return (
        <>
            <FeatureUnavailable
                open={internalBrowserWarningModal}
                closeModal={() => setInternalBrowserWarningModal(false)}
            />
            <DisplayFullJson open={openAdvancedModal} closeModal={() => setAdvanced(false)} json={viewTransaction} />
            {viewTransaction && (
                <Stack spacing={2}>
                    <Card variant="outlined">
                        <CardHeader
                            title={
                                <Stack spacing={2}>
                                    <MiTransactionSummary>
                                        <Stack
                                            sx={{ width: '100%' }}
                                            mb={2}
                                            gap={0.5}
                                            flexDirection="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                        >
                                            <h6>Quick Summary</h6>
                                            <DataObjectIcon onClick={handleFullJSONView} color="primary" />
                                        </Stack>
                                        <ul>
                                            <li>
                                                <p>Transaction ID (TxPoW)</p>
                                                <p>{viewTransaction.txpow.txpowid}</p>
                                            </li>
                                            <li>
                                                <p>Amount</p>
                                                {transactionAmount === '0' &&
                                                    viewTransaction?.txpow.body.txn.outputs[0].tokenid === '0x00' && (
                                                        <p>{viewTransaction.txpow.body.txn.outputs[0].amount}</p>
                                                    )}
                                                {transactionAmount === '0' &&
                                                    viewTransaction?.txpow.body.txn.outputs[0].tokenid !== '0x00' && (
                                                        <p>{viewTransaction.txpow.body.txn.outputs[0].tokenamount}</p>
                                                    )}
                                                {transactionAmount !== '0' && <p>{transactionAmount}</p>}
                                            </li>
                                            <li>
                                                <p>Type</p>

                                                {!!transactionType && <p>{transactionType}</p>}
                                                {!transactionType && <p>N/A</p>}
                                            </li>
                                            <li>
                                                <p>Sent to</p>

                                                <p>{viewTransaction.txpow.body.txn.outputs[0].miniaddress}</p>
                                            </li>
                                            <li>
                                                <p>Token</p>
                                                {transactionType !== 'Custom' && (
                                                    <p>
                                                        {viewTransaction.txpow.body.txn.outputs[0].tokenid === '0x00'
                                                            ? 'Minima'
                                                            : viewTransaction.txpow.body.txn.outputs[0].token?.name
                                                                  .name}
                                                    </p>
                                                )}
                                                {transactionType === 'Custom' && <p>Multiple</p>}
                                            </li>
                                            <li>
                                                <p>Block:</p>

                                                <p>{viewTransaction.txpow.header.block}</p>
                                            </li>
                                            <li>
                                                <p>Date:</p>

                                                <p>
                                                    {format(
                                                        parseInt(viewTransaction.txpow.header.timemilli),
                                                        'hh:mm:s a'
                                                    )}{' '}
                                                    •{' '}
                                                    {format(
                                                        parseInt(viewTransaction.txpow.header.timemilli),
                                                        'dd/MM/yy'
                                                    )}
                                                </p>
                                            </li>

                                            <li>
                                                <p>Burn</p>

                                                <p>{viewTransaction.txpow.burn}</p>
                                            </li>
                                        </ul>
                                    </MiTransactionSummary>
                                    <Button
                                        onClick={
                                            !isUserRunningWebView
                                                ? handleExportingToCSV
                                                : () => setInternalBrowserWarningModal(true)
                                        }
                                        color="inherit"
                                        variant="outlined"
                                    >
                                        Download Receipt
                                    </Button>
                                </Stack>
                            }
                        />
                    </Card>

                    {viewTransaction.txpow.hasbody && viewTransaction.txpow.body.txn && (
                        <Stack spacing={1}>
                            {!!viewTransaction.txpow.body.txn.inputs.length && (
                                <Accordion sx={{ background: 'rgba(255, 255, 255, 0.5)', boxShadow: 'none' }}>
                                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>Inputs</AccordionSummary>
                                    <AccordionDetails>
                                        <MiTransactionSummary>
                                            <ul id="input">
                                                {viewTransaction.txpow.body.txn.inputs.map((input, i) => (
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
                            )}
                            {!!viewTransaction.txpow.body.txn.outputs.length && (
                                <Accordion sx={{ background: 'rgba(255, 255, 255, 0.5)', boxShadow: 'none' }}>
                                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>Outputs</AccordionSummary>
                                    <AccordionDetails>
                                        <MiTransactionSummary>
                                            <ul id="input">
                                                {viewTransaction.txpow.body.txn.outputs.map((input, i) => (
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
                            )}
                            {!!viewTransaction.txpow.body.txn.state.length && (
                                <Accordion sx={{ background: 'rgba(255, 255, 255, 0.5)', boxShadow: 'none' }}>
                                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                                        State Variables
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <MiTransactionSummary>
                                            <ul id="input">
                                                {!viewTransaction.txpow.body.txn.state.length && (
                                                    <NoResults>
                                                        <h6>None Available</h6>
                                                        <p>this transaction doesn't hold any state variables.</p>
                                                    </NoResults>
                                                )}
                                                {!!viewTransaction.txpow.body.txn.state.length &&
                                                    viewTransaction.txpow.body.txn.state.map((input, i) => (
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
                            )}
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
