import { useState, useEffect, useContext } from 'react';

import { MinimaToken } from '../../../@types/minima';

import { containsText } from '../../../shared/functions';
import { useFormikContext } from 'formik';
import { useSearchParams } from 'react-router-dom';
import { appContext } from '../../../AppContext';
import { createPortal } from 'react-dom';

import Grid from '../../../components/UI/Grid';
import CardContent from '../../../components/UI/CardContent';

import Token from '../Token';
import TokenHelp from '../../../components/UI/TokenHelp';
import { Search, X } from 'lucide-react';

const WalletSelect = () => {
    const { balance } = useContext(appContext);

    const [active, setActive] = useState(false);

    const [tokenInformation, setTokenInformation] = useState<
        false | { confirmed: string; sendable: string; unconfirmed: string }
    >(false);
    const formik: any = useFormikContext();

    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (balance.length && formik.values.token) {
            const currentToken = balance.find((t: MinimaToken) => t.tokenid === formik.values.token.tokenid);
            if (currentToken) {
                formik.setFieldValue('token', currentToken);
            }
        }
    }, [balance, formik.values]);

    useEffect(() => {
        const requestingAddress = searchParams.get('address');
        const requestingTokenID = searchParams.get('tokenid');
        const requestingAmount = searchParams.get('amount');
        const requestingBurn = searchParams.get('burn');
        if (balance.length) {
            if (requestingTokenID !== null) {
                const fetchToken = balance.find((t: MinimaToken) => t.tokenid === requestingTokenID);

                if (fetchToken) {
                    formik.setFieldValue('token', fetchToken);
                }
            }
        }

        if (requestingAddress !== null) {
            formik.setFieldValue('address', requestingAddress);
        }

        if (requestingAmount !== null) {
            formik.setFieldValue('amount', requestingAmount);
        }

        if (requestingBurn !== null) {
            formik.setFieldValue('burn', requestingBurn);
        }
    }, [balance, searchParams.get('tokenid'), searchParams.get('amount'), searchParams.get('burn')]);

    const handleSelection = (token: MinimaToken) => {
        formik.setFieldValue('token', token);

        setActive(false);
    };

    return (
        <>
            <TokenHelp
                tokenInformation={tokenInformation}
                display={tokenInformation}
                dismiss={() => setTokenInformation(false)}
            />

            {active &&
                createPortal(
                    <div
                        onClick={() => setActive(false)}
                        className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn"
                    >
                        <Grid
                            variant="lg"
                            title={
                                <>
                                    <svg
                                        className="fill-white hover:cursor-pointer"
                                        onClick={() => setActive(false)}
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24"
                                        viewBox="0 -960 960 960"
                                        width="24"
                                    >
                                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                    </svg>
                                    Select Token
                                </>
                            }
                        >
                            <CardContent
                                className="bg-white bg-opacity-80"
                                header={
                                    <>
                                        <div onClick={(e) => e.stopPropagation()} className="relative">
                                            <input
                                                type="text"
                                                placeholder="Search tokens"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full px-4 py-3 pl-10 pr-10 bg-white text-base text-gray-900 rounded
                                                            border border-gray-300
                                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                                            transition-all duration-200 ease-in-out"
                                                aria-label="Search tokens"
                                            />
                                            <Search
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                                                aria-hidden="true"
                                            />
                                            {searchTerm && (
                                                <button
                                                    onClick={() => setSearchTerm('')}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                                    aria-label="Clear search"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </>
                                }
                                content={
                                    <>
                                        <ul>
                                            {balance
                                                .filter(
                                                    (t: MinimaToken) =>
                                                        containsText(
                                                            t.tokenid === '0x00'
                                                                ? t.token
                                                                : 'name' in t.token
                                                                ? t.token.name
                                                                : '',
                                                            searchTerm
                                                        ) || containsText(t.tokenid, searchTerm)
                                                )
                                                .map((t: MinimaToken) => (
                                                    <Token
                                                        t={t}
                                                        setTokenInformation={setTokenInformation}
                                                        handleClick={() => handleSelection(t)}
                                                    />
                                                ))}
                                        </ul>

                                        {!!balance.length &&
                                            !balance.filter(
                                                (t: MinimaToken) =>
                                                    containsText(
                                                        t.tokenid === '0x00'
                                                            ? t.token
                                                            : 'name' in t.token
                                                            ? t.token.name
                                                            : '',
                                                        searchTerm
                                                    ) || containsText(t.tokenid, searchTerm)
                                            ).length && (
                                                <div className="flex justify-center">
                                                    <span className="text-center text-sm">No results found</span>
                                                </div>
                                            )}
                                    </>
                                }
                            />
                        </Grid>
                    </div>,
                    document.body
                )}

            {formik.values.token && (
                <>
                    <Token
                        t={formik.values.token}
                        setTokenInformation={setTokenInformation}
                        handleClick={() => (formik.isSubmitting ? null : setActive(true))}
                    />
                </>
            )}
        </>
    );
};

export default WalletSelect;
