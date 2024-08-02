import { useContext, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import AnimatePageIn from '../../components/UI/Animations/AnimatePageIn';
import { useLocation } from 'react-router-dom';
import TransactionSearchBar from '../../components/TransactionSearchBar';
import SearchIcon from '../../components/UI/Icons/SearchIcon';

const Transactions = () => {
    const location = useLocation();
    const [filterText, setFilterText] = useState('');

    const [viewKey, setViewKey] = useState(false);
    const [remainingTime, setRemainingTime] = useState(5000);
    const [held, setHeld] = useState(false);
    const timeoutRef: any = useRef(null);

    const handleFilterTextChange = (evt) => {
        setFilterText(evt.target.value);
    };

    const handleStart = () => {
        timeoutRef.current = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(timeoutRef.current);
                    setHeld(true);
                    setViewKey(true);
                    return 0;
                }
                return prevTime - 1000;
            });
        }, 1000);
        setHeld(true);
    };

    const handleEnd = () => {
        setViewKey(false);
        clearInterval(timeoutRef.current);
        setRemainingTime(5000);
        setHeld(false);
    };

    return (
        <>
            <AnimatePageIn display={location.pathname.includes('/dashboard/transactions')}>
                <div className="mx-3 mt-8">
                    <div className="grid grid-cols-[1fr_auto] items-center">
                        <h6 className="font-bold tracking-wide dark:text-neutral-300">Transaction History</h6>
                    </div>

                    <div className="my-3 overflow-x-auto">
                        <div className="flex items-center overflow-auto hide-scrollbar gap-2 w-full">
                            <TransactionSearchBar />
                            <div className="flex flex-shrink-0 gap-2">
                                <button type="button" className="bg-[#1B1B1B]">
                                    ooo
                                </button>
                                <button type="button" className="bg-[#1B1B1B]">
                                    ooo
                                </button>
                                <button type="button" className="bg-[#1B1B1B]">
                                    ooo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatePageIn>
        </>
    );
};
export default Transactions;
