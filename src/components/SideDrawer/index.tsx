import { NavLink } from 'react-router-dom';
import WalletBrand from '../UI/Icons/WalletBrand';
import WalletIcon from '../UI/Icons/WalletIcon';
import SendIcon from '../UI/Icons/SendIcon';
import AppThemeSwitch from '../AppThemeSwitch';
import ReceiveIcon from '../UI/Icons/ReceiveIcon';
import StudioIcon from '../UI/Icons/StudioIcon';
import ActivityIcon from '../UI/Icons/ActivityIcon';
import SettingsIcon from '../UI/Icons/SettingsIcon';
import CollectionIcon from '../UI/Icons/CollectionIcon';
import MinimaLandscape from '../UI/Icons/MinimaLandscape';
import { useContext } from 'react';
import { appContext } from '../../AppContext';

interface IProps {
    isOpen: boolean;
    toggleDrawer: () => void;
}
const SideDrawer = ({ isOpen, toggleDrawer }: IProps) => {
    const {isDarkMode} = useContext(appContext);
    return (
        <div className="relative">
            {/* Persistent Drawer */}
            <div
                className={`z-[19] h-full fixed top-0 dark:shadow-none bg-neutral-200 left-0 w-[240px] dark:bg-[#252525] dark:border-r dark:border-r-[#1B1B1B] text-white transition-transform duration-300 md:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Drawer Header */}
                    <div className="flex items-center gap-2 bg-[#1B1B1B] h-[52px] px-4 border-r border-[#1B1B1B] dark:border-none">
                        <div className=''>
                            <WalletBrand fill="#1B1B1B" size={30} />
                        </div>
                        <h2 className="text-lg font-bold tracking-wide text-neutral-200">Wallet</h2>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col border-r dark:border-none px-4 py-4">
                        <ul className="mb-4">
                            <li className="">
                                <NavLink
                                    to="/dashboard/balance"
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'flex items-center rounded-full px-3 py-2 bg-black text-white dark:bg-[#1B1B1B] dark:text-neutral-300 font-bold hover:!text-neutral-300'
                                            : 'bg-neutral-100 dark:bg-transparent flex items-center px-3 py-2 border dark:border-[#1B1B1B] rounded-full font-bold text-neutral-500 dark:text-neutral-600'
                                    }
                                    onClick={() => {
                                        toggleDrawer();
                                    }}
                                >
                                    <WalletIcon fill="" size={16} />
                                    <span className="ml-2 text-sm tracking-wider">Balance</span>
                                </NavLink>
                            </li>
                            <li className="mt-2">
                                <NavLink
                                    to="/dashboard/send"
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'flex items-center rounded-full px-3 py-2 bg-black text-white  dark:bg-[#1B1B1B] dark:text-neutral-300 font-bold hover:!text-neutral-300'
                                            : 'bg-neutral-100 dark:bg-transparent flex items-center px-3 py-2 border dark:border-[#1B1B1B] rounded-full font-bold text-neutral-500 dark:text-neutral-600'
                                    }
                                    onClick={() => {
                                        toggleDrawer();
                                    }}
                                >
                                    <SendIcon fill="currentColor" size={16} />
                                    <span className="ml-2 text-sm tracking-wider">Send</span>
                                </NavLink>
                            </li>
                            <li className="mt-2">
                                <NavLink
                                    to="/dashboard/receive"
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'flex items-center rounded-full px-3 py-2 bg-black text-white  dark:bg-[#1B1B1B] dark:text-neutral-300 font-bold hover:!text-neutral-300'
                                            : 'bg-neutral-100 dark:bg-transparent flex items-center px-3 py-2 border dark:border-[#1B1B1B] rounded-full font-bold text-neutral-500 dark:text-neutral-600'
                                    }
                                    onClick={() => {
                                        toggleDrawer();
                                    }}
                                >
                                    <ReceiveIcon fill="currentColor" size={16} />
                                    <span className="ml-2 text-sm tracking-wider">Receive</span>
                                </NavLink>
                            </li>
                            <li className="mt-2">
                                <NavLink
                                    to="/dashboard/transactions"
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'flex items-center rounded-full px-3 py-2 bg-black text-white  dark:bg-[#1B1B1B] dark:text-neutral-300 font-bold hover:!text-neutral-300'
                                            : 'bg-neutral-100 dark:bg-transparent flex items-center px-3 py-2 border dark:border-[#1B1B1B] rounded-full font-bold text-neutral-500 dark:text-neutral-600'
                                    }
                                    onClick={() => {
                                        toggleDrawer();
                                    }}
                                >
                                    <ActivityIcon fill="currentColor" size={16} />
                                    <span className="ml-2 text-sm tracking-wider">Transactions</span>
                                </NavLink>
                            </li>
                            <li className="mt-2">
                                <NavLink
                                    to="/dashboard/tokenstudio"
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'flex items-center rounded-full px-3 py-2 bg-black text-white  dark:bg-[#1B1B1B] dark:text-neutral-300 font-bold hover:!text-neutral-300'
                                            : 'bg-neutral-100 dark:bg-transparent flex items-center px-3 py-2 border dark:border-[#1B1B1B] rounded-full font-bold text-neutral-500 dark:text-neutral-600'
                                    }
                                    onClick={() => {
                                        toggleDrawer();
                                    }}
                                >
                                    <StudioIcon fill="currentColor" size={16} />
                                    <span className="ml-2 text-sm tracking-wider">Token Studio</span>
                                </NavLink>
                            </li>
                            <li className="mt-2">
                                <NavLink
                                    to="/dashboard/collections"
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'flex items-center rounded-full px-3 py-2 bg-black text-white  dark:bg-[#1B1B1B] dark:text-neutral-300 font-bold hover:!text-neutral-300'
                                            : 'bg-neutral-100 dark:bg-transparent flex items-center px-3 py-2 border dark:border-[#1B1B1B] rounded-full font-bold text-neutral-500 dark:text-neutral-600'
                                    }
                                    onClick={() => {
                                        toggleDrawer();
                                    }}
                                >
                                    <CollectionIcon fill="currentColor" size={16} />
                                    <span className="ml-2 text-sm tracking-wider">Collections</span>
                                </NavLink>
                            </li>
                        </ul>
                        <div className="flex items-center justify-center">
                            <hr className="border border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                            <span className="mx-4 text-center text-black dark:text-neutral-500 font-bold text-[12px]">
                                <SettingsIcon fill="currentColor" />
                            </span>
                            <hr className="border border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto">
                        <div className='flex justify-center my-4'>
                            <AppThemeSwitch />
                        </div>
                        <div className='px-4 pb-4'>
                            <MinimaLandscape fill={isDarkMode ? '#737373': '#1B1B1B'} size={124} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for small screens */}
            <div
                className={`fixed top-0 left-0 w-full h-full bg-black opacity-50 md:hidden ${
                    isOpen ? 'block' : 'hidden'
                }`}
                onClick={toggleDrawer}
            />
        </div>
    );
};

export default SideDrawer;
