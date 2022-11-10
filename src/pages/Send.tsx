import { Button, TextField, Card, CardContent, Typography, Skeleton, Stack, Select, MenuItem } from '@mui/material';
import { FC, useState, useMemo } from 'react';
import { callSend } from '../minima/rpc-commands';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import MiniModal from '../shared/components/MiniModal';
import GridLayout from '../layout/GridLayout';

import { insufficientFundsError } from '../shared/functions';

import TokenListItem from './components/tokens/TokenListItem';
import { splitCoin } from '../minima/utils';
import { useAppDispatch, useAppSelector } from '../minima/redux/hooks';
import { selectBalance, selectBalanceFilter } from '../minima/redux/slices/balanceSlice';
import { toggleNotification } from '../minima/redux/slices/notificationSlice';
import { useParams } from 'react-router-dom';
import ModalManager from './components/managers/ModalManager';

import ValueTransferConfirmation from './components/forms/common/ValueTransferConfirmation';
import CoinSplitConfirmation from './components/forms/common/CoinSplitConfirmation';

import styles from '../theme/cssmodule/Components.module.css';
import Pending from './components/forms/Pending';

import Decimal from 'decimal.js';
import MiSelect from '../shared/components/layout/MiSelect';

/**
 * Minima scales up to 64 decimal places
 * tokens are scaled to 36 decimal places
 * 1 Minima === 1-e36
 */
Decimal.set({ precision: 64 });
Decimal.set({ toExpNeg: -36 });

const TransferTokenSchema = Yup.object().shape({
    tokenid: Yup.string().required('Field Required'),
    address: Yup.string()
        .matches(/0|M[xX][0-9a-zA-Z]+/, 'Invalid Address.')
        .min(59, 'Invalid Address, too short.')
        .max(66, 'Invalid Address, too long.')
        .required('Field Required'),
    amount: Yup.string()
        .required('Field Required')
        .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.')
        .test('check-my-amount', 'Invalid amount, NFTs cannot be divisible', function (val) {
            const { path, createError, parent } = this;
            if (val == undefined) {
                return false;
            }

            if (new Decimal(val).equals(new Decimal(0))) {
                return createError({
                    path,
                    message: `Invalid amount`,
                });
            }

            return true;
        }),
    burn: Yup.string().matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.'),
});

const CoinSplitterSchema = Yup.object().shape({
    tokenid: Yup.string().required('Field Required'),
    burn: Yup.string().matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.'),
});

const validationSchema = [null, TransferTokenSchema, CoinSplitterSchema];

type SendFormUtility = 'VALUETRANSFER' | 'COINSPLIT';
const Send: FC = () => {
    const dispatch = useAppDispatch();
    const [formUtility, setFormUtility] = useState<SendFormUtility>('VALUETRANSFER');
    const [mode, setMode] = useState(1);
    const [modalEmployee, setModalEmployee] = useState('');
    const wallet = useAppSelector(selectBalance);

    const handleCloseModalManager = () => {
        setModalEmployee('');
    };
    const handleProceed = () => {
        setModalEmployee('confirmation');
    };
    const handleUtilityChange = () => {
        setFormUtility(formUtility === 'VALUETRANSFER' ? 'COINSPLIT' : 'VALUETRANSFER');
    };
    // Handle Modal
    const [open, setOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState('Failed');
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setModalStatus('Failed');
    };

    // change validation according to mode set
    const dynamicValidation = useMemo(() => {
        return validationSchema[mode];
    }, [mode]);
    // change the validation on form depending on what utility we are using
    useMemo(() => {
        return setMode(formUtility === 'VALUETRANSFER' ? 1 : 2);
    }, [formUtility]);

    const formik = useFormik({
        initialValues: {
            token: wallet[0],
            amount: '',
            address: '',
            burn: '',
        },
        validationSchema: dynamicValidation,
        onSubmit: (data) => {
            setModalEmployee(''); // close modals
            const modifyData = {
                ...data,
                burn: data.burn && data.burn.length ? data.burn : 0,
                amount: data.amount && data.amount.length ? data.amount : 0,
            };

            if (formUtility === 'VALUETRANSFER') {
                // do normal value transfer
                callSend(modifyData)
                    .then((res: any) => {
                        if (!res.status && !res.pending) {
                            throw new Error(res.error ? res.error : res.message); // TODO.. consistent key value
                        }

                        // Non-write minidapp
                        if (!res.status && res.pending) {
                            setModalStatus('Pending');
                            setOpen(true);
                        }
                        // write Minidapp
                        if (res.status && !res.pending) {
                            // Set Modal
                            setModalStatus('Success');
                            // Open Modal
                            setOpen(true);
                        }
                        // SENT
                        formik.resetForm();
                    })
                    .catch((err) => {
                        if (err === undefined || err.message === undefined) {
                            dispatch(
                                toggleNotification(
                                    'Something went wrong!  Open a Discord Support ticket for assistance.',
                                    'error',
                                    'error'
                                )
                            );
                        }

                        if (insufficientFundsError(err.message)) {
                            formik.setFieldError('amount', err.message);
                            console.error(err.message);
                            dispatch(toggleNotification(err.message, 'error', 'error'));
                        }

                        if (err.message !== undefined) {
                            console.error(err.message);
                            dispatch(toggleNotification(err.message, 'error', 'error'));
                        }

                        // setOpenConfirmationModal(false);
                    })
                    .finally(() => {
                        // handleCloseConfirmationModal();
                        // NO MATTER WHAT
                        formik.setSubmitting(false);
                    });
            } else if (formUtility === 'COINSPLIT') {
                // const tkn = wallet.find((v) => v.tokenid === data.tokenid);
                // TODO
                const tkn = undefined;
                // if (tkn !== undefined) {
                //     // do coin split
                //     splitCoin(tkn.tokenid, tkn.sendable, tkn.coins, modifyData.burn)
                //         .then((res: any) => {
                //             // console.log(res);
                //             if (!res.status && !res.pending) {
                //                 throw new Error(res.error ? res.error : res.message); // TODO.. consistent key value
                //             }
                //             // SENT
                //             // Non-write minidapp
                //             if (!res.status && res.pending) {
                //                 setModalStatus('Pending');
                //                 setOpen(true);
                //             }
                //             // write Minidapp
                //             if (res.status && !res.pending) {
                //                 // Set Modal
                //                 setModalStatus('Success');
                //                 // Open Modal
                //                 setOpen(true);
                //             }
                //             formik.resetForm();
                //         })
                //         .catch((err) => {
                //             if (err === undefined || err.message === undefined) {
                //                 const balanceNotification = {
                //                     message: 'New balance update',
                //                     severity: 'info',
                //                     type: 'info',
                //                 };
                //                 dispatch(
                //                     toggleNotification(
                //                         balanceNotification.message,
                //                         balanceNotification.severity,
                //                         balanceNotification.type
                //                     )
                //                 );
                //             }

                //             if (insufficientFundsError(err.message)) {
                //                 formik.setFieldError('amount', err.message);
                //                 console.error(err.message);
                //                 dispatch(toggleNotification(`${err.message}`, 'error', 'error'));
                //             }

                //             if (err.message !== undefined) {
                //                 console.error(err.message);
                //                 dispatch(toggleNotification(`${err.message}`, 'error', 'error'));
                //             }
                //             // setOpenConfirmationModal(false);
                //         });
                // } else {
                //     dispatch(
                //         toggleNotification('Token not found!  Please open a Discord support ticket', 'error', 'error')
                //     );
                // }
            }
        },
        validateOnChange: true,
    });

    return (
        <>
            <GridLayout
                children={
                    <>
                        <Card variant="outlined">
                            <CardContent>
                                <form onSubmit={formik.handleSubmit}>
                                    {wallet && wallet.length > 0 ? (
                                        <Stack spacing={2}>
                                            <Select
                                                fullWidth
                                                disabled={formik.isSubmitting}
                                                id="send-select-mode"
                                                name="mode"
                                                value={formUtility}
                                                onChange={handleUtilityChange}
                                            >
                                                <MenuItem value="VALUETRANSFER">Value Transfer</MenuItem>
                                                <MenuItem value="COINSPLIT">Coin Split</MenuItem>
                                            </Select>

                                            <MiSelect
                                                id="token"
                                                name="token"
                                                value={formik.values.token}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                fullWidth={true}
                                                error={
                                                    formik.touched.token && Boolean(formik.errors.token) ? true : false
                                                }
                                                tokens={wallet}
                                                setFieldValue={formik.setFieldValue}
                                                resetForm={formik.resetForm}
                                            />

                                            {formUtility === 'VALUETRANSFER' ? (
                                                <Stack spacing={2}>
                                                    <TextField
                                                        disabled={formik.isSubmitting}
                                                        fullWidth
                                                        id="address"
                                                        name="address"
                                                        placeholder="Address"
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
                                                        }}
                                                    />
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
                                                </Stack>
                                            ) : null}
                                            <Button
                                                disabled={
                                                    formUtility === 'VALUETRANSFER'
                                                        ? !(formik.isValid && formik.dirty && !formik.isSubmitting)
                                                        : formik.isSubmitting
                                                }
                                                disableElevation
                                                color="primary"
                                                variant="contained"
                                                fullWidth
                                                onClick={() => {
                                                    //console.log('next');
                                                    setModalEmployee('burn');
                                                }}
                                            >
                                                {formik.isSubmitting ? 'Please wait...' : 'Next'}
                                            </Button>
                                            {mode === 2 ? (
                                                <>
                                                    <Typography variant="caption">
                                                        Coin split will divide an unspent coin into two, providing you
                                                        with additional coins to use as inputs to new transactions
                                                    </Typography>
                                                </>
                                            ) : null}
                                        </Stack>
                                    ) : (
                                        <Stack spacing={2}>
                                            <Skeleton
                                                sx={{ borderRadius: '8px', mb: 2 }}
                                                variant="rectangular"
                                                width="100%"
                                                height={80}
                                            />
                                            <Skeleton
                                                sx={{ borderRadius: '8px', mb: 2 }}
                                                variant="rectangular"
                                                width="100%"
                                                height={60}
                                            />
                                            <Skeleton
                                                sx={{ borderRadius: '8px', mb: 2 }}
                                                variant="rectangular"
                                                width="100%"
                                                height={60}
                                            />
                                        </Stack>
                                    )}
                                </form>
                            </CardContent>
                        </Card>

                        <ModalManager
                            formik={formik}
                            modal={modalEmployee}
                            closeFn={handleCloseModalManager}
                            proceedFn={handleProceed}
                            children={
                                formUtility === 'VALUETRANSFER' ? (
                                    <ValueTransferConfirmation formik={formik} />
                                ) : (
                                    <CoinSplitConfirmation formik={formik} />
                                )
                            }
                        />

                        <MiniModal
                            open={open}
                            handleClose={handleClose}
                            handleOpen={handleOpen}
                            header={
                                modalStatus === 'Success'
                                    ? 'Success!'
                                    : modalStatus === 'Pending'
                                    ? 'Pending'
                                    : 'Failed!'
                            }
                            status="Transaction Status"
                            subtitle={
                                modalStatus === 'Success' ? (
                                    'Your transaction will be received shortly'
                                ) : modalStatus === 'Pending' ? (
                                    <Pending />
                                ) : (
                                    'Please try again later.'
                                )
                            }
                        />
                    </>
                }
            />
        </>
    );
};

export default Send;
