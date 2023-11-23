import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { appContext } from '../../AppContext';

const SideMenu = () => {
    const { setOpenDrawer } = useContext(appContext);
    return (
        <div className="min-w-[240px] grid grid-rows-[auto_1fr_auto] grid-cols-1 h-full">
            <header className="bg-black flex items-center gap-4 px-4 py-3">
                <svg width="32" height="32" viewBox="0 0 220 205" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M68.5074 65.4331L128.501 89.6635L165.238 74.8196L178.081 18.0364L128.501 38.0647L34.2537 0L0 151.449L53.9818 129.647L68.5074 65.4331Z"
                        fill="#FFA010"
                    />
                    <path
                        d="M165.239 74.8198L150.713 139.034L90.7195 114.804L53.9827 129.648L41.1399 186.431L90.7195 166.402L184.967 204.467L219.221 53.0179L165.239 74.8198Z"
                        fill="#FFA010"
                    />
                </svg>
                <h1 className="text-white text-lg">Wallet</h1>
            </header>

            <main className="flex flex-col gap-2 mt-4">
                <NavLink
                    onClick={() => setOpenDrawer(false)}
                    to="/balance"
                    className={`flex items-center gap-2 px-3 py-2`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-480h480q22 0 42 5t38 16v-21q0-33-23.5-56.5T720-720H240q-33 0-56.5 23.5T160-640v21q18-11 38-16t42-5Zm-74 130 445 108q9 2 18 0t17-8l139-116q-11-15-28-24.5t-37-9.5H240q-26 0-45.5 13.5T166-510Z" />
                    </svg>
                    Balance
                </NavLink>
                <NavLink
                    onClick={() => setOpenDrawer(false)}
                    to="/send"
                    className={`${({ isActive }: any) => (isActive ? 'active' : '')} flex items-center gap-2 px-3 py-2`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M320-160q-117 0-198.5-81.5T40-440q0-107 70.5-186.5T287-718l-63-66 56-56 160 160-160 160-56-57 59-59q-71 14-117 69t-46 127q0 83 58.5 141.5T320-240h120v80H320Zm200-360v-280h360v280H520Zm0 360v-280h360v280H520Zm80-80h200v-120H600v120Z" />
                    </svg>
                    Send
                </NavLink>
                <NavLink
                    onClick={() => setOpenDrawer(false)}
                    to="/receive"
                    className={`${({ isActive }: any) => (isActive ? 'active' : '')} flex items-center gap-2 px-3 py-2`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="m280-120-56-56 63-66q-106-12-176.5-91.5T40-520q0-117 81.5-198.5T320-800h120v80H320q-83 0-141.5 58.5T120-520q0 72 46 127t117 69l-59-59 56-57 160 160-160 160Zm240-40v-280h360v280H520Zm0-360v-280h360v280H520Zm80-80h200v-120H600v120Z" />
                    </svg>
                    Receive
                </NavLink>
                <NavLink
                    onClick={() => setOpenDrawer(false)}
                    to="/validate"
                    className={`${({ isActive }: any) => (isActive ? 'active' : '')} flex items-center gap-2 px-3 py-2`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M517-518 347-688l57-56 113 113 227-226 56 56-283 283Zm43 458-280-78v58H40v-440h318l248 92q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60ZM120-160h80v-280h-80v280Zm438 16 238-74q-3-11-13.5-16.5T760-240H568q-31 0-56-4t-54-14l-69-24 23-76 80 26q18 6 42 9t66 3q0-11-6.5-21T578-354l-234-86h-64v220l278 76ZM200-300Zm400-20Zm-400 20Zm80 0Z" />
                    </svg>
                    Validate Address
                </NavLink>
                <NavLink
                    onClick={() => setOpenDrawer(false)}
                    to="/status"
                    className={`${({ isActive }: any) => (isActive ? 'active' : '')} flex items-center gap-2 px-3 py-2`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M438-120 296-262l57-56 85 85 169-170 57 57-226 226ZM200-760v40h560v-40H200Zm124 120 12 40h288l12-40H324Zm12 120q-26 0-47-15.5T260-576l-20-64h-40q-33 0-56.5-23.5T120-720v-120h720v120q0 33-23.5 56.5T760-640h-40l-26 68q-9 23-29 37.5T620-520H336ZM200-760v40-40Z" />
                    </svg>{' '}
                    Status
                </NavLink>
                <NavLink
                    onClick={() => setOpenDrawer(false)}
                    to="/tokencreate"
                    className={`${({ isActive }: any) => (isActive ? 'active' : '')} flex items-center gap-2 px-3 py-2`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M167-120q-21 5-36.5-10.5T120-167l40-191 198 198-191 40Zm191-40L160-358l458-458q23-23 57-23t57 23l84 84q23 23 23 57t-23 57L358-160Zm317-600L261-346l85 85 414-414-85-85Z" />
                    </svg>{' '}
                    Token create
                </NavLink>
                <NavLink
                    onClick={() => setOpenDrawer(false)}
                    to="/nfts"
                    className={`${({ isActive }: any) => (isActive ? 'active' : '')} flex items-center gap-2 px-3 py-2`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M560-120q-17 0-28.5-11.5T520-160q0-17 11.5-28.5T560-200q47 0 83.5-18.5T680-260q0-14-13-26t-36-22l59-59q32 19 51 45t19 62q0 66-63 103t-137 37ZM183-426q-29-17-46-39.5T120-520q0-42 31-70.5T262-654q63-29 80.5-40.5T360-720q0-16-19.5-28T280-760q-25 0-42 6t-31 20q-11 11-27 13t-29-9q-13-10-15-26t9-29q19-23 54.5-39t80.5-16q72 0 116 32.5t44 87.5q0 39-29 70t-117 69q-58 25-76 37t-18 24q0 9 11.5 17.5T243-486l-60 60Zm571-118L584-714l42-42q24-24 57.5-24t56.5 24l56 56q24 23 24 56.5T796-586l-42 42ZM240-200h56l288-288-56-56-288 288v56Zm-80 80v-170l368-368 170 170-368 368H160Zm368-424 56 56-56-56Z" />
                    </svg>{' '}
                    View/Create NFTs
                </NavLink>
                <NavLink
                    onClick={() => setOpenDrawer(false)}
                    to="/history"
                    className={`${({ isActive }: any) => (isActive ? 'active' : '')} flex items-center gap-2 px-3 py-2`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M240-80q-50 0-85-35t-35-85v-120h120v-560l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-560H320v440h360v120q0 17 11.5 28.5T720-160ZM360-600v-80h240v80H360Zm0 120v-80h240v80H360Zm320-120q-17 0-28.5-11.5T640-640q0-17 11.5-28.5T680-680q17 0 28.5 11.5T720-640q0 17-11.5 28.5T680-600Zm0 120q-17 0-28.5-11.5T640-520q0-17 11.5-28.5T680-560q17 0 28.5 11.5T720-520q0 17-11.5 28.5T680-480ZM240-160h360v-80H200v40q0 17 11.5 28.5T240-160Zm-40 0v-80 80Z" />
                    </svg>{' '}
                    Transaction History
                </NavLink>
                <NavLink
                    onClick={() => setOpenDrawer(false)}
                    to="/settings"
                    className={`${({ isActive }: any) => (isActive ? 'active' : '')} flex items-center gap-2 px-3 py-2`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                    </svg>{' '}
                    Settings
                </NavLink>
            </main>

            <footer className="flex items-center p-4">
                <img className="w-[128px]" alt="" src="./assets/minima-landscape.png" />
            </footer>
        </div>
    );
};

export default SideMenu;
