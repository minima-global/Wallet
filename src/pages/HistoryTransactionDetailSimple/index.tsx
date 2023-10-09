import { Button } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import exportToCsv from '../../shared/utils/jsonToCsv';

import useIsUserRunningWebView from '../../hooks/useIsUserRunningWebView';

import * as types from '../../types/minima';

import { appContext } from '../../AppContext';
import { createPortal } from 'react-dom';

import CardContent from '../../components/UI/CardContent';
import Grid from '../../components/UI/Grid';
import KeyValue from '../../components/UI/KeyValue';

const HistoryTransactionDetailSimple = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { historyDetails, history } = useContext(appContext);

    const [_viewFullJson, setViewJson] = useState(false);
    const [_showInputs, setShowInputs] = useState(false);
    const [_showOutputs, setShowOutputs] = useState(false);
    const [_showStates, setShowStates] = useState(false);

    const [_transaction, setTransaction] = useState<{
        txpowid: string;
        amount: string;
        type: string;
        sentTo0x: string;
        sentToMx: string;
        tokenName: string;
        blockPosted: string;
        date: string;
        timemilli: string;
        burn: string;
        inputs: any[];
        outputs: any[];
        stateVars: any[];
    } | null>(null);

    const handleExportingToCSV = (e: any) => {
        if (_transaction) {
            exportToCsv(
                e,
                historyDetails,
                JSON.stringify(history.find((t: any) => t.txpowid === _transaction.txpowid))
            );
        }
    };

    useEffect(() => {
        setTransaction(historyDetails.find((t: any) => t.txpowid === params.transactionid));
    }, [params]);

    return (
        <>
            {_viewFullJson &&
                _transaction &&
                createPortal(
                    <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                        <Grid
                            variant="lg"
                            title={
                                <>
                                    <svg
                                        className="fill-white hover:cursor-pointer"
                                        onClick={() => setViewJson(false)}
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24"
                                        viewBox="0 -960 960 960"
                                        width="24"
                                    >
                                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                    </svg>
                                    Full TxPOW Json
                                </>
                            }
                        >
                            <div className="flex flex-col gap-4 mx-4 rounded bg-white bg-opacity-90 p-4 mb-4 shadow-sm">
                                <div className="overflow-scroll">
                                    <pre className="text-black text-sm break-all max-h-[calc(100vh_-_56px)]">
                                        {JSON.stringify(
                                            history.find((t: any) => t.txpowid === _transaction.txpowid),
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>
                            </div>
                        </Grid>
                    </div>,
                    document.body
                )}

            {params &&
                createPortal(
                    <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                        <Grid
                            variant="lg"
                            title={
                                <>
                                    <svg
                                        className="fill-white hover:cursor-pointer"
                                        onClick={() => navigate(-1)}
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24"
                                        viewBox="0 -960 960 960"
                                        width="24"
                                    >
                                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                    </svg>
                                    Viewing transaction
                                </>
                            }
                        >
                            <CardContent
                                className="bg-opacity-90"
                                header={
                                    <span className="flex justify-between">
                                        <h6 className="text-black text-xl">Quick Summary</h6>

                                        <div className="flex gap-2">
                                            <svg
                                                onClick={() => setViewJson(true)}
                                                className="fill-black hover:cursor-pointer"
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                viewBox="0 -960 960 960"
                                                width="24"
                                            >
                                                <path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z" />
                                            </svg>

                                            <svg
                                                onClick={handleExportingToCSV}
                                                className="fill-black hover:cursor-pointer"
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                viewBox="0 -960 960 960"
                                                width="24"
                                            >
                                                <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                                            </svg>
                                        </div>
                                    </span>
                                }
                                content={
                                    <div className="flex flex-col gap-8">
                                        <div className="divide-y-2">
                                            <KeyValue
                                                title="Transaction ID (TxPOWID)"
                                                value={_transaction ? _transaction.txpowid : 'N/A'}
                                            />
                                            <KeyValue
                                                title="Amount"
                                                value={_transaction ? _transaction.amount : 'N/A'}
                                            />
                                            <KeyValue title="Type" value={_transaction ? _transaction.type : 'N/A'} />
                                            <div>
                                                <KeyValue
                                                    title="Sent to"
                                                    value={_transaction ? _transaction.sentToMx : 'N/A'}
                                                />
                                                <KeyValue
                                                    title="(0x)"
                                                    value={_transaction ? _transaction.sentTo0x : 'N/A'}
                                                />
                                            </div>
                                            <KeyValue
                                                title="Token"
                                                value={_transaction ? _transaction.tokenName : 'N/A'}
                                            />
                                            <KeyValue
                                                title="Block"
                                                value={_transaction ? _transaction.blockPosted : 'N/A'}
                                            />
                                            <KeyValue title="Date" value={_transaction ? _transaction.date : 'N/A'} />
                                            <KeyValue title="Burn" value={_transaction ? _transaction.burn : 'N/A'} />
                                        </div>

                                        {_transaction && _transaction.inputs.length && (
                                            <div>
                                                <div
                                                    onClick={() => setShowInputs((prevState) => !prevState)}
                                                    className={`bg-white text-black p-4 flex items-center justify-between rounded-lg font-semibold ${
                                                        !_showInputs ? '' : 'rounded-b-none'
                                                    }`}
                                                >
                                                    Inputs
                                                    <svg
                                                        className={`fill-black ${
                                                            !_showInputs ? 'arrow-active' : 'arrow-passive'
                                                        }`}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="24"
                                                        viewBox="0 -960 960 960"
                                                        width="24"
                                                    >
                                                        <path d="m296-345-56-56 240-240 240 240-56 56-184-184-184 184Z" />
                                                    </svg>
                                                </div>
                                                <ul
                                                    aria-expanded={!_showInputs}
                                                    className="accordion-content rounded bg-white bg-opacity-50 h-[auto] border-t-0"
                                                >
                                                    <li>Inputs</li>
                                                    {_transaction.inputs.map((i, index) => (
                                                        <li className="divide-y-2">
                                                            <h3 className="text-black font-semibold text-sm pb-2 mx-4 underline">
                                                                Input {index}
                                                            </h3>
                                                            <KeyValue
                                                                title="Token"
                                                                value={
                                                                    i.tokenid === '0x00'
                                                                        ? 'Minima'
                                                                        : i.token !== null
                                                                        ? i.token.name.name
                                                                        : 'N/A'
                                                                }
                                                            />
                                                            <div>
                                                                <KeyValue title="Amount" value={i.amount} />
                                                                {i.tokenamount && (
                                                                    <KeyValue
                                                                        title="Token amount"
                                                                        value={i.tokenamount}
                                                                    />
                                                                )}
                                                            </div>
                                                            <KeyValue title="Coin ID" value={i.coinid} />
                                                            <KeyValue title="Token ID" value={i.tokenid} />
                                                            <KeyValue title="Spent" value={i.spent ? 'Yes' : 'No'} />
                                                            <KeyValue
                                                                title="Storing state"
                                                                value={i.storestate ? 'Yes' : 'No'}
                                                            />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {_transaction && _transaction.outputs.length && (
                                            <div>
                                                <div
                                                    onClick={() => setShowOutputs((prevState) => !prevState)}
                                                    className={`bg-white text-black p-4 flex items-center justify-between rounded-lg font-semibold ${
                                                        !_showOutputs ? '' : 'rounded-b-none'
                                                    }`}
                                                >
                                                    Outputs
                                                    <svg
                                                        className={`fill-black ${
                                                            !_showOutputs ? 'arrow-active' : 'arrow-passive'
                                                        }`}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="24"
                                                        viewBox="0 -960 960 960"
                                                        width="24"
                                                    >
                                                        <path d="m296-345-56-56 240-240 240 240-56 56-184-184-184 184Z" />
                                                    </svg>
                                                </div>
                                                <ul
                                                    aria-expanded={!_showOutputs}
                                                    className="accordion-content rounded bg-white bg-opacity-50 h-[auto] border-t-0"
                                                >
                                                    <li>Outputs</li>
                                                    {_transaction.outputs.map((i, index) => (
                                                        <li className="divide-y-2">
                                                            <h3 className="text-black font-semibold text-sm pb-2 mx-4 underline">
                                                                Output {index}
                                                            </h3>
                                                            <KeyValue
                                                                title="Token"
                                                                value={
                                                                    i.tokenid === '0x00'
                                                                        ? 'Minima'
                                                                        : i.token !== null
                                                                        ? i.token.name.name
                                                                        : 'N/A'
                                                                }
                                                            />
                                                            <div>
                                                                <KeyValue title="Amount" value={i.amount} />
                                                                {i.tokenamount && (
                                                                    <KeyValue
                                                                        title="Token amount"
                                                                        value={i.tokenamount}
                                                                    />
                                                                )}
                                                            </div>
                                                            <KeyValue title="Coin ID" value={i.coinid} />
                                                            <KeyValue title="Token ID" value={i.tokenid} />
                                                            <KeyValue title="Spent" value={i.spent ? 'Yes' : 'No'} />
                                                            <KeyValue
                                                                title="Storing state"
                                                                value={i.storestate ? 'Yes' : 'No'}
                                                            />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {_transaction && _transaction.stateVars.length && (
                                            <div>
                                                <div
                                                    onClick={() => setShowStates((prevState) => !prevState)}
                                                    className={`bg-white text-black p-4 flex items-center justify-between rounded-lg font-semibold ${
                                                        !_showStates ? '' : 'rounded-b-none'
                                                    }`}
                                                >
                                                    State Variables
                                                    <svg
                                                        className={`fill-black ${
                                                            !_showStates ? 'arrow-active' : 'arrow-passive'
                                                        }`}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="24"
                                                        viewBox="0 -960 960 960"
                                                        width="24"
                                                    >
                                                        <path d="m296-345-56-56 240-240 240 240-56 56-184-184-184 184Z" />
                                                    </svg>
                                                </div>
                                                <ul
                                                    aria-expanded={!_showStates}
                                                    className="accordion-content rounded bg-white bg-opacity-50 h-[auto] border-t-0"
                                                >
                                                    <li>State Variables</li>
                                                    {_transaction &&
                                                        _transaction.stateVars.map((i, index) => (
                                                            <li className="divide-y-2">
                                                                <h3 className="text-black font-semibold text-sm pb-2 mx-4 underline">
                                                                    Port{' '}
                                                                    <span className="font-bold green-good">
                                                                        {i.port}
                                                                    </span>
                                                                </h3>

                                                                <KeyValue title="Type" value={i.type + ''} />
                                                                <KeyValue
                                                                    title="Data"
                                                                    value={i.data.replace(/[\[\]]+/gi, ' ')}
                                                                />
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                }
                            />
                        </Grid>
                    </div>,

                    document.body
                )}
        </>
    );
};

export default HistoryTransactionDetailSimple;

// return (
//     <>
//         <FeatureUnavailable
//             open={internalBrowserWarningModal}
//             closeModal={() => setInternalBrowserWarningModal(false)}
//         />
//         <DisplayFullJson open={openAdvancedModal} closeModal={() => setAdvanced(false)} json={viewTransaction} />
//         {viewTransaction && (
//             <Stack spacing={2}>
//                 <Card variant="outlined">
//                     <CardHeader
//                         title={
//                             <Stack spacing={2}>
//                                 <MiTransactionSummary>
//                                     <Stack
//                                         sx={{ width: '100%' }}
//                                         mb={2}
//                                         gap={0.5}
//                                         flexDirection="row"
//                                         alignItems="center"
//                                         justifyContent="space-between"
//                                     >
//                                         <h6>Quick Summary</h6>
//                                         <DataObjectIcon onClick={handleFullJSONView} color="primary" />
//                                     </Stack>
//                                     <ul>
//                                         <li>
//                                             <p>Transaction ID (TxPoW)</p>
//                                             <p>{viewTransaction.txpow.txpowid}</p>
//                                         </li>
//                                         <li>
//                                             <p>Amount</p>
//                                             {transactionAmount === '0' &&
//                                                 viewTransaction?.txpow.body.txn.outputs[0].tokenid === '0x00' && (
//                                                     <p>{viewTransaction.txpow.body.txn.outputs[0].amount}</p>
//                                                 )}
//                                             {transactionAmount === '0' &&
//                                                 viewTransaction?.txpow.body.txn.outputs[0].tokenid !== '0x00' && (
//                                                     <p>{viewTransaction.txpow.body.txn.outputs[0].tokenamount}</p>
//                                                 )}
//                                             {transactionAmount !== '0' && <p>{transactionAmount}</p>}
//                                         </li>
//                                         <li>
//                                             <p>Type</p>

//                                             {!!transactionType && <p>{transactionType}</p>}
//                                             {!transactionType && <p>N/A</p>}
//                                         </li>
//                                         <li>
//                                             <p>Sent to</p>

//                                             <p>{viewTransaction.txpow.body.txn.outputs[0].miniaddress}</p>
//                                         </li>
//                                         <li>
//                                             <p>Token</p>
//                                             {transactionType !== 'Custom' && (
//                                                 <p>
//                                                     {viewTransaction.txpow.body.txn.outputs[0].tokenid === '0x00'
//                                                         ? 'Minima'
//                                                         : viewTransaction.txpow.body.txn.outputs[0].token?.name
//                                                               .name}
//                                                 </p>
//                                             )}
//                                             {transactionType === 'Custom' && <p>Multiple</p>}
//                                         </li>
//                                         <li>
//                                             <p>Block:</p>

//                                             <p>{viewTransaction.txpow.header.block}</p>
//                                         </li>
//                                         <li>
//                                             <p>Date:</p>

//                                             <p>
//                                                 {format(
//                                                     parseInt(viewTransaction.txpow.header.timemilli),
//                                                     'hh:mm:s a'
//                                                 )}{' '}
//                                                 •{' '}
//                                                 {format(
//                                                     parseInt(viewTransaction.txpow.header.timemilli),
//                                                     'dd/MM/yy'
//                                                 )}
//                                             </p>
//                                         </li>

//                                         <li>
//                                             <p>Burn</p>

//                                             <p>{viewTransaction.txpow.burn}</p>
//                                         </li>
//                                     </ul>
//                                 </MiTransactionSummary>
//                                 <Button
//                                     onClick={
//                                         !isUserRunningWebView
//                                             ? handleExportingToCSV
//                                             : () => setInternalBrowserWarningModal(true)
//                                     }
//                                     color="inherit"
//                                     variant="outlined"
//                                 >
//                                     Download Receipt
//                                 </Button>
//                             </Stack>
//                         }
//                     />
//                 </Card>

//                 {viewTransaction.txpow.hasbody && viewTransaction.txpow.body.txn && (
//                     <Stack spacing={1}>
//                         {!!viewTransaction.txpow.body.txn.inputs.length && (
//                             <Accordion sx={{ background: 'rgba(255, 255, 255, 0.5)', boxShadow: 'none' }}>
//                                 <AccordionSummary expandIcon={<ExpandMoreOutlined />}>Inputs</AccordionSummary>
//                                 <AccordionDetails>
//                                     <MiTransactionSummary>
//                                         <ul id="input">
//                                             {viewTransaction.txpow.body.txn.inputs.map((input, i) => (
//                                                 <ul key={input.coinid} id="iterator">
//                                                     <li id="list-subheader">{i + 1}.</li>
//                                                     <li>
//                                                         <p>Coin ID</p>
//                                                         <p>{input.coinid}</p>
//                                                     </li>
//                                                     <li>
//                                                         <p>Token ID</p>
//                                                         <p>{input.tokenid}</p>
//                                                     </li>
//                                                     {input.token !== null && (
//                                                         <li>
//                                                             <p>Token Name</p>
//                                                             <p>{input.token.name.name}</p>
//                                                         </li>
//                                                     )}
//                                                     {input.tokenid === '0x00' && (
//                                                         <li>
//                                                             <p>Token Name</p>
//                                                             <p>Minima</p>
//                                                         </li>
//                                                     )}
//                                                     <li>
//                                                         <p>Address</p>
//                                                         <p>{input.address}</p>
//                                                     </li>
//                                                     <li>
//                                                         <p>Mini Address</p>
//                                                         <p>{input.miniaddress ? input.miniaddress : 'N/A'}</p>
//                                                     </li>
//                                                     <li>
//                                                         <p>Spent</p>
//                                                         <p>{input.spent ? 'Yes' : 'No'}</p>
//                                                     </li>
//                                                     <li>
//                                                         <p>Store State</p>
//                                                         <p>{input.storestate ? 'Yes' : 'No'}</p>
//                                                     </li>
//                                                     <li>
//                                                         <p>Amount</p>
//                                                         <p>{input.amount}</p>
//                                                     </li>
//                                                     {input.tokenamount && (
//                                                         <li>
//                                                             <p>Token Amount</p>
//                                                             <p>{input.tokenamount}</p>
//                                                         </li>
//                                                     )}
//                                                 </ul>
//                                             ))}
//                                         </ul>
//                                     </MiTransactionSummary>
//                                 </AccordionDetails>
//                             </Accordion>
//                         )}
//                         {!!viewTransaction.txpow.body.txn.outputs.length && (
//                             <Accordion sx={{ background: 'rgba(255, 255, 255, 0.5)', boxShadow: 'none' }}>
//                                 <AccordionSummary expandIcon={<ExpandMoreOutlined />}>Outputs</AccordionSummary>
//                                 <AccordionDetails>
//                                     <MiTransactionSummary>
//                                         <ul id="input">
//                                             {viewTransaction.txpow.body.txn.outputs.map((input, i) => (
//                                                 <ul key={input.coinid} id="iterator">
//                                                     <li id="list-subheader">{i + 1}.</li>
//                                                     <li>
//                                                         <p>Coin ID</p>
//                                                         <p>{input.coinid}</p>
//                                                     </li>
//                                                     <li>
//                                                         <p>Token ID</p>
//                                                         <p>{input.tokenid}</p>
//                                                     </li>
//                                                     {input.token !== null && (
//                                                         <li>
//                                                             <p>Token Name</p>
//                                                             <p>{input.token.name.name}</p>
//                                                         </li>
//                                                     )}
//                                                     {input.tokenid === '0x00' && (
//                                                         <li>
//                                                             <p>Token Name</p>
//                                                             <p>Minima</p>
//                                                         </li>
//                                                     )}
//                                                     <li>
//                                                         <p>Address</p>
//                                                         <p>{input.address}</p>
//                                                     </li>
//                                                     <li>
//                                                         <p>Mini Address</p>
//                                                         <p>{input.miniaddress ? input.miniaddress : 'N/A'}</p>
//                                                     </li>
//                                                     <li>
//                                                         <p>Spent</p>
//                                                         <p>{input.spent ? 'Yes' : 'No'}</p>
//                                                     </li>
//                                                     <li>
//                                                         <p>Store State</p>
//                                                         <p>{input.storestate ? 'Yes' : 'No'}</p>
//                                                     </li>
//                                                     <li>
//                                                         <p>Amount</p>
//                                                         <p>{input.amount}</p>
//                                                     </li>
//                                                     {input.tokenamount && (
//                                                         <li>
//                                                             <p>Token Amount</p>
//                                                             <p>{input.tokenamount}</p>
//                                                         </li>
//                                                     )}
//                                                 </ul>
//                                             ))}
//                                         </ul>
//                                     </MiTransactionSummary>
//                                 </AccordionDetails>
//                             </Accordion>
//                         )}
//                         {!!viewTransaction.txpow.body.txn.state.length && (
//                             <Accordion sx={{ background: 'rgba(255, 255, 255, 0.5)', boxShadow: 'none' }}>
//                                 <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
//                                     State Variables
//                                 </AccordionSummary>
//                                 <AccordionDetails>
//                                     <MiTransactionSummary>
//                                         <ul id="input">
//                                             {!viewTransaction.txpow.body.txn.state.length && (
//                                                 <NoResults>
//                                                     <h6>None Available</h6>
//                                                     <p>this transaction doesn't hold any state variables.</p>
//                                                 </NoResults>
//                                             )}
//                                             {!!viewTransaction.txpow.body.txn.state.length &&
//                                                 viewTransaction.txpow.body.txn.state.map((input, i) => (
//                                                     <ul key={input.port} id="iterator">
//                                                         <li id="list-subheader">{input.port}</li>
//                                                         <li>
//                                                             <p>Port:</p>
//                                                             <p>{input.port}</p>
//                                                         </li>
//                                                         <li>
//                                                             <p>Type:</p>
//                                                             <p>{input.type}</p>
//                                                         </li>
//                                                         <li>
//                                                             <p>Data:</p>
//                                                             <p>{input.data}</p>
//                                                         </li>
//                                                     </ul>
//                                                 ))}
//                                         </ul>
//                                     </MiTransactionSummary>
//                                 </AccordionDetails>
//                             </Accordion>
//                         )}
//                     </Stack>
//                 )}
//             </Stack>
//         )}

//         {!viewTransaction && (
//             <Stack alignItems="center" justifyContent="center">
//                 <CircularProgress size={32} />
//             </Stack>
//         )}
//     </>
// );
