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
    
            // Check if the number has decimals
            const hasDecimals = decimalValue.decimalPlaces() > 0;
    
            if (!hasDecimals) {
                // No decimals, return as-is
                return utilities.formatNumberPreference(
                    decimalValue.toString(),
                    0,  // No decimal precision
                    '',
                    _currencyFormat
                );
            }
    
            // If the number has more than 3 decimals, limit it to 3 decimals without rounding
            const maxDecimals = Math.min(decimalValue.decimalPlaces(), 3);
    
            return utilities.formatNumberPreference(
                decimalValue.toDecimalPlaces(maxDecimals, Decimal.ROUND_DOWN).toString(),
                decimals,
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