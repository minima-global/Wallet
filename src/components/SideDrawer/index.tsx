import { NavLink } from 'react-router-dom';
import WalletBrand from '../UI/Icons/WalletBrand';
import WalletIcon from '../UI/Icons/WalletIcon';
import SendIcon from '../UI/Icons/SendIcon';

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
                                            : 'flex items-center rounded-full px-3 py-2 dark:border dark:border-[#1B1B1B] text-neutral-400 hover:bg-[#1B1B1B] hover:dark:text-neutral-300 border dark:border-none'
                                    }
                                >
                                    <WalletIcon fill="" size={16} />
                                    <span className="ml-2 text-sm">Balance</span>
                                </NavLink>
                            </li>
                            <li className='mt-2'>
                                <NavLink
                                    to="/dashboard/send"
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'flex items-center rounded-full px-3 py-2 bg-black text-white  dark:bg-[#1B1B1B] dark:text-neutral-300 font-bold hover:!text-neutral-300'
                                            : 'flex items-center rounded-full px-3 py-2 dark:border dark:border-[#1B1B1B] text-neutral-400 hover:bg-[#1B1B1B] hover:dark:text-neutral-300 border dark:border-none'
                                    }
                                >
                                    <SendIcon fill="currentColor" size={16} />
                                    <span className="ml-2 text-sm">Send</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto">
                        <p>Minima logo etc</p>
                        <p>Night mode toggle</p>
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
