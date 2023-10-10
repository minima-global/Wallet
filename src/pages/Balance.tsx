import { useContext } from 'react';
import Grid from '../components/UI/Grid';
import Wallet from './components/wallet/Wallet';
import { appContext } from '../AppContext';
import { Outlet } from 'react-router-dom';

const Balance = () => {
    const { setOpenDrawer } = useContext(appContext);
    return (
        <Grid
            variant="lg"
            title={
                <>
                    <svg
                        onClick={() => setOpenDrawer(true)}
                        className="block md:hidden fill-white"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                    >
                        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                    </svg>
                    Balance
                </>
            }
        >
            <>
                <Wallet />
            </>
        </Grid>
    );
};

export default Balance;
