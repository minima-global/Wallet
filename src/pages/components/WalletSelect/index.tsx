import { useState, useEffect, useContext } from 'react';

import styles from './WalletSelect.module.css';
import { MinimaToken } from '../../../@types/minima';

import { containsText } from '../../../shared/functions';
import { useFormikContext } from 'formik';
import Input from '../../../components/UI/Input';
import { useSearchParams } from 'react-router-dom';
import NFTAuthenticity from '../tokens/NFTAuthenticity';
import { appContext } from '../../../AppContext';
import { createPortal } from 'react-dom';

import Grid from '../../../components/UI/Grid';
import CardContent from '../../../components/UI/CardContent';

import useFormatMinimaNumber from '../../../__minima__/libs/utils/useMakeNumber';
import Token from '../Token';
import TokenHelp from '../../../components/UI/TokenHelp';

const WalletSelect = () => {
    const { balance } = useContext(appContext);

    const [filterText, setFilterText] = useState('');
    const [active, setActive] = useState(false);
    const { makeMinimaNumber } = useFormatMinimaNumber();

    const [tokenInformation, setTokenInformation] = useState<
        false | { confirmed: string; sendable: string; unconfirmed: string }
    >(false);
    const formik: any = useFormikContext();

    const [searchParams] = useSearchParams();

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
                                onClick={(e: any) => e.stopPropagation()}
                                className="bg-white bg-opacity-80"
                                header={
                                    <>
                                        <input
                                            value={filterText}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setFilterText(e.target.value)
                                            }
                                            type="search"
                                            className="focus:outline-none border hover:border-neutral-200 px-4 py-3 rounded-md bg-neutral-50 "
                                            placeholder="Search by token name or id"
                                        />
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
                                                            filterText
                                                        ) || containsText(t.tokenid, filterText)
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
                                                        filterText
                                                    ) || containsText(t.tokenid, filterText)
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
