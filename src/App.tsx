import { Drawer } from '@mui/material';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';

import SideMenu from './layout/SideMenu';
import Notification from './components/UI/Notification';
import { appContext } from './AppContext';
import { createPortal } from 'react-dom';
import Grid from './components/UI/Grid';
import useIsMinimaBrowser from './hooks/useIsMinimaBrowser';

export interface RouteType {
    path: string;
    sidebarName: string;
    element: JSX.Element;
}

const App = () => {
    const openTitleBar = useIsMinimaBrowser();
    const { openDrawer, setOpenDrawer, minidappSystemFailed } = useContext(appContext);
    return (
        <>
            {minidappSystemFailed &&
                createPortal(
                    <div className="ml-0 absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn z-[100000]">
                        <Grid variant="sm" title={<></>}>
                            <div
                                onClick={openTitleBar}
                                className="mx-4 rounded bg-white bg-opacity-90 p-4 items-center h-max"
                            >
                                <div className="grid grid-cols-1 grid-rows-1 pb-4">
                                    <div className="flex flex-col items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="80"
                                            viewBox="0 -960 960 960"
                                            width="80"
                                        >
                                            <path d="m456-200 179.022-340H510v-220L324.978-420H456v220Zm24 128.13q-84.913 0-159.345-32.117-74.432-32.118-129.491-87.177-55.059-55.059-87.177-129.491Q71.869-395.087 71.869-480t32.118-159.345q32.118-74.432 87.177-129.491 55.059-55.059 129.491-87.177Q395.087-888.131 480-888.131t159.345 32.118q74.432 32.118 129.491 87.177 55.059 55.059 87.177 129.491Q888.131-564.913 888.131-480t-32.118 159.345q-32.118 74.432-87.177 129.491-55.059 55.059-129.491 87.177Q564.913-71.869 480-71.869Z" />
                                        </svg>
                                        <h1 className="text-black text-xl font-semibold mt-4">
                                            Minidapp System is offline!
                                        </h1>
                                        <p className="text-black text-center">
                                            Please make sure you're logged into the MiniHub and your node is running.
                                        </p>
                                    </div>
                                </div>
                                <div />
                            </div>
                        </Grid>
                    </div>,

                    document.body
                )}
            <Notification />
            <main id="navigation" className="md:ml-[240px]">
                <Outlet />
            </main>
            <div>
                <Drawer
                    variant="temporary"
                    open={openDrawer}
                    onClose={(event, reason) => {
                        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
                            setOpenDrawer(false);
                        }
                    }}
                    ModalProps={{ keepMounted: true }}
                    className="md:hidden grid"
                >
                    <SideMenu />
                </Drawer>
                <Drawer variant="permanent" className="hidden md:grid">
                    <SideMenu />
                </Drawer>
            </div>
        </>
    );
};

export default App;
