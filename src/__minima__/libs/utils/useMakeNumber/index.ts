import { useContext } from 'react';
import { appContext } from '../../../../AppContext';
import * as utilities from '../../../../utilities';
import Decimal from 'decimal.js';

const useFormatMinimaNumber = () => {
    const { _currencyFormat } = useContext(appContext);

    const makeMinimaNumber = (initialValue: string, decimals: number) => {
        if (_currencyFormat === null) return 0;

        return utilities.formatNumberPreference(
            //@ts-ignore
            new Decimal(initialValue).toSD(88),
            decimals,
            utilities.getCharacterCountAfterChar(initialValue, '.') > decimals ? '...' : '',
            _currencyFormat
        );
    };

    return { makeMinimaNumber };
};

export default useFormatMinimaNumber;
