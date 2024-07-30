import { animated, config, useTransition } from '@react-spring/web';
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

const Send = () => {
    const location = useLocation();
    const { balance: wallet } = useContext(appContext);
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

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const transitions = useTransition(location.pathname.includes('/dashboard/send'), {
        from: { opacity: 0, transform: 'translateY(-50%) scale(0.8)' },
        enter: { opacity: 1, transform: 'translateY(0%) scale(1)' },
        leave: { opacity: 0, transform: 'translateY(-50%) scale(0.8)' },
        config: config.default,
    });

    return transitions((styles, item) =>
        item ? (
            <animated.div style={styles}>
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
                            'Split a coin into several outputs, read more on coins and UTXOs on our docs.'}
                        {selectedOption === 'combine' &&
                            'Combine coins into a singular UTXO, read more on coins and UTXOs on our docs.'}
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
                                        <span className={`${selectedOption === 'default' ? 'text-white' : ''}`}>
                                            <SendIcon fill="currentColor" />
                                        </span>
                                        <span className={`ml-2 ${selectedOption === 'default' ? 'text-white' : ''}`}>
                                            Default
                                        </span>
                                    </label>
                                    <label
                                        className={`justify-center text-sm flex-col rounded-lg sm:roundd-full sm:flex-row p-4 flex items-center transition-all ${
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
                                            onChange={handleOptionChange}
                                            className="hidden"
                                        />
                                        <span className={`${selectedOption === 'split' ? 'text-white' : ''}`}>
                                            <SplitIcon fill="currentColor" />
                                        </span>
                                        <span className={`ml-2 ${selectedOption === 'split' ? 'text-white' : ''}`}>
                                            Split
                                        </span>
                                    </label>
                                    <label
                                        className={`justify-center text-sm flex-col rounded-lg sm:roundd-full sm:flex-row p-4 flex items-center transition-all ${
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
                                            onChange={handleOptionChange}
                                            className="hidden"
                                        />
                                        <span className={`${selectedOption === 'combine' ? 'text-white' : ''}`}>
                                            <CombineIcon fill="currentColor" />
                                        </span>
                                        <span className={`ml-2 ${selectedOption === 'combine' ? 'text-white' : ''}`}>
                                            Combine
                                        </span>
                                    </label>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <Formik
                        initialValues={{ tokens: wallet[0], amount: '', address: '', message: '', burn: '' }}
                        onSubmit={() => console.log()}
                        validationSchema={yup.object().shape({
                            amount: yup
                                .string()
                                .required('Field is required')
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

                                        if (new Decimal(val).greaterThan(parent.token.sendable)) {
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
                                .required('Field Required'),
                            message: yup.string().max(255, "A message cannot exceed 255 characters"),
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
                        {({ values, errors, isSubmitting, isValid, handleChange, handleBlur }) => (
                            <form>
                                <WalletSelect />

                                <div className="my-2">
                                    <input
                                        id="amount"
                                        name="amount"
                                        type="text"
                                        placeholder="0.0"
                                        value={values.amount}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="rounded p-4 w-full focus:border focus:outline-none dark:placeholder:text-neutral-600 dark:bg-[#1B1B1B]"
                                    />
                                    {errors && errors.amount && (
                                        <p className="text-sm mt-2 dark:text-neutral-300">{errors.amount}</p>
                                    )}
                                </div>
                                <div className="my-2">
                                    <SelectAddress
                                        id="address"
                                        name="address"
                                        value={values.address}
                                        error={false}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    />
                                    {errors && errors.address && (
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

                                <div className="mt-16">
                                    <PrimaryButton disabled={!isValid || isSubmitting} type="submit">Transfer</PrimaryButton>
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
                                            placeholder="0.0"
                                            className="bg-transparent focus:outline-none text-right max-w-max text-sm placeholder:opacity-80"
                                        />
                                    </div>
                                </div>
                            </form>
                        )}
                    </Formik>
                </section>
            </animated.div>
        ) : null
    );
};

export default Send;
