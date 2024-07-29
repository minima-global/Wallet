import { useContext, useState } from 'react';
import styles from './Balance.module.css';
import { useSpring, animated, config } from 'react-spring';
import { appContext } from '../../AppContext';
import Wallet from '../Wallet/Wallet';
import TokenDetails from './TokenDetails';
import BalanceInfo from './BalanceInfo';
import Confirmation from '../../components/UI/Confirmation';
import HelpIcon from '../../components/UI/Icons/HelpIcon';

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
    };

    return (
        <>            
            <BalanceInfo />

            <TokenDetails dismiss={promptTokenDetails} display={_promptTokenDetails} token={viewingToken} />

            <animated.div style={springProps}>
                <section className='mx-3'>
                    <div className="grid grid-cols-[1fr_auto] items-center">
                        <h6>Your tokens</h6>
                        <div onClick={promptBalanceInfo} className="flex items-center justify-center">
                            <span>
                                <HelpIcon />
                            </span>
                        </div>
                        {/* <FetchBalanceButton /> */}
                    </div>
                    <div className='my-3'>
                        <input onChange={handleFilterTextChange} placeholder="Search tokens" type="search" className="rounded-full p-3 px-4 w-full focus:outline-2 focus:outline-black focus:dark:outline-neutral-600 dark:placeholder:text-neutral-600" />
                    </div>
                    <Wallet
                        selectToken={handleViewToken}
                        filterText={filter}
                        selectionMode={false}
                        detailsMode={true}
                    />
                </section>
            </animated.div>
        </>
    );
};
export default Balance;
