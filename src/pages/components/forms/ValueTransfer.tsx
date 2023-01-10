import { useFormik } from 'formik';
import Decimal from 'decimal.js';
import * as Yup from 'yup';
import React from 'react';

import { Button, Stack, TextField } from '@mui/material';
import { callSend } from '../../../minima/rpc-commands';
import { MinimaToken } from '../../../@types/minima2';
import { useAppSelector } from '../../../minima/redux/hooks';
import styles from '../../../theme/cssmodule/Components.module.css';
import MiSelect from '../../../shared/components/layout/MiSelect';
import { selectBalance } from '../../../minima/redux/slices/balanceSlice';
import { MINIMA__DECIMAL_PRECISION, MINIMA__TOKEN_ID } from '../../../shared/constants';
import ValueTransferConfirmation from './common/ValueTransferConfirmation';

import ModalManager from '../managers/ModalManager';
import MiniModal from '../../../shared/components/MiniModal';
import Pending from './Pending';
import FormFieldWrapper from '../../../shared/components/FormFieldWrapper';
import styled from '@emotion/styled';

import QrScanner from '../../../shared/components/qrscanner/QrScanner';
import validateMinimaAddress from '../../../minima/commands/validateMinimaAddress/validateMinimaAddress';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

Decimal.set({ precision: MINIMA__DECIMAL_PRECISION });

interface ISendForm {
    token: MinimaToken;
    amount: string;
    address: string;
    burn: string;
}

const MiCameraButton = styled('img')``;

interface IProps {}
type IStatusModal = 'success' | 'error' | 'pending' | '';
const ValueTransfer = ({}: IProps) => {
    const mySchema = useFormSchema();
    const wallet = useAppSelector(selectBalance);
    const [modalEmployee, setModalEmployee] = React.useState('');
    const [statusModal, setStatusModal] = React.useState<IStatusModal>('');
    const [openQrScanner, setOpenQrScanner] = React.useState(true);
    const [errorScannedMinimaAddress, setErrorScannedMinimaAddress] = React.useState<false | string>(false);

    const [modalStatusMessage, setModalStatusMessage] = React.useState<false | string>(false);

    const formik = useFormik({
        initialValues: {
            token: wallet[0],
            amount: '',
            address: '',
            burn: '',
            password: '',
        },
        onSubmit: async (formInputs: ISendForm) => {
            try {
                // send rpc
                const jsonResponse = await callSend({ ...formInputs });
                // success..
                handleSuccessState(
                    `Your transaction has been posted on block height ${jsonResponse.postedHeight} and should arrive soon.`
                );
            } catch (error: any) {
                console.log(error);

                handleErrorState(error.message);
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

    const handleSuccessState = (message: string) => {
        setStatusModal('success');
        setModalStatusMessage(message);
        handleCloseModalManager();
        formik.resetForm();
    };
    const handleErrorState = (message: string) => {
        setStatusModal('error');
        setModalStatusMessage(message);
        handleCloseModalManager();
        formik.setSubmitting(false);
    };

    const handleCloseModalManager = () => {
        setModalEmployee('');
    };
    const handleProceedButton = () => {
        setModalEmployee('confirmation');
    };
    const handleCloseStatusModal = () => setStatusModal('');

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
                    <Stack alignItems="center" justifyContent="center">
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
                            FormHelperTextProps={{ className: styles['form-helper-text'] }}
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
                                            className={styles['qr-scanner']}
                                            color="inherit"
                                            onClick={handleOpenQrScanner}
                                        />
                                    </>
                                ),
                            }}
                        />
                        <MiCameraButton onClick={() => console.log('Open qr scanner')} src="" />
                    </Stack>
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
                            className: styles['form-helper-text'],
                        }}
                        InputProps={{
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
                    <FormFieldWrapper
                        help="If your database (vault) is locked, use the password here otherwise ignore this"
                        children={
                            <TextField
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

                    <Button
                        // type="submit"
                        onClick={handleProceedButton}
                        color="primary"
                        variant="contained"
                        fullWidth
                        disableElevation
                        disabled={!(formik.isValid && formik.dirty && !formik.isSubmitting)}
                    >
                        {formik.isSubmitting ? 'Building transaction...' : 'Continue'}
                    </Button>
                </Stack>
            </form>
            <ModalManager
                formik={formik}
                modal={modalEmployee}
                closeFn={handleCloseModalManager}
                children={<ValueTransferConfirmation formik={formik} />}
            />
            <MiniModal
                open={statusModal.length > 0 ? true : false}
                handleClose={handleCloseStatusModal}
                header={statusModal === 'success' ? 'Success.' : 'Failed.'}
                status="Transaction Status"
                subtitle={modalStatusMessage}
            />
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
