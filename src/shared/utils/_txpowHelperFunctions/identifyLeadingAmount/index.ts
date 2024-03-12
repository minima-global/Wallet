import { DetailsTxPOW } from '../../../../types/minima';
import getTxPOWDetailsType from '../../getTxPOWDetailsType';

/**
 *
 * @param i index of which txpow details we are looking at
 * @param txpowDetail the details json included with the history command for a txpow
 * @returns the amount to display
 */
const identifyLeadingAmount = (txpowDetail: DetailsTxPOW) => {
    try {
        const transactionType = getTxPOWDetailsType(txpowDetail);
        const valueTransfer = transactionType === 'normal';
        const custom = transactionType === 'custom';
    
        return custom
            ? ''
            : valueTransfer
            ? txpowDetail.difference[Object.keys(txpowDetail.difference)[0]]
            : txpowDetail.difference['0xFF'];    
    } catch (error) {
        return "";
    }
};

export default identifyLeadingAmount;
