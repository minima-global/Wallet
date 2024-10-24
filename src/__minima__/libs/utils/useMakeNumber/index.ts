import { useContext } from 'react';
import { appContext } from '../../../../AppContext';
import * as utilities from '../../../../utilities';
import Decimal from 'decimal.js';

Decimal.set({ precision: 44 });

const useFormatMinimaNumber = () => {
    const { _currencyFormat } = useContext(appContext);

    const makeMinimaNumber = (initialValue: string, decimals: number) => {
        try {
            if (initialValue.length === 0) {
                throw new Error('No value passed for formatter.');
            }
    
            const decimalValue = new Decimal(initialValue);
    
            return utilities.formatNumberPreference(
                decimalValue.toString(),
                44,  // No decimal precision
                '',
                _currencyFormat
            );
        } catch (error) {
            console.error(error);
            return 0;
        }
    };

    return { makeMinimaNumber };
};

export default useFormatMinimaNumber;