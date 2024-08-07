import { useContext } from 'react';
import useIsMinimaBrowser from '../../hooks/useIsMinimaBrowser';
import { appContext } from '../../AppContext';
import ContentGrid from '../../components/UI/ContentGrid';
import { Outlet } from 'react-router-dom';
import MenuIcon from '../../components/UI/Icons/MenuIcon';
import MiningIcon from '../../components/UI/Icons/MiningIcon';
import ScrollToTop from '../../components/UI/ScrollToTop';

const Dashboard = () => {
    const openTitleBar = useIsMinimaBrowser();
    const { promptMenu, _promptMining } = useContext(appContext);

    return (
        <>
        <ScrollToTop />

            <header className="sticky top-0 right-0 z-[440] left-0 md:ml-[240px] bg-[#1B1B1B] p-4" onClick={openTitleBar}>
                <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                        <span
                            className="text-neutral-100 dark:text-neutral-300 block md:hidden"
                            onClick={(e) => {
                                e.stopPropagation();
                                promptMenu();
                            }}
                        >
                            <MenuIcon fill="currentColor" />
                        </span>

                        <h3 className="font-bold text-white text-sm dark:text-neutral-300 tracking-widest">
                            Navigation
                        </h3>
                    </div>
                    <div>
                        {_promptMining && (
                            <span className="text-orange-300 dark:text-neutral-600 flex flex-row-reverse items-center gap-1 text-sm animate-pulse">
                                Mining... <MiningIcon size={18} fill="currentColor" />
                            </span>
                        )}
                    </div>
                </div>
            </header>
            <main className="h-[calc(100%_-_52px)] md:ml-[240px] dark:text-opacity-80">
                <ContentGrid>
                    <Outlet />
                </ContentGrid>
            </main>
        </>
    );
};

export default Dashboard;
