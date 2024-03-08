import { useContext, useState } from 'react';
import styles from './Balance.module.css';
import { useSpring, animated, config } from 'react-spring';
import { appContext } from '../../AppContext';
import Wallet from '../Wallet/Wallet';
import TokenDetails from './TokenDetails';
import BalanceInfo from './BalanceInfo';

const Balance = () => {
    const { _currentNavigation, promptBalanceInfo } = useContext(appContext);
    const [filter, setFilterText] = useState('');
    const [_promptTokenDetails, setPromptTokenDetails] = useState(false);
    const [viewingToken, setViewingToken] = useState(null);

    const promptTokenDetails = () => {
        setPromptTokenDetails((prevState) => !prevState);
    };

    if (_currentNavigation !== 'balance') {
        return null;
    }
    
    const springProps = useSpring({
        opacity: _currentNavigation === 'balance' ? 1 : 0,
        transform: _currentNavigation === 'balance' ? 'translateY(0%) scale(1)' : 'translateY(-50%) scale(1)',
        config: config.gentle,
    });

    const handleFilterTextChange = (evt) => {
        setFilterText(evt.target.value);
    };

    const handleViewToken = (token: any) => {
      setViewingToken(token);
      promptTokenDetails();
    }

    return (
        <>
            <BalanceInfo />

            <TokenDetails dismiss={promptTokenDetails} display={_promptTokenDetails} token={viewingToken} />

            <animated.div style={springProps}>
                <section className={styles['tokens']}>
                    <div className="grid grid-cols-[1fr_auto] items-center">
                        <h6>Your tokens</h6>
                        <div onClick={promptBalanceInfo} className="flex items-center justify-center">
                            <svg
                                className="hover:animate-pulse"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 9h.01" />
                                <path d="M11 12h1v4h1" />
                                <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
                            </svg>
                        </div>
                        {/* <FetchBalanceButton /> */}
                    </div>
                    <input onChange={handleFilterTextChange} placeholder="Search tokens" type="search" />
                    <Wallet selectToken={handleViewToken} filterText={filter} selectionMode={false} detailsMode={true} />
                </section>
            </animated.div>
        </>
    );
};
export default Balance;
