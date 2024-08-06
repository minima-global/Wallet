import { useContext } from 'react';
import { appContext } from './AppContext';
import SideDrawer from './components/SideDrawer';
import { Grid } from '@mui/material';
import { createPortal } from 'react-dom';
import Logs from './components/UI/Logs';
import { Outlet } from 'react-router-dom';
import TransactionStatus from './components/TransactionStatus';
import { animated, useSpring } from 'react-spring';

const App = () => {
    const { openDrawer, promptMenu, openTitleBar, minidappSystemFailed, isCreatingKeys } = useContext(appContext);

    const minidappSystemFailedAnimation = useSpring({
        opacity: minidappSystemFailed ? 1 : 0,
        transform: minidappSystemFailed ? `translateY(0)` : `translateY(-50%)`,
        config: { tension: 300, friction: 20 },
    });

    const isCreatingKeysAnimation = useSpring({
        opacity: isCreatingKeys ? 1 : 0,
        transform: isCreatingKeys ? `translateY(0)` : `translateY(-50%)`,
        config: { tension: 300, friction: 20 },
    });

    return (
        <>
            <Outlet />

            <SideDrawer isOpen={openDrawer} toggleDrawer={promptMenu} />

            <TransactionStatus />

            {isCreatingKeys &&
                createPortal(
                    <div className="absolute left-0 right-0 bottom-0 top-0 bg-black/80 z-[20000] flex justify-center items-center">
                        <animated.div style={isCreatingKeysAnimation} className="bg-neutral-300 dark:bg-[#1B1B1B] p-4 rounded mx-4 max-w-[360px]">
                            <div onClick={openTitleBar} className="grid grid-cols-1 grid-rows-1 pb-4">
                                <div className="flex flex-col items-center">
                                    
                                    <h1 className="text-[#1B1B1B] dark:text-neutral-300 text-xl font-semibold mt-4">Node generating your keys</h1>
                                    <p className="text-[#1B1B1B] dark:text-neutral-400  text-center mb-4">
                                        Please be patient until all your keys are created.
                                    </p>
                                    <Logs />
                                </div>
                            </div>
                        </animated.div>
                    </div>,
                    document.body
                )}

            {minidappSystemFailed &&
                createPortal(
                    <div className="absolute left-0 right-0 bottom-0 top-0 bg-black/80 z-[20000] flex justify-center items-center">
                        <animated.div style={minidappSystemFailedAnimation} className="bg-neutral-300 dark:bg-[#1B1B1B] p-4 rounded mx-4 max-w-[360px]">
                            <h1 className="dark:text-neutral-300 text-lg text-center mb-2">
                                Could not connect to the Minidapp system
                            </h1>
                            <div className="mb-2">
                                <img
                                    alt="down"
                                    src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGNqZzRwZ2ljc3NjZnZuY3g0YnBiZXVmNXAydGZxaTFyaTNva3lwZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1USKMDPjuH4ovL7J5h/giphy.gif"
                                    className="rounded-full w-[120px] h-[120px] mx-auto"
                                />
                            </div>
                            <p className="text-[#1B1B1B] dark:text-neutral-400 text-lg text-center">
                                Try to restart Minima and re-login to the MiniHub then try to open this app again.
                            </p>
                        </animated.div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default App;
