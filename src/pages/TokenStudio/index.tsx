import { useLocation, useSearchParams } from "react-router-dom";
import AnimatePageIn from "../../components/UI/Animations/AnimatePageIn";
import { Formik } from "formik";
import Decimal from "decimal.js";
import { useContext, useState, useEffect } from "react";
import { appContext } from "../../AppContext";
import MessageArea from "../../components/MessageArea";
import SelectAddress from "../../components/SelectAddress";
import CombineIcon from "../../components/UI/Icons/CombineIcon";
import FireIcon from "../../components/UI/Icons/FireIcon";
import SendIcon from "../../components/UI/Icons/SendIcon";
import SplitIcon from "../../components/UI/Icons/SplitIcon";
import PrimaryButton from "../../components/UI/PrimaryButton";
import WalletSelect from "../../components/WalletSelect";
import * as yup from "yup";
import SimpleTokenIcon from "../../components/UI/Icons/SimpleTokenIcon";
import CustomTokenIcon from "../../components/UI/Icons/CustomTokenIcon";
import NonFungibleIcon from "../../components/UI/Icons/NonFungibleIcon";
const TokenStudio = () => {
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

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return        <AnimatePageIn display={location.pathname.includes('/dashboard/tokenstudio')}>
    <section className="mx-3 mt-8">
        <div className="grid grid-cols-[1fr_auto] items-center">
            <h6 className="font-bold tracking-wide dark:text-neutral-300">
                Token Studio
            </h6>
        </div>
        <p>
            Select an option
        </p>
        <div className="flex-1 flex flex-col">
            {/* Custom Radio Buttons */}
            <div className="my-3">
                <fieldset>
                    <div className="grid grid-cols-3 gap-2">
                        <label
                            className={`justify-center text-sm p-4 flex-col rounded-lg sm:roundd-full sm:flex-row flex items-center transition-all ${
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
                                <SimpleTokenIcon fill="currentColor" size={20} />
                            </span>
                            <span className={`ml-2 ${selectedOption === 'default' ? 'text-white' : ''}`}>
                                Simple
                            </span>
                        </label>
                        <label
                            className={`justify-center text-sm flex-col rounded-lg sm:roundd-full sm:flex-row p-4 flex items-center transition-all ${
                                selectedOption === 'custom'
                                    ? 'bg-black dark:bg-black font-bold'
                                    : 'bg-neutral-200 dark:bg-[#1B1B1B]'
                            }`}
                        >
                            <input
                                type="radio"
                                name="option"
                                value="custom"
                                checked={selectedOption === 'custom'}
                                onChange={handleOptionChange}
                                className="hidden"
                            />
                            <span>
                                <CustomTokenIcon fill="currentColor" size={20} />
                            </span>
                            <span className={`ml-2 ${selectedOption === 'custom' ? 'text-white' : ''}`}>
                                Custom
                            </span>
                        </label>
                        <label
                            className={`justify-center text-sm flex-col rounded-lg sm:roundd-full sm:flex-row p-4 flex items-center transition-all ${
                                selectedOption === 'nft'
                                    ? 'bg-black dark:bg-black font-bold'
                                    : 'bg-neutral-200 dark:bg-[#1B1B1B]'
                            }`}
                        >
                            <input
                                type="radio"
                                name="option"
                                value="nft"
                                checked={selectedOption === 'nft'}
                                onChange={handleOptionChange}
                                className="hidden"
                            />
                            <span className={`${selectedOption === 'nft' ? 'text-white' : ''}`}>
                                <NonFungibleIcon fill="currentColor" size={20} />
                            </span>
                            <span className={`ml-2 ${selectedOption === 'nft' ? 'text-white' : ''}`}>
                                Non-fungible
                            </span>
                        </label>
                    </div>
                </fieldset>
            </div>
        </div>
        <Formik
            initialValues={{
                tokens: null,
                name: '',
                amount: '',
                address: '',
                message: '',
                burn: '',
            }}
            onSubmit={async ({ tokens, amount, name, burn, message }, { resetForm }) => {
                setTransactionSubmitting(true);

                try {
                    // Create a promise for the MDS command and await its resolution

                    if (selectedOption === 'default') {
                        await new Promise((resolve, reject) => {
                            (window as any).MDS.cmd(
                                `tokencreate amount:${amount} name:${name} ${
                                    burn.length ? 'burn:' + burn : ''
                                }`,
                                (resp) => {
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
                            (window as any).MDS.cmd('getaddress', (res) => {
                                if (!res.status) reject('Could not get an address');

                                (window as any).MDS.cmd(
                                    `send amount:${tokens.sendable} address:${res.response.miniaddress} ${
                                        burn.length ? 'burn:' + burn : ''
                                    } split:10 tokenid:${tokens.tokenid}`,
                                    (resp) => {
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
                    }

                    if (selectedOption === 'combine') {
                        // split 10
                        await new Promise((resolve, reject) => {
                            (window as any).MDS.cmd(
                                `consolidate ${burn.length ? 'burn:' + burn : ''} tokenid:${tokens.tokenid}`,
                                (resp) => {
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
                        setTransactionError(typeof error === 'string' ? error : 'An unknown error occurred');
                    }
                }
            }}
            validationSchema={
                selectedOption === 'default'
                    ? yup.object().shape({
                          amount: yup
                              .string()
                              .required('Field required')
                              .matches(/^\d*\.?\d+$/, 'Enter a valid number')
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
                              }),
                          address: yup
                              .string()
                              .matches(/0|M[xX][0-9a-zA-Z]+/, 'Invalid Address.')
                              .min(59, 'Invalid Minima address')
                              .max(66, 'Invalid Minima address')
                              .required('Field required'),
                          message: yup.string().max(255, 'A message cannot exceed 255 characters'),
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
                      })
                    : null
            }
        >
            {({ values, errors, touched, isSubmitting, isValid, handleChange, handleBlur, handleSubmit }) => (
                <form onSubmit={handleSubmit}>

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
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Token Name"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="bg-white rounded p-4 w-full focus:border focus:outline-none dark:placeholder:text-neutral-600 dark:bg-[#1B1B1B]"
                                />
                                {errors && errors.name && touched && touched.name && (
                                    <p className="text-sm mt-2 dark:text-neutral-300">{errors.name}</p>
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
                            {selectedOption === 'default' && 'Mint'}
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
                            <span className="flex justify-end text-orange-300 dark:text-orange-400">
                                <FireIcon size={22} fill="currentColor" />
                            </span>
                            <input
                                id="burn"
                                name="burn"
                                value={values.burn}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="0.0"
                                className="bg-transparent focus:outline-none text-right max-w-max text-sm placeholder:opacity-80"
                            />
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    </section>
</AnimatePageIn>
}


export default TokenStudio;