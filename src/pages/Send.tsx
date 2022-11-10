import { Button, TextField, Card, CardContent, Typography, Skeleton, Stack, Select, MenuItem } from '@mui/material';
import { FC, useState, useMemo, useEffect } from 'react';
import { callSend } from '../minima/rpc-commands';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import MiniModal from '../shared/components/MiniModal';
import GridLayout from '../layout/GridLayout';

import { splitCoin } from '../minima/utils';
import { insufficientFundsError } from '../shared/functions';
import { useAppDispatch, useAppSelector } from '../minima/redux/hooks';
import { selectBalance } from '../minima/redux/slices/balanceSlice';
import { toggleNotification } from '../minima/redux/slices/notificationSlice';
import ModalManager from './components/managers/ModalManager';
import ValueTransferConfirmation from './components/forms/common/ValueTransferConfirmation';
import CoinSplitConfirmation from './components/forms/common/CoinSplitConfirmation';
import MiSelect from '../shared/components/layout/MiSelect';
import Pending from './components/forms/Pending';

import styles from '../theme/cssmodule/Components.module.css';

import Decimal from 'decimal.js';
import { MINIMA__TOKEN_ID } from '../shared/constants';

/**
 * Minima scales up to 64 decimal places
 * tokens are scaled to 36 decimal places
 * 1 Minima === 1-e36
 */
Decimal.set({ precision: 64 });
Decimal.set({ toExpNeg: -36 });

type SendFormUtility = 'VALUETRANSFER' | 'COINSPLIT';
const Send: FC = () => {
    const TransferTokenSchema = Yup.object().shape({
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
    const CoinSplitterSchema = Yup.object().shape({
        token: Yup.object()
            .required('Field Required')
            .test('check-my-tokensendable', 'Invalid token sendable', function (val: any) {
                const { path, createError } = this;
                if (val === undefined) {
                    return false;
                }

                if (val.token.type && val.token.type === 'NFT') {
                    return createError({
                        path,
                        message: `You cannot split a non-fungible token`,
                    });
                }

                if (new Decimal(val.sendable).equals(new Decimal(0))) {
                    return createError({
                        path,
                        message: `Oops, not enough funds available to perform a split`,
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
    const validationSchema = [null, TransferTokenSchema, CoinSplitterSchema];

    const dispatch = useAppDispatch();
    const [formUtility, setFormUtility] = useState<SendFormUtility>('VALUETRANSFER');
    const [mode, setMode] = useState(1);
    const [modalEmployee, setModalEmployee] = useState('');
    const wallet = useAppSelector(selectBalance);

    useEffect(() => {
        if (!formik.values.token) {
            formik.setFieldValue('token', wallet[0]);
        }
    }, [wallet]);
    const handleCloseModalManager = () => {
        setModalEmployee('');
        formik.setFieldValue('burn', '');
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
            const sendPayload = {
                token: data.token,
                address: data.address,
                amount: data.amount || '',
                burn: data.burn || '',
            };

            if (formUtility === 'VALUETRANSFER') {
                // do normal value transfer
                callSend({ ...sendPayload })
                    .then(() => {
                        setOpen(true);
                        setModalStatus('Success');
                        // SENT
                        formik.resetForm();
                    })
                    .catch((err) => {
                        console.error(err.message);
                        dispatch(toggleNotification(err.message, 'error', 'error'));
                    });
            } else if (formUtility === 'COINSPLIT') {
                // do coin split
                splitCoin(data.token.tokenid, data.token.sendable, data.token.coins, data.burn)
                    .then(() => {
                        setOpen(true);
                        setModalStatus('Success');
                        formik.resetForm();
                    })
                    .catch((err) => {
                        console.error(err);
                        dispatch(toggleNotification(`${err.message}`, 'error', 'error'));
                    });
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
                                                error={Boolean(formik.errors.token) ? formik.errors.token : undefined}
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
                                                disabled={!(formik.isValid && formik.dirty && !formik.isSubmitting)}
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
                                            {formUtility === 'COINSPLIT' ? (
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
