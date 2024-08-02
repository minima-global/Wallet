import React, { useState, FocusEvent, useContext } from 'react';
import truncateString from '../../../shared/utils/truncateString';
import { Scripts } from '../../../@types/minima';
import EditIcon from '../../../components/UI/Icons/EditIcon';
import PrimaryButton from '../../../components/UI/PrimaryButton';
import DoneIcon from '../../../components/UI/Icons/DoneIcon';
import { appContext } from '../../../AppContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
interface AddressItemProps {
    address: Scripts;
    setAddress: React.Dispatch<React.SetStateAction<Scripts | null>>;
    filterText: string;
    setFilterText: (text: string) => void;
    setShowFullList: (show: boolean) => void;
}

const AddressItem: React.FC<AddressItemProps> = ({
    address,
    setAddress,
    filterText,
    setFilterText,
    setShowFullList,
}) => {
    const { editNickname, _nicknameAddress } = useContext(appContext);
    const [edit, setEdit] = useState(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    return (
        <li
            key={address.miniaddress}
            onClick={() => {
                setAddress(address);
                if (filterText.length) {
                    setFilterText('');
                }
                setShowFullList(false);
            }}
            className="truncate mb-2 px-4 p-4 first:mt-2 text-[#1B1B1B] hover:bg-slate-50 dark:hover:bg-[#1B1B1B] hover:cursor-pointer dark:text-neutral-300"
        >
            {edit && (
                <Formik
                    initialValues={{ nickname: _nicknameAddress[address.miniaddress] || "Untitled" }}
                    onSubmit={(data) => {
                        const { nickname } = data;
                        editNickname(address.miniaddress, nickname.replaceAll("'", ' '));
                        setEdit(false);
                    }}
                    validationSchema={Yup.object().shape({
                        nickname: Yup.string()
                            .required('Field is required')
                            .max(255, "A nickname can't be longer than 255 characters"),
                    })}
                >
                    {({ values, handleSubmit, handleChange }) => (
                        <form
                            className="flex justify-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                
                            }}
                            onSubmit={handleSubmit}
                        >
                            <input
                            id="nickname"
                            name="nickname"
                            value={values.nickname}
                            onChange={handleChange}
                                placeholder="Enter nickname"
                                className="bg-white dark:bg-[#1B1B1B] dark:border-neutral-500 px-4 border rounded-full focus:outline placeholder:text-neutral-500 rounded-r-none focus:outline-[#1B1B1B] dark:focus:outline-neutral-300"
                            />
                            <div className="flex-shrink-0">
                                <PrimaryButton onClick={() => {}} extraClass="!bg-neutral-300 dark:!bg-neutral-500 py-2 ml-0 rounded-l-none" type="submit">
                                    <span className='dark:text-neutral-300'>
                                    <DoneIcon fill="currentColor" size={24} />
                                    </span>
                                </PrimaryButton>
                            </div>
                        </form>
                    )}
                </Formik>
            )}

            {!edit && (
                <div className="flex justify-center gap-1">
                    <h1 className="font-bold truncate text-center">{_nicknameAddress[address.miniaddress] || 'Untitled address'}</h1>

                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            setEdit(true);
                        }}
                    >
                        <EditIcon fill="currentColor" />
                    </span>
                </div>
            )}
            <input
                onClick={(e) => e.stopPropagation()}
                readOnly
                value={isFocused ? address.miniaddress : truncateString(address.miniaddress, 12, 12)}
                onBlur={handleBlur}
                onFocus={handleFocus}
                className="tracking-wide text-center truncate bg-transparent focus:outline-none w-full"
            />
        </li>
    );
};

export default AddressItem;
