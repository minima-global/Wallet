import { useFormik } from 'formik';
import Decimal from 'decimal.js';
import * as Yup from 'yup';

import { Button, Stack, TextField, Typography } from '@mui/material';
import { MinimaToken } from '../../../@types/minima';
import { useAppSelector } from '../../../minima/redux/hooks';
import styles from '../../../theme/cssmodule/Components.module.css';
import MiSelect from '../../../shared/components/layout/MiSelect/MiSelect';
import { selectBalance } from '../../../minima/redux/slices/balanceSlice';
import { MINIMA__DECIMAL_PRECISION } from '../../../shared/constants';

import MiniModal from '../../../shared/components/MiniModal';
import CoinSplitConfirmation from './common/CoinSplitConfirmation';

import ModalManager from '../managers/ModalManager';
import React from 'react';
import { splitCoin } from '../../../minima/utils';
import FormFieldWrapper from '../../../shared/components/FormFieldWrapper';
import { useModalHandler } from '../../../hooks/useModalHandler';
import useIsVaultLocked from '../../../hooks/useIsVaultLocked';

Decimal.set({ precision: MINIMA__DECIMAL_PRECISION });

interface ISendForm {
    token: MinimaToken;
    burn: string;
    password: string;
}

const CoinSplit = () => {
    const mySchema = useFormSchema();
    const wallet = useAppSelector(selectBalance);
    const {
        statusModal,
        modalStatusMessage,
        handleSuccessState,
        handleErrorState,
        handleProceedButton,
        modalEmployee,
        handleCloseModalManager,
        handleCloseStatusModal,
    } = useModalHandler();

    const userLockedVault = useIsVaultLocked();

    const formik = useFormik({
        initialValues: {
            token: wallet[0],
            burn: '',
            password: '',
        },
        onSubmit: async (formInputs: ISendForm) => {
            try {
                // send rpc
                const jsonResponse = await splitCoin(
                    formInputs.token.tokenid,
                    formInputs.token.sendable,
                    formInputs.burn,
                    formInputs.password
                );
                // success..
                handleSuccessState(
                    `Your transaction has been posted on block height ${jsonResponse.postedHeight} and should arrive soon.`
                );
                // time to reset
                formik.resetForm();
            } catch (error: any) {
                const isPending = error.message === 'pending';

                if (isPending) {
                    // time to reset
                    formik.resetForm();
                }
                handleErrorState(isPending, error.message);
            }
        },
        validationSchema: mySchema,
    });

    return (
        <>
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
                                    className: styles['form-helper-text'],
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
                                        className: styles['form-helper-text'],
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
                        onClick={handleProceedButton}
                        color="primary"
                        variant="contained"
                        fullWidth
                        disableElevation
                        disabled={formik.isSubmitting || !formik.isValid}
                    >
                        {formik.isSubmitting ? 'Please wait...' : 'Split Coin'}
                    </Button>
                    <Typography variant="caption">
                        Split your coins by two so you have more available UTXO to transact with
                    </Typography>
                </Stack>
            </form>
            <ModalManager
                formik={formik}
                modal={modalEmployee}
                closeFn={handleCloseModalManager}
                children={<CoinSplitConfirmation formik={formik} />}
            />
            <MiniModal
                open={statusModal && statusModal.length > 0}
                handleClose={handleCloseStatusModal}
                header={statusModal && statusModal.length > 0 ? statusModal : ''}
                status="Transaction Status"
                subtitle={modalStatusMessage}
            />
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
