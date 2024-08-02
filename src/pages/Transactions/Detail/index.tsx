import { useContext, useEffect, useState } from 'react';
import AnimatedDialog from '../../../components/UI/AnimatedDialog';
import CloseIcon from '../../../components/UI/Icons/CloseIcon';
import { appContext } from '../../../AppContext';
import KeyValue from '../../../components/UI/KeyValue';

interface Props {
    txpowid: string | false;
    dismiss: () => void;
}

const Detail = ({ txpowid, dismiss }: Props) => {
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

    useEffect(() => {
        setTransaction(historyDetails.find((t: any) => t.txpowid === txpowid));
    }, [txpowid]);

    return (
        <AnimatedDialog display={!!txpowid} dismiss={dismiss}>
            <div className="modal-content">
                <div className="flex items-center justify-between p-4 border-b border-[#1B1B1B] dark:border-neutral-600">
                    <h3 className="font-bold text-lg">Transaction Details</h3>
                    <button onClick={dismiss} aria-label="Close">
                        <CloseIcon fill="currentColor" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 md:px-0">
                    {/* Content goes here */}

                    {/* Add more content as needed */}
                    <div className="flex flex-col gap-8">
                        <div className="divide-y-2">
                            <KeyValue
                                truncate
                                clipboard
                                title="Transaction ID (TxPOWID)"
                                value={_transaction ? _transaction.txpowid : 'N/A'}
                            />
                            <KeyValue title="Amount" value={_transaction ? _transaction.amount : 'N/A'} />
                            <KeyValue title="Type" value={_transaction ? _transaction.type : 'N/A'} />
                            <div>
                                <KeyValue
                                    clipboard
                                    truncate
                                    title="Sent to"
                                    value={_transaction ? _transaction.sentToMx : 'N/A'}
                                />
                                <KeyValue
                                    clipboard
                                    truncate
                                    title="(0x)"
                                    value={_transaction ? _transaction.sentTo0x : 'N/A'}
                                />
                            </div>
                            <KeyValue title="Token" value={_transaction ? _transaction.tokenName : 'N/A'} />
                            <KeyValue title="Block" value={_transaction ? _transaction.blockPosted : 'N/A'} />
                            <KeyValue title="Date" value={_transaction ? _transaction.date : 'N/A'} />
                            <KeyValue title="Burn" value={_transaction ? _transaction.burn : 'N/A'} />
                            {_transaction &&
                                !!_transaction.stateVars.length &&
                                !!_transaction.stateVars.filter((t) => t.port === 44).length &&
                                _transaction &&
                                _transaction.stateVars.length &&
                                _transaction.stateVars
                                    .filter((t) => t.port === 44)
                                    .map((t: any) => (
                                        <KeyValue
                                            title="Message"
                                            value={decodeURIComponent(t.data).replace(/[\[\]]+/gi, ' ')}
                                        />
                                    ))}
                        </div>

                        {_transaction && !!_transaction.inputs.length && (
                            <div>
                                <div
                                    onClick={() => setShowInputs((prevState) => !prevState)}
                                    className={`bg-neutral-100 dark:bg-[#1B1B1B] dark:text-neutral-300 p-4 flex items-center justify-between rounded-lg ${
                                        !_showInputs ? '' : 'rounded-b-none'
                                    }`}
                                >
                                    Inputs
                                    <svg
                                        className={`fill-black ${!_showInputs ? 'arrow-active' : 'arrow-passive'}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24"
                                        viewBox="0 -960 960 960"
                                        width="24"
                                    >
                                        <path d="m296-345-56-56 240-240 240 240-56 56-184-184-184 184Z" />
                                    </svg>
                                </div>
                                <ul
                                    key={_transaction.txpowid}
                                    aria-expanded={!_showInputs}
                                    className="accordion-content rounded bg-white bg-opacity-50 h-[auto] border-t-0"
                                >
                                    {_transaction.inputs.map((i, index) => (
                                        <li key={i + index} className="divide-y-2">
                                            <h3 className="text-black font-semibold text-sm pb-2 py-2 mx-4 underline">
                                                Input {index}
                                            </h3>
                                            <KeyValue
                                                truncate
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
                                                    <KeyValue title="Token amount" value={i.tokenamount} />
                                                )}
                                            </div>
                                            <KeyValue truncate clipboard title="Coin ID" value={i.coinid} />
                                            <KeyValue truncate clipboard title="Token ID" value={i.tokenid} />
                                            <KeyValue title="Spent" value={i.spent ? 'Yes' : 'No'} />
                                            <KeyValue title="Storing state" value={i.storestate ? 'Yes' : 'No'} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {_transaction && !!_transaction.outputs.length && (
                            <div>
                                <div
                                    onClick={() => setShowOutputs((prevState) => !prevState)}
                                    className={`bg-neutral-100 dark:bg-[#1B1B1B] dark:text-neutral-300 p-4 flex items-center justify-between rounded-lg  ${
                                        !_showOutputs ? '' : 'rounded-b-none'
                                    }`}
                                >
                                    Outputs
                                    <svg
                                        className={`fill-black ${!_showOutputs ? 'arrow-active' : 'arrow-passive'}`}
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
                                    {_transaction.outputs.map((i, index) => (
                                        <li key={i + index} className="divide-y-2">
                                            <h3 className="text-black font-semibold text-sm pb-2 py-2 mx-4 underline">
                                                Output {index}
                                            </h3>
                                            <KeyValue
                                                truncate
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
                                                    <KeyValue title="Token amount" value={i.tokenamount} />
                                                )}
                                            </div>
                                            <KeyValue truncate clipboard title="Coin ID" value={i.coinid} />
                                            <KeyValue truncate clipboard title="Token ID" value={i.tokenid} />
                                            <KeyValue title="Spent" value={i.spent ? 'Yes' : 'No'} />
                                            <KeyValue title="Storing state" value={i.storestate ? 'Yes' : 'No'} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {_transaction && !!_transaction.stateVars.length && (
                            <div>
                                <div
                                    onClick={() => setShowStates((prevState) => !prevState)}
                                    className={`bg-white text-black p-4 flex items-center justify-between rounded-lg font-semibold ${
                                        !_showStates ? '' : 'rounded-b-none'
                                    }`}
                                >
                                    State Variables
                                    <svg
                                        className={`fill-black ${!_showStates ? 'arrow-active' : 'arrow-passive'}`}
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
                                    {_transaction &&
                                        _transaction.stateVars.map((i, index) => (
                                            <li key={i + index} className="divide-y-2">
                                                <h3 className="text-black font-semibold text-sm pb-2 mx-4 underline pt-2">
                                                    Port <span className="font-bold green-good">{i.port}</span>
                                                </h3>

                                                <KeyValue title="Type" value={i.type + ''} />
                                                <KeyValue
                                                    truncate={false}
                                                    clipboard
                                                    title="Data"
                                                    value={i.data.replace(/[\[\]]+/gi, ' ')}
                                                />
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AnimatedDialog>
    );
};

export default Detail;
