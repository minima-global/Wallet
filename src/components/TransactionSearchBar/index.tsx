import { useState } from 'react';
import AnimateExpandIn from '../UI/Animations/AnimateExpandIn';
import SearchIcon from '../UI/Icons/SearchIcon';
import CloseIcon from '../UI/Icons/CloseIcon';
import { useTransactionHistory } from '../../pages/Transactions/context';


const TransactionSearchBar = () => {
    const { setFilterText, filterText } = useTransactionHistory();
    const [show, setShow] = useState(false);

    return (
        <div className={`relative flex items-center ${show && "min-w-[92%]"}`}>
            <AnimateExpandIn display={show}>
                <div className="bg-white rounded-full p-3 px-4 flex items-center gap-3 w-full dark:bg-[#1B1B1B]">
                    <span>
                        <SearchIcon fill="currentColor" />
                    </span>
                    <input
                        placeholder="Search transaction by id, tokenid or token name"
                        type="search"
                        onChange={(e) => {
                            setFilterText(e.target.value)
                        }}
                        value={filterText}
                        className="w-full focus:outline-none bg-transparent dark:placeholder:text-neutral-600"
                    />
                    <span onClick={() => setShow(false)}>
                        <CloseIcon fill="currentColor" />
                    </span>
                </div>
            </AnimateExpandIn>
            {!show && (
                <span
                    className="bg-white rounded-full p-3 px-4 flex items-center gap-3 cursor-pointer dark:bg-[#1B1B1B]"
                    onClick={() => setShow(true)}
                >
                    <SearchIcon fill="currentColor" />
                </span>
            )}
        </div>
    );
};

export default TransactionSearchBar;
