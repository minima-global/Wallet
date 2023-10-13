import { useContext, useEffect, useState } from 'react';

import Grid from '../../components/UI/Grid';
import CardContent from '../../components/UI/CardContent';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

import { appContext } from '../../AppContext';
import { createPortal } from 'react-dom';
import KeyValue from '../../components/UI/KeyValue';
import { Formik } from 'formik';
import Lottie from 'lottie-react';

import * as rpc from '../../__minima__/libs/RPC';

import Loading from '../../assets/lottie/Loading.json';

import * as Yup from 'yup';
import getCurrentNodeVersion from '../../minima/commands/getCurrentVersion';

const ValidateAddress = () => {
    const { setOpenDrawer, loaded } = useContext(appContext);

    const [validationData, setValidationData] = useState<any>(false);

    const [isSubmitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(0);
    const [error, setError] = useState<false | string>(false);
    const [loading, setLoading] = useState(false);

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

    return (
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
                    Validate Address
                </>
            }
        >
            <>
                {!validBuild &&
                    validBuild !== null &&
                    createPortal(
                        <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn h-max">
                            <Grid variant="sm" title={<></>}>
                                <div className="mx-4 rounded bg-white bg-opacity-90 p-4 items-center">
                                    <div className="grid grid-cols-1 grid-rows-1 pb-4">
                                        <div className="flex flex-col items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="80"
                                                viewBox="0 -960 960 960"
                                                width="80"
                                            >
                                                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" />
                                            </svg>
                                            <h1 className="text-black text-xl font-semibold mt-4">
                                                You're running an older version of your node
                                            </h1>
                                            <p className="text-black text-center">
                                                Please upgrade to atleast v1.0.21+ to access this feature.
                                            </p>
                                        </div>
                                    </div>
                                    <div />
                                </div>
                            </Grid>
                        </div>,

                        document.body
                    )}
                <CardContent
                    header={
                        <>
                            <h1 className="text-black mb-4 font-semibold">
                                Validate an 0x or Mx wallet address and check whether it is relevant to your node.
                            </h1>
                        </>
                    }
                    content={
                        <Formik
                            initialValues={{ address: '' }}
                            onSubmit={async (formInputs) => {
                                setStep(0);
                                setLoading(true);

                                try {
                                    const resp = await rpc.checkAddress(formInputs.address);
                                    setLoading(false);
                                    setStep(1);
                                    setValidationData(resp);
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
                                values,
                                resetForm,
                                touched,
                                errors,
                            }) => (
                                <>
                                    {step === 1 &&
                                        validationData &&
                                        createPortal(
                                            <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                                                <Grid variant="lg" title={<></>}>
                                                    <CardContent
                                                        className="bg-opacity-90"
                                                        header={
                                                            <h1 className="text-black font-semibold">
                                                                Validation report
                                                            </h1>
                                                        }
                                                        content={
                                                            <>
                                                                <div className="mb-8 flex flex-col gap-2">
                                                                    <KeyValue title="Address" value={values.address} />
                                                                    <KeyValue
                                                                        title="Original"
                                                                        value={validationData.original}
                                                                    />
                                                                    <KeyValue title="0x" value={validationData['0x']} />
                                                                    <KeyValue title="Mx" value={validationData['Mx']} />
                                                                    <KeyValue
                                                                        title="Address belongs to this node?"
                                                                        value={validationData.relevant ? 'Yes' : 'No'}
                                                                    />
                                                                    <KeyValue
                                                                        title="Simple Address"
                                                                        value={validationData.simple ? 'True' : 'False'}
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col gap-2 mt-16">
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
                                                            </>
                                                        }
                                                    />
                                                </Grid>
                                            </div>,

                                            document.body
                                        )}

                                    {loading &&
                                        createPortal(
                                            <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                                                <Grid variant="sm" title={<></>}>
                                                    <div className="mx-4 rounded bg-white bg-opacity-90 p-4 items-center h-max max-h-[calc(100%_-_16px)] overflow-y-scroll">
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

                                    {error &&
                                        createPortal(
                                            <div className="ml-0 md:ml-[240px] absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 animate-fadeIn">
                                                <Grid variant="sm" title={<></>}>
                                                    <div className="mx-4 rounded bg-white bg-opacity-90 p-4 items-center h-max max-h-[calc(100%_-_16px)] overflow-y-scroll">
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
                                                                    ? error.split(
                                                                          'java.lang.IllegalArgumentException:'
                                                                      )[1]
                                                                    : error}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col gap-2 w-full mt-8 md:mt-16 self-end">
                                                            {!isSubmitting && (
                                                                <Button
                                                                    onClick={() => {
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

                                    <form onSubmit={handleSubmit}>
                                        <div>
                                            <Input
                                                disabled={isSubmitting}
                                                type="text"
                                                id="address"
                                                {...getFieldProps('address')}
                                                placeholder="0x or Mx address"
                                                error={errors.address && touched.address ? errors.address : false}
                                            />
                                            <Button
                                                extraClass="mt-8 md:mt-16"
                                                type="submit"
                                                variant="primary"
                                                disabled={!isValid}
                                            >
                                                Validate
                                            </Button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </Formik>
                    }
                ></CardContent>
            </>
        </Grid>
    );
};

export default ValidateAddress;

const validationSchema = () => {
    return Yup.object().shape({
        address: Yup.string()
            .matches(/0|M[xX][0-9a-zA-Z]+/, 'Invalid Address.')
            .min(59, 'Invalid Address, too short.')
            .max(66, 'Invalid Address, too long.')
            .required('Field Required'),
    });
};
