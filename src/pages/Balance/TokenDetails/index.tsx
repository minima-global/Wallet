import { createPortal } from 'react-dom';
import Dialog from '../../../components/UI/Dialog';
import { animated, config, useSpring, useTransition } from 'react-spring';
import KeyValue from '../../../components/UI/KeyValue';
import { useState, useEffect } from 'react';

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
                                                    className={`bg-black bg-opacity-90 w-full md:w-[calc(100%_-_16px)] overflow-auto mx-auto p-4 rounded`}
                                                >
                                                    <section>
                                                        <div className="grid grid-cols-[1fr_auto] items-center">
                                                            <div className="flex items-center">
                                                                <div className="grid grid-cols-[auto_1fr] gap-2">
                                                                    {!isMinima && isCustomTokenWithUrl && (
                                                                        <img
                                                                            alt="token-icon"
                                                                            src={
                                                                                token.token.url.length > 0
                                                                                    ? token.token.url
                                                                                    : `https://robohash.org/${token.tokenid}`
                                                                            }
                                                                            className="bg-[#080A0B] w-[56px] min-w-[56px] h-[56px] min-h-[56px]"
                                                                        />
                                                                    )}
                                                                    {isMinima && (
                                                                        <img
                                                                            alt="token-icon"
                                                                            src="./assets/token.svg"
                                                                            className="w-14 min-w-14"
                                                                        />
                                                                    )}
                                                                    <div className="grid grid-rows-[auto_1fr]">
                                                                        <div className="flex items-center">
                                                                            <h1 className="text-lg text-white">
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
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    className="fill-blue-500 text-black ml-1"
                                                                                    width="24"
                                                                                    height="24"
                                                                                    viewBox="0 0 24 24"
                                                                                    strokeWidth="2"
                                                                                    stroke="currentColor"
                                                                                    fill="none"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                >
                                                                                    <path
                                                                                        stroke="none"
                                                                                        d="M0 0h24v24H0z"
                                                                                        fill="none"
                                                                                    />
                                                                                    <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" />
                                                                                    <path d="M9 12l2 2l4 -4" />
                                                                                </svg>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-white text-opacity-50 text-sm">
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
                                                            <svg
                                                                className="text-gray-500 hover:scale-105 hover:text-gray-600 hover:cursor-pointer hover:outline-offset-2"
                                                                onClick={dismiss}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="2"
                                                                stroke="currentColor"
                                                                fill="none"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                <path d="M18 6l-12 12" />
                                                                <path d="M6 6l12 12" />
                                                            </svg>
                                                        </div>
                                                        <div className="my-8 flex flex-col gap-2">
                                                            <h3 className="break-word text-white">
                                                                {isMinima && 'Official Native Minima Token'}

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
                                                            <KeyValue mono title="Confirmed" value={token.confirmed} />
                                                            <KeyValue
                                                                mono
                                                                title="Unconfirmed"
                                                                value={token.unconfirmed}
                                                            />
                                                            <KeyValue mono title="Sendable" value={token.sendable} />
                                                        </div>
                                                    </section>
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
