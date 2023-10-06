import AppNavigation from './Navigation/AppNavigation';
import AppProvider from './AppContext';

export default function App() {
    return (
        <AppProvider>
            <AppNavigation />
        </AppProvider>
    );
}
