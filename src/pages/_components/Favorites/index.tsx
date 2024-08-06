import { useContext, useState } from 'react';
import AnimatedDialog from '../../../components/UI/AnimatedDialog';
import { appContext } from '../../../AppContext';
import CloseIcon from '../../../components/UI/Icons/CloseIcon';

import * as yup from 'yup';
import * as utils from "../../../utilities"
import { Formik, FormikContextType, FormikValues, useFormikContext } from 'formik';
import PrimaryButton from '../../../components/UI/PrimaryButton';
import SecondaryButton from '../../../components/UI/SecondaryButton';

interface Props {
    _promptAddNew: boolean;
    setPromptAddNew: any;
}
const Favorites = ({_promptAddNew, setPromptAddNew}: Props) => {
    const formik: FormikContextType<FormikValues> = useFormikContext();
    const [filterText, setFilterText] = useState('');
    const { _promptFavorites, setPromptFavorites, _addressBook, updateAddressBook } = useContext(appContext);


    const [error, setError] = useState<false | string>(false);

    const handleFilterTextChange = (evt: any) => {
        setFilterText(evt.target.value);
    };

    const handleSelect = (address: string) => {
        formik.setFieldValue("address", address);
        setPromptFavorites(false);
    }

    // Filter out and sort entries based on the filterText
    const filteredEntries = _addressBook
        ? Object.entries(_addressBook)
            .filter(([key, value]) => key.includes(filterText) || value.includes(filterText))
            .sort(([keyA, valueA], [keyB, valueB]) => valueA.localeCompare(valueB))
        : [];

    // Group entries by their starting alphabet
    const groupedEntries = filteredEntries.reduce((acc, [address, name]) => {
        const alphabet = name.charAt(0).toUpperCase();
        if (!acc[alphabet]) acc[alphabet] = [];
        acc[alphabet].push([address, name]);
        return acc;
    }, {} as Record<string, [string, string][]>);

    return (
        <AnimatedDialog display={_promptFavorites} dismiss={() => setPromptFavorites(false)}>
            <div className="modal-content">
                <div className="flex items-center justify-between p-4 border-b border-[#1B1B1B] dark:border-neutral-600">
                    <h3 className="font-bold text-lg">
                        {!_promptAddNew && 'Your Address Book'} {_promptAddNew && 'Add New'}
                    </h3>
                    <button onClick={() => setPromptFavorites(false)} aria-label="Close">
                        <CloseIcon fill="currentColor" />
                    </button>
                </div>

                {_promptAddNew && (
                    <Formik
                        initialValues={{ address: formik.values.address || '', name: '' }}
                        onSubmit={({ address, name }) => {
                            setError(false);

                            try {
                                updateAddressBook(address, utils.sanitizeSQLInput(name));
                                setPromptAddNew(false);
                            } catch (error) {
                                if (error instanceof Error) {
                                    return setError(error.message);
                                }

                                setError('Failed to add new contact, please try again later');
                            }
                        }}
                        validationSchema={yup.object().shape({
                            address: yup
                                .string()
                                .matches(/0|M[xX][0-9a-zA-Z]+/, 'Invalid Address.')
                                .min(59, 'Invalid Minima address')
                                .max(66, 'Invalid Minima address')
                                .required('Field required'),
                            name: yup.string().required('Field required').max(255),
                        })}
                    >
                        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting }) => (
                            <form className="my-4 mx-4 md:mx-0" onSubmit={handleSubmit}>
                                <div className="my-2">
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        placeholder="Minima Address"
                                        value={values.address}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="bg-white rounded p-4 w-full focus:border focus:outline-none dark:placeholder:text-neutral-600 dark:bg-[#1B1B1B]"
                                    />
                                    {errors && errors.address && touched && touched.address && (
                                        <p className="text-sm mt-2 dark:text-neutral-300">{errors.address}</p>
                                    )}
                                </div>
                                <div className="my-2">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="bg-white rounded p-4 w-full focus:border focus:outline-none dark:placeholder:text-neutral-600 dark:bg-[#1B1B1B]"
                                    />
                                    {errors && errors.name && touched && touched.name && (
                                        <p className="text-sm mt-2 dark:text-neutral-300">{errors.name}</p>
                                    )}
                                </div>

                                <div className="mt-8">
                                    <PrimaryButton disabled={isSubmitting} type="submit">
                                        Add
                                    </PrimaryButton>
                                    <SecondaryButton
                                        disabled={isSubmitting}
                                        extraClass="mt-2"
                                        onClick={() => setPromptAddNew(false)}
                                        type="button"
                                    >
                                        Cancel
                                    </SecondaryButton>
                                </div>
                            </form>
                        )}
                    </Formik>
                )}

                {!_promptAddNew && (
                    <>
                        <div className="my-3 px-3 flex gap-1">
                            <input
                                disabled={!Object.keys(_addressBook).length}
                                onChange={(e) => handleFilterTextChange(e)}
                                placeholder="Search contact"
                                type="search"
                                className="bg-white rounded-full p-3 px-4 w-full focus:outline-none focus:border focus:border-black focus:dark:border-neutral-600 dark:placeholder:text-neutral-600 dark:bg-[#1B1B1B] disabled:opacity-30"
                            />
                            <button
                                onClick={() => setPromptAddNew(true)}
                                type="button"
                                className="bg-neutral-100 dark:bg-[#1B1B1B] font-bold"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-3 md:px-0">
                            <ul className="overflow-y-auto">
                                {filterText.length > 0 && filteredEntries.length === 0 && (
                                    <li className="truncate">
                                        <p className="text-[#1b1b1b] dark:text-neutral-300 text-sm text-center">
                                            No results found
                                        </p>
                                    </li>
                                )}
                                {filterText.length === 0 && Object.keys(_addressBook).length === 0 && (
                                    <li className="truncate">
                                        <p className="text-[#1b1b1b] dark:text-neutral-300 text-sm text-center">
                                            No contacts yet
                                        </p>
                                    </li>
                                )}
                                {Object.entries(groupedEntries).map(([alphabet, entries]) => (
                                    <div key={alphabet}>
                                        <div className="flex items-center justify-center">
                                            <hr className="border-[0.1px] border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                                            <span className="mx-4 text-center text-[#1B1B1B] dark:text-neutral-400 font-bold text-[12px] flex-shrink-0">
                                                {alphabet}
                                            </span>
                                            <hr className="border-[0.1px] border-neutral-300 dark:border-neutral-600 my-1 w-full" />
                                        </div>
                                        {entries.map(([address, name]) => (
                                            <li
                                                onClick={() => handleSelect(address)}
                                                key={address}
                                                className="mb-2 transition-all hover:bg-neutral-300 hover:dark:bg-[#1B1B1B] px-4 hover:py-2 first:mt-4"
                                            >                                                
                                                <input
                                                    readOnly
                                                    value={name}
                                                    className="bg-transparent focus:outline-none truncate w-full text-[#1B1B1B] dark:text-neutral-300 font-bold"
                                                />
                                                <input
                                                    readOnly
                                                    value={address}
                                                    className="bg-transparent focus:outline-none truncate w-full"
                                                />
                                            </li>
                                        ))}
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </AnimatedDialog>
    );
};

export default Favorites;
