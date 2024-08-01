import { useContext, useState } from 'react';
import Wallet from '../Wallet/Wallet';
import TokenDetails from './TokenDetails';
import { useLocation } from 'react-router-dom';
import AnimatePageIn from '../../components/UI/Animations/AnimatePageIn';
import { appContext } from '../../AppContext';

const Balance = () => {
    const [filter, setFilterText] = useState('');
    const [_promptTokenDetails, setPromptTokenDetails] = useState(false);
    const [viewingToken, setViewingToken] = useState(null);
    const { _hiddenTokens } = useContext(appContext);
    const location = useLocation();
    const promptTokenDetails = () => {
        setPromptTokenDetails(false);
    };

    const handleFilterTextChange = (evt) => {
        setFilterText(evt.target.value);
    };

    const handleViewToken = (token: any) => {
        setViewingToken(token);
        setPromptTokenDetails(true);
    };

    console.log(Object.values(_hiddenTokens).length);
    return (
        <>
            <TokenDetails dismiss={promptTokenDetails} display={_promptTokenDetails} token={viewingToken} />
            <AnimatePageIn display={location.pathname === '/dashboard/balance'}>
                <section className="mx-3 mt-8">
                    <div className="grid grid-cols-[1fr_auto] items-center">
                        <h6 className="font-bold tracking-wide dark:text-neutral-300">Your tokens</h6>
                    </div>
                    <div className="my-3">
                        <input
                            onChange={handleFilterTextChange}
                            placeholder="Search tokens"
                            type="search"
                            className="bg-white rounded-full p-3 px-4 w-full focus:outline-none focus:border focus:border-black focus:dark:border-neutral-600 dark:placeholder:text-neutral-600 dark:bg-[#1B1B1B]"
                        />
                    </div>
                    <div className='flex justify-end'>
                        {Object.keys(_hiddenTokens).length > 0 &&
                        <button type="button" className="text-[#1B1B1B] font-bold hover:opacity-80 dark:text-neutral-300 hover:dark:text-neutral-400 text-sm text-right hover:cursor-pointer border p-0">
                            View hidden ({Object.keys(_hiddenTokens).length})
                        </button>

                        }
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
