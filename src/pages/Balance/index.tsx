import { useContext, useState } from 'react';
import Wallet from '../Wallet/Wallet';
import TokenDetails from './TokenDetails';
import { useLocation } from 'react-router-dom';
import AnimatePageIn from '../../components/UI/Animations/AnimatePageIn';
import { appContext } from '../../AppContext';

import HiddenTokens from './HiddenTokens';
import BalanceSearchBar from '../../components/BalanceSearchBar';
import SecondaryButton from '../../components/UI/SecondaryButton';

const Balance = () => {
    const [filter, setFilterText] = useState('');
    const [_promptTokenDetails, setPromptTokenDetails] = useState(false);
    const [viewingToken, setViewingToken] = useState(null);
    const { hiddenBalance, promptHiddenTokens } = useContext(appContext);
    const location = useLocation();
    const promptTokenDetails = () => {
        setPromptTokenDetails(false);
    };

    const handleFilterTextChange = (evt: any) => {
        setFilterText(evt.target.value);
    };

    const handleViewToken = (token: any) => {
        setViewingToken(token);
        setPromptTokenDetails(true);
    };

    console.log(hiddenBalance);
    return (
        <>
            <TokenDetails dismiss={promptTokenDetails} display={_promptTokenDetails} token={viewingToken} />
            <HiddenTokens />
            <AnimatePageIn display={location.pathname === '/dashboard/balance'}>
                <section className="mx-3 mt-8">
                    <div className="grid grid-cols-[1fr_auto] items-center">
                        <h6 className="font-bold tracking-wide dark:text-neutral-300">Your tokens</h6>
                    </div>
                    <div className="my-3 overflow-x-auto">
                        <div className="flex items-center overflow-auto hide-scrollbar gap-2 w-full">
                            <BalanceSearchBar filterText={filter} setFilterText={setFilterText} />
                            <div className="flex flex-shrink-0 gap-2">
                                <SecondaryButton
                                    onClick={promptHiddenTokens}
                                    disabled={!hiddenBalance || (hiddenBalance && !hiddenBalance.length)}
                                    type="button"
                                >
                                     <span className='text-sm'>({hiddenBalance && hiddenBalance.length}) </span> Hidden
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>

                    <Wallet
                        selectToken={handleViewToken}
                        filterText={filter}
                        selectionMode={false}
                        detailsMode={true}
                    />
                </section>
            </AnimatePageIn>
        </>
    );
};
export default Balance;
