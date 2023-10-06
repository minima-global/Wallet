import { useContext, useState } from 'react';
import { CardContent, TextField, Stack } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { isValidURLAll, isValidURLSecureOnly } from '../../shared/functions';

import GridLayout from '../../layout/GridLayout';

import Decimal from 'decimal.js';
import { NoResults } from '../../shared/components/layout/MiToken';
import FormImageUrlSelect from '../../shared/components/forms/FormImageUrlSelect';
import { appContext } from '../../AppContext';

import * as rpc from '../../__minima__/libs/RPC';

import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Grid from '../../components/UI/Grid';
import KeyValue from '../../components/UI/KeyValue';

import Lottie from 'lottie-react';
import Success from '../../assets/lottie/Success.json';
import Loading from '../../assets/lottie/Loading.json';

import { createPortal } from 'react-dom';
import useIsVaultLocked from '../../hooks/useIsVaultLocked';

const TokenCreation = () => {
    const mySchema = useMySchema();
    const { balance: wallet, setOpenDrawer, avgBurn } = useContext(appContext);
    const userLockedVault = useIsVaultLocked();

    const [error, setError] = useState<false | string>(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);

    return (
        <Grid
            variant="lg"
            title={
                <>
                    {' '}
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
                    Token creation
                </>
            }
        >
            <Formik
                initialValues={{
                    funds: wallet[0],
                    name: '',
                    amount: '',
                    url: '',
                    description: '',
                    burn: '',
                    webvalidate: '',
                    ticker: '',
                }}
                onSubmit={async (formData, { setStatus }) => {
                    setStep(0);
                    setLoading(true);

                    const token = {
                        name: formData.name,
                        url: formData.url,
                        description: formData.description,
                        ticker: formData.ticker,
                        webvalidate: formData.webvalidate,
                    };

                    try {
                        const resp = await rpc.createToken(token, formData.amount, 8);

                        setLoading(false);
                        setStep(resp);
                    } catch (error) {
                        setError(error as string);
                    }
                }}
                validationSchema={mySchema}
            >
                {({
                    handleSubmit,
                    getFieldProps,
                    errors,
                    isValid,
                    isSubmitting,
                    values,
                    touched,
                    resetForm,
                    submitForm,
                }) => (
                    <>
                        {userLockedVault && (
                            <NoResults>
                                <h6>You have locked your vault with a password.</h6>
                                <p>Unlock it so you can access this form.</p>
                            </NoResults>
                        )}

                        {step === 1 &&
                            createPortal(
                                <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                                    <Grid variant="lg" title={<></>}>
                                        <div className="mx-4 rounded bg-white bg-opacity-90 p-4 h-max">
                                            <h1 className="text-black font-semibold mb-8 rounded-l">
                                                Token creation review
                                            </h1>
                                            <div className="divide-y-2 mb-8">
                                                <div className=" bg-white flex gap-4 truncate">
                                                    {!!values.url.length && (
                                                        <img className="w-[80px] h-[80px]" src={values.url} alt="" />
                                                    )}
                                                    {!values.url.length && (
                                                        <div className="w-[80px] h-[80px] flex items-center justify-center bg-slate-200">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                height="48"
                                                                viewBox="0 -960 960 960"
                                                                width="48"
                                                            >
                                                                <path d="M360-390q-21 0-35.5-14.5T310-440q0-21 14.5-35.5T360-490q21 0 35.5 14.5T410-440q0 21-14.5 35.5T360-390Zm240 0q-21 0-35.5-14.5T550-440q0-21 14.5-35.5T600-490q21 0 35.5 14.5T650-440q0 21-14.5 35.5T600-390ZM480-160q134 0 227-93t93-227q0-24-3-46.5T786-570q-21 5-42 7.5t-44 2.5q-91 0-172-39T390-708q-32 78-91.5 135.5T160-486v6q0 134 93 227t227 93Zm0 80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-54-715q42 70 114 112.5T700-640q14 0 27-1.5t27-3.5q-42-70-114-112.5T480-800q-14 0-27 1.5t-27 3.5ZM177-581q51-29 89-75t57-103q-51 29-89 75t-57 103Zm249-214Zm-103 36Z" />
                                                            </svg>
                                                        </div>
                                                    )}

                                                    <div className="my-auto truncate max-w-[360px]">
                                                        <h6 className="font-bold text-black">{values.name}</h6>

                                                        <p className="font-normal truncate text-black">
                                                            {values.amount}
                                                        </p>
                                                    </div>
                                                </div>

                                                <KeyValue
                                                    title="Description"
                                                    value={values.description.length ? values.description : 'N/A'}
                                                />
                                                <KeyValue
                                                    title="Web validation"
                                                    value={
                                                        <>
                                                            {!!values.webvalidate.length && (
                                                                <a
                                                                    className="hover:cursor-pointer text-blue-400 hover:underline"
                                                                    href={values.webvalidate}
                                                                    target="_blank"
                                                                >
                                                                    {values.webvalidate}
                                                                </a>
                                                            )}
                                                            {!values.webvalidate.length && 'N/A'}
                                                        </>
                                                    }
                                                />

                                                <KeyValue
                                                    title="Burn"
                                                    value={parseInt(values.burn) > 0 ? values.burn : '0'}
                                                />
                                                <KeyValue
                                                    title="Burn avg (last 50 blocks)"
                                                    value={avgBurn.toString()}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
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
                                        <div className="mx-4 rounded bg-white bg-opacity-90 p-4 items-center grid grid-cols-1 grid-rows-[1fr_0.5fr]">
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
                                        <div className="mx-4 rounded bg-white bg-opacity-90 p-4 items-center grid grid-cols-1 grid-rows-[1fr_1fr]">
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
                                            <div className="flex flex-col gap-2 w-full mt-4 self-end">
                                                {!isSubmitting && (
                                                    <Button
                                                        onClick={() => {
                                                            setStep(0);
                                                            resetForm();
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

                        {step === 3 &&
                            createPortal(
                                <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                                    <Grid variant="sm" title={<></>}>
                                        <div className="mx-4 rounded bg-white bg-opacity-90 p-4 items-center grid grid-cols-1 grid-rows-[1fr_1fr]">
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
                                            <div className="flex flex-col gap-2 w-full mt-4 self-end">
                                                {!isSubmitting && (
                                                    <Button
                                                        onClick={() => {
                                                            setStep(0);
                                                            resetForm();
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

                        {error &&
                            createPortal(
                                <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                                    <Grid variant="sm" title={<></>}>
                                        <div className="mx-4 rounded bg-white bg-opacity-90 p-4 items-center grid grid-cols-1 grid-rows-[1fr_1fr]">
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
                                            <div className="flex flex-col gap-2 w-full mt-4 self-end">
                                                {!isSubmitting && (
                                                    <Button
                                                        onClick={() => {
                                                            setLoading(false);
                                                            setError(false);
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

                        {!userLockedVault && (
                            <Card>
                                <form onSubmit={handleSubmit}>
                                    <Stack spacing={2}>
                                        <FormImageUrlSelect />

                                        <Input
                                            id="name"
                                            type="text"
                                            disabled={isSubmitting}
                                            placeholder="Name"
                                            {...getFieldProps('name')}
                                            error={touched.name && errors.name ? errors.name : false}
                                        />
                                        <p className="text-slate-500 text-sm mb-4">
                                            Enter a name for your token <span className="red-bad">*</span>
                                        </p>

                                        <Input
                                            id="amount"
                                            type="text"
                                            disabled={isSubmitting}
                                            placeholder="Amount"
                                            {...getFieldProps('amount')}
                                            error={touched.amount && errors.amount ? errors.amount : false}
                                        />
                                        <p className="text-slate-500 text-sm mb-4">
                                            Enter a total supply for your token <span className="red-bad">*</span>
                                        </p>

                                        <Input
                                            id="description"
                                            type="text"
                                            disabled={isSubmitting}
                                            placeholder="Description"
                                            {...getFieldProps('description')}
                                            max={255}
                                            extraClass="pr-20 truncate"
                                            error={
                                                touched.description && errors.description ? errors.description : false
                                            }
                                            endIcon={
                                                <>
                                                    {values.description.length >= 255 && (
                                                        <div className="m-auto text-sm flex items-center justify-center text-black font-semibold">
                                                            {values.description.length + '/255'}
                                                        </div>
                                                    )}
                                                </>
                                            }
                                        />
                                        <p className="text-slate-500 text-sm mb-4">A description about your NFT.</p>

                                        <Input
                                            id="ticker"
                                            type="text"
                                            disabled={isSubmitting}
                                            placeholder="Web validation URL"
                                            {...getFieldProps('ticker')}
                                            error={touched.ticker && errors.ticker ? errors.ticker : false}
                                        />
                                        <p className="text-slate-500 text-sm mb-4">
                                            Enter a ticker symbol (eg. MINIMA, BTC, ETH)
                                        </p>

                                        <Input
                                            id="webvalidate"
                                            type="text"
                                            disabled={isSubmitting}
                                            placeholder="Web validation URL"
                                            {...getFieldProps('webvalidate')}
                                            error={
                                                touched.webvalidate && errors.webvalidate ? errors.webvalidate : false
                                            }
                                        />
                                        <p className="text-slate-500 text-sm mb-4">
                                            Validate your token by hosting a public .txt file containing the tokenid on
                                            your own server or website. Create the link to the .txt file in advance and
                                            add the tokenid after creating the token.
                                        </p>

                                        <Input
                                            id="burn"
                                            type="number"
                                            disabled={isSubmitting}
                                            placeholder="Burn"
                                            {...getFieldProps('burn')}
                                            error={touched.burn && errors.burn ? errors.burn : false}
                                        />
                                        <p className="text-slate-500 text-sm mb-4">
                                            Prioritize your transaction by adding a burn.
                                        </p>

                                        <Button onClick={() => setStep(1)} variant="primary" disabled={!isValid}>
                                            Review
                                        </Button>
                                    </Stack>
                                </form>
                            </Card>
                        )}
                    </>
                )}
            </Formik>
        </Grid>
    );
};

export default TokenCreation;

const useMySchema = () => {
    const { balance: wallet } = useContext(appContext);
    return Yup.object().shape({
        name: Yup.string()
            .required('This field is required')
            .matches(/^[^\\;]+$/, 'Invalid characters.'),
        amount: Yup.string()
            .required('This field is required')
            .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.')
            .test('check-my-amount', 'Invalid amount', function (val) {
                const { path, createError } = this;
                if (val === undefined) {
                    return false;
                }

                if (new Decimal(val).greaterThan(new Decimal(1000000000000))) {
                    return createError({
                        path,
                        message: `Invalid amount, cannot create more than 1 trillion tokens`,
                    });
                }

                if (new Decimal(val).lessThan(new Decimal(1))) {
                    return createError({
                        path,
                        message: `Invalid amount, must be 1 or greater`,
                    });
                }

                return true;
            }),
        description: Yup.string()
            .min(0)
            .max(255, 'Maximum 255 characters allowed.')
            .matches(/^[^\\;]+$/, 'Invalid characters.'),
        ticker: Yup.string()
            .min(0)
            .max(5, 'Maximum 5 characters allowed.')
            .matches(/^[^\\;]+$/, 'Invalid characters.'),
        burn: Yup.string()
            .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.')
            .test('check-my-burnamount', 'Invalid burn amount', function (val) {
                const { path, createError } = this;
                if (val === undefined) {
                    return true;
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
        url: Yup.string()
            .trim()
            .test('check-my-url', 'Invalid Url.', function (val) {
                const { path, createError, parent } = this;

                if (val === undefined) {
                    return true;
                }

                if (parent.url.substring(0, 'data:image'.length) === 'data:image') {
                    return true;
                }

                if (!isValidURLAll(parent.url)) {
                    return createError({
                        path,
                        message: `Invalid URL`,
                    });
                }
                return true;
            }),
        webvalidate: Yup.string().test('check-my-webvalidator', 'Invalid Url, must be https', function (val) {
            const { path, createError, parent } = this;

            if (val === undefined) {
                return true;
            }

            if (!isValidURLSecureOnly(parent.webvalidate)) {
                return createError({
                    path,
                    message: `Invalid URL, must be https`,
                });
            }
            return true;
        }),
    });
};
