import { DetailsTxPOW } from '../../../../types/minima';
import getTxPOWDetailsType from '../../getTxPOWDetailsType';

/**
 *
 * @param i index of which txpow details we are looking at
 * @param txpowDetail the details json included with the history command for a txpow
 * @returns the amount to display
 */
const identifyLeadingAmount = (i: number, txpowDetail: DetailsTxPOW[]) => {
    const transactionType = getTxPOWDetailsType(txpowDetail[i]);
    const valueTransfer = transactionType === 'normal';
    const custom = transactionType === 'custom';

    return custom
        ? ''
        : valueTransfer
        ? txpowDetail[i].difference[Object.keys(txpowDetail[i].difference)[0]]
        : txpowDetail[i].difference['0xFF'];
};

export default identifyLeadingAmount;
