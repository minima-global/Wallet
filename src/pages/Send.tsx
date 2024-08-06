import { useContext, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import SendIcon from '../components/UI/Icons/SendIcon';
import SplitIcon from '../components/UI/Icons/SplitIcon';
import CombineIcon from '../components/UI/Icons/CombineIcon';
import { Formik } from 'formik';
import WalletSelect from '../components/WalletSelect';
import { appContext } from '../AppContext';
import SelectAddress from '../components/SelectAddress';
import MessageArea from '../components/MessageArea';
import PrimaryButton from '../components/UI/PrimaryButton';
import { Decimal } from 'decimal.js';

import * as yup from 'yup';
import FireIcon from '../components/UI/Icons/FireIcon';
import AnimatePageIn from '../components/UI/Animations/AnimatePageIn';
import Favorites from './_components/Favorites';

const Send = () => {
    const location = useLocation();
    const {
        loaded,
        getBalance,
        balance: wallet,
        setTransactionSubmitting,
        setTransactionError,
        setTransactionPending,
        setTransactionSuccess,
    } = useContext(appContext);
    const [selectedOption, setSelectedOption] = useState('default');
    const [searchParams] = useSearchParams();

    // Set the mode according to the search params if any
    useEffect(() => {
        if (searchParams && searchParams.get('mode') && ['1', '2', '3'].includes(searchParams.get('mode')!)) {
            setSelectedOption(
                searchParams.get('mode') === '1'
                    ? 'default'
                    : searchParams.get('mode') === '2'
                    ? 'split'
                    : searchParams.get('mode') === '3'
                    ? 'combine'
                    : 'default'
            );
        }
    }, [searchParams]);

    useEffect(() => {
        if (loaded && loaded.current) {
            getBalance();
        }
    }, [loaded]);

    const handleOptionChange = (event: any) => {
        setSelectedOption(event.target.value);
    };

    return (
        <>
            <AnimatePageIn display={location.pathname.includes('/dashboard/send')}>
                <section className="mx-3 mt-8">
                    <div className="grid grid-cols-[1fr_auto] items-center">
                        <h6 className="font-bold tracking-wide dark:text-neutral-300">
                            {selectedOption === 'default' && 'Transfer'}
                            {selectedOption === 'split' && 'Split UTXOs'}
                            {selectedOption === 'combine' && 'Combine UTXOs'}
                        </h6>
                    </div>
                    <p>
                        {selectedOption === 'default' && 'Transfer tokens to a Minima address'}
                        {selectedOption === 'split' &&
                            'Split your UTXOs into more UTXOs, read more on coins and UTXOs on our docs.'}
                        {selectedOption === 'combine' &&
                            'Combine coins into a singular UTXO, read more on coins and UTXOs on our docs.'}
                    </p>
                    <Formik
                        initialValues={{
                            tokens: searchParams.get('tokenid')
                                ? wallet.find((t: any) => t.tokenid === searchParams.get('tokenid'))
                                : wallet[0],
                            amount: '',
                            address: '',
                            message: '',
                            burn: '',
                        }}
                        onSubmit={async ({ tokens, amount, address, burn, message }, { resetForm }) => {
                            setTransactionSubmitting(true);

                            try {
                                // Create a promise for the MDS command and await its resolution

                                if (selectedOption === 'default') {
                                    await new Promise((resolve, reject) => {
                                        (window as any).MDS.cmd(
                                            `send amount:${amount} address:${address} ${
                                                burn.length ? 'burn:' + burn : ''
                                            } ${
                                                message.length ? `state:{"44":"[${encodeURIComponent(message)}]"}` : ''
                                            }`,
                                            (resp: any) => {
                                                if (resp.pending) reject('PENDING');

                                                if (!resp.status) {
                                                    reject(
                                                        resp.message
                                                            ? resp.message
                                                            : resp.error
                                                            ? resp.error
                                                            : 'Failed to send!'
                                                    );
                                                } else {
                                                    resolve(true);
                                                }
                                            }
                                        );
                                    });
                                }

                                if (selectedOption === 'split') {
                                    // split 10
                                    await new Promise((resolve, reject) => {
                                        console.log(tokens.sendable);
                                        (window as any).MDS.cmd('balance', (resb: any) => {
                                            (window as any).MDS.cmd('getaddress', (res: any) => {
                                                if (!res.status) reject('Could not get an address');

                                                (window as any).MDS.cmd(
                                                    `send amount:${resb.response[0].sendable} address:${
                                                        res.response.miniaddress
                                                    } ${burn.length ? 'burn:' + burn : ''} split:10 tokenid:${
                                                        tokens.tokenid
                                                    }`,
                                                    (resp: any) => {
                                                        if (resp.pending) reject('PENDING');

                                                        if (!resp.status) {
                                                            reject(
                                                                resp.message
                                                                    ? resp.message
                                                                    : resp.error
                                                                    ? resp.error
                                                                    : 'Failed to send!'
                                                            );
                                                        } else {
                                                            resolve(true);
                                                        }
                                                    }
                                                );
                                            });
                                        });
                                    });
                                }

                                if (selectedOption === 'combine') {
                                    // split 10
                                    await new Promise((resolve, reject) => {
                                        (window as any).MDS.cmd(
                                            `consolidate ${burn.length ? 'burn:' + burn : ''} tokenid:${
                                                tokens.tokenid
                                            }`,
                                            (resp: any) => {
                                                if (resp.pending) reject('PENDING');

                                                if (!resp.status) {
                                                    reject(
                                                        resp.message
                                                            ? resp.message
                                                            : resp.error
                                                            ? resp.error
                                                            : 'Failed to send!'
                                                    );
                                                } else {
                                                    resolve(true);
                                                }
                                            }
                                        );
                                    });
                                }

                                setTransactionSuccess(true);
                                await new Promise((resolve) => setTimeout(resolve, 2000));

                                // reset
                                setTransactionSubmitting(false);
                                setTransactionSuccess(false);
                                resetForm();
                            } catch (error) {
                                console.error(error);
                                if (error instanceof Error) {
                                    setTransactionError(error.message);
                                } else if (error === 'PENDING') {
                                    setTransactionPending(true);
                                } else {
                                    setTransactionError(
                                        typeof error === 'string' ? error : 'An unknown error occurred'
                                    );
                                }
                            }
                        }}
                        validationSchema={yup.object().shape({
                            amount:
                                selectedOption === 'default'
                                    ? yup
                                          .string()
                                          .required('Field required')
                                          .matches(/^\d*\.?\d+$/, 'Enter a valid number')
                                          //@ts-ignore
                                          .test('test amount', function (val) {
                                              const { parent, path, createError } = this;

                                              if (!val) {
                                                  return false;
                                              }

                                              try {
                                                  if (new Decimal(val).isZero()) {
                                                      throw new Error("You can't send nothing.");
                                                  }

                                                  if (new Decimal(val).greaterThan(parent.tokens.sendable)) {
                                                      throw new Error('Insufficient funds!');
                                                  }

                                                  if (new Decimal(val).greaterThan(1000000000)) {
                                                      throw new Error('Too much!');
                                                  }

                                                  if (new Decimal(val).decimalPlaces() > 18) {
                                                      throw new Error("You can't have more than 18 decimal places.");
                                                  }

                                                  return true;
                                              } catch (error) {
                                                  if (error instanceof Error) {
                                                      return createError({ path, message: error.message });
                                                  }
                                              }
                                          })
                                    : yup.string().nullable(),
                            address:
                                selectedOption === 'default'
                                    ? yup
                                          .string()
                                          .matches(/0|M[xX][0-9a-zA-Z]+/, 'Invalid Address.')
                                          .min(59, 'Invalid Minima address')
                                          .max(66, 'Invalid Minima address')
                                          .required('Field required')
                                    : yup.string().nullable(),
                            message:
                                selectedOption === 'default'
                                    ? yup.string().max(255, 'A message cannot exceed 255 characters')
                                    : yup.string().nullable(),
                            //@ts-ignore
                            burn: yup.number().test('test burn', function (val) {
                                const { path, parent, createError } = this;

                                if (!val) {
                                    return true;
                                }

                                try {
                                    if (new Decimal(val).isZero()) {
                                        return true;
                                    }

                                    if (!parent.amount) {
                                        return true;
                                    }

                                    if (new Decimal(val).plus(parent.amount).greaterThan(parent.token.sendable)) {
                                        throw new Error('Insufficient funds');
                                    }

                                    if (new Decimal(val).decimalPlaces() > 18) {
                                        throw new Error("You can't have more than 18 decimal places.");
                                    }

                                    return true;
                                } catch (error) {
                                    if (error instanceof Error) {
                                        return createError({ path, message: error.message });
                                    }
                                }
                            }),
                        })}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            isSubmitting,
                            isValid,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            resetForm,
                        }) => (                            
                            <form onSubmit={handleSubmit}>
                                <div className="flex-1 flex flex-col">
                                    {/* Custom Radio Buttons */}
                                    <div className="my-3">
                                        <fieldset>
                                            <div className="grid grid-cols-3 gap-2">
                                                <label
                                                    className={`text-center justify-center text-sm p-4 flex-col rounded-lg sm:roundd-full sm:flex-row flex items-center transition-all ${
                                                        selectedOption === 'default'
                                                            ? 'bg-black dark:bg-black font-bold'
                                                            : 'bg-neutral-200 dark:bg-[#1B1B1B]'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="option"
                                                        value="default"
                                                        checked={selectedOption === 'default'}
                                                        onChange={handleOptionChange}
                                                        className="hidden"
                                                    />
                                                    <span>
                                                        <SendIcon fill="currentColor" />
                                                    </span>
                                                    <span
                                                        className={`ml-0 md:ml-2 ${
                                                            selectedOption === 'default' ? 'text-white' : ''
                                                        }`}
                                                    >
                                                        Default
                                                    </span>
                                                </label>
                                                <label
                                                    className={`text-center justify-center text-sm flex-col rounded-lg sm:roundd-full sm:flex-row p-4 flex items-center transition-all ${
                                                        selectedOption === 'split'
                                                            ? 'bg-black dark:bg-black font-bold'
                                                            : 'bg-neutral-200 dark:bg-[#1B1B1B]'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="option"
                                                        value="split"
                                                        checked={selectedOption === 'split'}
                                                        onChange={(e) => {
                                                            handleOptionChange(e);
                                                            resetForm();
                                                        }}
                                                        className="hidden"
                                                    />
                                                    <span>
                                                        <SplitIcon fill="currentColor" />
                                                    </span>
                                                    <span
                                                        className={`ml-0 md:ml-2 ${
                                                            selectedOption === 'split' ? 'text-white' : ''
                                                        }`}
                                                    >
                                                        Split
                                                    </span>
                                                </label>
                                                <label
                                                    className={`text-center justify-center text-sm flex-col rounded-lg sm:roundd-full sm:flex-row p-4 flex items-center transition-all ${
                                                        selectedOption === 'combine'
                                                            ? 'bg-black dark:bg-black font-bold'
                                                            : 'bg-neutral-200 dark:bg-[#1B1B1B]'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="option"
                                                        value="combine"
                                                        checked={selectedOption === 'combine'}
                                                        onChange={(e) => {
                                                            handleOptionChange(e);
                                                            resetForm();
                                                        }}
                                                        className="hidden"
                                                    />
                                                    <span
                                                        className={`${
                                                            selectedOption === 'combine' ? 'text-white' : ''
                                                        }`}
                                                    >
                                                        <CombineIcon fill="currentColor" />
                                                    </span>
                                                    <span
                                                        className={`ml-0 md:ml-2 ${
                                                            selectedOption === 'combine' ? 'text-white' : ''
                                                        }`}
                                                    >
                                                        Combine
                                                    </span>
                                                </label>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>

                                <WalletSelect />

                                {selectedOption === 'default' && (
                                    <>
                                        <div className="my-2">
                                            <input
                                                id="amount"
                                                name="amount"
                                                type="text"
                                                placeholder="0.0"
                                                value={values.amount}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className="bg-white rounded p-4 w-full focus:border focus:outline-none dark:placeholder:text-neutral-600 dark:bg-[#1B1B1B]"
                                            />
                                            {errors && errors.amount && touched && touched.amount && (
                                                <p className="text-sm mt-2 dark:text-neutral-300">{errors.amount}</p>
                                            )}
                                        </div>
                                        <div className="my-2">
                                            <SelectAddress
                                                id="address"
                                                name="address"
                                                value={values.address}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                                error={errors && errors.address ? errors.address : ''}
                                            />
                                            {errors && errors.address && touched && touched.address && (
                                                <p className="text-sm mt-2 dark:text-neutral-300">{errors.address}</p>
                                            )}
                                        </div>

                                        <div className="my-2">
                                            <MessageArea
                                                id="message"
                                                name="message"
                                                value={values.message}
                                                error={false}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                            />
                                            {errors && errors.message && (
                                                <p className="text-sm mt-2 dark:text-neutral-300">{errors.message}</p>
                                            )}
                                        </div>
                                    </>
                                )}

                                {(selectedOption === 'split' || selectedOption === 'combine') && (
                                    <>
                                        <div className="mt-4">
                                            <p className="text-sm text-center">
                                                You currently have {values.tokens ? values.tokens.coins : '-'} coin
                                                {values.tokens &&
                                                    values.tokens.coins &&
                                                    values.tokens.coins.length > 1 &&
                                                    's'}
                                            </p>
                                        </div>
                                    </>
                                )}

                                <div className="mt-16">
                                    <PrimaryButton disabled={!isValid || isSubmitting} type="submit">
                                        {selectedOption === 'default' && 'Transfer'}
                                        {selectedOption === 'split' && 'Split'}
                                        {selectedOption === 'combine' && 'Combine'}
                                    </PrimaryButton>
                                </div>

                                <div className="my-2 w-full flex">
                                    <p className="text-sm my-auto dark:text-neutral-300">
                                        Network
                                        <br /> fee
                                    </p>
                                    <div className="ml-auto">
                                        <span className="flex justify-end text-orange-500 dark:text-orange-400">
                                            <FireIcon size={22} fill="currentColor" />
                                        </span>
                                        <input
                                            id="burn"
                                            name="burn"
                                            value={values.burn}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="0.0"
                                            className="placeholder:font-mono placeholder:text-neutral-500 bg-transparent focus:outline-none text-right max-w-max text-sm dark:placeholder:text-neutral-400"
                                        />
                                    </div>
                                </div>
                            </form>                        
                        )}
                    </Formik>
                </section>
            </AnimatePageIn>
        </>
    );
};

export default Send;
