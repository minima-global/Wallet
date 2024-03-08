import { useContext } from 'react';
import { appContext } from '../../../AppContext';
import { animated, config, useSpring } from 'react-spring';
import Dialog from '../../../components/UI/Dialog';
import { createPortal } from 'react-dom';
import KeyValue from '../../../components/UI/KeyValue';

const BalanceInfo = () => {
    const { _promptBalanceInfo, promptBalanceInfo } = useContext(appContext);

    const springProps = useSpring({
        opacity: _promptBalanceInfo ? 1 : 0,
        transform: _promptBalanceInfo ? 'translateY(0%) scale(1)' : 'translateY(-50%) scale(0.8)',
        config: config.wobbly,
    });

    if (!_promptBalanceInfo) {
        return null;
    }

    return (
        _promptBalanceInfo &&
        createPortal(
            <Dialog dismiss={promptBalanceInfo}>
                <div className="h-full grid items-center">
                    <animated.div style={springProps}>
                        <div className="relative left-0 right-0 bottom-0 top-0 bg-transparent">
                            <div
                                className={`bg-black bg-opacity-90 w-[calc(100%_-_16px)] overflow-auto mx-auto md:w-full p-4 rounded`}
                            >
                                <section>
                                    <div className="grid grid-cols-[1fr_auto] items-center">
                                        <div className="flex items-center">
                                            <h3 className="text-white font-bold">Balance Help</h3>
                                        </div>
                                        <svg
                                            className="text-gray-500 hover:scale-105 hover:text-gray-600 hover:cursor-pointer hover:outline-offset-2"
                                            onClick={promptBalanceInfo}
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
                                    <div className="flex flex-col gap-2 my-8">
                                        <h3 className="text-white">There are three possible states a token can be in:</h3>
                                        <KeyValue truncate={false} title="Sendable" value="Funds are available to be spent immediately" />
                                        <KeyValue truncate={false} title="Confirmed" value="Funds locked in a smart contract" />
                                        <KeyValue truncate={false} title="Unconfirmed" value="Funds awaiting minimum block time confirmation in the mempool" />
                                    </div>
                                </section>
                            </div>
                        </div>
                    </animated.div>
                </div>
            </Dialog>,
            document.body
        )
    );
};

export default BalanceInfo;
