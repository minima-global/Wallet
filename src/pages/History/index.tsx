import React, { useContext, useEffect, useRef, useState } from 'react';
import { appContext } from '../../AppContext';
import Grid from '../../components/UI/Grid';
import { animated, config, useSpring } from 'react-spring';

import { downloadAllAsCsv } from '../../shared/utils/jsonToCsv';

import _ from 'lodash';
import { format, isToday, isYesterday } from 'date-fns';
import { getTxPOWDetailsType } from '../../shared/utils';
import identifyLeadingAmount from '../../shared/utils/_txpowHelperFunctions/identifyLeadingAmount';
import HistoryTransactionDetailSimple from '../HistoryTransactionDetailSimple';
import Decimal from 'decimal.js';
import useFormatMinimaNumber from '../../__minima__/libs/utils/useMakeNumber';
import ComposableModal from '../components/ComposableModal';
import { createPortal } from 'react-dom';
import Cross from '../components/Cross';

const History = () => {
    const {
        _currentPage,
        setCurrentPage,
        setOpenDrawer,
        getHistory,
        loaded,
        _historyDetails,
        _historyTransactions,
        promptTransactionDetails,
        _promptTransactionDetails,
    } = useContext(appContext);

    const [_promptAllDialog, setPromptAllDialog] = useState(false);

    const [working, setWorking] = useState(false);
    const [historySize, setHistorySize] = useState(0);
    const [dropDownMenu, setDropDownMenu] = useState(false); // State to track the index of the item with an open dropdown
    const dropdownRef = useRef(null); // Ref to the dropdown menu

    const toggleDropdown = () => {
        setDropDownMenu((prevState) => !prevState);
    };

    const promptAllDialog = () => {
        setPromptAllDialog((prevState) => !prevState);
    };

    const springProps = useSpring({
        opacity: _promptAllDialog ? 1 : 0,
        transform: _promptAllDialog ? 'translateY(0%) scale(1)' : 'translateY(-50%) scale(0.8)',
        config: config.stiff,
    });

    useEffect(() => {
        if (loaded.current === true) {
            (window as any).MDS.cmd('history action:size', (resp: any) => {
                if (resp.status) {
                    setHistorySize(resp.response.size);
                }
            });

            getHistory(20, _currentPage);
        }
    }, [loaded.current, _currentPage]);

    // Function to close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            // @ts-ignore
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropDownMenu(false); // Close dropdown when clicking outside the dropdown menu
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const zippedArrays = _historyTransactions.map((transaction: any, index: any) => ({
        transaction,
        details: _historyDetails[index], // Assuming anotherArray has corresponding items
    }));

    // Group transactions by date using Lodash _.groupBy()
    const groupedTransactions = _.groupBy(zippedArrays, (transaction) => {
        // Extract the time in milliseconds and convert it to a Date object
        const date = new Date(parseInt(transaction.transaction.header.timemilli, 10));
        const now = new Date();

        // Check if the date is today
        if (isToday(date)) {
            return `${format(date, 'EEEE do')}`;
        }

        // Check if the date is yesterday
        if (isYesterday(date)) {
            return 'Yesterday';
        }

        // Check if the date is from the previous year
        const yearDiff = now.getFullYear() - date.getFullYear();
        if (yearDiff > 0) {
            return format(date, 'MMMM do yyyy');
        }

        // Format the date as "Monday 11th" for other cases
        return format(date, 'MMMM do');
    });

    const handleDownloadPage = () => {
        const transactions = _historyTransactions.map((_transaction: any, index: number) => {
            const amount =
                identifyLeadingAmount(_historyDetails[index]) === '0'
                    ? '-'
                    : identifyLeadingAmount(_historyDetails[index]);
            const txpowid = _transaction.txpowid;
            const sentToMx = _transaction.body.txn.outputs[0].miniaddress;
            const sentTo0x = _transaction.body.txn.outputs[0].address;
            const date = format(parseInt(_transaction.header.timemilli), "MMMM do yyyy 'at' h:mm a");
            const type =
                getTxPOWDetailsType(_historyDetails[index].details) === 'normal'
                    ? 'Value Transfer'
                    : getTxPOWDetailsType(_historyDetails[index].details) === 'custom'
                    ? 'Custom'
                    : 'Token Creation';
            const blockPosted = _transaction.header.block;
            const burn = parseInt(_transaction.burn) > 0 ? _transaction.burn : '0';
            const fullJson = JSON.stringify(_transaction);

            return {
                amount,
                txpowid,
                sentToMx,
                sentTo0x,
                date,
                type,
                blockPosted,
                burn,
                fullJson,
            };
        });

        downloadAllAsCsv(transactions);
    };
    const handleDownloadAll = async () => {
        setWorking(true);
        return new Promise((resolve, reject) => {
            (window as any).MDS.cmd('history max:1000', (resp: any) => {
                if (!resp.status) reject('Failed to fetch history');
                const { txpows, details, size } = resp.response;
                const transactions = txpows.map((_transaction: any, index: number) => {
                    const amount =
                        identifyLeadingAmount(details[index]) === '0' ? '-' : identifyLeadingAmount(details[index]);
                    const txpowid = _transaction.txpowid;
                    const sentToMx = _transaction.body.txn.outputs[0].miniaddress;
                    const sentTo0x = _transaction.body.txn.outputs[0].address;
                    const date = format(parseInt(_transaction.header.timemilli), "MMMM do yyyy 'at' h:mm a");
                    const type =
                        getTxPOWDetailsType(details[index].details) === 'normal'
                            ? 'Value Transfer'
                            : getTxPOWDetailsType(details[index].details) === 'custom'
                            ? 'Custom'
                            : 'Token Creation';
                    const blockPosted = _transaction.header.block;
                    const burn = parseInt(_transaction.burn) > 0 ? _transaction.burn : '0';
                    const fullJson = JSON.stringify(_transaction);

                    return {
                        amount,
                        txpowid,
                        sentToMx,
                        sentTo0x,
                        date,
                        type,
                        blockPosted,
                        burn,
                        fullJson,
                    };
                });
                downloadAllAsCsv(transactions);
                resolve(size);
            });
        });
    };

    return (
        <>
            {_promptAllDialog &&
                createPortal(
                    <ComposableModal dismiss={promptAllDialog}>
                        <div className="grid grid-rows-[80px_1fr] mx-4 md:mx-0">
                            <div />
                            <animated.div style={springProps}>
                                <div className="bg-white shadow-md text-black pb-2 px-4 rounded grid grid-rows-[min-content_minmax(0,_260px)_auto]">
                                    <div className="grid grid-cols-[1fr_auto] py-4">
                                        <h3 className="font-bold text-black">Download Transaction History</h3>
                                        {!working && <Cross dismiss={promptAllDialog} />}
                                    </div>
                                    <div>
                                        <p>
                                            You have <b>{historySize}</b> transactions in total.  You can download up to 1000 transactions.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-[1fr_auto]">
                                        <div />

                                        <div className="grid grid-cols-[minmax(0,_128px)_minmax(0,_128px)] gap-2 py-4">
                                            {working && <div />}
                                            {!working && (
                                                <button onClick={promptAllDialog} className="px-3 py-2 border rounded">
                                                    Cancel
                                                </button>
                                            )}
                                            <button
                                                onClick={async () => {
                                                    await handleDownloadAll();
                                                    setWorking(false);
                                                }}
                                                className="disabled:bg-opacity-10 px-3 py-2 font-bold bg-black text-white rounded"
                                            >
                                                {working ? (
                                                    <div className="flex justify-center items-center">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="animate-spin"
                                                            width="32"
                                                            height="32"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="1.5"
                                                            stroke="#FFA010"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                            <path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" />
                                                            <path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" />
                                                            <path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" />
                                                            <path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" />
                                                            <path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" />
                                                        </svg>
                                                    </div>
                                                ) : (
                                                    'Download'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </animated.div>
                        </div>
                    </ComposableModal>,
                    document.body
                )}
            {_promptTransactionDetails && <HistoryTransactionDetailSimple />}

            <Grid
                title={
                    <>
                        <svg
                            onClick={(e: any) => {
                                e.stopPropagation();
                                setOpenDrawer(true);
                            }}
                            className="block md:hidden fill-white"
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 -960 960 960"
                            width="24"
                        >
                            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                        </svg>
                        History
                    </>
                }
                variant="lg"
            >
                <>
                    {!_historyTransactions.length && (
                        <div>
                            <p className="text-center text-opacity-50">No transactions were recorded yet</p>
                        </div>
                    )}
                    {!!_historyTransactions.length && (
                        <div className="bg-white overflow-y-scroll p-4 pt-0 px-0 mx-4 rounded mb-4 md:mx-2">
                            <div className="px-4 sticky top-0 bg-white py-4 shadow-sm flex items-center justify-between">
                                {/* <input
                                    value={filterText}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)}
                                    type="search"
                                    className="appearance-none border-none w-full bg-violet-500 bg-opacity-10 py-3 rounded text-sm placeholder:text-purple-300"
                                    placeholder="Search by txpowid or token name"
                                /> */}
                                <div />
                                <div onClick={toggleDropdown} className="flex items-center justift-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="#000000"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                        <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                        <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                    </svg>
                                    {dropDownMenu && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute right-0 mt-2 top-[30px] w-auto max-w-[200px] bg-white z-[25] border border-gray-200 rounded-md shadow-md"
                                        >
                                            <a
                                                className="cursor-pointer block p-2 py-4 text-sm text-center text-gray-800 w-[200px] hover:bg-violet-300 hover:bg-opacity-10"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent click on dropdown from closing the dropdown
                                                    handleDownloadPage();
                                                }}
                                            >
                                                Download Page
                                            </a>
                                            <a
                                                className="cursor-pointer block p-2 py-4 text-sm text-center text-gray-800 w-[200px] hover:bg-violet-300 hover:bg-opacity-10"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent click on dropdown from closing the dropdown
                                                    promptAllDialog();
                                                }}
                                            >
                                                Download All
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {Object.entries(groupedTransactions).map(([date, transactions], index) => (
                                <div className="my-4" key={index}>
                                    <h2 className="px-4 bg-violet-300 text-sm font-bold">{date}</h2>
                                    <TransactionList
                                        viewTransaction={promptTransactionDetails}
                                        transactions={transactions}
                                    />
                                </div>
                            ))}

                            {historySize > 20 && (
                                <div className="grid gap-2 grid-cols-[1fr_minmax(0,_360px)_1fr] mx-4">
                                    <div />
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            disabled={_currentPage === 1}
                                            className="bg-purple-400 font-bold text-white px-4 py-2 rounded-lg disabled:bg-purple-100 disabled:text-violet-200"
                                            onClick={() => setCurrentPage((prevState: any) => prevState - 1)}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            disabled={_historyTransactions.length < 20}
                                            className="bg-purple-400 font-bold text-white px-4 py-2 rounded-lg disabled:font-bold disabled:bg-purple-100 disabled:text-violet-200"
                                            onClick={() => setCurrentPage((prevState: any) => prevState + 1)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div />
                                </div>
                            )}
                        </div>
                    )}
                </>
            </Grid>
        </>
    );
};

export default History;

function TransactionList({ transactions, viewTransaction }: any) {
    const { makeMinimaNumber } = useFormatMinimaNumber();
    return (
        <ul>
            {transactions.map((transaction: any, index: number) => (
                <li
                    onClick={() => viewTransaction(transaction)}
                    key={index}
                    className="flex border-b border-gray-200 py-4 px-6 transition duration-300 ease-in-out hover:bg-gray-50"
                >
                    <div className="flex items-center gap-1">
                        <TransactionIcon transactionDetail={transaction.details} />
                        <div>
                            <h1 className="font-bold">
                                {transaction.transaction.body.txn.outputs[0].tokenid === '0x00'
                                    ? 'Minima'
                                    : transaction.transaction.body.txn.outputs[0].token &&
                                      transaction.transaction.body.txn.outputs[0].token.name &&
                                      typeof transaction.transaction.body.txn.outputs[0].token.name.name === 'string'
                                    ? transaction.transaction.body.txn.outputs[0].token.name.name
                                    : 'N/A'}
                            </h1>
                            <p>
                                {identifyLeadingAmount(transaction.details) === '0'
                                    ? '-'
                                    : Number(identifyLeadingAmount(transaction.details)) &&
                                      new Decimal(identifyLeadingAmount(transaction.details)).abs().greaterThan(0)
                                    ? makeMinimaNumber(identifyLeadingAmount(transaction.details), 2000)
                                    : ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 text-right">
                        <p className="text-sm font=bold">
                            {format(parseInt(transaction.transaction.header.timemilli), 'hh:mm a')}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
}

const TransactionIcon = ({ transactionDetail }: any) => {
    return (
        <>
            {getTxPOWDetailsType(transactionDetail) === 'normal' &&
                identifyLeadingAmount(transactionDetail).substring(0, 1) === '-' && (
                    <svg
                        className="fill-black"
                        width="45"
                        height="45"
                        viewBox="0 0 45 45"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="22.2568" cy="22.6328" r="21.5" stroke="white" />
                        <path
                            d="M12.7941 27.7531C11.8112 27.7531 10.9692 27.5392 10.2684 27.1115C9.56758 26.6791 9.0283 26.0784 8.65058 25.3093C8.27741 24.5402 8.09082 23.6482 8.09082 22.6334C8.09082 21.6186 8.27741 20.7266 8.65058 19.9575C9.0283 19.1884 9.56758 18.59 10.2684 18.1622C10.9692 17.7298 11.8112 17.5137 12.7941 17.5137C13.7771 17.5137 14.619 17.7298 15.3199 18.1622C16.0253 18.59 16.5645 19.1884 16.9377 19.9575C17.3154 20.7266 17.5043 21.6186 17.5043 22.6334C17.5043 23.6482 17.3154 24.5402 16.9377 25.3093C16.5645 26.0784 16.0253 26.6791 15.3199 27.1115C14.619 27.5392 13.7771 27.7531 12.7941 27.7531ZM12.7941 26.2036C13.454 26.2081 14.0024 26.0625 14.4393 25.7667C14.8807 25.4709 15.2107 25.0545 15.4291 24.5175C15.6521 23.9805 15.7636 23.3524 15.7636 22.6334C15.7636 21.9144 15.6521 21.2909 15.4291 20.763C15.2107 20.2305 14.8807 19.8164 14.4393 19.5206C14.0024 19.2248 13.454 19.0723 12.7941 19.0632C12.1343 19.0587 11.5859 19.2043 11.149 19.5001C10.7121 19.7959 10.3822 20.2123 10.1592 20.7493C9.94075 21.2863 9.83153 21.9144 9.83153 22.6334C9.83153 23.3524 9.94075 23.9782 10.1592 24.5106C10.3776 25.0385 10.7053 25.4504 11.1422 25.7462C11.5836 26.042 12.1343 26.1945 12.7941 26.2036Z"
                            fill="white"
                        />
                        <path
                            d="M23.0954 27.7531C22.3126 27.7531 21.6232 27.5939 21.027 27.2753C20.4354 26.9567 19.9712 26.5085 19.6344 25.9305C19.3022 25.3526 19.1361 24.6745 19.1361 23.8963V17.7321L20.8017 17.7185V23.8553C20.8017 24.2239 20.8632 24.5539 20.986 24.8451C21.1135 25.1364 21.2841 25.3844 21.498 25.5892C21.7119 25.7894 21.9577 25.9419 22.2353 26.0466C22.5129 26.1512 22.7996 26.2036 23.0954 26.2036C23.4003 26.2036 23.6893 26.1512 23.9623 26.0466C24.2399 25.9373 24.4857 25.7826 24.6996 25.5824C24.9134 25.3776 25.0818 25.1296 25.2047 24.8383C25.3276 24.547 25.389 24.2194 25.389 23.8553V17.7185H27.0546V23.8963C27.0546 24.6745 26.8862 25.3526 26.5495 25.9305C26.2173 26.5085 25.7531 26.9567 25.1569 27.2753C24.5653 27.5939 23.8781 27.7531 23.0954 27.7531Z"
                            fill="white"
                        />
                        <path
                            d="M31.5972 27.5483V19.2612H28.4162V17.7185H36.4234V19.2612H33.2424V27.5483H31.5972Z"
                            fill="white"
                        />
                    </svg>
                )}

            {getTxPOWDetailsType(transactionDetail) === 'normal' &&
                identifyLeadingAmount(transactionDetail).substring(0, 1) !== '-' && (
                    <svg
                        className="fill-black"
                        width="45"
                        height="45"
                        viewBox="0 0 45 45"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="22.8809" cy="22.6328" r="21.5" stroke="white" />
                        <path d="M16.9541 27.5486V17.7188H18.5992V27.5486H16.9541Z" fill="white" />
                        <path
                            d="M20.9171 27.5486V17.7188H22.5827L27.1427 24.6475V17.7188H28.8083V27.5486H27.1427L22.5827 20.6199V27.5486H20.9171Z"
                            fill="white"
                        />
                    </svg>
                )}

            {getTxPOWDetailsType(transactionDetail) === 'tokencreate' && (
                <svg
                    className="fill-black my-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    height="45"
                    viewBox="0 -960 960 960"
                    width="45"
                >
                    <path d="M560-120q-17 0-28.5-11.5T520-160q0-17 11.5-28.5T560-200q47 0 83.5-18.5T680-260q0-14-13-26t-36-22l59-59q32 19 51 45t19 62q0 66-63 103t-137 37ZM183-426q-29-17-46-39.5T120-520q0-42 31-70.5T262-654q63-29 80.5-40.5T360-720q0-16-19.5-28T280-760q-25 0-42 6t-31 20q-11 11-27 13t-29-9q-13-10-15-26t9-29q19-23 54.5-39t80.5-16q72 0 116 32.5t44 87.5q0 39-29 70t-117 69q-58 25-76 37t-18 24q0 9 11.5 17.5T243-486l-60 60Zm571-118L584-714l42-42q24-24 57.5-24t56.5 24l56 56q24 23 24 56.5T796-586l-42 42ZM240-200h56l288-288-56-56-288 288v56Zm-80 80v-170l368-368 170 170-368 368H160Zm368-424 56 56-56-56Z" />
                </svg>
            )}
            {getTxPOWDetailsType(transactionDetail) === 'custom' && (
                <svg
                    className="fill-black"
                    width="45"
                    height="45"
                    viewBox="0 0 45 45"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="22.248" cy="22.9297" r="21.5" stroke="white" />
                    <path
                        d="M22.334 30.6233C21.2881 30.6233 20.3282 30.437 19.4543 30.0645C18.5804 29.6921 17.821 29.162 17.1763 28.4743C16.5316 27.7723 16.0302 26.9485 15.672 26.0029C15.3282 25.0573 15.1562 24.0186 15.1562 22.8868C15.1562 21.8123 15.3425 20.8166 15.715 19.8997C16.1018 18.9685 16.6319 18.1518 17.3053 17.4498C17.9786 16.7478 18.7594 16.2034 19.6477 15.8166C20.536 15.4297 21.4959 15.2363 22.5274 15.2363C23.258 15.2363 23.9672 15.3509 24.6549 15.5802C25.3569 15.7951 25.9873 16.1031 26.546 16.5042C27.1191 16.8911 27.5847 17.3352 27.9429 17.8366L26.3956 19.4484C25.9801 19.0329 25.5575 18.6891 25.1277 18.4169C24.7122 18.1303 24.2824 17.9154 23.8383 17.7722C23.4085 17.6289 22.9715 17.5573 22.5274 17.5573C21.8254 17.5573 21.1663 17.6934 20.5503 17.9656C19.9486 18.2235 19.4185 18.5888 18.96 19.0616C18.5159 19.5344 18.1649 20.1003 17.907 20.7593C17.6491 21.404 17.5202 22.1132 17.5202 22.8868C17.5202 23.7035 17.6419 24.4484 17.8855 25.1218C18.1434 25.7808 18.5016 26.3467 18.96 26.8195C19.4185 27.2923 19.9629 27.6576 20.5933 27.9155C21.238 28.1591 21.9471 28.2809 22.7208 28.2809C23.1936 28.2809 23.6592 28.2164 24.1177 28.0875C24.5761 27.9585 25.0059 27.7723 25.4071 27.5287C25.8082 27.2852 26.1735 26.9986 26.5031 26.6691L27.6635 28.5602C27.334 28.9471 26.8827 29.2981 26.3096 29.6133C25.7509 29.9284 25.1205 30.1792 24.4185 30.3654C23.7308 30.5373 23.036 30.6233 22.334 30.6233Z"
                        fill="white"
                    />
                </svg>
            )}
        </>
    );
};
