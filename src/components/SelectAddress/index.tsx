import { useState } from 'react';
import FavoriteIcon from '../UI/Icons/FavoriteIcon';

interface Props {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    value: any;
    error: false | string;
    id: string;
    name: string;
}
const SelectAddress = ({ handleChange, handleBlur, value, error, id, name }: Props) => {
    const [_f, setF] = useState(false);


    return (
        <div className={`bg-white ${!error && "flex"} dark:bg-[#1B1B1B] rounded p-4 w-full ${_f && "border"} flex`}>
            <div className='w-full'>
                {(!error && !!value.length) && <p className='text-sm dark:text-neutral-300'>Minimalist</p>}
                <input
                    id={id}
                    name={name}
                    onChange={handleChange}
                    onFocus={() => {
                        setF(true);
                    }}
                    onBlur={(e) => {
                        handleBlur(e);
                        setF(false);
                    }}
                    value={value}
                    placeholder="Minima Address"
                    className="bg-transparent focus:outline-none dark:placeholder:text-neutral-600 w-full truncate"
                    type="text"
                />
            </div>
            <span className='ml-auto my-auto'>
                <FavoriteIcon fill="currentColor" />
            </span>
        </div>
    );
};

export default SelectAddress;
