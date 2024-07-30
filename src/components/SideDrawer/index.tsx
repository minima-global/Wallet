import WalletBrand from '../UI/Icons/WalletBrand';
import WalletIcon from '../UI/Icons/WalletIcon';

interface IProps {
    isOpen: boolean;
    toggleDrawer: () => void;
}
const SideDrawer = ({ isOpen, toggleDrawer }: IProps) => {
    return (
        <div className="relative">
            {/* Persistent Drawer */}
            <div
                className={`h-full fixed top-0 shadow-lg dark:shadow-none bg-white left-0 w-[240px] dark:bg-[#1B1B1B] dark:bg-opacity-10 dark:border-r dark:border-r-[#1B1B1B] text-white transition-transform duration-300 md:translate-x-0 ${
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
                            <li>Nav 1</li>
                            <li>Nav 2</li>
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

            <div className="flex md:hidden flex-col h-full p-4 text-black dark:text-white">
                {/* Drawer Header */}
                <div className="flex items-center gap-2 mb-4">
                    <WalletBrand fill="#1B1B1B" size={24} />
                    <h2 className="text-lg font-bold tracking-wide text-black dark:text-white">Wallet</h2>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <ul className="mb-4">
                        <li>Nav 1</li>
                        <li>Nav 2</li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="mt-auto">
                    <p>Minima logo etc</p>
                    <p>Night mode toggle</p>
                </div>
            </div>
        </div>
    );
};

export default SideDrawer;
