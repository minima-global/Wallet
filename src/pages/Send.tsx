import { FC, useContext, useEffect, useState } from 'react';
import ValueTransfer from './components/forms/ValueTransfer/ValueTransfer';
import CoinSplit from './components/forms/CoinSplit/CoinSplit';
import Grid from '../components/UI/Grid';
import { appContext } from '../AppContext';
import CardContent from '../components/UI/CardContent';
import Consolidate from './Consolidate';
import Select from '../components/UI/Select';

const Send: FC = () => {
    const { setOpenDrawer, getBalance, loaded } = useContext(appContext);
    const [current, setCurrent] = useState<string | null>('Value transfer');

    useEffect(() => {
        if (loaded.current === true) {
            getBalance();
        }
    }, [loaded, loaded.current]);

    return (
        <Grid
            variant="lg"
            title={
                <>
                    <svg
                        onClick={(e: any) => {
                            e.stopPropagation();
                            setOpenDrawer(true);
                        }}
                        className="block md:hidden fill-white"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                    >
                        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                    </svg>
                    Send
                </>
            }
        >
            <CardContent
                header={
                    <Select
                        def="Value transfer"
                        options={['Value transfer', 'Split coins', 'Consolidate']}
                        setCurrent={setCurrent}
                        current={current}
                    />
                }
                content={
                    <>
                        {current === 'Value transfer' && <ValueTransfer />}
                        {current === 'Split coins' && <CoinSplit />}
                        {current === 'Consolidate' && <Consolidate />}
                    </>
                }
            />
        </Grid>
    );
};

export default Send;
