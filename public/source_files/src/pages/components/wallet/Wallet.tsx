import React from 'react';
import styled from '@emotion/styled';

import { Avatar, CircularProgress, Stack } from '@mui/material';
import { MinimaToken } from '../../../@types/minima';
import { useAppSelector } from '../../../minima/redux/hooks';
import { selectBalance } from '../../../minima/redux/slices/balanceSlice';
import { containsText } from '../../../shared/functions';
import MiCard from '../../../shared/components/layout/MiCard/MiCard';

import { useNavigate } from 'react-router-dom';
import Input from '../../../components/UI/Input';
import NFTAuthenticity from '../tokens/NFTAuthenticity';

const Wallet = () => {
    const navigate = useNavigate();
    const walletTokens = useAppSelector(selectBalance);
    const [filterText, setFilterText] = React.useState('');

    return (
        <MiCard>
            <Input
                extraClass={`w-full mt-2`}
                id="search"
                name="search"
                disabled={false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)}
                type="search"
                placeholder="Search token"
            />
            <div>
                {!walletTokens.length && (
                    <Stack mt={2} alignItems="center" justifyContent="center">
                        <CircularProgress size={16} />
                        <p>Fetching your tokens...</p>
                    </Stack>
                )}

                <ul className="mt-6">
                    {walletTokens
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
                                className="hover:bg-slate-200 hover:cursor-pointer bg-white flex rounded-lg gap-4 truncate mb-4"
                                key={t.tokenid}
                            >
                                {t.tokenid === '0x00' && (
                                    <div className="relative">
                                        <svg
                                            className="absolute right-0 bottom-0"
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24"
                                            viewBox="0 -960 960 960"
                                            width="24"
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
                                        <NFTAuthenticity token={t} />
                                    </div>
                                )}

                                <div className="my-auto truncate max-w-[180px]">
                                    {t.tokenid === '0x00' && <h6 className="font-bold truncate">Minima</h6>}
                                    {t.tokenid !== '0x00' && (
                                        <h6 className="font-bold">
                                            {t.token && 'name' in t?.token ? t?.token.name : 'Name not available'}
                                        </h6>
                                    )}

                                    <p className="font-normal truncate">{t.sendable}</p>
                                </div>
                            </li>
                        ))}
                    {!walletTokens.filter(
                        (t: MinimaToken) =>
                            containsText(
                                t.tokenid === '0x00' ? t.token : 'name' in t.token ? t.token.name : '',
                                filterText
                            ) || containsText(t.tokenid, filterText)
                    ).length && (
                        <li>
                            <h1 className="text-sm text-center">No results found</h1>
                        </li>
                    )}
                </ul>
            </div>
        </MiCard>
    );
};

export default Wallet;
