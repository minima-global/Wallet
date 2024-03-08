import React, { useContext, useState } from 'react';
import { appContext } from '../../AppContext';
import useFormatMinimaNumber from '../../__minima__/libs/utils/useMakeNumber';
import Spinner from '../../components/UI/Spinner';

import * as utils from '../../utilities';
import Decimal from 'decimal.js';

interface IProps {
    selectionMode: boolean;
    detailsMode: boolean;
    selectToken?: any;
    filterText: string;
}
const Wallet = ({ selectToken, selectionMode = false, detailsMode = false, filterText }: IProps) => {
    const { makeMinimaNumber } = useFormatMinimaNumber();
    const { balance, loading } = useContext(appContext);
    
    if (!balance) {
        return <div>No tokens available.</div>;
    }

    if (
        balance.filter(
            (t: any) =>
                utils.containsText(
                    t.tokenid === '0x00' ? t.token : 'name' in t.token ? t.token.name : '',
                    filterText
                ) || utils.containsText(t.tokenid, filterText)
        ).length === 0
    ) {
        return <div className="mx-auto ">No tokens found matching your search</div>;
    }

    return (
        <div>
            <div className="mb-3">{loading && <Spinner />}</div>
            {balance.length > 0 && (
                <>
                    <ul className="">
                        {balance
                            .filter(
                                (t: any) =>
                                    utils.containsText(
                                        t.tokenid === '0x00' ? t.token : 'name' in t.token ? t.token.name : '',
                                        filterText
                                    ) || utils.containsText(t.tokenid, filterText)
                            )
                            .map((token: any) =>
                                token.tokenid === '0x00' ? (
                                    <li
                                        onClick={selectToken ? () => selectToken(token) : detailsMode ? selectToken(token) : () => null}
                                        className={`grid grid-cols-[auto_1fr] items-center gap-2 bg-white dark:bg-black mb-2 rounded ${
                                            selectionMode ? 'hover:bg-teal-500 border-teal-500 border' : ''
                                        }`}
                                        key={token.tokenid}
                                    >
                                        <img alt="token-icon" src="./assets/token.svg" className="w-14 min-w-14" />
                                        <div className="overflow-hidden grid grid-cols-[1fr_auto]">
                                            <div>
                                                <div className="grid grid-cols-[auto_1fr]">
                                                    <h6 className="font-bold truncate">Minima</h6>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="fill-blue-500 text-black ml-1"
                                                        width="18"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="2"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" />
                                                        <path d="M9 12l2 2l4 -4" />
                                                    </svg>
                                                </div>
                                                {!selectionMode && (
                                                    <p
                                                        className={`text-sm font-mono truncate ${
                                                            token.unconfirmed != '0' ? 'animate-pulse' : ''
                                                        }`}
                                                    >
                                                        {makeMinimaNumber(token.sendable, 2000)}
                                                        {token.unconfirmed != '0'
                                                            ? '/' + makeMinimaNumber(token.unconfirmed, 2000)
                                                            : null}
                                                    </p>
                                                )}
                                                {selectionMode && <p className="font-bold text-sm">MINIMA</p>}
                                            </div>
                                            {!selectionMode && (
                                                <div className="flex flex-col items-end pr-1">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="#000000"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path
                                                            d="M12 2c-.218 0 -.432 .002 -.642 .005l-.616 .017l-.299 .013l-.579 .034l-.553 .046c-4.785 .464 -6.732 2.411 -7.196 7.196l-.046 .553l-.034 .579c-.005 .098 -.01 .198 -.013 .299l-.017 .616l-.004 .318l-.001 .324c0 .218 .002 .432 .005 .642l.017 .616l.013 .299l.034 .579l.046 .553c.464 4.785 2.411 6.732 7.196 7.196l.553 .046l.579 .034c.098 .005 .198 .01 .299 .013l.616 .017l.642 .005l.642 -.005l.616 -.017l.299 -.013l.579 -.034l.553 -.046c4.785 -.464 6.732 -2.411 7.196 -7.196l.046 -.553l.034 -.579c.005 -.098 .01 -.198 .013 -.299l.017 -.616l.005 -.642l-.005 -.642l-.017 -.616l-.013 -.299l-.034 -.579l-.046 -.553c-.464 -4.785 -2.411 -6.732 -7.196 -7.196l-.553 -.046l-.579 -.034a28.058 28.058 0 0 0 -.299 -.013l-.616 -.017l-.318 -.004l-.324 -.001zm0 4a3 3 0 0 1 2.995 2.824l.005 .176v1a2 2 0 0 1 1.995 1.85l.005 .15v3a2 2 0 0 1 -1.85 1.995l-.15 .005h-6a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-3a2 2 0 0 1 1.85 -1.995l.15 -.005v-1a3 3 0 0 1 3 -3zm3 6h-6v3h6v-3zm-3 -4a1 1 0 0 0 -.993 .883l-.007 .117v1h2v-1a1 1 0 0 0 -1 -1z"
                                                            fill="currentColor"
                                                            strokeWidth="0"
                                                        />
                                                    </svg>

                                                    <p className="text-sm font-mono">
                                                        {makeMinimaNumber(
                                                            new Decimal(token.confirmed)
                                                                .minus(token.sendable)
                                                                .toString(),
                                                            2000
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ) : (
                                    <li
                                    onClick={selectToken ? () => selectToken(token) : detailsMode ? selectToken(token) : () => null}
                                        className={`grid grid-cols-[auto_1fr] items-center gap-2 bg-white dark:bg-black p-1 mb-2 rounded ${
                                            selectionMode ? 'hover:bg-teal-500 border-teal-500 border' : ''
                                        }`}
                                        key={token.tokenid}
                                    >
                                        <img
                                            alt="token-icon"
                                            src={
                                                'url' in token.token && token.token.url.length
                                                    ? token.token.url
                                                    : `https://robohash.org/${token.tokenid}`
                                            }
                                            className="bg-[#080A0B] w-[56px] min-w-[56px] h-[56px] min-h-[56px]"
                                        />
                                        <div className="overflow-hidden grid grid-cols-[1fr_auto]">
                                            <div>
                                                <h6 className="font-bold truncate">
                                                    {'name' in token.token && typeof token.token.name === 'string'
                                                        ? token.token.name
                                                        : 'N/A'}
                                                </h6>
                                                {!selectionMode && (
                                                    <p
                                                        className={`text-sm font-mono truncate ${
                                                            token.unconfirmed != '0' ? 'animate-pulse' : ''
                                                        }`}
                                                    >
                                                        {makeMinimaNumber(token.sendable, 2000)}
                                                        {token.unconfirmed != '0'
                                                            ? '/' + makeMinimaNumber(token.unconfirmed, 2000)
                                                            : null}
                                                    </p>
                                                )}
                                                {selectionMode && (
                                                    <p className="text-sm font-bold">
                                                        {token.token && 'ticker' in token.token
                                                            ? token.token.ticker
                                                            : ''}
                                                    </p>
                                                )}
                                            </div>
                                            {!selectionMode && (
                                                <div className="flex flex-col items-end pr-1">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="#000000"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path
                                                            d="M12 2c-.218 0 -.432 .002 -.642 .005l-.616 .017l-.299 .013l-.579 .034l-.553 .046c-4.785 .464 -6.732 2.411 -7.196 7.196l-.046 .553l-.034 .579c-.005 .098 -.01 .198 -.013 .299l-.017 .616l-.004 .318l-.001 .324c0 .218 .002 .432 .005 .642l.017 .616l.013 .299l.034 .579l.046 .553c.464 4.785 2.411 6.732 7.196 7.196l.553 .046l.579 .034c.098 .005 .198 .01 .299 .013l.616 .017l.642 .005l.642 -.005l.616 -.017l.299 -.013l.579 -.034l.553 -.046c4.785 -.464 6.732 -2.411 7.196 -7.196l.046 -.553l.034 -.579c.005 -.098 .01 -.198 .013 -.299l.017 -.616l.005 -.642l-.005 -.642l-.017 -.616l-.013 -.299l-.034 -.579l-.046 -.553c-.464 -4.785 -2.411 -6.732 -7.196 -7.196l-.553 -.046l-.579 -.034a28.058 28.058 0 0 0 -.299 -.013l-.616 -.017l-.318 -.004l-.324 -.001zm0 4a3 3 0 0 1 2.995 2.824l.005 .176v1a2 2 0 0 1 1.995 1.85l.005 .15v3a2 2 0 0 1 -1.85 1.995l-.15 .005h-6a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-3a2 2 0 0 1 1.85 -1.995l.15 -.005v-1a3 3 0 0 1 3 -3zm3 6h-6v3h6v-3zm-3 -4a1 1 0 0 0 -.993 .883l-.007 .117v1h2v-1a1 1 0 0 0 -1 -1z"
                                                            fill="currentColor"
                                                            strokeWidth="0"
                                                        />
                                                    </svg>

                                                    <p className="text-sm font-mono">
                                                        {makeMinimaNumber(
                                                            new Decimal(token.confirmed)
                                                                .minus(token.sendable)
                                                                .toString(),
                                                            2000
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                )
                            )}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Wallet;