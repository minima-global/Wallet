import { FC, useContext, useEffect, useState } from 'react';
import ValueTransfer from './components/forms/ValueTransfer/ValueTransfer';
import CoinSplit from './components/forms/CoinSplit/CoinSplit';
import Grid from '../components/UI/Grid';
import { appContext } from '../AppContext';
import CardContent from '../components/UI/CardContent';
import Consolidate from './Consolidate';
import Select from '../components/UI/Select';
import SelectTransferType from './components/SelectTransferType';

const Send: FC = () => {
    const { getBalance, loaded, _transferType } = useContext(appContext);

    useEffect(() => {
        if (loaded.current === true) {
            getBalance();
        }
    }, [loaded, loaded.current]);

    return (
        <Grid title="Send">
            <div className="px-4 md:px-0">                
                <div className="mb-4">
                    <SelectTransferType />
                </div>
                {_transferType === 'value' && <ValueTransfer />}
                {_transferType === 'split' && <CoinSplit />}
                {_transferType === 'consolidate' && <Consolidate />}
            </div>
        </Grid>
    );
};

export default Send;
