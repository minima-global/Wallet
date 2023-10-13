import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { appContext } from '../../AppContext';

import Grid from '../../components/UI/Grid';
import Input from '../../components/UI/Input';
import CardContent from '../../components/UI/CardContent';

import { format, isSameWeek, isSameYear } from 'date-fns';

const History = () => {
    const navigate = useNavigate();
    const { historyFacade, setOpenDrawer, getHistory, loaded } = useContext(appContext);

    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        if (loaded.current === true) {
            getHistory();
        }
    }, [loaded.current]);

    const createElement = () => {
        const elements = [];
        let counter = 0;

        for (const key in historyFacade) {
            // should year be displayed for this item?
            const shouldDisplayYear = historyFacade[key][0]
                ? isSameYear(new Date(), new Date(parseInt(historyFacade[key][0].timeMilli)))
                : false;

            // should we show weekday or month day?
            const shouldShowWeekDay = historyFacade[key][0]
                ? isSameWeek(new Date(), new Date(parseInt(historyFacade[key][0].timeMilli)))
                : false;
            counter++;

            const displayDate = `${format(
                parseInt(historyFacade[key][0].timeMilli),
                `${shouldShowWeekDay ? 'EEEE dd' : 'MMM dd'} ${!shouldDisplayYear ? ' yyyy' : ''}`
            )}`;

            if (
                historyFacade[key] &&
                historyFacade[key].filter(
                    (_t: any) => _t.txpowid.includes(filterText) || _t.tokenName.includes(filterText)
                ).length > 0
            ) {
                elements.push(
                    <React.Fragment key={Math.random()}>
                        {historyFacade[key] &&
                            historyFacade[key].filter(
                                (_t: any) => _t.txpowid.includes(filterText) || _t.tokenName.includes(filterText)
                            ).length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-black mt-2 mb-2">{displayDate}</h3>

                                    <ul className="flex flex-col gap-2">
                                        {historyFacade[key] &&
                                            historyFacade[key]
                                                .filter(
                                                    (_t: any) =>
                                                        _t.txpowid.includes(filterText) ||
                                                        _t.tokenName.includes(filterText)
                                                )
                                                .map((t: any) => (
                                                    <li
                                                        key={t.txpowid}
                                                        onClick={() => navigate(t.txpowid)}
                                                        className="bg-white bg-opacity-80 p-4 rounded-lg grid grid-cols-[auto_1fr_auto] gap-2 hover:bg-slate-200 hover:cursor-pointer"
                                                    >
                                                        <div>
                                                            {t.type === 'Value Transfer' &&
                                                                t.amount.substring(0, 1) === '-' && (
                                                                    <svg
                                                                        className="fill-black"
                                                                        width="45"
                                                                        height="45"
                                                                        viewBox="0 0 45 45"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <circle
                                                                            cx="22.2568"
                                                                            cy="22.6328"
                                                                            r="21.5"
                                                                            stroke="white"
                                                                        />
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
                                                            {t.type === 'Value Transfer' &&
                                                                t.amount.substring(0, 1) !== '-' && (
                                                                    <svg
                                                                        className="fill-black"
                                                                        width="45"
                                                                        height="45"
                                                                        viewBox="0 0 45 45"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <circle
                                                                            cx="22.8809"
                                                                            cy="22.6328"
                                                                            r="21.5"
                                                                            stroke="white"
                                                                        />
                                                                        <path
                                                                            d="M16.9541 27.5486V17.7188H18.5992V27.5486H16.9541Z"
                                                                            fill="white"
                                                                        />
                                                                        <path
                                                                            d="M20.9171 27.5486V17.7188H22.5827L27.1427 24.6475V17.7188H28.8083V27.5486H27.1427L22.5827 20.6199V27.5486H20.9171Z"
                                                                            fill="white"
                                                                        />
                                                                    </svg>
                                                                )}
                                                            {t.type === 'Token Creation' && (
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
                                                            {t.type === 'Custom' && (
                                                                <svg
                                                                    className="fill-black"
                                                                    width="45"
                                                                    height="45"
                                                                    viewBox="0 0 45 45"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <circle
                                                                        cx="22.248"
                                                                        cy="22.9297"
                                                                        r="21.5"
                                                                        stroke="white"
                                                                    />
                                                                    <path
                                                                        d="M22.334 30.6233C21.2881 30.6233 20.3282 30.437 19.4543 30.0645C18.5804 29.6921 17.821 29.162 17.1763 28.4743C16.5316 27.7723 16.0302 26.9485 15.672 26.0029C15.3282 25.0573 15.1562 24.0186 15.1562 22.8868C15.1562 21.8123 15.3425 20.8166 15.715 19.8997C16.1018 18.9685 16.6319 18.1518 17.3053 17.4498C17.9786 16.7478 18.7594 16.2034 19.6477 15.8166C20.536 15.4297 21.4959 15.2363 22.5274 15.2363C23.258 15.2363 23.9672 15.3509 24.6549 15.5802C25.3569 15.7951 25.9873 16.1031 26.546 16.5042C27.1191 16.8911 27.5847 17.3352 27.9429 17.8366L26.3956 19.4484C25.9801 19.0329 25.5575 18.6891 25.1277 18.4169C24.7122 18.1303 24.2824 17.9154 23.8383 17.7722C23.4085 17.6289 22.9715 17.5573 22.5274 17.5573C21.8254 17.5573 21.1663 17.6934 20.5503 17.9656C19.9486 18.2235 19.4185 18.5888 18.96 19.0616C18.5159 19.5344 18.1649 20.1003 17.907 20.7593C17.6491 21.404 17.5202 22.1132 17.5202 22.8868C17.5202 23.7035 17.6419 24.4484 17.8855 25.1218C18.1434 25.7808 18.5016 26.3467 18.96 26.8195C19.4185 27.2923 19.9629 27.6576 20.5933 27.9155C21.238 28.1591 21.9471 28.2809 22.7208 28.2809C23.1936 28.2809 23.6592 28.2164 24.1177 28.0875C24.5761 27.9585 25.0059 27.7723 25.4071 27.5287C25.8082 27.2852 26.1735 26.9986 26.5031 26.6691L27.6635 28.5602C27.334 28.9471 26.8827 29.2981 26.3096 29.6133C25.7509 29.9284 25.1205 30.1792 24.4185 30.3654C23.7308 30.5373 23.036 30.6233 22.334 30.6233Z"
                                                                        fill="white"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h1 className="text-black">{t.tokenName}</h1>
                                                            <p className="text-black">
                                                                {t.amount === '0' ? '-' : t.amount}
                                                            </p>
                                                        </div>
                                                        <h3 className="text-black font-light text-sm">
                                                            {format(parseInt(t.timeMilli), 'hh:mm a')}
                                                        </h3>
                                                    </li>
                                                ))}
                                    </ul>
                                </div>
                            )}
                    </React.Fragment>
                );
            }
        }

        return elements;
    };

    createElement();

    return (
        <>
            <Outlet />
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
                    <CardContent
                        header={
                            <Input
                                id="search"
                                name="search"
                                disabled={false}
                                value={filterText}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)}
                                type="search"
                                placeholder="Search by txpowid or token name"
                            />
                        }
                        content={
                            <div className="flex flex-col gap-8">
                                <ul className="flex flex-col gap-2 divide-y divide-gray-200">
                                    {!historyFacade && loaded.current && (
                                        <p className="text-center text-black">No transactions recorded yet</p>
                                    )}
                                    {!historyFacade && !loaded.current && (
                                        <div className="flex justify-center items-center">
                                            <svg
                                                className="animate-spin"
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                viewBox="0 -960 960 960"
                                                width="24"
                                            >
                                                <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
                                            </svg>
                                        </div>
                                    )}

                                    {historyFacade && createElement()}
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
