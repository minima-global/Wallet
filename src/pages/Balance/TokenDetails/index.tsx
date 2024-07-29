import { createPortal } from 'react-dom';
import Dialog from '../../../components/UI/Dialog';
import { animated, config, useSpring, useTransition } from 'react-spring';
import KeyValue from '../../../components/UI/KeyValue';
import { useState, useEffect } from 'react';
import CloseIcon from '../../../components/UI/Icons/CloseIcon';
import VerifiedIcon from '../../../components/UI/Icons/VerifiedIcon';
import Decimal from 'decimal.js';

const TokenDetails = ({ token, display, dismiss }: any) => {
    const [show, setShow] = useState(display);

    useEffect(() => {
        if (display) setShow(true);
    }, [display]);

    const transitions = useTransition(display, {
        from: { opacity: 0, transform: 'translateY(-50%) scale(0.8)' },
        enter: { opacity: 1, transform: 'translateY(0%) scale(1)' },
        leave: { opacity: 0, transform: 'translateY(-50%) scale(0.8)' },
        config: config.gentle,
        onRest: () => {
            if (!display) setShow(false);
        },
    });

    const isCustomTokenWithUrl =
        token && typeof token.name === 'object' && token.name.url && typeof token.name.url === 'string';
    const isCustomTokenWithTicker =
        token && typeof token.name === 'object' && token.name.ticker && typeof token.name.ticker === 'string';
    const isCustomTokenWithDescription =
        token && typeof token.name === 'object' && token.name.description && typeof token.name.description === 'string';
    const isMinima = token && token.tokenid === '0x00';
    return (
        <>
            {show &&
                createPortal(
                    <Dialog dismiss={dismiss}>
                        <div className="h-full grid items-center">
                            {transitions(
                                (styles, item) =>
                                    item && (
                                        <animated.div style={styles}>
                                            <div className="relative left-0 right-0 bottom-0 top-0 bg-transparent">
                                                <div
                                                    className={`bg-white dark:bg-black w-[calc(100%_-_16px)] overflow-auto mx-auto md:w-full p-4 rounded`}
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="font-bold tracking-wide">Token Details</h3>
                                                        <span onClick={dismiss}>
                                                            <CloseIcon fill="currentColor" />
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="grid grid-cols-[1fr_auto] items-center">
                                                            <div className="flex items-center">
                                                                <div className="grid grid-cols-[auto_1fr] gap-2 bg-neutral-100 dark:bg-[#1B1B1B] dark:bg-opacity-50 w-full ">
                                                                    {!isMinima && isCustomTokenWithUrl && (
                                                                        <img
                                                                            alt="token-icon"
                                                                            src={
                                                                                token.token.url.length > 0
                                                                                    ? token.token.url
                                                                                    : `https://robohash.org/${token.tokenid}`
                                                                            }
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
                                                                                {token &&
                                                                                    token.tokenid === '0x00' &&
                                                                                    'Minima'}
                                                                                {token &&
                                                                                    token.tokenid !== '0x00' &&
                                                                                    token.name === 'object' &&
                                                                                    typeof token.name.name ===
                                                                                        'string' &&
                                                                                    token.name.name}
                                                                            </h1>
                                                                            {isMinima && (
                                                                                <span className="my-auto text-black dark:text-black">
                                                                                    <VerifiedIcon fill="currentColor" />
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-sm tracking-widest">
                                                                            {isMinima && 'MINIMA'}
                                                                            {!isMinima &&
                                                                                isCustomTokenWithTicker &&
                                                                                token.name.ticker}
                                                                            {!isMinima &&
                                                                                !isCustomTokenWithTicker &&
                                                                                ''}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="my-8 flex flex-col gap-2">
                                                            <h3 className="break-word text-white">
                                                                {!isMinima &&
                                                                    isCustomTokenWithDescription &&
                                                                    token.name.description}
                                                            </h3>
                                                            <KeyValue
                                                                clipboard
                                                                mono
                                                                title="Token ID"
                                                                value={token.tokenid}
                                                            />
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
                                                                value={new Decimal(token.confirmed)
                                                                    .minus(token.sendable)
                                                                    .toString()}
                                                            />
                                                            <KeyValue mono title="Pending" value={token.unconfirmed} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </animated.div>
                                    )
                            )}
                        </div>
                    </Dialog>,
                    document.body
                )}
        </>
    );
};

export default TokenDetails;
