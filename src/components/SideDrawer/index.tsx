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

interface IProps {
    isOpen: boolean;
    toggleDrawer: () => void;
}
const SideDrawer = ({ isOpen, toggleDrawer }: IProps) => {
    return (
        <div className="relative">
            {/* Persistent Drawer */}
            <div
                className={`z-[444] h-full fixed top-0 shadow-lg dark:shadow-none bg-white left-0 w-[240px] dark:bg-[#252525] dark:border-r dark:border-r-[#1B1B1B] text-white transition-transform duration-300 md:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full p-4 text-black dark:text-white">
                    {/* Drawer Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <WalletBrand fill="#1B1B1B" size={24} />
                        <h2 className="text-lg font-bold tracking-wide text-black dark:text-white">Wallet</h2>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col">
                        <ul className="mb-4">
                            <li className="">
                                <NavLink
                                    to="/dashboard/balance"
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'flex items-center rounded-full px-3 py-2 bg-black text-white dark:bg-[#1B1B1B] dark:text-neutral-300 font-bold hover:!text-neutral-300'
                                            : 'flex items-center px-3 py-2 border dark:border-[#1B1B1B] rounded-full font-bold text-neutral-500 dark:text-neutral-600'
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
                                            : 'flex items-center px-3 py-2 border dark:border-[#1B1B1B] rounded-full font-bold text-neutral-500 dark:text-neutral-600'
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
                                            : 'flex items-center px-3 py-2 border dark:border-[#1B1B1B] rounded-full font-bold text-neutral-500 dark:text-neutral-600'
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
                                    to="/dashboard/tokenstudio"
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'flex items-center rounded-full px-3 py-2 bg-black text-white  dark:bg-[#1B1B1B] dark:text-neutral-300 font-bold hover:!text-neutral-300'
                                            : 'flex items-center px-3 py-2 border dark:border-[#1B1B1B] rounded-full font-bold text-neutral-500 dark:text-neutral-600'
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
                                            : 'flex items-center px-3 py-2 border dark:border-[#1B1B1B] rounded-full font-bold text-neutral-500 dark:text-neutral-600'
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
                                            : 'flex items-center px-3 py-2 border dark:border-[#1B1B1B] rounded-full font-bold text-neutral-500 dark:text-neutral-600'
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
                            <hr className="border border-neutral-300 dark:border-[#1B1B1B] my-1 w-full" />
                            <span className="mx-4 text-center text-black dark:text-white font-bold text-[12px]">
                                <SettingsIcon fill="currentColor" />
                            </span>
                            <hr className="border border-neutral-300 dark:border-[#1B1B1B] my-1 w-full" />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto">
                        <AppThemeSwitch />
                        <span>
                            <img className="w-[128px]" alt="" src="./assets/minima-landscape.png" />
                        </span>
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
