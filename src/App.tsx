import AppNavigation from './Navigation/AppNavigation';
import AppProvider from './AppContext';
import Notification from './components/UI/Notification';

export default function App() {
    return (
        <AppProvider>
            <AppNavigation />
        </AppProvider>
    );
}
