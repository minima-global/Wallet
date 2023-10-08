import { useContext, useEffect, useState } from 'react';
import { copy } from '../shared/functions';
import QRCode from 'react-qr-code';
import CardContent from '../components/UI/CardContent';
import { Scripts } from '../@types/minima';
import Grid from '../components/UI/Grid';
import { appContext } from '../AppContext';
import { createPortal } from 'react-dom';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { Formik } from 'formik';
import * as Yup from 'yup';

const Receive = () => {
    const { simpleAddresses, setOpenDrawer, _nicknameAddress, editNickname, showEditNickname, setShowEditNickname } =
        useContext(appContext);
    const [address, setAddress] = useState<Scripts | null>(null);
    const [showFullList, setShowFullList] = useState(false);
    const [copyState, setCopy] = useState(false);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        if (simpleAddresses.length) {
            setAddress(simpleAddresses[Math.floor(Math.random() * simpleAddresses.length)]);
        }
    }, [simpleAddresses]);

    const handleCopyClick = () => {
        copy(address ? address.miniaddress : '');
        setCopy(true);
        setTimeout(() => {
            setCopy(false);
        }, 2500);
    };

    return (
        <>
            <Grid
                variant="lg"
                title={
                    <>
                        <svg
                            onClick={() => setOpenDrawer(true)}
                            className="block md:hidden fill-white"
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 -960 960 960"
                            width="24"
                        >
                            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                        </svg>
                        Receive
                    </>
                }
            >
                <div>
                    {showEditNickname &&
                        createPortal(
                            <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                                <Grid variant="sm" title={<></>}>
                                    <div className="mx-4 rounded bg-white bg-opacity-90 p-4">
                                        <h1 className="text-black font-semibold mb-8">Enter a nickname</h1>
                                        <div className="divide-y-2 mb-8">
                                            <Formik
                                                initialValues={{ nickname: '' }}
                                                onSubmit={(data) => {
                                                    const { nickname } = data;
                                                    editNickname(address?.miniaddress, nickname);
                                                }}
                                                validationSchema={Yup.object().shape({
                                                    nickname: Yup.string()
                                                        .required('Field is required')
                                                        .max(255, "A nickname can't be longer than 255 characters"),
                                                })}
                                            >
                                                {({
                                                    getFieldProps,
                                                    errors,
                                                    isSubmitting,
                                                    values,
                                                    touched,
                                                    isValid,
                                                    handleSubmit,
                                                }) => (
                                                    <form onSubmit={handleSubmit}>
                                                        <Input
                                                            id="nickname"
                                                            type="text"
                                                            disabled={isSubmitting}
                                                            placeholder="Enter a nickname"
                                                            {...getFieldProps('nickname')}
                                                            error={
                                                                errors.nickname && touched.nickname
                                                                    ? errors.nickname
                                                                    : false
                                                            }
                                                            extraClass={`${errors.nickname ? 'pr-20 truncate' : ''}`}
                                                            endIcon={
                                                                <>
                                                                    {values.nickname.length >= 255 && (
                                                                        <div className="m-auto text-sm flex items-center justify-center red-bad font-semibold">
                                                                            {values.nickname.length + '/255'}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            }
                                                        />
                                                        <div className="flex flex-col gap-2 mt-4">
                                                            <Button
                                                                disabled={isSubmitting || !isValid}
                                                                type="submit"
                                                                variant="primary"
                                                            >
                                                                Update
                                                            </Button>
                                                            {!isSubmitting && (
                                                                <Button
                                                                    onClick={() => setShowEditNickname(false)}
                                                                    variant="secondary"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </form>
                                                )}
                                            </Formik>
                                        </div>
                                    </div>
                                </Grid>
                            </div>,

                            document.body
                        )}
                    <CardContent
                        className="p-0"
                        header={
                            <>
                                <div className="flex justify-center">
                                    <QRCode
                                        className="rounded h-[240px] w-[240px] mt-8 animate-fadeIn"
                                        value={address ? address?.miniaddress : ''}
                                        type="M"
                                    />
                                </div>
                            </>
                        }
                        content={
                            <div>
                                <div className="bg-white p-4">
                                    <div className="grid grid-cols-[auto_1fr] grid-rows-1 gap-2 w-full">
                                        <h1 className="text-black font-semibold truncate">
                                            {address && _nicknameAddress && _nicknameAddress[address.miniaddress]
                                                ? _nicknameAddress[address.miniaddress]
                                                : 'N/A'}
                                        </h1>
                                        {address && (
                                            <svg
                                                onClick={() => setShowEditNickname(address.miniaddress)}
                                                className="hover:cursor-pointer hover:scale-105 fill-purple-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="20"
                                                viewBox="0 -960 960 960"
                                                width="20"
                                            >
                                                <path d="M200-200h56l345-345-56-56-345 345v56Zm572-403L602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 24 55.5T829-660l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Zm-141-29-28-28 56 56-28-28Z" />
                                            </svg>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-[auto_1fr] grid-rows-1 gap-1 items-center">
                                        <p className="text-black text-sm truncate">
                                            {address ? address.miniaddress : ''}
                                        </p>
                                        <button onClick={handleCopyClick}>
                                            {!copyState && (
                                                <svg
                                                    className="fill-black"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="20"
                                                    viewBox="0 -960 960 960"
                                                    width="20"
                                                >
                                                    <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                                                </svg>
                                            )}
                                            {copyState && (
                                                <svg
                                                    className="fill-[#FFA010]"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="20"
                                                    viewBox="0 -960 960 960"
                                                    width="20"
                                                >
                                                    <path d="m438-240 226-226-58-58-169 169-84-84-57 57 142 142ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    className="bg-black text-white w-full px-4 py-2 flex items-center justify-center"
                                    onClick={() => setShowFullList((prevState) => !prevState)}
                                >
                                    <svg
                                        className={`fill-white ${showFullList ? 'arrow-active' : 'arrow-passive'}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24"
                                        viewBox="0 -960 960 960"
                                        width="24"
                                    >
                                        <path d="m296-345-56-56 240-240 240 240-56 56-184-184-184 184Z" />
                                    </svg>
                                </button>

                                <ul
                                    aria-expanded={!showFullList}
                                    className="accordion-content rounded bg-white h-[250px] divide-y-1"
                                >
                                    <li className="mx-4 my-2">
                                        <Input
                                            id="search"
                                            name="search"
                                            disabled={false}
                                            value={filterText}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setFilterText(e.target.value)
                                            }
                                            type="search"
                                            placeholder="Search nickname/address"
                                        />
                                    </li>
                                    {!(simpleAddresses as Scripts[]).filter(
                                        (a) =>
                                            a.miniaddress.includes(filterText) ||
                                            (_nicknameAddress &&
                                                _nicknameAddress[a.miniaddress] &&
                                                _nicknameAddress[a.miniaddress].includes(filterText))
                                    ).length && (
                                        <li className="truncate mb-2 px-4 p-4 first:mt-2 text-black hover:bg-slate-50 hover:cursor-pointer">
                                            <h1 className="text-center font-medium">No results found</h1>
                                        </li>
                                    )}
                                    {(simpleAddresses as Scripts[])
                                        .filter(
                                            (a) =>
                                                a.miniaddress.includes(filterText) ||
                                                (_nicknameAddress &&
                                                    _nicknameAddress[a.miniaddress] &&
                                                    _nicknameAddress[a.miniaddress].includes(filterText))
                                        )
                                        .map((a) => (
                                            <li
                                                key={a.address}
                                                onClick={() => {
                                                    setAddress(a);
                                                    if (filterText.length) {
                                                        setFilterText('');
                                                    }
                                                    setShowFullList(false);
                                                }}
                                                className="truncate mb-2 px-4 p-4 first:mt-2 text-black hover:bg-slate-50 hover:cursor-pointer"
                                            >
                                                <h1 className="text-black font-semibold truncate">
                                                    {_nicknameAddress && _nicknameAddress[a.miniaddress]
                                                        ? _nicknameAddress[a.miniaddress]
                                                        : 'N/A'}
                                                </h1>
                                                <p className="text-black truncate text-sm">{a.miniaddress}</p>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        }
                    />
                </div>
            </Grid>
        </>
    );
};
export default Receive;
