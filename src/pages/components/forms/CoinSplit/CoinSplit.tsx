import { Formik } from 'formik';
import Decimal from 'decimal.js';
import * as Yup from 'yup';
import { useContext, useState } from 'react';

import Button from '../../../../components/UI/Button';
import { splitCoin } from '../../../../minima/utils';
import useIsVaultLocked from '../../../../hooks/useIsVaultLocked';
import WalletSelect from '../../WalletSelect';
import { appContext } from '../../../../AppContext';
import Input from '../../../../components/UI/Input';
import Grid from '../../../../components/UI/Grid';

import Lottie from 'lottie-react';
import Success from '../../../../assets/lottie/Success.json';
import Loading from '../../../../assets/lottie/Loading.json';
import { createPortal } from 'react-dom';
import KeyValue from '../../../../components/UI/KeyValue';

import TogglePasswordIcon from '../../../../components/UI/TogglePasswordIcon/TogglePasswordIcon';
import Logs from '../../../../components/UI/Logs';
import Burn from '../../../../components/UI/Burn';
import useFormatMinimaNumber from '../../../../__minima__/libs/utils/useMakeNumber';

const CoinSplit = () => {
    const mySchema = useFormSchema();
    const { balance: wallet } = useContext(appContext);
    const { makeMinimaNumber } = useFormatMinimaNumber();

    const userLockedVault = useIsVaultLocked();

    const [hidePassword, togglePasswordVisibility] = useState(false);
    const [error, setError] = useState<false | string>(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);

    return (
        <Formik
            initialValues={{ token: wallet[0], burn: '', password: '', coinSplit: true }}
            onSubmit={async (formInputs) => {
                setStep(0);
                setLoading(true);

                if (!formInputs.password.length && userLockedVault) {
                    setLoading(false);
                    return setStep(5);
                }

                try {
                    const resp = await splitCoin(
                        formInputs.token.tokenid,
                        formInputs.token.sendable,
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
        >
            {({
                handleSubmit,
                getFieldProps,
                errors,
                isValid,
                isSubmitting,
                submitForm,
                setFieldValue,
                values,
                resetForm,
                touched,
                dirty,
            }) => (
                <>
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
                                                    value={values.token.token.name ? values.token.token.name : 'N/A'}
                                                />
                                            )}

                                            {values.token.tokenid === '0x00' && (
                                                <KeyValue title="Token" value="Minima" />
                                            )}

                                            <KeyValue title="Total coins" value={values.token.coins} />
                                            <KeyValue title="Split amount" value="10" />
                                            <KeyValue
                                                title="Total coins after split"
                                                value={parseInt(values.token.coins) + 10 + ''}
                                            />
                                            <KeyValue
                                                title="Burn"
                                                value={
                                                    parseInt(values.burn) > 0
                                                        ? makeMinimaNumber(values.burn, 2000)
                                                        : '0'
                                                }
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
                                    <div className="mx-4 rounded bg-white bg-opacity-90 p-4 items-center h-max  overflow-y-scroll">
                                        <div className="grid">
                                            <Lottie
                                                className="w-[128px] h-[128px] self-center place-self-center justify-self-center"
                                                animationData={Success}
                                                loop={false}
                                            />

                                            <h1 className="text-black text-center font-semibold text-xl mb-2">
                                                Success
                                            </h1>
                                            <p className="text-black text-center mb-2">
                                                The transaction has been posted and should arrive shortly. Check{' '}
                                                <span className="font-bold">coins</span> property of your token.
                                            </p>

                                            <Logs />
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
                                                error={touched.password && errors.password ? errors.password : false}
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
                                    <div className="mx-4 rounded bg-white bg-opacity-90 p-4 items-center grid grid-cols-1 grid-rows-[1fr_1fr] h-max">
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
                                            {error.includes('size too large') && (
                                                <p className="text-black text-center mt-4">
                                                    Why don't you try to <span className="font-bold">consolidate</span>{' '}
                                                    some coins to squash them back together and then try to split more.
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2 w-full mt-4 self-end">
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

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-black text-sm mb-1">
                                Splitting your coins allows you to have more UTXOs which means less waiting time in
                                between transactions. Learn more about transactions on Minima on our{' '}
                                <a
                                    className="font-semibold"
                                    href="https://docs.minima.global/docs/learn/minima/coreconcepts#utxo-model"
                                    target="_blank"
                                >
                                    docs.
                                </a>
                            </h1>
                            <WalletSelect />
                            {errors.token && <p className="red-bad text-sm">{errors.token}</p>}

                            <Burn />

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
    );
};

export default CoinSplit;

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

                if (new Decimal(val.sendable).lessThanOrEqualTo(new Decimal(0))) {
                    return createError({
                        path,
                        message: `Oops, not enough funds available to perform a split`,
                    });
                }

                return true;
            }),
        burn: Yup.string()
            .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters')
            .test('check-my-burnamount', 'Invalid burn amount', function (val) {
                const { path, createError } = this;
                if (val === undefined) {
                    return true;
                }
                try {
                    const burn = new Decimal(val);

                    if (burn.greaterThan(wallet[0].sendable)) {
                        return createError({
                            path,
                            message: `Oops, not enough funds available to burn.  You require another ${burn
                                .minus(wallet[0].sendable)
                                .toNumber()} Minima`,
                        });
                    }
                } catch (err) {
                    console.error(err);

                    return createError({
                        path,
                        message: `Invalid characters`,
                    });
                }

                return true;
            }),
    });
};
