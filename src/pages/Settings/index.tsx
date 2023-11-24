import { useContext, useEffect, useState } from 'react';
import Grid from '../../components/UI/Grid';
import { appContext } from '../../AppContext';
import CardContent from '../../components/UI/CardContent';
import { createPortal } from 'react-dom';

import * as utilities from '../../utilities';
import formatNumber from 'format-number';
import Decimal from 'decimal.js';
import Button from '../../components/UI/Button';
import { CircularProgress } from '@mui/material';

const Settings = () => {
    const { setOpenDrawer, updateCurrencyFormat, _currencyFormat } = useContext(appContext);
    const [showCurrencyFormatter, setShowCurrencyFormatter] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updated, setUpdate] = useState(false);

    useEffect(() => {
        setDecimalSeparator(_currencyFormat.decimal);
        setThousandSeparator(_currencyFormat.thousands);
    }, []);

    const [decimalSeparator, setDecimalSeparator] = useState('.');
    const [thousandSeparator, setThousandSeparator] = useState('');

    const handleDecimalChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        const value = evt.target.value;

        if (value === ',' && thousandSeparator === ',') {
            setThousandSeparator('.');
        }

        if (value === '.' && thousandSeparator === '.') {
            setThousandSeparator(',');
        }

        setDecimalSeparator(value);
    };
    const handleThousandChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        const value = evt.target.value;

        if (value === ',' && decimalSeparator === ',') {
            setDecimalSeparator('.');
        }

        if (value === '.' && thousandSeparator === '.') {
            setDecimalSeparator(',');
        }

        setThousandSeparator(value);
    };

    return (
        <Grid
            variant="lg"
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
                    Settings
                </>
            }
        >
            <>
                <CardContent
                    header={<></>}
                    content={
                        <>
                            {showCurrencyFormatter &&
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
                                                            setShowCurrencyFormatter(false);
                                                        }}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="24"
                                                        viewBox="0 -960 960 960"
                                                        width="24"
                                                    >
                                                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                                    </svg>
                                                    Currency Formatter
                                                </>
                                            }
                                        >
                                            <div className="flex flex-col gap-4 mx-4 rounded bg-white bg-opacity-90 p-4 mb-4 shadow-sm">
                                                <h3 className="font-semibold">Display as</h3>
                                                <div className="font-mono text-center bg-white rounded-lg py-6 px-4 text-yellow-500 font-bold">
                                                    {formatNumber({
                                                        prefix: '',
                                                        truncate: 3,
                                                        decimal: decimalSeparator,

                                                        integerSeparator: thousandSeparator,
                                                        suffix:
                                                            utilities.getCharacterCountAfterChar(
                                                                new Decimal('1000000.956').toString(),
                                                                '.'
                                                            ) > 3
                                                                ? '...'
                                                                : '',
                                                    })(new Decimal('1000000.956').toNumber())}
                                                </div>

                                                <div className="bg-white px-4 py-2 rounded-lg flex justify-between items-center">
                                                    <label htmlFor="thousands">Thousands Separator</label>
                                                    <select
                                                        disabled={loading}
                                                        className="min-w-[80px] font-bold rounded-lg"
                                                        name="thousands"
                                                        value={thousandSeparator}
                                                        onChange={handleThousandChange}
                                                    >
                                                        <option>.</option>
                                                        <option>,</option>
                                                        <option> </option>
                                                    </select>
                                                </div>

                                                <div className="bg-white px-4 py-2 rounded-lg flex justify-between items-center">
                                                    <label htmlFor="decimal">Decimal Separator</label>
                                                    <select
                                                        disabled={loading}
                                                        className="min-w-[80px] font-bold rounded-lg"
                                                        name="decimal"
                                                        value={decimalSeparator}
                                                        onChange={handleDecimalChange}
                                                    >
                                                        <option>.</option>
                                                        <option>,</option>
                                                    </select>
                                                </div>

                                                <Button
                                                    disabled={loading}
                                                    onClick={() => {
                                                        setLoading(true);
                                                        updateCurrencyFormat(decimalSeparator, thousandSeparator);

                                                        setTimeout(() => {
                                                            setLoading(false);
                                                            setUpdate(true);
                                                        }, 2000);

                                                        setTimeout(() => setUpdate(false), 5000);
                                                    }}
                                                >
                                                    {!loading && 'Update'}
                                                    {loading && <CircularProgress size={16} />}
                                                </Button>

                                                {updated && (
                                                    <div className="flex items-center gap-1 justify-center">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="2"
                                                            stroke="green"
                                                            fill="none"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                        >
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                            <path d="M5 12l5 5l10 -10" />
                                                        </svg>
                                                        Updated!
                                                    </div>
                                                )}
                                            </div>
                                        </Grid>
                                    </div>,
                                    document.body
                                )}

                            <ul>
                                <li
                                    onClick={() => setShowCurrencyFormatter(true)}
                                    className="flex items-center gap-2 bg-white rounded-lg px-2 py-3 hover:bg-opacity-50 hover:cursor-pointer"
                                >
                                    <div className="bg-yellow-300 rounded-full p-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            stroke-width="2"
                                            stroke="currentColor"
                                            fill="none"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        >
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M16.007 7.54a5.965 5.965 0 0 0 -4.008 -1.54a6 6 0 0 0 -5.992 6c0 3.314 2.682 6 5.992 6a5.965 5.965 0 0 0 4 -1.536" />
                                            <path d="M12 20v-2" />
                                            <path d="M12 6v-2" />
                                        </svg>
                                    </div>
                                    <div className="grid grid-cols-[1fr_auto] w-full">
                                        <h3 className="">Format currency display</h3>
                                        <svg
                                            className="w-[20px] h-[20px]"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            stroke-width="2"
                                            stroke="currentColor"
                                            fill="none"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        >
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M9 6l6 6l-6 6" />
                                        </svg>
                                    </div>
                                </li>
                            </ul>
                        </>
                    }
                ></CardContent>
            </>
        </Grid>
    );
};

export default Settings;
