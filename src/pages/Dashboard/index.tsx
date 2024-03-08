import { useContext } from 'react';
import useIsMinimaBrowser from '../../hooks/useIsMinimaBrowser';
import Balance from '../Balance';
import styles from './Dashboard.module.css';
import { appContext } from '../../AppContext';
import Send from '../Send';

const Dashboard = () => {
    const openTitleBar = useIsMinimaBrowser();
    const { promptMenu, _currentNavigation } = useContext(appContext);

    return (
        <>
            <div className={styles['grid']}>
                <header className="md:ml-[240px]" onClick={openTitleBar}>
                    <div className="flex items-center">
                        <svg
                            className="block md:hidden mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={(e: any) => {
                                e.stopPropagation();
                                promptMenu();
                            }}
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                            stroke="#FFFFFF"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 6l16 0" />
                            <path d="M4 12l16 0" />
                            <path d="M4 18l16 0" />
                        </svg>

                        <h3 className="font-bold text-white text-xl">
                            {_currentNavigation === 'balance' && "Balance" }
                            {_currentNavigation === 'send' && "Send" }
                            {_currentNavigation === 'receive' && "Receive" }
                            {_currentNavigation === 'tokencreate' && "Create Token" }
                            {_currentNavigation === 'history' && "History" }
                            {_currentNavigation === 'nonfungible' && "Non Fungible Tokens" }
                        </h3>
                    </div>
                </header>
                <main className="md:ml-[240px]">
                    <section>
                        <section />
                        <Balance />
                        <Send />
                    </section>
                </main>
            </div>
        </>
    );
};

export default Dashboard;
