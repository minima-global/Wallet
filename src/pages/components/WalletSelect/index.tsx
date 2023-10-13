import { useState, useEffect, useContext } from 'react';

import styles from './WalletSelect.module.css';
import { MinimaToken } from '../../../@types/minima';

import { CSSTransition } from 'react-transition-group';
import { containsText } from '../../../shared/functions';
import { useFormikContext } from 'formik';
import Input from '../../../components/UI/Input';
import { useSearchParams } from 'react-router-dom';
import NFTAuthenticity from '../tokens/NFTAuthenticity';
import { appContext } from '../../../AppContext';
import { createPortal } from 'react-dom';

import Grid from '../../../components/UI/Grid';
import CardContent from '../../../components/UI/CardContent';

const WalletSelect = () => {
    const { balance } = useContext(appContext);

    const [filterText, setFilterText] = useState('');
    const [active, setActive] = useState(false);
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
            {active &&
                createPortal(
                    <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
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
                                        <Input
                                            id="search"
                                            name="search"
                                            disabled={false}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setFilterText(e.target.value)
                                            }
                                            type="search"
                                            placeholder="Search token"
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
                                                    <li
                                                        onClick={() => handleSelection(t)}
                                                        className="hover:bg-slate-200 hover:cursor-pointer bg-white flex rounded-lg gap-4 truncate mb-4"
                                                        key={t.tokenid}
                                                    >
                                                        {t.tokenid === '0x00' && (
                                                            <div className="relative">
                                                                <svg
                                                                    className="absolute right-1 bottom-2"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    height="16"
                                                                    viewBox="0 -960 960 960"
                                                                    width="16"
                                                                >
                                                                    <path
                                                                        fill="#3DA2FF"
                                                                        d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z"
                                                                    />
                                                                </svg>
                                                                <svg
                                                                    className="rounded-l-lg min-h-[80px] min-w-[80px]"
                                                                    width="80"
                                                                    height="80"
                                                                    viewBox="0 0 80 81"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <rect
                                                                        width="80"
                                                                        height="80"
                                                                        transform="translate(0 0.550781)"
                                                                        fill="#08090B"
                                                                    />
                                                                    <path
                                                                        d="M52.3627 30.187L50.5506 37.9909L48.2331 28.5753L40.1133 25.3689L37.9178 34.8015L35.9836 23.7402L27.8638 20.5508L19.5 56.5508H28.3691L30.9305 45.4895L32.8646 56.5508H41.7512L43.9292 47.1182L46.2467 56.5508H55.1158L60.5 33.3764L52.3627 30.187Z"
                                                                        fill="white"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        )}

                                                        {t.tokenid !== '0x00' && (
                                                            <div className="relative">
                                                                <img
                                                                    className="rounded-l-lg w-[80px] h-[80px]"
                                                                    alt="token-icon"
                                                                    src={
                                                                        'url' in t.token && t.token.url.length
                                                                            ? t.token.url
                                                                            : `https://robohash.org/${t.tokenid}`
                                                                    }
                                                                />
                                                                {t.tokenid !== '0x00' &&
                                                                    t.token.webvalidate &&
                                                                    !!t.token.webvalidate.length && (
                                                                        <NFTAuthenticity tokenid={t.tokenid} />
                                                                    )}
                                                            </div>
                                                        )}

                                                        <div className="my-auto truncate max-w-[360px]">
                                                            {t.tokenid === '0x00' && (
                                                                <h6 className="font-bold truncate text-black">
                                                                    Minima
                                                                </h6>
                                                            )}
                                                            {t.tokenid !== '0x00' && (
                                                                <h6 className="font-bold text-black">
                                                                    {t.token && 'name' in t?.token
                                                                        ? t?.token.name
                                                                        : 'Name not available'}
                                                                </h6>
                                                            )}

                                                            <p className="font-normal truncate text-black">
                                                                {formik.values.coinSplit
                                                                    ? t.coins + ' coin(s) available'
                                                                    : t.sendable}
                                                            </p>
                                                        </div>
                                                    </li>
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
                                            ).length && <h4 className="text-center text-black">No results found</h4>}
                                    </>
                                }
                            />
                        </Grid>
                    </div>,
                    document.body
                )}

            {formik.values.token && (
                <>
                    <div
                        onClick={() => (formik.isSubmitting ? null : setActive(true))}
                        className={`${styles.select} hover:bg-slate-200 hover:cursor-pointer ${
                            formik.isSubmitting ? 'bg-slate-50' : ''
                        }`}
                    >
                        {formik.values.token.tokenid === '0x00' && (
                            <div className="relative">
                                <svg
                                    className="absolute right-1 bottom-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="16"
                                    viewBox="0 -960 960 960"
                                    width="16"
                                >
                                    <path
                                        fill="#3DA2FF"
                                        d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm94-278 226-226-56-58-170 170-86-84-56 56 142 142Z"
                                    />
                                </svg>
                                <svg
                                    className="rounded-l-lg min-h-[80px] min-w-[80px]"
                                    width="80"
                                    height="80"
                                    viewBox="0 0 80 81"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect width="80" height="80" transform="translate(0 0.550781)" fill="#08090B" />
                                    <path
                                        d="M52.3627 30.187L50.5506 37.9909L48.2331 28.5753L40.1133 25.3689L37.9178 34.8015L35.9836 23.7402L27.8638 20.5508L19.5 56.5508H28.3691L30.9305 45.4895L32.8646 56.5508H41.7512L43.9292 47.1182L46.2467 56.5508H55.1158L60.5 33.3764L52.3627 30.187Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                        )}
                        {formik.values.token.tokenid !== '0x00' && (
                            <div className="relative">
                                <img
                                    alt="token-icon"
                                    src={
                                        'url' in formik.values.token.token && formik.values.token.token.url.length
                                            ? formik.values.token.token.url
                                            : `https://robohash.org/${formik.values.token.tokenid}`
                                    }
                                />
                            </div>
                        )}
                        <div>
                            {formik.values.token.tokenid === '0x00' && <h6>Minima</h6>}
                            {formik.values.token.tokenid !== '0x00' && (
                                <h6>
                                    {formik.values.token && 'name' in formik.values.token.token
                                        ? formik.values.token.token.name
                                        : 'Name not available'}
                                </h6>
                            )}

                            <p>
                                {!formik.values.coinSplit
                                    ? formik.values.token.sendable
                                    : formik.values.token.coins + ' coin(s) available'}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default WalletSelect;
