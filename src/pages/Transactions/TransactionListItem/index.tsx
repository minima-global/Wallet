import { useNavigate } from 'react-router-dom';
import useFormatMinimaNumber from '../../../__minima__/libs/utils/useMakeNumber';
import { format } from 'date-fns';
import CustomTokenIcon from '../../../components/UI/Icons/CustomTokenIcon';

const TransactionListItem = ({ transaction, viewTxpow }) => {
    const navigate = useNavigate();
    const { makeMinimaNumber } = useFormatMinimaNumber();

    const t = transaction;

    return (
        <li
            key={t.txpowid}
            onClick={() => viewTxpow(t.txpowid)}
            className="dark:bg-transparent px-4 flex gap-2 first:mt-4 hover:bg-white hover:bg-opacity-50 hover:dark:bg-[#1B1B1B] hover:py-2 transition-all"
        >
            <div>
                {t.type === 'Value Transfer' && t.amount.substring(0, 1) === '-' && (
                     <div className='border-2 border-[#1B1B1B] dark:border-neutral-300 dark:text-neutral-300 rounded-full w-[45px] h-[45px] flex justify-center items-center text-sm tracking-wide font-bold'>OUT</div>
                )}
                {t.type === 'Value Transfer' && t.amount.substring(0, 1) !== '-' && (
                    <div className='border-2 border-[#1B1B1B] dark:border-neutral-300 dark:text-neutral-300 rounded-full w-[45px] h-[45px] flex justify-center items-center text-sm tracking-wide font-bold'>IN</div>
                )}
                {t.type === 'Token Creation' && (
                    <span className='border-2 border-[#1B1B1B] dark:border-neutral-300 dark:text-neutral-300 rounded-full w-[45px] h-[45px] flex justify-center items-center'><CustomTokenIcon fill="currentColor" size={26} /></span>
                )}
                {t.type === 'Custom' && (
                    <div className='border-2 border-[#1B1B1B] dark:border-neutral-300 dark:text-neutral-300 rounded-full w-[45px] h-[45px] flex justify-center items-center text-sm tracking-wide font-bold'>MISC</div>
                )}
            </div>
            <div className="overflow-hidden flex-grow ml-4">
                <h1 className="text-[#1B1B1B] dark:text-neutral-300 font-bold tracking-widest truncate">{t.tokenName}</h1>
                <p className="font-bold dark:text-neutral-300 tracking-widest truncate">{t.amount === '0' ? '-' : makeMinimaNumber(t.amount, 3)}</p>
            </div>
            <div className='flex'>
                <h3 className="text-[#1B1B1B] dark:text-neutral-400 my-auto text-sm">{format(parseInt(t.timeMilli), 'hh:mm a')}</h3>
            </div>
        </li>
    );
};

export default TransactionListItem;
