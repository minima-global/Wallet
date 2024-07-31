import { useContext, useEffect, useRef, useState } from 'react';
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
import * as utils from '../shared/utils';
import getCurrentNodeVersion from '../minima/commands/getCurrentVersion';

import * as rpc from '../__minima__/libs/RPC';
import KeyValue from '../components/UI/KeyValue';
import AnimatePageIn from '../components/UI/Animations/AnimatePageIn';
import { useLocation } from 'react-router-dom';

import Loading from '../components/UI/Lottie/Loading.json';
import Lottie from 'lottie-react';
import PrivateKey from './_components/PrivateKey';
import WalletAddress from './_components/WalletAddress';
import PrimaryButton from '../components/UI/PrimaryButton';
import AnimatedDialog from '../components/UI/AnimatedDialog';
import SecondaryButton from '../components/UI/SecondaryButton';
import CloseIcon from '../components/UI/Icons/CloseIcon';
import AddressItem from './_components/ReceiveAddressItem';

const Receive = () => {
    const location = useLocation();

    const {
        loaded,
        simpleAddresses,
        setOpenDrawer,
        _nicknameAddress,
        editNickname,
        showEditNickname,
        setShowEditNickname,
    } = useContext(appContext);
    const [address, setAddress] = useState<Scripts | null>(null);
    const [showFullList, setShowFullList] = useState(false);
    const [copyState, setCopy] = useState(false);
    const [filterText, setFilterText] = useState('');

    const [viewKey, setViewKey] = useState(false);
    const [remainingTime, setRemainingTime] = useState(5000);
    const [held, setHeld] = useState(false);
    const timeoutRef: any = useRef(null);

    const [error, setError] = useState<false | string>(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);
    const [validateAddress, setValidateAddress] = useState(false);
    const [validationData, setValidationData] = useState<any>(false);
    const [validBuild, setValidBuild] = useState<boolean | null>(null);

    useEffect(() => {
        if (loaded.current === true) {
            getCurrentNodeVersion().then((v) => {
                const versionCheckAddressWasIntroduced = '1.0.21';
                const comparison = v.localeCompare(versionCheckAddressWasIntroduced);
                const isRunningSufficientVersion = comparison === 0 || comparison === 1;

                if (isRunningSufficientVersion) {
                    setValidBuild(true);
                }
                if (!isRunningSufficientVersion) {
                    setValidBuild(false);
                }
            });
        }
    }, [loaded.current]);
    const handleFilterTextChange = (evt) => {
        setFilterText(evt.target.value);
    };
    const handleStart = () => {
        timeoutRef.current = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(timeoutRef.current);
                    setHeld(true);
                    setViewKey(true);
                    return 0;
                }
                return prevTime - 1000;
            });
        }, 1000);
        setHeld(true);
    };

    const handleEnd = () => {
        setViewKey(false);
        clearInterval(timeoutRef.current);
        setRemainingTime(5000);
        setHeld(false);
    };

    useEffect(() => {
        if (simpleAddresses.length) {
            setAddress(simpleAddresses[Math.floor(Math.random() * simpleAddresses.length)]);
        }
    }, [simpleAddresses]);

    const validateCurrentAddress = () => {
        setLoading(true);

        if (address) {
            rpc.checkAddress(address?.miniaddress)
                .then((result) => {
                    setValidationData({ address: address.miniaddress, ...result });
                })
                .catch((err) => {
                    console.error(err);
                    setError(err as string);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const handleCopyClick = () => {
        copy(address ? address.miniaddress : '');
        setCopy(true);
        setTimeout(() => {
            setCopy(false);
        }, 2500);
    };

    const filteredAddresses = (simpleAddresses as Scripts[]).filter(
        (a) =>
            a.miniaddress.includes(filterText) ||
            (_nicknameAddress &&
                _nicknameAddress[a.miniaddress] &&
                _nicknameAddress[a.miniaddress].includes(filterText))
    );

    return (
        <>
            <AnimatedDialog display={showFullList} dismiss={() => setShowFullList(false)}>
                <div className="h-full grid md:items-center">
                    <div className="relative left-0 right-0 bottom-0 top-0 bg-transparent">
                        <div className="bg-neutral-100 h-full shadow-lg dark:shadow-none dark:bg-black w-full rounded-none md:w-[calc(100%_-_16px)]  mx-auto p-4 px-0 md:rounded md:max-w-[560px] overflow-hidden">
                            <div className="flex items-center justify-between mb-3 px-3">
                                <h3 className="font-bold tracking-wide">Default Addresses</h3>
                                <span onClick={() => setShowFullList(false)}>
                                    <CloseIcon fill="currentColor" />
                                </span>
                            </div>

                            <div className="my-3 px-3">
                                <input
                                    onChange={handleFilterTextChange}
                                    placeholder="Search address"
                                    type="search"
                                    className="bg-white rounded-full p-3 px-4 w-full focus:outline-none focus:border focus:border-black focus:dark:border-neutral-600   dark:placeholder:text-neutral-600 dark:bg-[#1B1B1B]"
                                />
                            </div>
                            <div className="overflow-y-auto h-[760px] md:h-[240px]">
                                <ul className="overflow-y-auto">
                                    {!filteredAddresses.length && (
                                        <li className="truncate mb-2 px-4 p-4 first:mt-2 text-black hover:bg-slate-50 hover:cursor-pointer">
                                            <h1 className="text-center font-medium">No results found</h1>
                                        </li>
                                    )}
                                    {filteredAddresses.map((a) => (
                                        <AddressItem
                                            key={a.address}
                                            address={a}
                                            setAddress={setAddress}
                                            filterText={filterText}
                                            setFilterText={setFilterText}
                                            setShowFullList={setShowFullList}
                                        />
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedDialog>

            <AnimatePageIn display={location.pathname.includes('/dashboard/receive')}>
                <div className="mx-3 mt-8">
                    <div className="grid grid-cols-[1fr_auto] items-center">
                        <h6 className="font-bold tracking-wide dark:text-neutral-300">Receive</h6>
                    </div>
                    <p>These are all your default addresses</p>

                    {address ? (
                        <div>
                            <div>
                                <h3 className="text-center tracking-wide">
                                    {_nicknameAddress[address.miniaddress]
                                        ? '@' + _nicknameAddress[address.miniaddress]
                                        : null}
                                </h3>
                            </div>
                            <div className="flex justify-center">
                                <QRCode
                                    className="bg-white dark:bg-[#1B1B1B] p-2"
                                    size={250}
                                    value={address.miniaddress}
                                />
                            </div>

                            <div className="relative flex justify-center items-center flex-col my-4">
                                <div className="w-max">
                                    <WalletAddress _address={address.miniaddress} />
                                </div>
                                {!viewKey && (
                                    <button
                                        onMouseDown={handleStart}
                                        onMouseUp={handleEnd}
                                        onMouseLeave={handleEnd}
                                        onTouchStart={handleStart}
                                        onTouchEnd={handleEnd}
                                        className="mt-2 font-bold w-full max-w-[200px] rounded-lg text-white bg-purple-600"
                                    >
                                        {held
                                            ? `Hold to reveal... (${Math.ceil(remainingTime / 1000)}s)`
                                            : `View seed phrase`}
                                    </button>
                                )}
                                {viewKey && (
                                    <div className="my-2">
                                        <PrivateKey fullAddress />
                                        <div
                                            className="max-w-xs my-2 mx-auto bg-yellow-600 border border-yellow-600 text-white dark:text-[#1B1B1B] px-4 py-3 rounded relative"
                                            role="alert"
                                        >
                                            <strong className="font-bold mr-1">Warning</strong>
                                            <span className="block sm:inline">
                                                Never share your private key with anyone! Doing so could result in the
                                                loss of your funds.
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleEnd()}
                                            className="w-full dark:bg-violet-600 text-white font-bold"
                                        >
                                            Done
                                        </button>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <SecondaryButton type="button" onClick={() => setShowFullList(true)}>
                                        View All
                                    </SecondaryButton>
                                </div>

                                {window.navigator.userAgent.includes('Minima Browser') && (
                                    <div
                                        className="mt-4"
                                        onClick={() => {
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            Android.shareText(_address);
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="icon icon-tabler icon-tabler-user-share"
                                            width="34"
                                            height="34"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                            <path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                            <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                            <path d="M8.7 10.7l6.6 -3.4" />
                                            <path d="M8.7 13.3l6.6 3.4" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <Lottie
                                className="w-[64px] h-[64px] self-center place-self-center justify-self-center"
                                animationData={Loading}
                                loop={true}
                            />
                        </div>
                    )}
                </div>
            </AnimatePageIn>
        </>
    );
    return (
        <>
            <Grid
                variant="lg"
                title={
                    <>
                        <svg
                            onClick={(e: any) => {
                                e.stopPropagation();
                                setOpenDrawer(true);
                            }}
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
                            <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-[50px] bg-black bg-opacity-50 animate-fadeIn">
                                <Grid variant="sm" title={<></>}>
                                    <div className="mx-4 rounded bg-white p-4 h-max">
                                        <h1 className="text-black font-semibold mb-8">Enter a nickname</h1>
                                        <div className="divide-y-2 mb-8">
                                            <Formik
                                                initialValues={{ nickname: '' }}
                                                onSubmit={(data) => {
                                                    const { nickname } = data;
                                                    editNickname(address?.miniaddress, nickname.replaceAll("'", ' '));
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
                                                            extraClass={`${
                                                                errors.nickname ? 'pr-20 truncate' : ''
                                                            } bg-blue-100`}
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
                                                                extraClass="mt-8 md:mt-16"
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
                        className="!p-0"
                        header={
                            <>
                                {error &&
                                    createPortal(
                                        <div
                                            onClick={() => setError(false)}
                                            className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn"
                                        >
                                            <Grid variant="sm" title={<></>}>
                                                <div
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="mx-4 rounded bg-white bg-opacity-90 p-4 items-center h-max max-h-[calc(100%_-_16px)] overflow-y-scroll"
                                                >
                                                    <div>
                                                        <svg
                                                            className="animate-pulse temporary-pulse fill-[var(--status-red)] mb-4
                                                mx-auto mt-8"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            height="64"
                                                            viewBox="0 -960 960 960"
                                                            width="64"
                                                        >
                                                            <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                                                        </svg>
                                                        <h1 className="text-black text-center font-semibold text-xl mb-2">
                                                            Hmm... something went wrong!
                                                        </h1>
                                                        <p className="text-black text-center break-all">
                                                            {typeof error.includes !== 'undefined' &&
                                                            error.includes('java.lang.IllegalArgumentException:')
                                                                ? error.split('java.lang.IllegalArgumentException:')[1]
                                                                : error}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col gap-2 w-full mt-8 md:mt-16 self-end">
                                                        <Button
                                                            onClick={() => {
                                                                setError(false);
                                                            }}
                                                            variant="secondary"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Grid>
                                        </div>,

                                        document.body
                                    )}
                                {validateAddress &&
                                    createPortal(
                                        <div
                                            onClick={() => setValidateAddress(false)}
                                            className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn"
                                        >
                                            <Grid
                                                variant="lg"
                                                title={
                                                    <>
                                                        <svg
                                                            className="fill-white hover:cursor-pointer"
                                                            onClick={(e: any) => {
                                                                e.stopPropagation();
                                                                setValidateAddress(false);
                                                            }}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            height="24"
                                                            viewBox="0 -960 960 960"
                                                            width="24"
                                                        >
                                                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                                        </svg>
                                                        Enter address
                                                    </>
                                                }
                                            >
                                                <CardContent
                                                    onClick={(e: any) => e.stopPropagation()}
                                                    header={<></>}
                                                    content={
                                                        <>
                                                            <Formik
                                                                initialValues={{ address: '' }}
                                                                onSubmit={async (formInputs) => {
                                                                    setStep(0);
                                                                    setLoading(true);

                                                                    const { address } = formInputs;
                                                                    try {
                                                                        const resp = await rpc.checkAddress(
                                                                            formInputs.address
                                                                        );
                                                                        setLoading(false);
                                                                        setStep(1);
                                                                        setValidationData({ address, ...resp });
                                                                    } catch (error) {
                                                                        setLoading(false);
                                                                        setError(error as string);
                                                                    }
                                                                }}
                                                                validationSchema={validationSchema}
                                                            >
                                                                {({
                                                                    handleSubmit,
                                                                    getFieldProps,
                                                                    isValid,
                                                                    isSubmitting,
                                                                    touched,
                                                                    errors,
                                                                }) => (
                                                                    <>
                                                                        <form onSubmit={handleSubmit}>
                                                                            <div>
                                                                                <Input
                                                                                    extraClass="bg-blue-100!"
                                                                                    disabled={isSubmitting}
                                                                                    type="text"
                                                                                    id="address"
                                                                                    {...getFieldProps('address')}
                                                                                    placeholder="0x or Mx address"
                                                                                    error={
                                                                                        errors.address &&
                                                                                        touched.address
                                                                                            ? errors.address
                                                                                            : false
                                                                                    }
                                                                                />
                                                                                <Button
                                                                                    extraClass="mt-8 md:mt-16"
                                                                                    type="submit"
                                                                                    variant="primary"
                                                                                    disabled={!isValid || loading}
                                                                                >
                                                                                    {!loading && 'Validate'}
                                                                                    {!!loading && (
                                                                                        <div className="flex items-center justify-center">
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                className="animate-spin"
                                                                                                width="24"
                                                                                                height="24"
                                                                                                viewBox="0 0 24 24"
                                                                                                strokeWidth="2"
                                                                                                stroke="currentColor"
                                                                                                fill="none"
                                                                                                strokeLinecap="round"
                                                                                                strokeLinejoin="round"
                                                                                            >
                                                                                                <path
                                                                                                    stroke="none"
                                                                                                    d="M0 0h24v24H0z"
                                                                                                    fill="none"
                                                                                                />
                                                                                                <path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" />
                                                                                                <path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" />
                                                                                                <path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" />
                                                                                                <path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" />
                                                                                                <path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" />
                                                                                            </svg>
                                                                                        </div>
                                                                                    )}
                                                                                </Button>
                                                                            </div>
                                                                        </form>
                                                                    </>
                                                                )}
                                                            </Formik>
                                                        </>
                                                    }
                                                />
                                            </Grid>
                                        </div>,
                                        document.body
                                    )}

                                {validationData &&
                                    createPortal(
                                        <div
                                            onClick={() => setValidationData(false)}
                                            className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn"
                                        >
                                            <Grid
                                                variant="lg"
                                                title={
                                                    <>
                                                        <svg
                                                            className="fill-white hover:cursor-pointer"
                                                            onClick={(e: any) => {
                                                                e.stopPropagation();
                                                                setValidationData(false);
                                                                if (validateAddress) {
                                                                    setValidateAddress(false);
                                                                }
                                                            }}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            height="24"
                                                            viewBox="0 -960 960 960"
                                                            width="24"
                                                        >
                                                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                                        </svg>
                                                        Validation Report
                                                    </>
                                                }
                                            >
                                                <CardContent
                                                    onClick={(e: any) => e.stopPropagation()}
                                                    header={<></>}
                                                    content={
                                                        <>
                                                            <div
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="mb-8 flex flex-col gap-2"
                                                            >
                                                                <KeyValue
                                                                    truncate={false}
                                                                    title="Validating"
                                                                    value={validationData.address}
                                                                />
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div className="bg-blue-100 rounded-lg text-black font-bold  p-4 grid grid-cols-1 grid-rows-[1fr_auto]">
                                                                        <h3 className="pb-8 text-center text-sm">
                                                                            Address belongs to this node?
                                                                        </h3>
                                                                        <div className="text-center flex justify-center">
                                                                            {validationData.relevant && (
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="32"
                                                                                    height="32"
                                                                                    viewBox="0 0 24 24"
                                                                                    strokeWidth="2"
                                                                                    stroke="currentColor"
                                                                                    fill="none"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                >
                                                                                    <path
                                                                                        stroke="none"
                                                                                        d="M0 0h24v24H0z"
                                                                                        fill="none"
                                                                                    />
                                                                                    <path
                                                                                        d="M12 2c-.218 0 -.432 .002 -.642 .005l-.616 .017l-.299 .013l-.579 .034l-.553 .046c-4.785 .464 -6.732 2.411 -7.196 7.196l-.046 .553l-.034 .579c-.005 .098 -.01 .198 -.013 .299l-.017 .616l-.004 .318l-.001 .324c0 .218 .002 .432 .005 .642l.017 .616l.013 .299l.034 .579l.046 .553c.464 4.785 2.411 6.732 7.196 7.196l.553 .046l.579 .034c.098 .005 .198 .01 .299 .013l.616 .017l.642 .005l.642 -.005l.616 -.017l.299 -.013l.579 -.034l.553 -.046c4.785 -.464 6.732 -2.411 7.196 -7.196l.046 -.553l.034 -.579c.005 -.098 .01 -.198 .013 -.299l.017 -.616l.005 -.642l-.005 -.642l-.017 -.616l-.013 -.299l-.034 -.579l-.046 -.553c-.464 -4.785 -2.411 -6.732 -7.196 -7.196l-.553 -.046l-.579 -.034a28.058 28.058 0 0 0 -.299 -.013l-.616 -.017l-.318 -.004l-.324 -.001zm2.293 7.293a1 1 0 0 1 1.497 1.32l-.083 .094l-4 4a1 1 0 0 1 -1.32 .083l-.094 -.083l-2 -2a1 1 0 0 1 1.32 -1.497l.094 .083l1.293 1.292l3.293 -3.292z"
                                                                                        fill="#00B894"
                                                                                        strokeWidth="0"
                                                                                    />
                                                                                </svg>
                                                                            )}
                                                                            {!validationData.relevant && (
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="32"
                                                                                    height="32"
                                                                                    viewBox="0 0 24 24"
                                                                                    strokeWidth="2"
                                                                                    stroke="#FF5252"
                                                                                    fill="none"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                >
                                                                                    <path
                                                                                        stroke="none"
                                                                                        d="M0 0h24v24H0z"
                                                                                        fill="none"
                                                                                    />
                                                                                    <path d="M10 8l4 8" />
                                                                                    <path d="M10 16l4 -8" />
                                                                                    <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
                                                                                </svg>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="bg-blue-100 rounded-lg text-black font-bold p-4 grid grid-cols-1 grid-rows-[1fr_auto]">
                                                                        <h3 className="pb-8 text-center text-sm">
                                                                            Simple address?
                                                                        </h3>
                                                                        <div className="text-center flex justify-center">
                                                                            {validationData.simple && (
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="32"
                                                                                    height="32"
                                                                                    viewBox="0 0 24 24"
                                                                                    strokeWidth="2"
                                                                                    stroke="currentColor"
                                                                                    fill="none"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                >
                                                                                    <path
                                                                                        stroke="none"
                                                                                        d="M0 0h24v24H0z"
                                                                                        fill="none"
                                                                                    />
                                                                                    <path
                                                                                        d="M12 2c-.218 0 -.432 .002 -.642 .005l-.616 .017l-.299 .013l-.579 .034l-.553 .046c-4.785 .464 -6.732 2.411 -7.196 7.196l-.046 .553l-.034 .579c-.005 .098 -.01 .198 -.013 .299l-.017 .616l-.004 .318l-.001 .324c0 .218 .002 .432 .005 .642l.017 .616l.013 .299l.034 .579l.046 .553c.464 4.785 2.411 6.732 7.196 7.196l.553 .046l.579 .034c.098 .005 .198 .01 .299 .013l.616 .017l.642 .005l.642 -.005l.616 -.017l.299 -.013l.579 -.034l.553 -.046c4.785 -.464 6.732 -2.411 7.196 -7.196l.046 -.553l.034 -.579c.005 -.098 .01 -.198 .013 -.299l.017 -.616l.005 -.642l-.005 -.642l-.017 -.616l-.013 -.299l-.034 -.579l-.046 -.553c-.464 -4.785 -2.411 -6.732 -7.196 -7.196l-.553 -.046l-.579 -.034a28.058 28.058 0 0 0 -.299 -.013l-.616 -.017l-.318 -.004l-.324 -.001zm2.293 7.293a1 1 0 0 1 1.497 1.32l-.083 .094l-4 4a1 1 0 0 1 -1.32 .083l-.094 -.083l-2 -2a1 1 0 0 1 1.32 -1.497l.094 .083l1.293 1.292l3.293 -3.292z"
                                                                                        fill="#00B894"
                                                                                        strokeWidth="0"
                                                                                    />
                                                                                </svg>
                                                                            )}
                                                                            {!validationData.simple && (
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="32"
                                                                                    height="32"
                                                                                    viewBox="0 0 24 24"
                                                                                    strokeWidth="2"
                                                                                    stroke="#FF5252"
                                                                                    fill="none"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                >
                                                                                    <path
                                                                                        stroke="none"
                                                                                        d="M0 0h24v24H0z"
                                                                                        fill="none"
                                                                                    />
                                                                                    <path d="M10 8l4 8" />
                                                                                    <path d="M10 16l4 -8" />
                                                                                    <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
                                                                                </svg>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <KeyValue
                                                                    truncate={false}
                                                                    title="0x"
                                                                    value={validationData['0x']}
                                                                    clipboard
                                                                />
                                                                <KeyValue
                                                                    truncate={false}
                                                                    title="Mx"
                                                                    value={validationData['Mx']}
                                                                    clipboard
                                                                />

                                                                {validateAddress && (
                                                                    <button
                                                                        onClick={() => setValidationData(false)}
                                                                        className="hover:opacity-90 bg-black text-white font-bold p-4 rounded mt-8"
                                                                    >
                                                                        Back
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </>
                                                    }
                                                />
                                            </Grid>
                                        </div>,
                                        document.body
                                    )}

                                <div className="flex justify-center flex-col items-center">
                                    <div className="flex flex-end justify-end w-full">
                                        <div className="px-1 py-2 flex items-center gap-2">
                                            <button
                                                disabled={!validBuild || loading || !address}
                                                onClick={validateCurrentAddress}
                                                className="disabled:bg-opacity-30 disabled:text-red hover:opacity-90 bg-black text-white px-4 py-2 md:px-2 md:py-1 rounded"
                                            >
                                                {!loading && 'Validate'}
                                                {!!loading && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="animate-spin"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="2"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" />
                                                        <path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" />
                                                        <path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" />
                                                        <path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" />
                                                        <path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" />
                                                    </svg>
                                                )}
                                            </button>
                                            <button
                                                disabled={!validBuild}
                                                onClick={() => setValidateAddress(true)}
                                                className="bg-slate-700 text-white h-full px-2 rounded"
                                            >
                                                {validBuild && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="2"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                                                        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                                                    </svg>
                                                )}
                                                {!validBuild && 'v1.0.21+'}
                                            </button>
                                        </div>
                                    </div>

                                    <QRCode
                                        onClick={handleCopyClick}
                                        className="rounded h-[210px] w-[210px] md:h-[240px] md:w-[240px] mt-8 animate-fadeIn"
                                        value={address ? address?.miniaddress : ''}
                                        type="M"
                                    />

                                    <div className="flex items-center">
                                        <svg
                                            className="w-5 h-5 animate-bounce temporary-pulse"
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24"
                                            viewBox="0 -960 960 960"
                                            width="24"
                                        >
                                            <path d="M419-80q-28 0-52.5-12T325-126L107-403l19-20q20-21 48-25t52 11l74 45v-328q0-17 11.5-28.5T340-760q17 0 29 11.5t12 28.5v472l-97-60 104 133q6 7 14 11t17 4h221q33 0 56.5-23.5T720-240v-160q0-17-11.5-28.5T680-440H461v-80h219q50 0 85 35t35 85v160q0 66-47 113T640-80H419ZM167-620q-13-22-20-47.5t-7-52.5q0-83 58.5-141.5T340-920q83 0 141.5 58.5T540-720q0 27-7 52.5T513-620l-69-40q8-14 12-28.5t4-31.5q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 17 4 31.5t12 28.5l-69 40Zm335 280Z" />
                                        </svg>
                                        <h1 className="text-[12px] mt-1">Tap the QR Code to copy address</h1>
                                    </div>
                                </div>
                            </>
                        }
                        content={
                            <div>
                                <div
                                    className={`p-4 ${
                                        copyState ? 'bg-green-good' : 'bg-white hover:bg-slate-100 hover:cursor-pointer'
                                    }`}
                                >
                                    {!copyState && (
                                        <>
                                            <div
                                                onClick={(e: any) => e.stopPropagation()}
                                                className={`flex justify-center md:grid md:grid-cols-[auto_1fr] md:grid-rows-1 gap-2 w-full`}
                                            >
                                                <h1
                                                    className="text-black font-semibold truncate"
                                                    onClick={(e: any) => e.stopPropagation()}
                                                >
                                                    {address &&
                                                    _nicknameAddress &&
                                                    _nicknameAddress[address.miniaddress]
                                                        ? _nicknameAddress[address.miniaddress]
                                                        : 'Untitled address'}
                                                </h1>
                                                {address && (
                                                    <svg
                                                        onClick={(e: any) => {
                                                            e.stopPropagation();
                                                            setShowEditNickname(address.miniaddress);
                                                        }}
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

                                            <div
                                                className={`flex justify-center md:grid md:grid-cols-[auto_1fr] md:grid-rows-1 gap-1 items-center`}
                                            >
                                                <p
                                                    onClick={(e: any) => e.stopPropagation()}
                                                    className="text-black text-sm overflow-x-auto"
                                                >
                                                    {address ? address.miniaddress : ''}
                                                </p>

                                                <button className="hidden md:block" onClick={handleCopyClick}>
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
                                        </>
                                    )}
                                    {copyState && (
                                        <div className="flex justify-center gap-1 items-center animate-fadeIn">
                                            <h1 className="text-black truncate gap-1">Copied</h1>

                                            <svg
                                                className=""
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24"
                                                viewBox="0 -960 960 960"
                                                width="24"
                                            >
                                                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                                            </svg>
                                        </div>
                                    )}
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
                                    id="address-selector"
                                    aria-expanded={!showFullList}
                                    className="accordion-content rounded bg-white h-[250px] divide-y-1"
                                >
                                    <li className="mx-4 my-2">
                                        <Input
                                            extraClass="text-center md:text-left"
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
                                                <h1 className="text-black font-semibold truncate text-center md:text-left">
                                                    {_nicknameAddress && _nicknameAddress[a.miniaddress]
                                                        ? _nicknameAddress[a.miniaddress]
                                                        : 'Untitled address'}
                                                </h1>
                                                <p className="text-black text-sm hidden md:block truncate text-center md:text-left">
                                                    {a.miniaddress}
                                                </p>
                                                <p className="text-black text-sm  md:hidden text-center md:text-left">
                                                    {utils.truncateString(a.miniaddress, 12, 12)}
                                                </p>
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

const validationSchema = () => {
    return Yup.object().shape({
        address: Yup.string()
            .matches(/0|M[xX][0-9a-zA-Z]+/, 'Invalid Address.')
            .min(59, 'Invalid Address, too short.')
            .max(66, 'Invalid Address, too long.')
            .required('Field Required'),
    });
};
