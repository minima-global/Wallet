import { useContext, useState } from 'react';
import styles from './Balance.module.css';
import { useSpring, animated, config, useTransition } from 'react-spring';
import { appContext } from '../../AppContext';
import Wallet from '../Wallet/Wallet';
import TokenDetails from './TokenDetails';
import BalanceInfo from './BalanceInfo';
import Confirmation from '../../components/UI/Confirmation';
import HelpIcon from '../../components/UI/Icons/HelpIcon';
import { useLocation } from 'react-router-dom';

const Balance = () => {
    const { promptBalanceInfo } = useContext(appContext);
    const [filter, setFilterText] = useState('');
    const [_promptTokenDetails, setPromptTokenDetails] = useState(false);
    const [viewingToken, setViewingToken] = useState(null);

    const location = useLocation();
    const promptTokenDetails = () => {
        setPromptTokenDetails((prevState) => !prevState);
    };

    const transitions = useTransition(location.pathname === '/dashboard/balance', {
        from: { opacity: 0, transform: 'translateY(-50%) scale(0.8)' },
        enter: { opacity: 1, transform: 'translateY(0%) scale(1)' },
        leave: { opacity: 0, transform: 'translateY(-50%) scale(0.8)' },
        config: config.default,
    });

    const handleFilterTextChange = (evt) => {
        setFilterText(evt.target.value);
    };

    const handleViewToken = (token: any) => {
        setViewingToken(token);
        promptTokenDetails();
    };

    return (
        <>
            <BalanceInfo />

            <TokenDetails dismiss={promptTokenDetails} display={_promptTokenDetails} token={viewingToken} />
            {transitions((styles, item) =>
                item ? (
                    <animated.div style={styles}>
                        <section className="mx-3 mt-8">
                            <div className="grid grid-cols-[1fr_auto] items-center">
                                <h6 className="font-bold tracking-wide dark:text-neutral-300">Your tokens</h6>
                                <div onClick={promptBalanceInfo} className="flex items-center justify-center">
                                    <span>
                                        <HelpIcon />
                                    </span>
                                </div>
                                {/* <FetchBalanceButton /> */}
                            </div>
                            <div className="my-3">
                                <input
                                    onChange={handleFilterTextChange}
                                    placeholder="Search tokens"
                                    type="search"
                                    className="rounded-full p-3 px-4 w-full focus:outline-2 focus:outline-black focus:dark:outline-neutral-600 dark:placeholder:text-neutral-600"
                                />
                            </div>
                            <Wallet
                                selectToken={handleViewToken}
                                filterText={filter}
                                selectionMode={false}
                                detailsMode={true}
                            />
                        </section>
                    </animated.div>
                ) : null
            )}
        </>
    );
};
export default Balance;