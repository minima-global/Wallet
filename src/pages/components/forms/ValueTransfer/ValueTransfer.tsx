import { Formik } from 'formik';
import Decimal from 'decimal.js';
import * as Yup from 'yup';
import React, { useContext, useEffect, useState } from 'react';

import Button from '../../../../components/UI/Button';
import { callSend } from '../../../../minima/rpc-commands';

import QrScanner from '../../../../shared/components/qrscanner/QrScanner';
import useIsVaultLocked from '../../../../hooks/useIsVaultLocked';
import WalletSelect from '../../WalletSelect';
import { appContext } from '../../../../AppContext';
import Input from '../../../../components/UI/Input';
import { createPortal } from 'react-dom';
import Grid from '../../../../components/UI/Grid';
import KeyValue from '../../../../components/UI/KeyValue';

import Lottie from 'lottie-react';
import Success from '../../../../assets/lottie/Success.json';
import Loading from '../../../../assets/lottie/Loading.json';
import TogglePasswordIcon from '../../../../components/UI/TogglePasswordIcon/TogglePasswordIcon';
import FeatureUnavailable from '../../../../components/UI/FeatureUnavailable';
import Burn from '../../../../components/UI/Burn';
import useFormatMinimaNumber from '../../../../__minima__/libs/utils/useMakeNumber';

import * as utils from '../../../../utilities';
import { Scan } from 'lucide-react';

const ValueTransfer = () => {
    const { balance: wallet, loaded } = useContext(appContext);
    const { makeMinimaNumber } = useFormatMinimaNumber();
    const mySchema = useFormSchema();
    const [openQrScanner, setOpenQrScanner] = React.useState(false);
    const userLockedVault = useIsVaultLocked();
    const [internalBrowserWarningModal, setInternalBrowserWarningModal] = useState(false);
    const [canUseWebcam, setCanUseWebcam] = useState(true);

    const [hidePassword, togglePasswordVisibility] = useState(false);
    const [error, setError] = useState<false | string>(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);

    const handleCloseQrScanner = () => {
        setOpenQrScanner(false);
    };
    const handleOpenQrScanner = () => {
        setOpenQrScanner(true);
    };

    useEffect(() => {
        if (window.navigator.userAgent.includes('Minima Browser')) {
            setCanUseWebcam(false);
        }
    }, []);

    return (
        <>
            <Formik
                initialValues={{ token: wallet[0], amount: '', address: '', burn: '', password: '', message: '' }}
                onSubmit={async (formInputs) => {
                    setStep(0);
                    setLoading(true);

                    if (!formInputs.password.length && userLockedVault) {
                        setLoading(false);
                        return setStep(5);
                    }

                    try {
                        const resp = await callSend(
                            formInputs.token,
                            formInputs.amount,
                            formInputs.address,
                            utils.encode(formInputs.message),
                            formInputs.burn,
                            formInputs.password
                        );

                        setLoading(false);
                        setStep(resp);
                    } catch (error) {
                        setLoading(false);
                        setError(error as string);
                    }
                }}
                validationSchema={mySchema}
                enableReinitialize={!!loaded.current}
            >
                {({
                    handleSubmit,
                    getFieldProps,
                    errors,
                    isValid,
                    isSubmitting,
                    submitForm,
                    values,
                    resetForm,
                    touched,
                    setFieldValue,
                }) => (
                    <>
                        <FeatureUnavailable
                            open={internalBrowserWarningModal}
                            closeModal={() => setInternalBrowserWarningModal(false)}
                        />
                        {step === 1 &&
                            createPortal(
                                <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                                    <Grid variant="lg" title={<></>}>
                                        <div className="mx-4 rounded bg-white bg-opacity-90 p-4 h-max max-h-[calc(100%_-_16px)] overflow-y-scroll">
                                            <h1 className="text-black font-semibold mb-8">Transaction review</h1>
                                            <div className="divide-y-2 mb-8">
                                                {values.token.tokenid !== '0x00' && (
                                                    <KeyValue
                                                        title="Token"
                                                        value={
                                                            values.token.token.name ? values.token.token.name : 'N/A'
                                                        }
                                                    />
                                                )}
                                                {values.token.tokenid === '0x00' && (
                                                    <KeyValue title="Token" value="Minima" />
                                                )}

                                                <KeyValue title="Recipient address" value={values.address} />
                                                <KeyValue
                                                    title="Amount"
                                                    value={makeMinimaNumber(values.amount, 2000)}
                                                />
                                                <KeyValue
                                                    title="Burn"
                                                    value={
                                                        parseInt(values.burn) > 0
                                                            ? makeMinimaNumber(values.burn, 2000)
                                                            : '0'
                                                    }
                                                />

                                                <KeyValue
                                                    title="Public message"
                                                    value={values.message.length > 0 ? values.message : 'N/A'}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 mt-8 md:mt-16">
                                                <Button
                                                    disabled={isSubmitting}
                                                    onClick={() => submitForm()}
                                                    variant="primary"
                                                >
                                                    Submit
                                                </Button>
                                                {!isSubmitting && (
                                                    <Button onClick={() => setStep(0)} variant="secondary">
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Grid>
                                </div>,

                                document.body
                            )}

                        {loading &&
                            createPortal(
                                <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                                    <Grid variant="sm" title={<></>}>
                                        <div className="mx-4 rounded bg-white bg-opacity-90 p-4 items-center h-max overflow-y-scroll">
                                            <div className="grid">
                                                <Lottie
                                                    className="w-[128px] h-[128px] self-center place-self-center justify-self-center"
                                                    animationData={Loading}
                                                    loop={true}
                                                />
                                                <h1 className="text-black text-center font-semibold text-xl mb-2">
                                                    Posting transaction...
                                                </h1>
                                            </div>
                                            <div />
                                        </div>
                                    </Grid>
                                </div>,

                                document.body
                            )}
                        {step === 2 &&
                            createPortal(
                                <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                                    <Grid variant="sm" title={<></>}>
                                        <div className="mx-4 rounded bg-white bg-opacity-90 p-4 items-center h-max overflow-y-scroll">
                                            <div className="grid">
                                                <Lottie
                                                    className="w-[128px] h-[128px] self-center place-self-center justify-self-center"
                                                    animationData={Success}
                                                    loop={false}
                                                />

                                                <h1 className="text-black text-center font-semibold text-xl mb-2">
                                                    Success
                                                </h1>
                                                <p className="text-black text-center">
                                                    The transaction has been posted and should arrive shortly.
                                                </p>
                                            </div>
                                            <div className="w-full mt-8 md:mt-16 self-end">
                                                {!isSubmitting && (
                                                    <Button
                                                        onClick={() => {
                                                            setStep(0);
                                                            resetForm();
                                                        }}
                                                        variant="secondary"
                                                    >
                                                        Close
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Grid>
                                </div>,

                                document.body
                            )}

                        {step === 3 &&
                            createPortal(
                                <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                                    <Grid variant="sm" title={<></>}>
                                        <div className="mx-4 rounded bg-white bg-opacity-90 p-4 items-center h-max overflow-y-scroll">
                                            <div>
                                                <svg
                                                    className="animate-pulse temporary-pulse fill-[rgb(78,227,193)] mb-4 mx-auto mt-8"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="64"
                                                    viewBox="0 -960 960 960"
                                                    width="64"
                                                >
                                                    <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
                                                </svg>

                                                <h1 className="text-black text-center font-semibold text-xl mb-2">
                                                    Transaction pending
                                                </h1>
                                                <p className="text-black text-center">
                                                    The transaction is awaiting confirmation. You have to accept this
                                                    pending action in the Pending minidapp.
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2 w-full mt-8 md:mt-16 self-end">
                                                {!isSubmitting && (
                                                    <Button
                                                        onClick={() => {
                                                            setStep(0);
                                                            resetForm();
                                                        }}
                                                        variant="secondary"
                                                    >
                                                        Close
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Grid>
                                </div>,

                                document.body
                            )}
                        {step === 5 &&
                            createPortal(
                                <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                                    <Grid variant="sm" title={<></>}>
                                        <div className="mx-4 rounded bg-white bg-opacity-90 p-4 h-max overflow-y-scroll">
                                            <h1 className="text-black font-semibold mb-8">Enter vault password</h1>
                                            <div className="divide-y-2 mb-8">
                                                <Input
                                                    id="password"
                                                    autoComplete="new-password"
                                                    disabled={isSubmitting}
                                                    {...getFieldProps('password')}
                                                    type={!hidePassword ? 'password' : 'text'}
                                                    placeholder="Enter password"
                                                    error={
                                                        touched.password && errors.password ? errors.password : false
                                                    }
                                                    endIcon={<TogglePasswordIcon toggle={hidePassword} />}
                                                    handleEndIconClick={() =>
                                                        togglePasswordVisibility((prevState) => !prevState)
                                                    }
                                                    extraClass="pr-16 truncate"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 mt-8 md:mt-16">
                                                <Button
                                                    disabled={isSubmitting}
                                                    onClick={() => {
                                                        submitForm();
                                                    }}
                                                    variant="primary"
                                                >
                                                    Submit
                                                </Button>
                                                {!isSubmitting && (
                                                    <Button onClick={() => setStep(0)} variant="secondary">
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Grid>
                                </div>,

                                document.body
                            )}

                        {error &&
                            createPortal(
                                <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                                    <Grid variant="sm" title={<></>}>
                                        <div className="mx-4 rounded bg-white bg-opacity-90 p-4 items-center">
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
                                                <p className="text-black text-center break-all">{error}</p>
                                            </div>
                                            <div className="flex flex-col gap-2 w-full mt-8 md:mt-16 self-end">
                                                {!isSubmitting && (
                                                    <Button
                                                        onClick={() => {
                                                            setError(false);

                                                            if (values.password.length) {
                                                                setFieldValue('password', '');
                                                            }
                                                        }}
                                                        variant="secondary"
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Grid>
                                </div>,

                                document.body
                            )}

                        <QrScanner closeModal={handleCloseQrScanner} open={openQrScanner} />
                        <form onSubmit={handleSubmit}>
                            <div>
                                <WalletSelect />

                                <div className="flex flex-col gap-4 mt-4">
                                    <Input
                                        id="address"
                                        type="text"
                                        disabled={isSubmitting}
                                        placeholder="Recipient Mx Address"
                                        {...getFieldProps('address')}
                                        error={touched.address && errors.address ? errors.address : false}
                                        extraClass="pr-12 truncate"                                        
                                        actionButton={
                                            <>
                                                {canUseWebcam && (
                                                    <button
                                                        className="bg-transparent text-black font-bold px-3 py-2 rounded-r outline-none"
                                                        onClick={handleOpenQrScanner}
                                                    >
                                                        <Scan className='w-6 h-6' />
                                                    </button>
                                                )}
                                            </>
                                        }
                                    />

                                    <Input
                                        id="amount"
                                        type="text"
                                        disabled={isSubmitting}
                                        placeholder="Amount"
                                        {...getFieldProps('amount')}
                                        error={touched.amount && errors.amount ? errors.amount : false}
                                        actionButton={
                                            <button
                                                type="button"
                                                className="bg-transparent text-black font-bold px-3 py-2 rounded-r outline-none"
                                                onClick={() => setFieldValue('amount', values.token.sendable)}
                                            >
                                                Max
                                            </button>
                                        }
                                    />

                                    <Input
                                        id="message"
                                        type="text"
                                        disabled={isSubmitting}
                                        placeholder="Message"
                                        {...getFieldProps('message')}
                                        error={touched.message && errors.message ? errors.message : false}
                                    />

                                    <Burn />
                                </div>

                                <Button
                                    extraClass="mt-8 md:mt-16"
                                    onClick={() => setStep(1)}
                                    variant="primary"
                                    disabled={!isValid}
                                >
                                    Review
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </Formik>
        </>
    );
};

export default ValueTransfer;

const useFormSchema = () => {
    const { balance: wallet } = useContext(appContext);
    return Yup.object().shape({
        token: Yup.object()
            .required('Field Required')
            .test('check-my-tokensendable', 'Invalid token sendable', function (val: any) {
                const { path, createError } = this;
                if (val === undefined) {
                    return false;
                }

                if (new Decimal(val.sendable).equals(new Decimal(0))) {
                    return createError({
                        path,
                        message: `Insufficient funds, not enough funds available to send`,
                    });
                }

                return true;
            }),
        address: Yup.string()
            .matches(/0|M[xX][0-9a-zA-Z]+/, 'Invalid Address.')
            .min(59, 'Invalid Address, too short.')
            .max(66, 'Invalid Address, too long.')
            .required('Field Required'),
        amount: Yup.string()
            .required('Field Required')
            .matches(
                /^[^a-zA-Z\\;'",]+$/,
                'Invalid number.  Make sure to use only digits, "." for decimals and nothing for thousands. (e.g 1000.234)'
            )
            .test('check-my-amount', 'Invalid amount', function (val) {
                const { path, createError, parent } = this;
                if (val === undefined) {
                    return false;
                }

                if (!Number(val)) {
                    return createError({
                        path,
                        message: 'Invalid number.  Make sure to only use "." for decimals and nothing for thousands.',
                    });
                }

                if (
                    parent.token &&
                    'sendable' in parent.token &&
                    new Decimal(val).greaterThan(new Decimal(parent.token.sendable))
                ) {
                    const desiredAmountToSend = new Decimal(val);
                    const available = new Decimal(parent.token.sendable);
                    const requiredAnother = desiredAmountToSend.minus(available);

                    return createError({
                        path,
                        message: `Oops, insufficient funds, you require another ${requiredAnother.toNumber()} ${
                            parent.tokenid === '0x00'
                                ? parent.token
                                : parent.token.token.name
                                ? parent.token.token.name
                                : 'Unavailable'
                        }`,
                    });
                }

                if (new Decimal(val).lessThanOrEqualTo(new Decimal(0))) {
                    return createError({
                        path,
                        message: `Oops, you haven't entered a valid amount to send`,
                    });
                }

                return true;
            }),
        burn: Yup.string()
            .matches(
                /^[^a-zA-Z\\;'",]+$/,
                'Invalid number.  Make sure to use only digits, "." for decimals and nothing for thousands. (e.g 1000.234)'
            )
            .test('check-my-burnamount', 'Invalid burn amount', function (val) {
                const { path, createError } = this;
                if (val === undefined) {
                    return true;
                }

                if (!Number(val)) {
                    return createError({
                        path,
                        message: 'Invalid number.  Make sure to only use "." for decimals and nothing for thousands.',
                    });
                }

                const burn = new Decimal(val);

                if (burn.greaterThan(wallet[0].sendable)) {
                    return createError({
                        path,
                        message: `Oops, not enough funds available to burn.  You require another ${burn
                            .minus(wallet[0].sendable)
                            .toNumber()} Minima`,
                    });
                }

                return true;
            }),
    });
};
