import { useEffect, useState } from 'react';
import AnimatedDialog from '../../../components/UI/AnimatedDialog';
import CloseIcon from '../../../components/UI/Icons/CloseIcon';
import SecondaryButton from '../../../components/UI/SecondaryButton';
import PrimaryButton from '../../../components/UI/PrimaryButton';
import { useTransactionHistory } from '../context';

interface Props {
    display: boolean;
    dismiss: () => void;
}

const FilterBy = ({ display, dismiss }: Props) => {
    const { filterBy: globalFilterBy, setFilterBy } = useTransactionHistory();

    const [filterBy, setMyFilter] = useState<'Value Transfer' | 'Custom' | 'Token Creation' | null>(null);

    const handleOptionChange = (event) => {
        if (event.target.value === filterBy) {
            return setMyFilter(null);            
        } 

        setMyFilter(event.target.value);
    };


    useEffect(() => {
        if (!globalFilterBy) {
            setMyFilter(null);
        }
    }, [globalFilterBy])

    return (
        <AnimatedDialog display={!!display} dismiss={dismiss}>
            <div className="modal-content">
                <div className="flex items-center justify-between p-4 border-b border-[#1B1B1B] dark:border-neutral-600">
                    <h3 className="font-bold text-lg">Filter By</h3>
                    <button onClick={dismiss} aria-label="Close">
                        <CloseIcon fill="currentColor" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-auto hide-scrollbar p-4 md:px-0">
                    <div className="my-3">
                        <fieldset>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <label
                                    className={`justify-center text-sm p-4 flex-col rounded-lg sm:roundd-full sm:flex-row flex items-center transition-all ${
                                        filterBy === 'Value Transfer'
                                            ? 'bg-black dark:bg-black font-bold'
                                            : 'bg-neutral-300 dark:bg-[#1B1B1B]'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="option"
                                        onClick={handleOptionChange}
                                        value="Value Transfer"
                                        checked={filterBy === 'Value Transfer'}
                                        onChange={handleOptionChange}
                                        className="hidden"
                                    />
                                    <span className={`ml-2 ${filterBy === 'Value Transfer' ? 'text-white' : ''}`}>
                                        {/* <DetailsIcon fill="currentColor" size={24} /> */}
                                    </span>
                                    <span className={`ml-2 ${filterBy === 'Value Transfer' ? 'text-white' : ''}`}>
                                        Value Transfer
                                    </span>
                                </label>
                                <label
                                    className={`justify-center text-sm flex-col rounded-lg sm:roundd-full sm:flex-row p-4 flex items-center transition-all ${
                                        filterBy === 'Token Creation'
                                            ? 'bg-black dark:bg-black font-bold'
                                            : 'bg-neutral-300 dark:bg-[#1B1B1B]'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="option"
                                        onClick={handleOptionChange}
                                        value="Token Creation"                                    
                                        checked={filterBy === 'Token Creation'}
                                        onChange={handleOptionChange}
                                        className="hidden"
                                    />
                                    <span className={`ml-2 ${filterBy === 'Token Creation' ? 'text-white' : ''}`}>
                                        {/* <InputOutputIcon fill="currentColor" size={24} /> */}
                                    </span>
                                    <span className={`ml-2 ${filterBy === 'Token Creation' ? 'text-white' : ''}`}>
                                        Token Creation
                                    </span>
                                </label>
                                <label
                                    className={`justify-center text-sm flex-col rounded-lg sm:roundd-full sm:flex-row p-4 flex items-center transition-all ${
                                        filterBy === 'Custom'
                                            ? 'bg-black dark:bg-black font-bold'
                                            : 'bg-neutral-300 dark:bg-[#1B1B1B]'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="option"
                                        onClick={handleOptionChange}
                                        value="Custom"
                                        checked={filterBy === 'Custom'}
                                        onChange={handleOptionChange}
                                        className="hidden"
                                    />
                                    <span className={`${filterBy === 'Custom' ? 'text-white' : ''}`}>
                                        {/* <StateIcon fill="currentColor" size={24} /> */}
                                    </span>
                                    <span className={`ml-2 ${filterBy === 'Custom' ? 'text-white' : ''}`}>
                                        Custom
                                    </span>
                                </label>                                
                            </div>
                        </fieldset>
                    </div>
                </div>
                <div className="mt-20 grid grid-cols-2 gap-3 mx-3">
                    <SecondaryButton extraClass="flex-shrink-0" type="button" onClick={dismiss}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton extraClass="flex-shrink-0" type="button" onClick={() => {
                        setFilterBy(filterBy);
                        dismiss();
                    }}>
                        Apply
                    </PrimaryButton>
                </div>
            </div>
        </AnimatedDialog>
    );
};

export default FilterBy;
