import { useContext, useEffect, useState } from 'react';
import AnimatedDialog from '../../../components/UI/AnimatedDialog';
import CloseIcon from '../../../components/UI/Icons/CloseIcon';
import SecondaryButton from '../../../components/UI/SecondaryButton';
import PrimaryButton from '../../../components/UI/PrimaryButton';
import { useTransactionHistory } from '../context';
import { appContext } from '../../../AppContext';

interface Props {
    display: boolean;
    dismiss: () => void;
}

const Hide = ({ display, dismiss }: Props) => {
    // const { hideBy: globalHideBy, setFilterBy } = useTransactionHistory();

    const { _hiddenTransactions } = useContext(appContext);

    const [hideBy, setHideBy] = useState<'id' | 'address' | null>(null);

    if (!display) {
        return null;
    }

    const handleOptionChange = (event: any) => {
        if (event.target.value === hideBy) {
            return setHideBy(null);            
        } 

        setHideBy(event.target.value);
    };


    // useEffect(() => {
    //     if (!globalHideBy) {
    //         setHideBy(null);
    //     }
    // }, [globalHideBy])


    console.log("globalHideBy");

    return (
        <AnimatedDialog display={!!display} dismiss={dismiss}>
            <div className="modal-content">
                <div className="flex items-center justify-between p-4 border-b border-[#1B1B1B] dark:border-neutral-600">
                    <h3 className="font-bold text-lg">Hide Transactions</h3>
                    <button onClick={dismiss} aria-label="Close">
                        <CloseIcon fill="currentColor" />
                    </button>
                </div>
                <p className='mt-4 text-sm'>You can set filter queries which will filter out any transactions that mirror your query filter.</p>
                <div className='my-4 divide-y divide-[#1B1B1B] dark:divide-neutral-600'>
                    <div className='grid grid-cols-2 text-center py-2 bg-neutral-100 divide-[#1B1B1B] dark:bg-[#1B1B1B] divide-x dark:divide-neutral-600'>
                        <p>Filter By</p>
                        <p>Key</p>
                    </div>
                    <div className='bg-neutral-100 dark:bg-[#1B1B1B] py-8'>
                        {!_hiddenTransactions && <p className='text-[#1B1B1B] text-center text-sm dark:text-neutral-500'>No filters yet</p>}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-auto hide-scrollbar p-4 md:px-0">
                    <div>
                        <h1 className='text-center font-bold'>Select a filter method</h1>
                    </div>
                    <div className="my-3">
                        <fieldset>
                            <div className="grid grid-cols-2 gap-2 text-center">
                                <label
                                    className={`justify-center text-sm p-4 flex-col rounded-lg sm:roundd-full sm:flex-row flex items-center transition-all ${
                                        hideBy === 'id'
                                            ? 'bg-black dark:bg-black font-bold'
                                            : 'bg-neutral-300 dark:bg-[#1B1B1B]'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="option"
                                        onClick={handleOptionChange}
                                        value="id"
                                        checked={hideBy === 'id'}
                                        onChange={handleOptionChange}
                                        className="hidden"
                                    />
                                    <span className={`ml-2 ${hideBy === 'id' ? 'text-white' : ''}`}>
                                        {/* <DetailsIcon fill="currentColor" size={24} /> */}
                                    </span>
                                    <span className={`ml-2 ${hideBy === 'id' ? 'text-white' : ''}`}>
                                        Id
                                    </span>
                                </label>
                                <label
                                    className={`justify-center text-sm flex-col rounded-lg sm:roundd-full sm:flex-row p-4 flex items-center transition-all ${
                                        hideBy === 'address'
                                            ? 'bg-black dark:bg-black font-bold'
                                            : 'bg-neutral-300 dark:bg-[#1B1B1B]'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="option"
                                        onClick={handleOptionChange}
                                        value="address"                                    
                                        checked={hideBy === 'address'}
                                        onChange={handleOptionChange}
                                        className="hidden"
                                    />
                                    <span className={`ml-2 ${hideBy === 'address' ? 'text-white' : ''}`}>
                                        {/* <InputOutputIcon fill="currentColor" size={24} /> */}
                                    </span>
                                    <span className={`ml-2 ${hideBy === 'address' ? 'text-white' : ''}`}>
                                        Amount
                                    </span>
                                </label>                                                               
                            </div>
                        </fieldset>
                    </div>

                    <div>
                        {hideBy === 'address' && <input readOnly />}
                    </div>
                </div>
                <div className="mt-20 grid grid-cols-2 gap-3 mx-3">
                    <SecondaryButton extraClass="flex-shrink-0" type="button" onClick={dismiss}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton extraClass="flex-shrink-0" type="button" onClick={() => {
                        // setHideBy(hideBy);
                        dismiss();
                    }}>
                        Apply
                    </PrimaryButton>
                </div>
            </div>
        </AnimatedDialog>
    );
};

export default Hide;
