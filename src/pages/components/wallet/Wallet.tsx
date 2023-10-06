import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { MinimaToken } from '../../../@types/minima';
import { containsText } from '../../../shared/functions';
import Input from '../../../components/UI/Input';
import NFTAuthenticity from '../tokens/NFTAuthenticity';
import { appContext } from '../../../AppContext';
import Card from '../../../components/UI/Card';

const Wallet = () => {
    const navigate = useNavigate();
    const { balance } = useContext(appContext);
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
                <Card>
                    <>
                        <Input
                            id="search"
                            name="search"
                            disabled={false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)}
                            type="search"
                            placeholder="Search token"
                        />

                        <ul className="mt-6">
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
                                                <NFTAuthenticity tokenid={t.tokenid} />
                                            </div>
                                        )}

                                        <div className="my-auto truncate max-w-[360px]">
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

                                            <p className="font-normal truncate text-black">{t.sendable}</p>
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
                </Card>
            )}
        </>
    );
};

export default Wallet;
