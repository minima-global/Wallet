import Status from './pages/Status';
import Receive from './pages/Receive';
import Balance from './pages/Balance';
import Send from './pages/Send';
import TokenCreation from './pages/TokenCreation';

export interface RouteType {
    path: string;
    sidebarName: string;
    element: JSX.Element;
}

const Routes: RouteType[] = [
    {
        path: '/',
        sidebarName: 'Status',
        element: <Status></Status>,
    },
    {
        path: '/receive',
        sidebarName: 'Receive',
        element: <Receive></Receive>,
    },
    {
        path: '/page3',
        sidebarName: 'Create Token',
        element: <TokenCreation></TokenCreation>,
    },
    {
        path: '/balance',
        sidebarName: 'Balance',
        element: <Balance></Balance>,
    },
    {
        path: '/send',
        sidebarName: 'Send',
        element: <Send></Send>,
    },
];

export default Routes;
