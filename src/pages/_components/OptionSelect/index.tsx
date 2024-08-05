import { ReactNode } from "react";

interface Props {
    selectedOption: string;
    handleOptionChange: (key: string, event: any) => void;
    setImageUploadOption: (option: string | null) => void;
    setFieldValue: (key: string, value: string) => void;
    CustomIcon: any;
}
const OptionSelect = ({ selectedOption, CustomIcon, handleOptionChange, setImageUploadOption, setFieldValue,  }: Props) => {
    return (
        <label
            className={`text-center justify-center text-sm flex-col rounded-lg sm:roundd-full sm:flex-row p-4 flex items-center transition-all ${
                selectedOption === 'custom'
                    ? 'bg-black dark:bg-black font-bold'
                    : 'bg-neutral-200 dark:bg-[#1B1B1B]'
            }`}
        >
            <input
                type="radio"
                name="option"
                value="custom"
                checked={selectedOption === 'custom'}
                onChange={(e) => {
                    handleOptionChange('form', e);

                    setImageUploadOption(null);
                    setFieldValue('url', '');
                }}
                className="hidden"
            />
            <span className={`${selectedOption === 'custom' && 'text-white'}`}>
                <CustomIcon fill="currentColor" size={20} />
            </span>
            <span
                className={`ml-2 ${selectedOption === 'custom' ? 'text-white' : ''}`}
            >
                Custom
            </span>
        </label>
    );
};

export default OptionSelect;