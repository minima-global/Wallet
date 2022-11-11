import GridLayout from '../layout/GridLayout';
import Wallet from './components/wallet/Wallet';

const Balance = () => {
    return <GridLayout children={<Wallet />} />;
};

export default Balance;
