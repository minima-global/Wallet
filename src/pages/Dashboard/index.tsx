import { useContext } from 'react';
import useIsMinimaBrowser from '../../hooks/useIsMinimaBrowser';
import { appContext } from '../../AppContext';
import ContentGrid from '../../components/UI/ContentGrid';
import { Outlet } from 'react-router-dom';
import MenuIcon from '../../components/UI/Icons/MenuIcon';

const Dashboard = () => {
    const openTitleBar = useIsMinimaBrowser();
    const { promptMenu, _currentNavigation, openDrawer } = useContext(appContext);
    

    return (
        <>
            <div>
                <header className="md:ml-[240px] bg-[#1B1B1B] p-4" onClick={openTitleBar}>
                    <div className="flex gap-2 items-center">
                        <span className='text-white dark:text-neutral-300' onClick={(e) => {
                            e.stopPropagation();
                            promptMenu();
                        }}>
                            <MenuIcon fill="currentColor" />
                        </span>

                        <h3 className="font-bold text-white text-sm dark:text-neutral-300 tracking-widest">
                            Navigation
                        </h3>
                    </div>
                </header>
                <main className="h-[calc(100%_-_48px)] md:ml-[240px] dark:text-opacity-80">
                    <ContentGrid>
                        <Outlet />
                    </ContentGrid>
                </main>
            </div>
        </>
    );
};

export default Dashboard;
