import { useState } from 'react';
import AnimateExpandIn from '../UI/Animations/AnimateExpandIn';
import SearchIcon from '../UI/Icons/SearchIcon';
import CloseIcon from '../UI/Icons/CloseIcon';

const TransactionSearchBar = () => {
    const [show, setShow] = useState(false);

    return (
        <div className={`relative flex items-center ${show && "min-w-[95%]"}`}>
            <AnimateExpandIn display={show}>
                <div className="bg-white rounded-full p-3 px-4 flex items-center gap-3 w-full dark:bg-[#1B1B1B]">
                    <span>
                        <SearchIcon fill="currentColor" />
                    </span>
                    <input
                        placeholder="Search tokens"
                        type="search"
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
