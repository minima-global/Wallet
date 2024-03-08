import { useContext } from 'react';
import Grid from '../components/UI/Grid';
import { appContext } from '../AppContext';

const Send = () => {
    const { _currentNavigation } = useContext(appContext);

    if (_currentNavigation !== 'send') {
        return null;
    }



    return (
        <Grid title="Send">
            <div className="px-4 md:px-0">                
                <div className="mb-4">
                    {/* <SelectTransferType /> */}
                </div>
                {/* {_transferType === 'value' && <ValueTransfer />}
                {_transferType === 'split' && <CoinSplit />}
                {_transferType === 'consolidate' && <Consolidate />} */}
            </div>
        </Grid>
    );
};

export default Send;
