import { DetailsTxPOW, TxPOW } from '../../../../types/minima';
import { format } from 'date-fns';
import identifyLeadingAmount from '../identifyLeadingAmount';
import getTxPOWDetailsType from '../../getTxPOWDetailsType';

const extractHistoryDetails = (txpows: TxPOW[], details: DetailsTxPOW[]) => {
    return txpows.map((t, i) => {
        const transactionType = getTxPOWDetailsType(details[i]);
        return {
            txpowid: t.txpowid,
            amount: identifyLeadingAmount(i, details),
            type:
                transactionType === 'custom'
                    ? 'Custom transaction'
                    : transactionType === 'tokencreate'
                    ? 'Token Creation'
                    : 'Value Transfer',
            sentTo0x: t.body.txn.outputs[0].address,
            sentToMx: t.body.txn.outputs[0].miniaddress,
            tokenName:
                t.body.txn.outputs[0].tokenid === '0x00'
                    ? 'Minima'
                    : t.body.txn.outputs[0].token &&
                      t.body.txn.outputs[0].token.name &&
                      typeof t.body.txn.outputs[0].token.name.name === 'string'
                    ? t.body.txn.outputs[0].token.name.name
                    : 'N/A',
            blockPosted: t.header.block,
            date: `${format(parseInt(t.header.timemilli), 'hh:mm:s a')} • ${format(
                parseInt(t.header.timemilli),
                'dd/MM/yy'
            )}`,
            timemilli: t.header.timemilli,
            burn: t.burn,
            inputs: t.body.txn.inputs,
            outputs: t.body.txn.outputs,
            stateVars: t.body.txn.state,
        };
    });
};

export default extractHistoryDetails;
