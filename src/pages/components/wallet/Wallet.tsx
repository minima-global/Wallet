import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { MinimaToken } from '../../../@types/minima';
import { containsText } from '../../../shared/functions';
import { appContext } from '../../../AppContext';
import CardContent from '../../../components/UI/CardContent';

import Token from '../Token';
import TokenHelp from '../../../components/UI/TokenHelp';

const Wallet = () => {
    const navigate = useNavigate();
    const { balance } = useContext(appContext);
    const [filterText, setFilterText] = React.useState('');

    const [tokenInformation, setTokenInformation] = React.useState<
        false | { confirmed: string; sendable: string; unconfirmed: string }
    >(false);

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
                        <input
                            value={filterText}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)}
                            type="search"
                            className="focus:outline-none border hover:border-neutral-200 px-4 py-3 rounded-md bg-neutral-50 "
                            placeholder="Search by token name or id"
                        />
                    }
                    content={
                        <>
                            <TokenHelp
                                tokenInformation={tokenInformation}
                                display={tokenInformation}
                                dismiss={() => setTokenInformation(false)}
                            />

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
                                        <Token
                                            key={t.tokenid}
                                            t={t}
                                            setTokenInformation={setTokenInformation}
                                            handleClick={() => navigate(t.tokenid)}
                                        />
                                    ))}
                            </ul>

                            {!!balance.length &&
                                !balance.filter(
                                    (t: MinimaToken) =>
                                        containsText(
                                            t.tokenid === '0x00' ? t.token : 'name' in t.token ? t.token.name : '',
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
            )}
        </>
    );
};

export default Wallet;
