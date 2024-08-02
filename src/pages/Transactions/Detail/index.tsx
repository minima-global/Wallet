import { useContext, useEffect, useState } from 'react';
import AnimatedDialog from '../../../components/UI/AnimatedDialog';
import CloseIcon from '../../../components/UI/Icons/CloseIcon';
import { appContext } from '../../../AppContext';
import KeyValue from '../../../components/UI/KeyValue';
import DetailsIcon from '../../../components/UI/Icons/DetailsIcon';
import InputOutputIcon from '../../../components/UI/Icons/StateIcon';
import StateIcon from '../../../components/UI/Icons/InputsIcon';
import CodeIcon from '../../../components/UI/Icons/CodeIcon';
import CSVIcon from '../../../components/UI/Icons/CSVIcon';
import { downloadCsv } from '../../../shared/utils/jsonToCsv';

interface Props {
    txpowid: string | false;
    dismiss: () => void;
}

const Detail = ({ txpowid, dismiss }: Props) => {
    const { historyDetails, history } = useContext(appContext);
    const [_viewFullJson, setViewJson] = useState(false);

    const [selectedOption, setSelectedOption] = useState('default');

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

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleExportingToCSV = () => {
        if (!_transaction) return;
        const transactionDetail = historyDetails.find((t: any) => t.txpowid === _transaction.txpowid);
        const { amount, txpowid, sentToMx, sentTo0x, date, type, blockPosted, burn } = transactionDetail;

        const fullJson = JSON.stringify(history.find((t: any) => t.txpowid === _transaction.txpowid));

        downloadCsv({ amount, txpowid, sentToMx, sentTo0x, date, type, blockPosted, burn, fullJson });
    };


    return (
        <AnimatedDialog display={!!txpowid} dismiss={dismiss}>
            <div className="modal-content">
                <div className="flex items-center justify-between p-4 border-b border-[#1B1B1B] dark:border-neutral-600">
                    <h3 className="font-bold text-lg">Transaction Details</h3>
                    <button onClick={dismiss} aria-label="Close">
                        <CloseIcon fill="currentColor" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-auto hide-scrollbar p-4 md:px-0">
                    <div className='flex'>
                        <div className='flex-grow'/>
                        <div>
                            <span onClick={handleExportingToCSV}>
                                <CSVIcon fill="currentColor" size={24} />
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                        {/* Custom Radio Buttons */}
                        <div className="my-3">
                            <fieldset>
                                <div className="grid grid-cols-4 gap-2">
                                    <label
                                        className={`justify-center text-sm p-4 flex-col rounded-lg sm:roundd-full sm:flex-row flex items-center transition-all ${
                                            selectedOption === 'default'
                                                ? 'bg-black dark:bg-black font-bold'
                                                : 'bg-neutral-200 dark:bg-[#1B1B1B]'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="option"
                                            value="default"
                                            checked={selectedOption === 'default'}
                                            onChange={handleOptionChange}
                                            className="hidden"
                                        />
                                        <span className={`ml-2 ${selectedOption === 'default' ? 'text-white' : ''}`}>
                                            <DetailsIcon fill="currentColor" size={24} />
                                        </span>
                                        <span className={`ml-2 ${selectedOption === 'default' ? 'text-white' : ''}`}>
                                            Details
                                        </span>
                                    </label>
                                    <label
                                        className={`justify-center text-sm flex-col rounded-lg sm:roundd-full sm:flex-row p-4 flex items-center transition-all ${
                                            selectedOption === 'inputsoutputs'
                                                ? 'bg-black dark:bg-black font-bold'
                                                : 'bg-neutral-200 dark:bg-[#1B1B1B]'
                                        } ${
                                            _transaction && !_transaction.inputs.length
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="option"
                                            value="inputsoutputs"
                                            disabled={_transaction && !_transaction.inputs.length ? true : false}
                                            checked={selectedOption === 'inputsoutputs'}
                                            onChange={handleOptionChange}
                                            className="hidden"
                                        />
                                        <span
                                            className={`ml-2 ${selectedOption === 'inputsoutputs' ? 'text-white' : ''}`}
                                        >
                                            <InputOutputIcon fill="currentColor" size={24} />
                                        </span>
                                        <span
                                            className={`ml-2 ${selectedOption === 'inputsoutputs' ? 'text-white' : ''}`}
                                        >
                                            In/Out
                                        </span>
                                    </label>
                                    <label
                                        className={`justify-center text-sm flex-col rounded-lg sm:roundd-full sm:flex-row p-4 flex items-center transition-all ${
                                            selectedOption === 'state'
                                                ? 'bg-black dark:bg-black font-bold'
                                                : 'bg-neutral-200 dark:bg-[#1B1B1B]'
                                        } ${
                                            _transaction && !_transaction.stateVars.length
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="option"
                                            value="state"
                                            disabled={_transaction && !_transaction.stateVars.length ? true : false}
                                            checked={selectedOption === 'state'}
                                            onChange={handleOptionChange}
                                            className="hidden"
                                        />
                                        <span className={`${selectedOption === 'state' ? 'text-white' : ''}`}>
                                            <StateIcon fill="currentColor" size={24} />
                                        </span>
                                        <span className={`ml-2 ${selectedOption === 'state' ? 'text-white' : ''}`}>
                                            State
                                        </span>
                                    </label>
                                    <label
                                        className={`justify-center text-sm flex-col rounded-lg sm:roundd-full sm:flex-row p-4 flex items-center transition-all ${
                                            selectedOption === 'json'
                                                ? 'bg-black dark:bg-black font-bold'
                                                : 'bg-neutral-200 dark:bg-[#1B1B1B]'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="option"
                                            value="json"
                                            checked={selectedOption === 'json'}
                                            onChange={handleOptionChange}
                                            className="hidden"
                                        />
                                        <span className={`${selectedOption === 'json' ? 'text-white' : ''}`}>
                                            <CodeIcon fill="currentColor" size={24} />
                                        </span>
                                    </label>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="flex flex-col gap-8">
                        {selectedOption === 'default' && (
                            <div className="flex flex-col gap-2">
                                <KeyValue
                                    truncate
                                    clipboard
                                    title="ID"
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
                                {_transaction?.stateVars
                                    ?.filter((t) => t.port === 44)
                                    .map((t, index) => (
                                        <KeyValue
                                            key={index} // Using index as the key since port is not unique within the array
                                            title="Message"
                                            value={decodeURIComponent(t.data).replace(/[\[\]]+/gi, ' ')}
                                        />
                                    ))}
                            </div>
                        )}

                        {selectedOption === 'inputsoutputs' && (
                            <div className="flex flex-col gap-2">
                                <h3 className="text-[#1B1B1B] dark:text-neutral-300 text-center">In</h3>
                                <ul>
                                    {_transaction?.inputs.map((i, index) => (
                                        <li key={i.coinid}>
                                            <div className="flex items-center justify-center mb-3">
                                                <hr className="border-[0.1px] border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                                                <span className="mx-4 text-center text-[#1B1B1B] dark:text-neutral-400 font-bold text-[12px] flex-shrink-0">
                                                    {index}
                                                </span>
                                                <hr className="border-[0.1px] border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                                            </div>

                                            <div className="space-y-2">
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
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <h3 className="text-[#1B1B1B] dark:text-neutral-300 text-center">Out</h3>
                                <ul>
                                    {_transaction?.outputs.map((i, index) => (
                                        <li key={i.coinid + index}>
                                            <div className="flex items-center justify-center mb-3">
                                                <hr className="border-[0.1px] border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                                                <span className="mx-4 text-center text-[#1B1B1B] dark:text-neutral-400 font-bold text-[12px] flex-shrink-0">
                                                    {index}
                                                </span>
                                                <hr className="border-[0.1px] border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                                            </div>

                                            <div className="space-y-2">
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
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {selectedOption === 'state' && (
                            <div className="flex flex-col gap-2">
                                <ul>
                                    {_transaction?.stateVars.map((i) => (
                                        <li key={i.port}>
                                            <div className="flex items-center justify-center mb-3">
                                                <hr className="border-[0.1px] border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                                                <span className="mx-4 text-center text-[#1B1B1B] dark:text-neutral-400 font-bold text-[12px] flex-shrink-0">
                                                    Variable {i.port}
                                                </span>
                                                <hr className="border-[0.1px] border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                                            </div>

                                            <div className="space-y-2">
                                                <KeyValue title="Type" value={i.type + ''} />
                                                
                                                <KeyValue
                                                    truncate={false}
                                                    clipboard
                                                    title="Data"
                                                    value={i.data.replace(/[\[\]]+/gi, ' ')}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {selectedOption === 'json' && (
                            <div className="flex flex-col gap-2">
                                
                                    <pre className="text-[#1B1B1B] dark:text-neutral-300 text-sm break-all max-h-[calc(100vh_-_56px)] font-bold">
                                        {JSON.stringify(
                                            history.find((t: any) => t.txpowid === txpowid),
                                            null,
                                            2
                                        )}
                                    </pre>
                                
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AnimatedDialog>
    );
};

export default Detail;
