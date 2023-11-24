import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { MinimaToken } from '../../../@types/minima';
import { containsText } from '../../../shared/functions';
import Input from '../../../components/UI/Input';
import NFTAuthenticity from '../tokens/NFTAuthenticity';
import { appContext } from '../../../AppContext';
import CardContent from '../../../components/UI/CardContent';

import Decimal from 'decimal.js';

import * as utilities from '../../../utilities';

const Wallet = () => {
    const navigate = useNavigate();
    const { balance, _currencyFormat } = useContext(appContext);
    const [filterText, setFilterText] = React.useState('');
    return (
        <>
            {balance.length === 0 && (
                <div className="flex justify-center items-center">
                    <svg
                        className="animate-spin "
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                    >
                        <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
                    </svg>
                </div>
            )}

            {balance.length > 0 && (
                <CardContent
                    header={
                        <Input
                            id="search"
                            name="search"
                            disabled={false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)}
                            type="search"
                            placeholder="Search token"
                        />
                    }
                    content={
                        <>
                            <ul>
                                {balance
                                    .filter(
                                        (t: MinimaToken) =>
                                            containsText(
                                                t.tokenid === '0x00' ? t.token : 'name' in t.token ? t.token.name : '',
                                                filterText
                                            ) || containsText(t.tokenid, filterText)
                                    )
                                    .map((t: MinimaToken) => (
                                        <li
                                            onClick={() => navigate(t.tokenid)}
                                            className="hover:bg-slate-200 hover:cursor-pointer bg-white rounded-lg mb-4 whitespace-nowrap grid grid-cols-[auto_1fr] items-center"
                                            key={t.tokenid}
                                        >
                                            {t.tokenid === '0x00' && (
                                                <div className="relative w-max inline-block mr-2">
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
                                                <div className="relative w-max inline-block mr-2">
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

                                            <div className="grid grid-cols-[auto_1fr] gap-2">
                                                <div>
                                                    {t.tokenid === '0x00' && (
                                                        <h6 className="font-bold truncate text-black">Minima</h6>
                                                    )}
                                                    {t.tokenid !== '0x00' && (
                                                        <h6 className="font-bold text-black">
                                                            {t.token && 'name' in t?.token
                                                                ? t?.token.name
                                                                : 'Name not available'}
                                                        </h6>
                                                    )}

                                                    {t.tokenid === '0x00' && (
                                                        <p className="font-bold truncate text-black text-opacity-50">
                                                            $MINIMA
                                                        </p>
                                                    )}
                                                    {t.tokenid !== '0x00' && (
                                                        <p className="font-bold text-black text-opacity-50">
                                                            {t.token && 'ticker' in t?.token
                                                                ? '$' + t?.token.ticker
                                                                : ''}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-end w-full justify-end">
                                                    <div>
                                                        <div className="grid grid-cols-[1fr_auto] items-center mr-4">
                                                            <p
                                                                className={`${
                                                                    t.unconfirmed !== '0'
                                                                        ? 'bg-yellow-500 text-yellow-200 animate-pulse'
                                                                        : 'bg-green-200 text-green-600'
                                                                } w-max justify-self-end text-green-600 text-[12px] rounded-full px-2 max-w-max  font-bold`}
                                                            >
                                                                {_currencyFormat !== null &&
                                                                    utilities.formatNumberPreference(
                                                                        new Decimal(t.sendable).toNumber(),
                                                                        3,
                                                                        utilities.getCharacterCountAfterChar(
                                                                            t.sendable,
                                                                            '.'
                                                                        ) > 3
                                                                            ? '...'
                                                                            : '',
                                                                        _currencyFormat
                                                                    )}
                                                                {/* {formatNumber({
                                                                    prefix: '',
                                                                    truncate: 3,
                                                                    suffix:
                                                                        utilities.getCharacterCountAfterChar(
                                                                            t.confirmed,
                                                                            '.'
                                                                        ) > 3
                                                                            ? '...'
                                                                            : '',
                                                                })(new Decimal(t.sendable).toNumber())} */}
                                                            </p>

                                                            {t.unconfirmed === '0' && (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="24"
                                                                    height="24"
                                                                    className="min-h-[24px] min-w-[24px]"
                                                                    viewBox="0 0 24 24"
                                                                    stroke-width="2"
                                                                    stroke="#22c55e"
                                                                    fill="none"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                >
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                    <path d="M7 9m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                                                    <path d="M14 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                                                    <path d="M17 9v-2a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v6a2 2 0 0 0 2 2h2" />
                                                                </svg>
                                                            )}
                                                            {t.unconfirmed !== '0' && (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="min-h-[24px] min-w-[24px] animate-pulse"
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    stroke-width="2"
                                                                    stroke="#eab308"
                                                                    fill="none"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                >
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                    <path d="M6.5 7h11" />
                                                                    <path d="M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1z" />
                                                                    <path d="M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-[1fr_auto] items-center mr-4">
                                                            <p className="w-max justify-self-end text-white text-[12px] rounded-full px-2 max-w-max bg-black">
                                                                {_currencyFormat !== null &&
                                                                    utilities.formatNumberPreference(
                                                                        new Decimal(t.confirmed)
                                                                            .minus(t.sendable)
                                                                            .toNumber(),
                                                                        3,
                                                                        utilities.getCharacterCountAfterChar(
                                                                            new Decimal(t.confirmed)
                                                                                .minus(t.sendable)
                                                                                .toString(),
                                                                            '.'
                                                                        ) > 3
                                                                            ? '...'
                                                                            : '',
                                                                        _currencyFormat
                                                                    )}

                                                                {/* {formatNumber({
                                                                    prefix: '',
                                                                    truncate: 3,
                                                                    // decimal: '.',
                                                                    // integerSeparator: '.',
                                                                    suffix:
                                                                        utilities.getCharacterCountAfterChar(
                                                                            new Decimal(t.confirmed)
                                                                                .minus(t.sendable)
                                                                                .toString(),
                                                                            '.'
                                                                        ) > 3
                                                                            ? '...'
                                                                            : '',
                                                                })(
                                                                    new Decimal(t.confirmed)
                                                                        .minus(t.sendable)
                                                                        .toNumber()
                                                                )} */}
                                                            </p>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                className="min-h-[24px] min-w-[24px]"
                                                                viewBox="0 0 24 24"
                                                                stroke-width="2"
                                                                stroke="currentColor"
                                                                fill="none"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            >
                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                <path
                                                                    d="M12 2c-.218 0 -.432 .002 -.642 .005l-.616 .017l-.299 .013l-.579 .034l-.553 .046c-4.785 .464 -6.732 2.411 -7.196 7.196l-.046 .553l-.034 .579c-.005 .098 -.01 .198 -.013 .299l-.017 .616l-.004 .318l-.001 .324c0 .218 .002 .432 .005 .642l.017 .616l.013 .299l.034 .579l.046 .553c.464 4.785 2.411 6.732 7.196 7.196l.553 .046l.579 .034c.098 .005 .198 .01 .299 .013l.616 .017l.642 .005l.642 -.005l.616 -.017l.299 -.013l.579 -.034l.553 -.046c4.785 -.464 6.732 -2.411 7.196 -7.196l.046 -.553l.034 -.579c.005 -.098 .01 -.198 .013 -.299l.017 -.616l.005 -.642l-.005 -.642l-.017 -.616l-.013 -.299l-.034 -.579l-.046 -.553c-.464 -4.785 -2.411 -6.732 -7.196 -7.196l-.553 -.046l-.579 -.034a28.058 28.058 0 0 0 -.299 -.013l-.616 -.017l-.318 -.004l-.324 -.001zm0 4a3 3 0 0 1 2.995 2.824l.005 .176v1a2 2 0 0 1 1.995 1.85l.005 .15v3a2 2 0 0 1 -1.85 1.995l-.15 .005h-6a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-3a2 2 0 0 1 1.85 -1.995l.15 -.005v-1a3 3 0 0 1 3 -3zm3 6h-6v3h6v-3zm-3 -4a1 1 0 0 0 -.993 .883l-.007 .117v1h2v-1a1 1 0 0 0 -1 -1z"
                                                                    fill="currentColor"
                                                                    stroke-width="0"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                            </ul>

                            {!!balance.length &&
                                !balance.filter(
                                    (t: MinimaToken) =>
                                        containsText(
                                            t.tokenid === '0x00' ? t.token : 'name' in t.token ? t.token.name : '',
                                            filterText
                                        ) || containsText(t.tokenid, filterText)
                                ).length && <h4 className="text-center text-black">No results found</h4>}
                        </>
                    }
                />
            )}
        </>
    );
};

export default Wallet;
