import { useContext, useState } from 'react';

import {  downloadCsv } from '../../shared/utils/jsonToCsv';
import { useSpring, animated } from 'react-spring';

import identifyLeadingAmount from '../../shared/utils/_txpowHelperFunctions/identifyLeadingAmount';
import { appContext } from '../../AppContext';
import { createPortal } from 'react-dom';

import CardContent from '../../components/UI/CardContent';
import Grid from '../../components/UI/Grid';
import useFormatMinimaNumber from '../../__minima__/libs/utils/useMakeNumber';
import { getTxPOWDetailsType } from '../../shared/utils';
import { format } from 'date-fns';

import * as utils from "../../utilities"

const HistoryTransactionDetailSimple = () => {
    const { makeMinimaNumber } = useFormatMinimaNumber();
    const { _promptTransactionDetails: _transaction, promptTransactionDetails } = useContext(appContext);
    const [_viewFullJson, setViewJson] = useState(false);
    const [_showInputs, setShowInputs] = useState(false);
    const [_showStates, setShowStates] = useState(false);
    const [showOutputs, setShowOutputs] = useState(false);

    const dropdownAnimationOutputs = useSpring({
        height: showOutputs ? 'auto' : 0,
        opacity: showOutputs ? 1 : 0,
    });

    const dropdownAnimationInputs = useSpring({
        height: _showInputs ? 'auto' : 0,
        opacity: _showInputs ? 1 : 0,
    });

    const dropdownAnimationStates = useSpring({
        height: _showStates ? 'auto' : 0,
        opacity: _showStates ? 1 : 0,
    });

    if (!_transaction) {
        return null;
    }
    
    const hasPublicMessage =
        _transaction.transaction.body.txn.state.length &&
        _transaction.transaction.body.txn.state.find((s: any) => s.port === 44)
            ? _transaction.transaction.body.txn.state.find((s: any) => s.port === 44)
            : false;
    const theMessage = hasPublicMessage ? utils.decode(hasPublicMessage.data).substring(1, hasPublicMessage.data.length-1) : '';

    const amount = identifyLeadingAmount(_transaction.details) === '0'
                                                            ? '-'
                                                            : makeMinimaNumber(
                                                                  identifyLeadingAmount(_transaction.details),
                                                                  2000
                                                              );
    const txpowid = _transaction.transaction.txpowid;
    const sentToMx = _transaction.transaction.body.txn.outputs[0].miniaddress;
    const sentTo0x = _transaction.transaction.body.txn.outputs[0].address;
    const date = format(
        parseInt(_transaction.transaction.header.timemilli),
        "MMMM do yyyy 'at' h:mm a"
    );
    const type = getTxPOWDetailsType(_transaction.details) === 'normal'
    ? 'Value Transfer'
    : getTxPOWDetailsType(_transaction.details) === 'custom'
    ? 'Custom'
    : 'Token Creation';
    const blockPosted = _transaction.transaction.header.block;
    const burn = parseInt(_transaction.transaction.burn) > 0 ? makeMinimaNumber(_transaction.transaction.burn, 2000) : '0';
    const fullJson = JSON.stringify(_transaction.transaction);

    const handleExportingToCSV = () => {        
        downloadCsv({ amount, txpowid, sentToMx, sentTo0x, date, type, blockPosted, burn, fullJson });
    };

    return (
        <>
            {_viewFullJson &&
                _transaction &&
                createPortal(
                    <div
                        onClick={() => setViewJson(false)}
                        className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn"
                    >
                        <Grid
                            variant="lg"
                            title={
                                <>
                                    <svg
                                        className="fill-white hover:cursor-pointer"
                                        onClick={(e: any) => {
                                            e.stopPropagation();
                                            setViewJson(false);
                                        }}
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
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="flex flex-col gap-4 mx-4 rounded bg-white bg-opacity-90 p-4 mb-4 shadow-sm"
                            >
                                <div className="overflow-scroll">
                                    <pre className="text-black text-sm break-all max-h-[calc(100vh_-_56px)]">
                                        {JSON.stringify(
                                            _transaction.transaction,
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

            {_transaction &&
                createPortal(
                    <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                        <Grid
                            variant="lg"
                            title={
                                <>
                                    <svg
                                        className="fill-white hover:cursor-pointer"
                                        onClick={(e: any) => {
                                            e.stopPropagation();
                                            promptTransactionDetails(false);
                                        }}
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
                                onClick={(e: any) => e.stopPropagation()}
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
                                                onClick={() => handleExportingToCSV()}
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
                                            <div className="bg-white p-4 rounded">
                                                <h6 className="font-bold">Transaction ID</h6>
                                                <input
                                                    className="w-full truncate font-mono"
                                                    value={_transaction.transaction.txpowid}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="bg-white p-4 rounded">
                                                <h6 className="font-bold">Amount</h6>
                                                <input
                                                    className="w-full truncate font-mono"
                                                    value={
                                                        amount
                                                    }
                                                    readOnly
                                                />
                                            </div>

                                            <div className="bg-white p-4 rounded">
                                                <h6 className="font-bold">Transaction Type</h6>
                                                <input
                                                    className="w-full truncate"
                                                    value={
                                                        type
                                                    }
                                                    readOnly
                                                />
                                            </div>

                                            <div className="bg-white p-4 rounded">
                                                <h6 className="font-bold">Recipient (0x)</h6>
                                                <input
                                                    className="w-full truncate font-mono"
                                                    value={sentTo0x}
                                                    readOnly
                                                />
                                            </div>

                                            <div className="bg-white p-4 rounded">
                                                <h6 className="font-bold">(Mx Address)</h6>
                                                <input
                                                    className="w-full truncate font-mono"
                                                    value={sentToMx}
                                                    readOnly
                                                />
                                            </div>

                                            <div className="bg-white p-4 rounded">
                                                <h6 className="font-bold">Token</h6>
                                                <input
                                                    className="w-full truncate"
                                                    value={
                                                        _transaction.transaction.body.txn.outputs[0].tokenid === '0x00'
                                                            ? 'Minima'
                                                            : _transaction.transaction.body.txn.outputs[0].token &&
                                                              _transaction.transaction.body.txn.outputs[0].token.name &&
                                                              typeof _transaction.transaction.body.txn.outputs[0].token
                                                                  .name.name === 'string'
                                                            ? _transaction.transaction.body.txn.outputs[0].token.name
                                                                  .name
                                                            : 'N/A'
                                                    }
                                                    readOnly
                                                />
                                            </div>

                                            <div className="bg-white p-4 rounded">
                                                <h6 className="font-bold">Block Height</h6>
                                                <input
                                                    className="w-full truncate font-mono"
                                                    value={blockPosted}
                                                    readOnly
                                                />
                                            </div>

                                            <div className="bg-white p-4 rounded">
                                                <h6 className="font-bold">Date</h6>
                                                <input
                                                    className="w-full truncate"
                                                    value={date}
                                                    readOnly
                                                />
                                            </div>

                                            <div className="bg-white p-4 rounded">
                                                <h6 className="font-bold">Burn</h6>
                                                <input
                                                    className="w-full truncate font-mono"
                                                    value={burn}
                                                    readOnly
                                                />
                                            </div>

                                            <div className="bg-white p-4 rounded">
                                                <h6 className="font-bold">Public Message</h6>
                                                <input
                                                    className="w-full truncate font-mono"
                                                    value={theMessage ? theMessage : '-'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <>
                                            {!!_transaction.transaction.body.txn.inputs.length && (
                                                <div className="bg-white shadow-md rounded-lg mb-4">
                                                    <div
                                                        onClick={() => setShowInputs((prevState) => !prevState)}
                                                        className="p-4 flex items-center justify-between rounded-t-lg cursor-pointer"
                                                    >
                                                        <span className="font-semibold">Inputs</span>
                                                        <svg
                                                            className={`w-6 h-6 ${
                                                                showOutputs ? 'transform rotate-180' : ''
                                                            }`}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </div>
                                                    {_showInputs && (
                                                        <animated.ul
                                                            style={dropdownAnimationInputs}
                                                            className="bg-white divide-y divide-gray-200 overflow-hidden"
                                                        >
                                                            {_transaction.transaction.body.txn.inputs.map(
                                                                (output: any, index: any) => (
                                                                    <li key={index} className="p-4">
                                                                        <h3 className="text-lg font-semibold mb-2">
                                                                            # {index}
                                                                        </h3>
                                                                        <div className="bg-white py-3 border-b border-gray-300">
                                                                            <h6 className="font-bold">Token</h6>
                                                                            <input
                                                                                className="w-full truncate font-mono"
                                                                                value={
                                                                                    output.tokenid === '0x00'
                                                                                        ? 'Minima'
                                                                                        : output.token
                                                                                        ? output.token.name.name
                                                                                        : 'N/A'
                                                                                }
                                                                                readOnly
                                                                            />
                                                                        </div>
                                                                        <div className="bg-white py-3 border-b border-gray-300">
                                                                            <h6 className="font-bold">Amount</h6>
                                                                            <input
                                                                                className="w-full truncate font-mono"
                                                                                value={makeMinimaNumber(
                                                                                    output.amount,
                                                                                    2000
                                                                                )}
                                                                                readOnly
                                                                            />
                                                                        </div>
                                                                        {output.tokenamount && (
                                                                            <div className="bg-white py-3 border-b border-gray-300">
                                                                                <h6 className="font-bold">
                                                                                    Token Amount
                                                                                </h6>
                                                                                <input
                                                                                    className="w-full truncate font-mono"
                                                                                    value={makeMinimaNumber(
                                                                                        output.tokenamount,
                                                                                        2000
                                                                                    )}
                                                                                    readOnly
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        <div className="bg-white py-3 border-b border-gray-300">
                                                                            <h6 className="font-bold">Coin ID</h6>
                                                                            <input
                                                                                className="w-full truncate font-mono"
                                                                                value={output.coinid}
                                                                                readOnly
                                                                            />
                                                                        </div>

                                                                        <div className="bg-white py-3 border-b border-gray-300">
                                                                            <h6 className="font-bold">Token ID</h6>
                                                                            <input
                                                                                className="w-full truncate font-mono"
                                                                                value={output.tokenid}
                                                                                readOnly
                                                                            />
                                                                        </div>

                                                                        <div className="bg-white py-3 border-b border-gray-300">
                                                                            <h6 className="font-bold">Spent</h6>
                                                                            <input
                                                                                className="w-full truncate font-mono"
                                                                                value={output.spent ? 'Yes' : 'No'}
                                                                                readOnly
                                                                            />
                                                                        </div>

                                                                        <div className="bg-white py-3 border-b border-gray-300">
                                                                            <h6 className="font-bold">Storing State</h6>
                                                                            <input
                                                                                className="w-full truncate font-mono"
                                                                                value={output.storestate ? 'Yes' : 'No'}
                                                                                readOnly
                                                                            />
                                                                        </div>
                                                                    </li>
                                                                )
                                                            )}
                                                        </animated.ul>
                                                    )}
                                                </div>
                                            )}

                                            {!!_transaction.transaction.body.txn.outputs.length && (
                                                <div className="bg-white shadow-md rounded-lg mb-4">
                                                    <div
                                                        onClick={() => setShowOutputs((prevState) => !prevState)}
                                                        className="p-4 flex items-center justify-between rounded-t-lg cursor-pointer"
                                                    >
                                                        <span className="font-semibold">Outputs</span>
                                                        <svg
                                                            className={`w-6 h-6 ${
                                                                showOutputs ? 'transform rotate-180' : ''
                                                            }`}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </div>
                                                    {showOutputs && (
                                                        <animated.ul
                                                            style={dropdownAnimationOutputs}
                                                            className="bg-white divide-y divide-gray-200 overflow-hidden"
                                                        >
                                                            {_transaction.transaction.body.txn.outputs.map(
                                                                (output: any, index: any) => (
                                                                    <li key={index} className="p-4">
                                                                        <h3 className="text-lg font-semibold mb-2">
                                                                            # {index}
                                                                        </h3>
                                                                        <div className="bg-white py-3 border-b border-gray-300">
                                                                            <h6 className="font-bold">Token</h6>
                                                                            <input
                                                                                className="w-full truncate font-mono"
                                                                                value={
                                                                                    output.tokenid === '0x00'
                                                                                        ? 'Minima'
                                                                                        : output.token
                                                                                        ? output.token.name.name
                                                                                        : 'N/A'
                                                                                }
                                                                                readOnly
                                                                            />
                                                                        </div>
                                                                        <div className="bg-white py-3 border-b border-gray-300">
                                                                            <h6 className="font-bold">Amount</h6>
                                                                            <input
                                                                                className="w-full truncate font-mono"
                                                                                value={makeMinimaNumber(
                                                                                    output.amount,
                                                                                    2000
                                                                                )}
                                                                                readOnly
                                                                            />
                                                                        </div>
                                                                        {output.tokenamount && (
                                                                            <div className="bg-white py-3 border-b border-gray-300">
                                                                                <h6 className="font-bold">
                                                                                    Token Amount
                                                                                </h6>
                                                                                <input
                                                                                    className="w-full truncate font-mono"
                                                                                    value={makeMinimaNumber(
                                                                                        output.tokenamount,
                                                                                        2000
                                                                                    )}
                                                                                    readOnly
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        <div className="bg-white py-3 border-b border-gray-300">
                                                                            <h6 className="font-bold">Coin ID</h6>
                                                                            <input
                                                                                className="w-full truncate font-mono"
                                                                                value={output.coinid}
                                                                                readOnly
                                                                            />
                                                                        </div>

                                                                        <div className="bg-white py-3 border-b border-gray-300">
                                                                            <h6 className="font-bold">Token ID</h6>
                                                                            <input
                                                                                className="w-full truncate font-mono"
                                                                                value={output.tokenid}
                                                                                readOnly
                                                                            />
                                                                        </div>

                                                                        <div className="bg-white py-3 border-b border-gray-300">
                                                                            <h6 className="font-bold">Spent</h6>
                                                                            <input
                                                                                className="w-full truncate font-mono"
                                                                                value={output.spent ? 'Yes' : 'No'}
                                                                                readOnly
                                                                            />
                                                                        </div>

                                                                        <div className="bg-white py-3 border-b border-gray-300">
                                                                            <h6 className="font-bold">Storing State</h6>
                                                                            <input
                                                                                className="w-full truncate font-mono"
                                                                                value={output.storestate ? 'Yes' : 'No'}
                                                                                readOnly
                                                                            />
                                                                        </div>
                                                                    </li>
                                                                )
                                                            )}
                                                        </animated.ul>
                                                    )}
                                                </div>
                                            )}

                                            {!!_transaction.transaction.body.txn.state.length && (
                                                <div className="bg-white shadow-md rounded-lg mb-4">
                                                    <div
                                                        onClick={() => setShowStates((prevState) => !prevState)}
                                                        className={`p-4 flex items-center justify-between rounded-t-lg cursor-pointer ${
                                                            _showStates ? '' : 'rounded-b-lg'
                                                        }`}
                                                    >
                                                        <span className="font-semibold">State Variables</span>
                                                        <svg
                                                            className={`w-6 h-6 ${
                                                                _showStates ? 'transform rotate-180' : ''
                                                            }`}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </div>
                                                    {_showStates && (
                                                        <animated.ul
                                                        style={dropdownAnimationStates}
                                                        className="bg-white divide-y divide-gray-200 overflow-hidden"
                                                    >
                                                            {_transaction.transaction.body.txn.state.map(
                                                                (stateVar: any, index: any) => (
                                                                    <li key={index} className="p-4">
                                                                        <div className="bg-white py-3 border-b border-gray-300">
                                                                            <h6 className="font-bold">Port</h6>
                                                                            <input
                                                                                className="w-full truncate font-mono"
                                                                                value={stateVar.port}
                                                                                readOnly
                                                                            />
                                                                        </div>
                                                                        
                                                                        <div className="bg-white py-3 border-b border-gray-300">
                                                                            <h6 className="font-bold">Type</h6>
                                                                            <input
                                                                                className="w-full truncate font-mono"
                                                                                value={stateVar.type}
                                                                                readOnly
                                                                            />
                                                                        </div>
                                                                        
                                                                        <div className="bg-white py-3 border-b border-gray-300">
                                                                            <h6 className="font-bold">Data</h6>
                                                                            <input
                                                                                className="w-full truncate font-mono"
                                                                                value={stateVar.data}
                                                                                readOnly
                                                                            />
                                                                        </div>
                                                                        
                                                                    </li>
                                                                )
                                                            )}
                                                        </animated.ul>
                                                    )}
                                                </div>
                                            )}
                                        </>                                        
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
