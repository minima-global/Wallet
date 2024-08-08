import { useState } from 'react';
import AnimateExpandIn from '../UI/Animations/AnimateExpandIn';
import SearchIcon from '../UI/Icons/SearchIcon';
import CloseIcon from '../UI/Icons/CloseIcon';

const BalanceSearchBar = ({filterText, setFilterText}: any) => {
    const [show, setShow] = useState(false);

    return (
        <div className={`flex items-center ${show && "min-w-[92%]"}`}>
            <AnimateExpandIn display={show}>
                <div className="bg-white rounded-full p-3 px-4 flex items-center gap-3 w-full dark:bg-[#1B1B1B]">
                    <span>
                        <SearchIcon fill="currentColor" />
                    </span>
                    <input
                        placeholder="Search token"
                        type="search"
                        onChange={(e) => {
                            setFilterText(e.target.value)
                        }}
                        value={filterText}
                        className="w-full focus:outline-none bg-transparent dark:placeholder:text-neutral-600 truncate"
                    />
                    <span onClick={() => {
                        setShow(false);
                        setFilterText('');
                    }}>
                        <CloseIcon fill="currentColor" />
                    </span>
                </div>
            </AnimateExpandIn>
            {!show && (
                <span
                    className="bg-transparent border dark:border-none border-neutral-300 rounded-full w-[48px] h-[48px] flex items-center justify-center gap-3 cursor-pointer dark:bg-[#1B1B1B] transition-all hover:w-[54px]"
                    onClick={() => setShow(true)}
                >
                    <SearchIcon fill="currentColor" />
                </span>
            )}
        </div>
    );
};

export default BalanceSearchBar;
