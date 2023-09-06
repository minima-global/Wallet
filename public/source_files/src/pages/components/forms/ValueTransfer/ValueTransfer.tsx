import { Formik, useFormik } from 'formik';
import Decimal from 'decimal.js';
import * as Yup from 'yup';
import React, { useState, useEffect } from 'react';

import { Button, Stack, TextField } from '@mui/material';
import { callSend } from '../../../../minima/rpc-commands';
import { MinimaToken } from '../../../../@types/minima';
import { useAppSelector } from '../../../../minima/redux/hooks';
import sharedStyles from '../../../../theme/cssmodule/Components.module.css';
import { selectBalance } from '../../../../minima/redux/slices/balanceSlice';
import { MINIMA__DECIMAL_PRECISION, MINIMA__TOKEN_ID } from '../../../../shared/constants';

import FormFieldWrapper from '../../../../shared/components/FormFieldWrapper';

import QrScanner from '../../../../shared/components/qrscanner/QrScanner';
import validateMinimaAddress from '../../../../minima/commands/validateMinimaAddress/validateMinimaAddress';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { useParams, useSearchParams } from 'react-router-dom';
import useIsUserRunningWebView from '../../../../hooks/useIsUserRunningWebView';
import FeatureUnavailable from '../../FeatureUnavailable';
import useIsVaultLocked from '../../../../hooks/useIsVaultLocked';
import SuccessDialog from '../SuccessDialog';
import ReviewDialog from '../ReviewDialog';
import WalletSelect from '../../WalletSelect';

Decimal.set({ precision: MINIMA__DECIMAL_PRECISION });

interface ISendForm {
    token: MinimaToken;
    amount: string;
    address: string;
    burn: string;
    password: string;
}

const ValueTransfer = () => {
    const wallet = useAppSelector(selectBalance);
    const mySchema = useFormSchema();
    const [openQrScanner, setOpenQrScanner] = React.useState(false);
    const userLockedVault = useIsVaultLocked();
    const [internalBrowserWarningModal, setInternalBrowserWarningModal] = useState(false);
    const isUserRunningWebView = useIsUserRunningWebView();

    const [error, setError] = useState('');
    const [showReview, setReview] = useState(false);
    const [showSuccess, setSuccess] = useState(false);

    const handleCloseQrScanner = () => {
        setOpenQrScanner(false);
    };
    const handleOpenQrScanner = () => {
        setOpenQrScanner(true);
    };

    return (
        <>
            <Formik
                initialValues={{ token: wallet[0], amount: '', address: '', burn: '', password: '' }}
                onSubmit={async (formInputs: ISendForm, { setStatus }) => {
                    setSuccess(true);
                    setStatus('ongoing');
                    try {
                        // send rpc
                        await callSend({ ...formInputs });
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
                    values,
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
                                        <h6>Recipient Address</h6>
                                        <p>{values.address}</p>
                                    </li>
                                    <li>
                                        <h6>Amount</h6>
                                        <p>{values.amount}</p>
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
                        <FeatureUnavailable
                            open={internalBrowserWarningModal}
                            closeModal={() => setInternalBrowserWarningModal(false)}
                        />
                        <QrScanner closeModal={handleCloseQrScanner} open={openQrScanner} />
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <WalletSelect />
                                {/* Choose an address */}

                                <TextField
                                    disabled={isSubmitting}
                                    fullWidth
                                    placeholder="minima address"
                                    {...getFieldProps('address')}
                                    error={touched.address && Boolean(errors.address)}
                                    helperText={touched.address && errors.address}
                                    FormHelperTextProps={{ className: sharedStyles['form-helper-text'] }}
                                    InputProps={{
                                        style:
                                            touched.address && Boolean(errors.address)
                                                ? {
                                                      borderBottomLeftRadius: 0,
                                                      borderBottomRightRadius: 0,
                                                  }
                                                : {
                                                      borderBottomLeftRadius: 8,
                                                      borderBottomRightRadius: 8,
                                                  },
                                        endAdornment: (
                                            <>
                                                <QrCodeScannerIcon
                                                    className={sharedStyles['qr-scanner']}
                                                    color="inherit"
                                                    onClick={
                                                        !isUserRunningWebView
                                                            ? handleOpenQrScanner
                                                            : () => setInternalBrowserWarningModal(true)
                                                    }
                                                />
                                            </>
                                        ),
                                    }}
                                />

                                {/* Choose an amount */}
                                <TextField
                                    disabled={isSubmitting}
                                    fullWidth
                                    placeholder="amount"
                                    {...getFieldProps('amount')}
                                    error={touched.amount && Boolean(errors.amount)}
                                    helperText={touched.amount && errors.amount}
                                    FormHelperTextProps={{
                                        className: sharedStyles['form-helper-text'],
                                    }}
                                    InputProps={{
                                        autoComplete: 'off',
                                        style:
                                            touched.amount && Boolean(errors.amount)
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
                                {/* Choose a burn amount */}
                                <FormFieldWrapper
                                    help="Prioritize your transaction by adding a burn. Burn amounts are denominated in Minima only."
                                    children={
                                        <TextField
                                            autoComplete="off"
                                            disabled={isSubmitting}
                                            fullWidth
                                            placeholder="burn fee"
                                            {...getFieldProps('burn')}
                                            error={touched.burn && Boolean(errors.burn)}
                                            helperText={touched.burn && errors.burn}
                                            FormHelperTextProps={{
                                                className: sharedStyles['form-helper-text'],
                                            }}
                                            InputProps={{
                                                autoComplete: 'off',
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
                                                    autoComplete: 'vault-password',
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
                                    disabled={!(isValid && dirty && !isSubmitting)}
                                >
                                    Review
                                </Button>
                            </Stack>
                        </form>
                    </>
                )}
            </Formik>
        </>
    );
};

export default ValueTransfer;

const useFormSchema = () => {
    const wallet = useAppSelector(selectBalance);
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
            .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.')
            .test('check-my-amount', 'Invalid amount', function (val) {
                const { path, createError, parent } = this;
                if (val === undefined) {
                    return false;
                }

                if (new Decimal(val).greaterThan(new Decimal(parent.token.sendable))) {
                    const desiredAmountToSend = new Decimal(val);
                    const available = new Decimal(parent.token.sendable);
                    const requiredAnother = desiredAmountToSend.minus(available);

                    return createError({
                        path,
                        message: `Oops, insufficient funds, you require another ${requiredAnother.toNumber()} ${
                            parent.tokenid === MINIMA__TOKEN_ID
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
            .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.')
            .test('check-my-burnamount', 'Invalid burn amount', function (val) {
                const { path, createError, parent } = this;
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
    });
};
