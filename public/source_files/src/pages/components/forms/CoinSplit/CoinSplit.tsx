import { useFormik } from 'formik';
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

    const formik = useFormik({
        initialValues: {
            token: wallet[0],
            burn: '',
            password: '',
        },
        onSubmit: async (formInputs: ISendForm) => {
            setSuccess(true);
            formik.setStatus('ongoing');
            try {
                await splitCoin(
                    formInputs.token.tokenid,
                    formInputs.token.sendable,
                    formInputs.burn,
                    formInputs.password
                );
                formik.setStatus('complete');
            } catch (error: any) {
                const isPending = error.message === 'pending';
                if (isPending) {
                    formik.setStatus('pending');
                }
                if (!isPending) {
                    formik.setStatus('failed');
                    setError(error.message);
                }
            }
        },
        validationSchema: mySchema,
    });

    return (
        <>
            <SuccessDialog
                open={showSuccess}
                error={error}
                transactionCreationStatus={formik.status}
                hideSuccess={() => setSuccess(false)}
                clearForm={() => formik.resetForm()}
            />
            <ReviewDialog
                open={showReview}
                children={
                    <ul id="list">
                        <li>
                            <h6>Splitting your sendable balance in two</h6>
                            <p>{formik.values.token.sendable}</p>
                        </li>
                        {!!formik.values.burn.length && (
                            <li>
                                <h6>Burn</h6>
                                <p>{formik.values.burn}</p>
                            </li>
                        )}
                    </ul>
                }
                transactionCreationStatus={formik.status}
                hideReview={() => setReview(false)}
                submitForm={() => formik.submitForm()}
            />
            <form onSubmit={formik.handleSubmit}>
                <Stack spacing={2}>
                    {/* Select a token */}
                    <MiSelect
                        value={formik.values.token}
                        tokens={wallet}
                        error={Boolean(formik.errors.token) ? formik.errors.token : undefined}
                        setFieldValue={formik.setFieldValue}
                        resetForm={formik.resetForm}
                        coinSplitMode={true}
                    />
                    {/* Choose a burn amount */}
                    <FormFieldWrapper
                        help="Prioritize your transaction by adding a burn. Burn amounts are denominated in Minima only."
                        children={
                            <TextField
                                disabled={formik.isSubmitting}
                                fullWidth
                                id="burn"
                                name="burn"
                                placeholder="burn fee"
                                value={formik.values.burn}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.burn && Boolean(formik.errors.burn)}
                                helperText={formik.touched.burn && formik.errors.burn}
                                FormHelperTextProps={{
                                    className: sharedStyles['form-helper-text'],
                                }}
                                InputProps={{
                                    style:
                                        formik.touched.burn && Boolean(formik.errors.burn)
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
                                    disabled={formik.isSubmitting}
                                    fullWidth
                                    id="password"
                                    name="password"
                                    placeholder="vault password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                    FormHelperTextProps={{
                                        className: sharedStyles['form-helper-text'],
                                    }}
                                    InputProps={{
                                        style:
                                            formik.touched.password && Boolean(formik.errors.password)
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
                            formik.setStatus('ongoing');
                        }}
                        color="primary"
                        variant="contained"
                        fullWidth
                        disableElevation
                        disabled={formik.isSubmitting || !formik.isValid}
                    >
                        Review
                    </Button>
                    <Typography variant="caption">
                        Split your coins by two so you have more available UTXO to transact with
                    </Typography>
                </Stack>
            </form>
        </>
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
