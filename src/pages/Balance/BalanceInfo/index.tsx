import { useSpring, animated, config, useTransition } from 'react-spring';
import { useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Dialog from '../../../components/UI/AnimatedDialog';
import KeyValue from '../../../components/UI/KeyValue';
import { appContext } from '../../../AppContext';
import CloseIcon from '../../../components/UI/Icons/CloseIcon';

const BalanceInfo = () => {
    const { _promptBalanceInfo, promptBalanceInfo } = useContext(appContext);
    const [show, setShow] = useState(_promptBalanceInfo);

    useEffect(() => {
        if (_promptBalanceInfo) setShow(true);
    }, [_promptBalanceInfo]);

    const transitions = useTransition(_promptBalanceInfo, {
        from: { opacity: 0, transform: 'translateY(-50%) scale(0.8)' },
        enter: { opacity: 1, transform: 'translateY(0%) scale(1)' },
        leave: { opacity: 0, transform: 'translateY(-50%) scale(0.8)' },
        config: config.gentle,
        onRest: () => {
            if (!_promptBalanceInfo) setShow(false);
        },
    });

    return null;

    return (
        show &&
        createPortal(
            <Dialog dismiss={promptBalanceInfo}>
                <div className="h-full grid items-center">
                    {transitions(
                        (styles, item) =>
                            item && (
                                <animated.div style={styles}>
                                    <div className="relative left-0 right-0 bottom-0 top-0 bg-transparent">
                                        <div
                                            className={`bg-white dark:bg-black w-[calc(100%_-_16px)] overflow-auto mx-auto md:w-full p-4 rounded`}
                                        >
                                            <section>
                                                <div className="grid grid-cols-[1fr_auto] items-center">
                                                    <div className="flex items-center">
                                                        <h3 className="font-bold">Help</h3>
                                                    </div>
                                                    <span onClick={promptBalanceInfo}>
                                                        <CloseIcon fill="currentColor" />
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-2 my-8">
                                                    <h3>There are three possible states a token can be in:</h3>
                                                    <KeyValue
                                                        truncate={false}
                                                        title="Available"
                                                        value="Funds are available to be spent immediately"
                                                    />
                                                    <KeyValue
                                                        truncate={false}
                                                        title="Locked"
                                                        value="Funds locked in a smart contract"
                                                    />
                                                    <KeyValue
                                                        truncate={false}
                                                        title="Pending"
                                                        value="Funds awaiting minimum block time confirmation in the mempool"
                                                    />
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
        )
    );
};

export default BalanceInfo;
