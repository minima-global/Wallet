import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { appContext } from '../../AppContext';

import Grid from '../../components/UI/Grid';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import CardContent from '../../components/UI/CardContent';

const History = () => {
    const { history, historyFacade, setOpenDrawer, getHistory } = useContext(appContext);
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState('');

    // const isViewingTransactionDetail = useMatch('/history/:transactionid');
    // const [splitByMonths, setSplitByMonth] = useState<Map<
    //     string,
    //     { detail: types.DetailsTxPOW; txpow: types.TxPOW }[]
    // > | null>(null);

    // const [loading, setLoading] = useState(true);

    // const [paginationPageSize] = useState(20);
    // const [paginationPageNumber, setPaginationNumber] = useState(1);
    // const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
    //     setPaginationNumber(value);
    // };

    useEffect(() => {
        getHistory();
    }, []);

    console.log('Full history', history);
    console.log('History front', historyFacade);

    // useEffect(() => {
    //     if (history) {
    // const extractTxPOWS = Array.from(historyTxpows.values());

    // const split = extractByMonthAndDay(
    //     extractTxPOWS
    //         .slice()
    //         .sort((a, b) => b.txpow.header.timemilli.localeCompare(a.txpow.header.timemilli))
    //         .slice((paginationPageNumber - 1) * paginationPageSize, paginationPageSize * paginationPageNumber)
    // );

    // setSplitByMonth(split);
    // setLoading(false);
    //     }
    // }, [history, paginationPageNumber, paginationPageSize]);

    // const createElements = (arr: Map<string, { detail: types.DetailsTxPOW; txpow: types.TxPOW }[]>) => {
    //     let elements = [];

    //     let counter = 1;
    //     for (const [key, value] of arr) {
    //         const txpow = arr.get(key);
    //         let day = txpow && format(parseInt(txpow[0].txpow.header.timemilli), 'LLLL do');

    //         if (counter === 1) {
    //             day = txpow && format(parseInt(txpow[0].txpow.header.timemilli), 'iiii do');
    //         }

    //         elements.push(
    //             <React.Fragment key={key}>
    //                 <div className="month">{day}</div>
    //                 {value.map((t: { detail: types.DetailsTxPOW; txpow: types.TxPOW }) => (
    //                     <li
    //                         key={t.txpow.txpowid + 'key'}
    //                         onClick={() =>
    //                             navigate(t.txpow.txpowid, {
    //                                 state: {
    //                                     txpowid: t.txpow.txpowid,
    //                                 },
    //                             })
    //                         }
    //                     >
    //                         <Stack flexDirection="row" gap={2} sx={{ minWidth: 0 }} alignItems="center">
    //                             <TransactionHistoryType
    //                                 tokenName={
    //                                     t.txpow.body.txn.outputs[0].tokenid === '0x00'
    //                                         ? 'Minima'
    //                                         : t.txpow.body.txn.outputs[0].token
    //                                         ? t.txpow.body.txn.outputs[0].token.name.name
    //                                         : 'N/A'
    //                                 }
    //                                 amount={t.detail}
    //                                 address={t.txpow.body.txn.outputs[0].address}
    //                                 tokenid={t.txpow.body.txn.outputs[0].tokenid}
    //                             />
    //                         </Stack>
    //                         <MiTimeWrapper>
    //                             <p id="time">{format(parseInt(t.txpow.header.timemilli), 'hh:mm aa')}</p>
    //                         </MiTimeWrapper>
    //                     </li>
    //                 ))}
    //             </React.Fragment>
    //         );
    //         counter++;
    //     }

    //     return elements;
    // };
    // return (
    //     <Grid
    //         variant="lg"
    //         title={
    //             <>
    //                 <svg
    //                     onClick={() => setOpenDrawer(true)}
    //                     className="block md:hidden fill-white"
    //                     xmlns="http://www.w3.org/2000/svg"
    //                     height="24"
    //                     viewBox="0 -960 960 960"
    //                     width="24"
    //                 >
    //                     <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
    //                 </svg>
    //                 Transaction History
    //             </>
    //         }
    //     >
    //         <>
    //             {!isViewingTransactionDetail && (
    //                 <Card>
    //                     <div className="flex flex-col gap-1">
    //                         <div className="flex flex-col gap-2">
    //                             <Input
    //                                 id="search"
    //                                 name="search"
    //                                 value={filterText}
    //                                 onChange={(e: any) => setFilterText(e.target.value)}
    //                                 placeholder="Search history"
    //                                 type="text"
    //                                 disabled={false}
    //                             />
    //                         </div>

    //                         <div>
    //                             {!!history && (
    //                                 <MiTransactionList>
    //                                     {!filterText.length && splitByMonths && createElements(splitByMonths)}

    //                                     {!filterText.length && !history.size && (
    //                                         <NoResults>
    //                                             <h6>No transactions in your history yet</h6>
    //                                         </NoResults>
    //                                     )}

    //                                     {!filterText.length && history.size > paginationPageSize && (
    //                                         <Stack mt={5} alignItems="center">
    //                                             <Pagination
    //                                                 shape="rounded"
    //                                                 variant="outlined"
    //                                                 size="small"
    //                                                 count={Math.floor(history.size / paginationPageSize)}
    //                                                 page={paginationPageNumber}
    //                                                 onChange={handlePaginationChange}
    //                                             />
    //                                         </Stack>
    //                                     )}

    //                                     {!!filterText.length &&
    //                                         [...history.values()]
    //                                             .filter((t) => containsText(t.txpow.txpowid, filterText))
    //                                             .map((t) => (
    //                                                 <React.Fragment key={t.txpow.txpowid}>
    //                                                     <li
    //                                                         key={t.txpow.txpowid + 'key'}
    //                                                         onClick={() =>
    //                                                             navigate(t.txpow.txpowid, {
    //                                                                 state: {
    //                                                                     txpowid: t.txpow.txpowid,
    //                                                                 },
    //                                                             })
    //                                                         }
    //                                                     >
    //                                                         <Stack
    //                                                             flexDirection="row"
    //                                                             gap={2}
    //                                                             sx={{ minWidth: 0 }}
    //                                                             alignItems="center"
    //                                                         >
    //                                                             <TransactionHistoryType
    //                                                                 tokenName={
    //                                                                     t.txpow.body.txn.outputs[0].tokenid === '0x00'
    //                                                                         ? 'Minima'
    //                                                                         : t.txpow.body.txn.outputs[0].token
    //                                                                         ? t.txpow.body.txn.outputs[0].token.name
    //                                                                               .name
    //                                                                         : 'N/A'
    //                                                                 }
    //                                                                 amount={t.detail}
    //                                                                 address={t.txpow.body.txn.outputs[0].address}
    //                                                                 tokenid={t.txpow.body.txn.outputs[0].tokenid}
    //                                                             />
    //                                                         </Stack>

    //                                                         <MiTimeWrapper>
    //                                                             <p id="time">
    //                                                                 {format(
    //                                                                     parseInt(t.txpow.header.timemilli),
    //                                                                     'hh:mm aa'
    //                                                                 )}
    //                                                             </p>
    //                                                         </MiTimeWrapper>
    //                                                     </li>
    //                                                 </React.Fragment>
    //                                             ))}

    //                                     {!!filterText.length &&
    //                                         [...history.values()].filter((t) =>
    //                                             containsText(t.txpow.txpowid, filterText)
    //                                         ).length === 0 && (
    //                                             <NoResults>
    //                                                 <h6>No results</h6>
    //                                                 <p>Please try your search again.</p>
    //                                             </NoResults>
    //                                         )}
    //                                 </MiTransactionList>
    //                             )}
    //                             {!history && !loading && (
    //                                 <Stack alignItems="center" justifyItems="center">
    //                                     <NoResults>
    //                                         <h6>No transactions in your history yet</h6>
    //                                     </NoResults>
    //                                 </Stack>
    //                             )}
    //                             {!history && loading && (
    //                                 <Stack alignItems="center" justifyItems="center">
    //                                     <CircularProgress size={16} />
    //                                 </Stack>
    //                             )}
    //                         </div>
    //                     </div>
    //                 </Card>
    //             )}

    //             {isViewingTransactionDetail && !!history && <Outlet />}
    //         </>
    //     </Grid>
    // );

    return (
        <>
            <Outlet />
            <Grid
                title={
                    <>
                        <svg
                            onClick={() => setOpenDrawer(true)}
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
                    <CardContent
                        header={
                            <Input
                                id="search"
                                name="search"
                                disabled={false}
                                value={filterText}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)}
                                type="search"
                                placeholder="Search transaction by txpowid"
                            />
                        }
                        content={
                            <div className="flex flex-col gap-8">
                                <ul className="flex flex-col gap-2">
                                    {historyFacade && !historyFacade.length && <p>No transactions recorded yet</p>}
                                    {historyFacade &&
                                        historyFacade.map((t: any) => (
                                            <li
                                                onClick={() => navigate(t.txpowid)}
                                                className="bg-white bg-opacity-80 p-4 rounded-lg"
                                            >
                                                <div></div>
                                                <div>
                                                    <h1 className="text-black">{t.tokenName}</h1>
                                                    <p className="text-black">{t.amount}</p>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        }
                    ></CardContent>
                </>
            </Grid>
        </>
    );
};

export default History;
