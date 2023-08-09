import { useFormik } from 'formik';
import Decimal from 'decimal.js';
import * as Yup from 'yup';
import React, { useState, useEffect } from 'react';

import { Button, Stack, TextField } from '@mui/material';
import { callSend } from '../../../../minima/rpc-commands';
import { MinimaToken } from '../../../../@types/minima';
import { useAppSelector } from '../../../../minima/redux/hooks';
import sharedStyles from '../../../../theme/cssmodule/Components.module.css';
import MiSelect from '../../../../shared/components/layout/MiSelect/MiSelect';
import { selectBalance } from '../../../../minima/redux/slices/balanceSlice';
import { MINIMA__DECIMAL_PRECISION, MINIMA__TOKEN_ID } from '../../../../shared/constants';

import FormFieldWrapper from '../../../../shared/components/FormFieldWrapper';

import QrScanner from '../../../../shared/components/qrscanner/QrScanner';
import validateMinimaAddress from '../../../../minima/commands/validateMinimaAddress/validateMinimaAddress';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { useParams } from 'react-router-dom';
import useIsUserRunningWebView from '../../../../hooks/useIsUserRunningWebView';
import FeatureUnavailable from '../../FeatureUnavailable';
import useIsVaultLocked from '../../../../hooks/useIsVaultLocked';
import SuccessDialog from '../SuccessDialog';
import ReviewDialog from '../ReviewDialog';

Decimal.set({ precision: MINIMA__DECIMAL_PRECISION });

interface ISendForm {
    token: MinimaToken;
    amount: string;
    address: string;
    burn: string;
}

const ValueTransfer = () => {
    const wallet = useAppSelector(selectBalance);
    const mySchema = useFormSchema();
    const [openQrScanner, setOpenQrScanner] = React.useState(false);
    const [errorScannedMinimaAddress, setErrorScannedMinimaAddress] = React.useState<false | string>(false);
    const userLockedVault = useIsVaultLocked();
    const [internalBrowserWarningModal, setInternalBrowserWarningModal] = useState(false);
    const isUserRunningWebView = useIsUserRunningWebView();

    const [error, setError] = useState('');
    const [showReview, setReview] = useState(false);
    const [showSuccess, setSuccess] = useState(false);
    const { tokenid, amount, address, burn } = useParams();

    useEffect(() => {
        if (tokenid) {
            formik.setFieldValue(
                'token',
                tokenid && wallet.find((i) => i.tokenid === tokenid)
                    ? wallet.filter((i) => i.tokenid === tokenid)[0]
                    : wallet[0]
            );
        }

        if (amount) {
            formik.setFieldValue('amount', amount);
        }
        if (address) {
            formik.setFieldValue('address', address);
        }
        if (burn) {
            formik.setFieldValue('burn', burn);
        }
    }, [tokenid, address, amount, burn, wallet]);

    const formik = useFormik({
        initialValues: {
            token: wallet[0],
            amount: '',
            address: '',
            burn: '',
            password: '',
        },
        onSubmit: async (formInputs: ISendForm) => {
            setSuccess(true);
            formik.setStatus('ongoing');
            try {
                // send rpc
                await callSend({ ...formInputs });
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

    const handleCloseQrScanner = () => {
        setOpenQrScanner(false);
    };
    const handleOpenQrScanner = () => {
        setOpenQrScanner(true);
    };

    const setAddressFieldValue = async (scannedMinimaAddress: string) => {
        setErrorScannedMinimaAddress(false);
        try {
            await validateMinimaAddress(scannedMinimaAddress);
            // it's valid so set input field
            formik.setFieldValue('address', scannedMinimaAddress);
            // close Modal
            setOpenQrScanner(false);
        } catch (error: any) {
            console.error(error);
            // set error
            setErrorScannedMinimaAddress(error.message);
        }
    };

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
                            <h6>Recipient Address</h6>
                            <p>{formik.values.address}</p>
                        </li>
                        <li>
                            <h6>Amount</h6>
                            <p>{formik.values.amount}</p>
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
            <FeatureUnavailable
                open={internalBrowserWarningModal}
                closeModal={() => setInternalBrowserWarningModal(false)}
            />
            <QrScanner
                setScannedResult={setAddressFieldValue}
                closeModal={handleCloseQrScanner}
                open={openQrScanner}
                error={errorScannedMinimaAddress}
            />
            <form onSubmit={formik.handleSubmit}>
                <Stack spacing={2}>
                    {/* Select a token */}
                    <MiSelect
                        coinSplitMode={false}
                        value={formik.values.token}
                        tokens={wallet}
                        error={Boolean(formik.errors.token) ? formik.errors.token : undefined}
                        setFieldValue={formik.setFieldValue}
                        resetForm={formik.resetForm}
                    />
                    {/* Choose an address */}

                    <TextField
                        disabled={formik.isSubmitting}
                        fullWidth
                        id="address"
                        name="address"
                        placeholder="minima address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.address && Boolean(formik.errors.address)}
                        helperText={formik.touched.address && formik.errors.address}
                        FormHelperTextProps={{ className: sharedStyles['form-helper-text'] }}
                        InputProps={{
                            style:
                                formik.touched.address && Boolean(formik.errors.address)
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
                        disabled={formik.isSubmitting}
                        fullWidth
                        id="amount"
                        name="amount"
                        placeholder="amount"
                        value={formik.values.amount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.amount && Boolean(formik.errors.amount)}
                        helperText={formik.touched.amount && formik.errors.amount}
                        FormHelperTextProps={{
                            className: sharedStyles['form-helper-text'],
                        }}
                        InputProps={{
                            autoComplete: 'off',
                            style:
                                formik.touched.amount && Boolean(formik.errors.amount)
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
                                    autoComplete: 'off',
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
                                        autoComplete: 'vault-password',
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
                        disabled={!(formik.isValid && formik.dirty && !formik.isSubmitting)}
                    >
                        Review
                    </Button>
                </Stack>
            </form>
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
