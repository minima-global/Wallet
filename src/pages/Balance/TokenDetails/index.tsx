import { createPortal } from 'react-dom';
import { config } from 'react-spring';
import KeyValue from '../../../components/UI/KeyValue';
import { useState, useEffect } from 'react';
import CloseIcon from '../../../components/UI/Icons/CloseIcon';
import VerifiedIcon from '../../../components/UI/Icons/VerifiedIcon';
import Decimal from 'decimal.js';
import FireIcon from '../../../components/UI/Icons/FireIcon';
import AnimatedDialog from '../../../components/UI/AnimatedDialog';
import Burn from '../Burn';

const TokenDetails = ({ token, display, dismiss }: any) => {
    const [_promptBurn, setPromptBurn] = useState(false);

    const promptBurn = () => {
        dismiss();
        setPromptBurn(prevState => !prevState);
    }

    if (!token) {
        return null;
    }

    const isCustomTokenWithUrl =
        token && typeof token.token === 'object' && token.token.url && typeof token.token.url === 'string';
    const isCustomTokenWithTicker =
        token && typeof token.token === 'object' && token.token.ticker && typeof token.token.ticker === 'string';
    const isCustomTokenWithDescription =
        token &&
        typeof token.token === 'object' &&
        token.token.description &&
        typeof token.token.description === 'string';
    const isMinima = token && token.tokenid === '0x00';

    return (
        <>
            <Burn token={token} display={_promptBurn} dismiss={promptBurn} />

            <AnimatedDialog display={display} dismiss={dismiss}>
                <div className="h-full grid md:items-center">
                    <div className="relative left-0 right-0 bottom-0 top-0 bg-transparent">
                        <div className="bg-white h-full shadow-lg dark:shadow-none dark:bg-black w-full rounded-none md:w-[calc(100%_-_16px)] overflow-auto mx-auto p-4 md:rounded overflow-y-auto">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold tracking-wide">Token Details</h3>
                                <span onClick={dismiss}>
                                    <CloseIcon fill="currentColor" />
                                </span>
                            </div>
                            <div>
                                <div className="grid grid-cols-[1fr_auto] items-center">
                                    <div className="flex items-center">
                                        <div className="grid grid-cols-[auto_1fr] gap-2 bg-neutral-100 dark:bg-[#1B1B1B] dark:bg-opacity-50 w-full">
                                            {!isMinima && isCustomTokenWithUrl && (
                                                <img
                                                    alt="token-icon"
                                                    src={decodeURIComponent(token.token.url)}
                                                    className="bg-black dark:bg-[#1B1B1B] w-[56px] min-w-[56px] h-[56px] min-h-[56px]"
                                                />
                                            )}
                                            {!isMinima && !isCustomTokenWithUrl && (
                                                <img
                                                    alt="token-icon"
                                                    src={`https://robohash.org/${token.tokenid}`}
                                                    className="bg-black dark:bg-[#1B1B1B] w-[56px] min-w-[56px] h-[56px] min-h-[56px]"
                                                />
                                            )}
                                            {isMinima && (
                                                <img
                                                    alt="token-icon"
                                                    src="./assets/token.svg"
                                                    className="w-14 min-w-14 dark:border-r dark:border-r-neutral-800"
                                                />
                                            )}
                                            <div className="grid grid-rows-[auto_1fr] my-auto">
                                                <div className="flex items-center">
                                                    <h1 className="text-sm font-bold tracking-wide">
                                                        {token && token.tokenid === '0x00' && 'Minima'}
                                                        {token &&
                                                            token.tokenid !== '0x00' &&
                                                            typeof token.token === 'object' &&
                                                            typeof token.token.name === 'string' &&
                                                            token.token.name}
                                                    </h1>
                                                    {isMinima && (
                                                        <span className="my-auto text-black dark:text-black">
                                                            <VerifiedIcon fill="currentColor" />
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm tracking-widest">
                                                    {isMinima && 'MINIMA'}
                                                    {!isMinima && isCustomTokenWithTicker && token.token.ticker}
                                                    {!isMinima && !isCustomTokenWithTicker && ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="my-8 flex flex-col gap-2">
                                    <h3 className="break-word text-white">
                                        {!isMinima && isCustomTokenWithDescription && token.token.description}
                                    </h3>
                                    <KeyValue clipboard mono title="Token ID" value={token.tokenid} />
                                    <KeyValue mono title="Total Supply" value={token.total} />
                                    <KeyValue mono title="Total Coins" value={token.coins} />
                                    <div className="flex items-center justify-center">
                                        <hr className="border border-neutral-300 dark:border-[#1B1B1B] my-1 w-full" />
                                        <span className="mx-4 text-center text-black dark:text-white font-bold text-[12px]">
                                            Balance
                                        </span>
                                        <hr className="border border-neutral-300 dark:border-[#1B1B1B] my-1 w-full" />
                                    </div>
                                    <KeyValue mono title="Available" value={token.sendable} />
                                    <KeyValue
                                        mono
                                        title="Locked"
                                        value={new Decimal(token.confirmed).minus(token.sendable).toString()}
                                    />
                                    <KeyValue mono title="Pending" value={token.unconfirmed} />
                                </div>

                                <div className={`grid grid-cols-[1fr,_3fr] gap-2 ${isMinima && '!grid-cols-1'}`}>
                                    {!isMinima && (
                                        <button
                                            onClick={promptBurn}
                                            type="button"
                                            className="bg-orange-400 text-white dark:text-[#1B1B1B] dark:bg-orange-800 font-bold tracking-wider w-full flex justify-center"
                                        >
                                            <FireIcon size={22} fill="currentColor" />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="bg-teal-500 text-white dark:text-[#1B1B1B] dark:bg-teal-800 font-bold tracking-wider w-full"
                                    >
                                        Transfer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedDialog>
        </>
    );
};

export default TokenDetails;
