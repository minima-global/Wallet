import { Formik, useFormik } from 'formik';
import Decimal from 'decimal.js';
import * as Yup from 'yup';
import { useState } from 'react';

import { Button, Dialog, Stack, TextField, Typography } from '@mui/material';
import { MinimaToken } from '../../../../@types/minima';
import { useAppSelector } from '../../../../minima/redux/hooks';
import sharedStyles from '../../../../theme/cssmodule/Components.module.css';
import styles from './CoinSplit.module.css';
import MiSelect from '../../../../shared/components/layout/MiSelect/MiSelect';
import { selectBalance } from '../../../../minima/redux/slices/balanceSlice';
import { MINIMA__DECIMAL_PRECISION } from '../../../../shared/constants';

import { splitCoin } from '../../../../minima/utils';
import FormFieldWrapper from '../../../../shared/components/FormFieldWrapper';
import useIsVaultLocked from '../../../../hooks/useIsVaultLocked';
import ReviewDialog from '../ReviewDialog';
import SuccessDialog from '../SuccessDialog';
import WalletSelect from '../../WalletSelect';

Decimal.set({ precision: MINIMA__DECIMAL_PRECISION });

interface ISendForm {
    token: MinimaToken;
    burn: string;
    password: string;
}

const CoinSplit = () => {
    const mySchema = useFormSchema();
    const wallet = useAppSelector(selectBalance);
    const userLockedVault = useIsVaultLocked();

    const [error, setError] = useState('');
    const [showReview, setReview] = useState(false);
    const [showSuccess, setSuccess] = useState(false);

    return (
        <Formik
            initialValues={{ token: wallet[0], burn: '', password: '', coinSplit: true }}
            onSubmit={async (formInputs: ISendForm, { setStatus }) => {
                setSuccess(true);
                setStatus('ongoing');
                try {
                    await splitCoin(
                        formInputs.token.tokenid,
                        formInputs.token.sendable,
                        formInputs.burn,
                        formInputs.password
                    );
                    setStatus('complete');
                } catch (error: any) {
                    const isPending = error.message === 'pending';
                    if (isPending) {
                        setStatus('pending');
                    }
                    if (!isPending) {
                        setStatus('failed');
                        setError(error.message);
                    }
                }
            }}
            validationSchema={mySchema}
        >
            {({
                handleSubmit,
                getFieldProps,
                status,
                setStatus,
                errors,
                isValid,
                isSubmitting,
                submitForm,
                setFieldValue,
                values,
                handleBlur,
                resetForm,
                touched,
                dirty,
            }) => (
                <>
                    <SuccessDialog
                        open={showSuccess}
                        error={error}
                        transactionCreationStatus={status}
                        hideSuccess={() => setSuccess(false)}
                        clearForm={() => resetForm()}
                    />
                    <ReviewDialog
                        open={showReview}
                        children={
                            <ul id="list">
                                <li>
                                    <h6>Splitting your sendable balance in two</h6>
                                    <p>{values.token.sendable}</p>
                                </li>
                                {!!values.burn.length && (
                                    <li>
                                        <h6>Burn</h6>
                                        <p>{values.burn}</p>
                                    </li>
                                )}
                            </ul>
                        }
                        transactionCreationStatus={status}
                        hideReview={() => setReview(false)}
                        submitForm={() => submitForm()}
                    />
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            {/* Select a token */}
                            <WalletSelect />
                            {/* Choose a burn amount */}
                            <FormFieldWrapper
                                help="Prioritize your transaction by adding a burn. Burn amounts are denominated in Minima only."
                                children={
                                    <TextField
                                        disabled={isSubmitting}
                                        fullWidth
                                        {...getFieldProps('burn')}
                                        placeholder="burn fee"
                                        error={touched.burn && Boolean(errors.burn)}
                                        helperText={touched.burn && errors.burn}
                                        FormHelperTextProps={{
                                            className: sharedStyles['form-helper-text'],
                                        }}
                                        InputProps={{
                                            style:
                                                touched.burn && Boolean(errors.burn)
                                                    ? {
                                                          borderBottomLeftRadius: 0,
                                                          borderBottomRightRadius: 0,
                                                      }
                                                    : {
                                                          borderBottomLeftRadius: 8,
                                                          borderBottomRightRadius: 8,
                                                      },
                                        }}
                                    />
                                }
                            />
                            {userLockedVault && (
                                <FormFieldWrapper
                                    help="Your vault is locked.  Use your password so you can process this transaction."
                                    children={
                                        <TextField
                                            type="password"
                                            disabled={isSubmitting}
                                            fullWidth
                                            {...getFieldProps('password')}
                                            placeholder="vault password"
                                            error={touched.password && Boolean(errors.password)}
                                            helperText={touched.password && errors.password}
                                            FormHelperTextProps={{
                                                className: sharedStyles['form-helper-text'],
                                            }}
                                            InputProps={{
                                                style:
                                                    touched.password && Boolean(errors.password)
                                                        ? {
                                                              borderBottomLeftRadius: 0,
                                                              borderBottomRightRadius: 0,
                                                          }
                                                        : {
                                                              borderBottomLeftRadius: 8,
                                                              borderBottomRightRadius: 8,
                                                          },
                                            }}
                                        />
                                    }
                                />
                            )}
                            <Button
                                onClick={() => {
                                    setReview(true);
                                    setStatus('ongoing');
                                }}
                                color="primary"
                                variant="contained"
                                fullWidth
                                disableElevation
                                disabled={isSubmitting || !isValid}
                            >
                                Review
                            </Button>
                            <Typography variant="caption">
                                Split your coins by two so you have more available UTXO to transact with
                            </Typography>
                        </Stack>
                    </form>
                </>
            )}
        </Formik>
    );
};

export default CoinSplit;

const useFormSchema = () => {
    const wallet = useAppSelector(selectBalance);
    return Yup.object().shape({
        token: Yup.object()
            .required('Field Required')
            .test('check-my-tokensendable', 'Invalid token sendable', function (val: any) {
                const { path, createError } = this;
                // console.log(val);
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
            // .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters')
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
