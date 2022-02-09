import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Balance from './pages/Balance';
import Send from './pages/Send';
import Terminal from './pages/Terminal';

export interface RouteType {
    path: string;
    sidebarName: string;
    element: JSX.Element;
}

const Routes: RouteType[] = [
    {
        path: '/',
        sidebarName: 'Page 1',
        element: <Page1></Page1>,
    },
    {
        path: '/page2',
        sidebarName: 'Page 2',
        element: <Page2></Page2>,
    },
    {
        path: '/page3',
        sidebarName: 'Page 3',
        element: <Page3></Page3>,
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
    {
        path: '/terminal',
        sidebarName: 'Terminal',
        element: <Terminal></Terminal>,
    },
];

export default Routes;
