import { useContext, useState } from 'react';
import FavoriteIcon from '../UI/Icons/FavoriteIcon';
import { appContext } from '../../AppContext';
import Favorites from '../../pages/_components/Favorites';
import AddIcon from '../UI/Icons/AddIcon';
import { FormikContextType, FormikValues, useFormikContext } from 'formik';

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
    const { setPromptFavorites, _addressBook } = useContext(appContext);


    return (
        <>
            <div className={`bg-white ${!error && 'flex'} dark:bg-[#1B1B1B] rounded p-4 w-full ${_f && 'border'} flex`}>
                <div className="w-full">
                    {!error && !!value.length && (
                        <input
                            readOnly
                            value={_addressBook[value] ? _addressBook[value] : 'Minimalist'}
                            className="w-full focus:outline-none bg-transparent truncate text-sm dark:text-neutral-300"
                        />
                    )}

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
                <div className='flex flex-col gap-1'>
                 {!!value.length && !error && !_addressBook[value] && <span className="ml-auto my-auto" onClick={() => {
                    setPromptFavorites(true);
                    // setPromptAddNew(true);
                 }}><AddIcon fill="currentColor" /></span>}
                <span className="ml-auto my-auto" onClick={() => setPromptFavorites(true)}>                    
                    <FavoriteIcon fill="currentColor" />
                </span>
                </div>
            </div>
        </>
    );
};

export default SelectAddress;
