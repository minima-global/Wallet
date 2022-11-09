import { FC, useState, useEffect } from 'react';
import { Card, CardContent, TextField, Button, Skeleton, Stack, Typography, Tooltip } from '@mui/material';
import MiniModal from '../shared/components/MiniModal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { callStatus } from '../minima/rpc-commands';
import { insufficientFundsError, isValidURLAll, isValidURLSecureOnly } from '../shared/functions';

import GridLayout from '../layout/GridLayout';

import { useAppDispatch, useAppSelector } from '../minima/redux/hooks';
import { toggleNotification } from '../minima/redux/slices/notificationSlice';
import { selectBalance } from '../minima/redux/slices/balanceSlice';
import TokenConfirmation from './components/forms/common/TokenConfirmation';
import ModalManager from './components/managers/ModalManager';

import styles from '../theme/cssmodule/Components.module.css';
import Pending from './components/forms/Pending';
import FormFieldWrapper from '../shared/components/FormFieldWrapper';
import FormImageUrlSelect from '../shared/components/forms/FormImageUrlSelect';
import { buildCustomTokenCreation } from '../minima/libs/nft';
import { MiCustomToken } from '../minima/types/nft';
import Required from '../shared/components/forms/Required';
import Decimal from 'decimal.js';
import MiFunds from './components/forms/MiFunds';
import React from 'react';

/**
 * Minima scales up to 64 decimal places
 * tokens are scaled to 36 decimal places
 * 1 Minima === 1-e36
 */
Decimal.set({ precision: 64 });
Decimal.set({ toExpNeg: -36 });

const CreateTokenSchema = Yup.object().shape({
    funds: Yup.object().test('check-my-funds', 'Insufficient funds.', function (val: any) {
        const { path, createError, parent } = this;

        if (val == undefined) {
            return false;
        }

        if (new Decimal(val.sendable).equals(new Decimal(0))) {
            return createError({
                path: 'amount',
                message: `Insufficient funds, you require more Minima to create this token.`,
            });
        }

        return true;
    }),
    name: Yup.string()
        .required('This field is required')
        .matches(/^[^\\;]+$/, 'Invalid characters.'),
    amount: Yup.string()
        .required('This field is required')
        .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.'),
    description: Yup.string()
        .min(0)
        .max(255, 'Maximum 255 characters allowed.')
        .matches(/^[^\\;]+$/, 'Invalid characters.'),
    ticker: Yup.string()
        .min(0)
        .max(5, 'Maximum 5 characters allowed.')
        .matches(/^[^\\;]+$/, 'Invalid characters.'),
    burn: Yup.string().matches(/^[^a-zA-Z\\;"]+$/, 'Invalid characters.'),
    url: Yup.string()
        .trim()
        .required('This field is required.')
        .test('check-my-url', 'Invalid Url.', function (val) {
            const { path, createError, parent } = this;

            if (val == undefined) {
                return false;
            }

            if (parent.url.substring(0, 'data:image'.length) === 'data:image') {
                return true;
            }

            if (!isValidURLAll(parent.url)) {
                return createError({
                    path,
                    message: `Invalid URL`,
                });
            }
            return true;
        }),
    webvalidate: Yup.string().test('check-my-webvalidator', 'Invalid Url, must be https', function (val) {
        const { path, createError, parent } = this;

        if (val == undefined) {
            return true;
        }

        if (!isValidURLSecureOnly(parent.webvalidate)) {
            return createError({
                path,
                message: `Invalid URL, must be https`,
            });
        }
        return true;
    }),
});

const TokenCreation: FC = () => {
    const wallet = useAppSelector(selectBalance);
    const dispatch = useAppDispatch();
    const [modalEmployee, setModalEmployee] = useState('');
    const handleCloseModalEmployee = () => {
        setModalEmployee('');
    };
    const handleProceed = () => {
        setModalEmployee('confirmation');
    };

    const [open, setOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState('Failed');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setModalStatus('Failed');
    };

    React.useEffect(() => {
        formik.setFieldValue('funds', wallet[0]);
    }, [wallet]);

    const formik = useFormik({
        initialValues: {
            funds: wallet[0],
            name: '',
            amount: '',
            url: '',
            description: '',
            burn: '',
            webvalidate: '',
            ticker: '',
        },
        validationSchema: CreateTokenSchema,
        onSubmit: (formData) => {
            setModalEmployee('');

            const cToken: MiCustomToken = {
                name: formData.name.replaceAll(`"`, `'`),
                amount: formData.amount.toString(),
                url: formData.url, // upload image or normal url
                description: formData.description.replaceAll(`"`, `'`),
                burn: formData.burn.toString(),
                ticker: formData.ticker.replaceAll(`"`, `'`),
                type: 'STANDARDTOKEN',
                webvalidate: formData.webvalidate,
            };
            buildCustomTokenCreation(cToken)
                .then((res: any) => {
                    console.log(res);

                    setModalStatus('Success');
                    setOpen(true); // Show success modal
                    formik.resetForm();
                })
                .catch((err: any) => {
                    console.log(err);
                    dispatch(toggleNotification(`err`, 'error', 'error'));

                    // if (insufficientFundsError(err.message)) {
                    //     formik.setFieldError('amount', err.message);
                    //     dispatch(toggleNotification(err.message, 'error', 'error'));
                    // }
                });
        },
    });
    return (
        <GridLayout
            children={
                <>
                    <Card variant="outlined">
                        <CardContent>
                            <form onSubmit={formik.handleSubmit}>
                                <Stack spacing={2}>
                                    <FormFieldWrapper
                                        help=""
                                        children={<MiFunds formik={formik} funds={formik.values.funds} />}
                                    />
                                    {/* Asterisk required  */}
                                    <Required />
                                    <FormFieldWrapper
                                        required={true}
                                        help="Use a public image URL ending in .png .jpg or .jpeg or upload your own content"
                                        children={<FormImageUrlSelect formik={formik} />} // selector for url or upload
                                    />

                                    <FormFieldWrapper
                                        required={true}
                                        help="Enter a name for your custom token"
                                        children={
                                            <TextField
                                                disabled={formik.isSubmitting}
                                                fullWidth
                                                id="name"
                                                name="name"
                                                placeholder="name"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.name && Boolean(formik.errors.name)}
                                                helperText={formik.touched.name && formik.errors.name}
                                                FormHelperTextProps={{ className: styles['form-helper-text'] }}
                                                InputProps={{
                                                    style:
                                                        formik.touched.name && Boolean(formik.errors.name)
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
                                        required={true}
                                        help="Enter the total supply to create. By default 1 token will have 8 decimal places and use a small fraction of Minima (1e-36) from your balance"
                                        children={
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
                                                FormHelperTextProps={{ className: styles['form-helper-text'] }}
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
                                        }
                                    />

                                    <FormFieldWrapper
                                        help="Enter a description about your token"
                                        children={
                                            <TextField
                                                disabled={formik.isSubmitting}
                                                fullWidth
                                                id="description"
                                                name="description"
                                                placeholder="description"
                                                value={formik.values.description}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.description && Boolean(formik.errors.description)}
                                                helperText={
                                                    formik.values.description.length === 255
                                                        ? formik.values.description.length + '/255'
                                                        : null
                                                }
                                                FormHelperTextProps={{
                                                    style: { display: 'flex', justifyContent: 'flex-end' },
                                                }}
                                                multiline
                                                rows={4}
                                                inputProps={{ maxLength: 255 }}
                                            />
                                        }
                                    />

                                    <FormFieldWrapper
                                        help="Enter a ticker symbol (eg. MINIMA, BTC, ETH)"
                                        children={
                                            <TextField
                                                disabled={formik.isSubmitting}
                                                fullWidth
                                                id="ticker"
                                                name="ticker"
                                                placeholder="ticker"
                                                value={formik.values.ticker}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.ticker && Boolean(formik.errors.ticker)}
                                                FormHelperTextProps={{
                                                    style: { display: 'flex', justifyContent: 'flex-end' },
                                                }}
                                                inputProps={{
                                                    maxLength: 5,
                                                    style: {
                                                        textTransform:
                                                            formik.values.ticker.length > 0 ? 'uppercase' : 'lowercase',
                                                    },
                                                }}
                                            />
                                        }
                                    />

                                    <FormFieldWrapper
                                        help="Validate your token by hosting a public .txt file containing the tokenid on your own server or website. Create the link to the .txt file in advance and add the tokenid after creating the token."
                                        children={
                                            <TextField
                                                disabled={formik.isSubmitting}
                                                fullWidth
                                                id="webvalidate"
                                                name="webvalidate"
                                                placeholder="web validation url"
                                                value={formik.values.webvalidate}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.webvalidate && Boolean(formik.errors.webvalidate)}
                                                helperText={formik.touched.webvalidate && formik.errors.webvalidate}
                                            />
                                        }
                                    />

                                    <Button
                                        disabled={!(formik.isValid && formik.dirty && !formik.isSubmitting)}
                                        disableElevation
                                        color="primary"
                                        variant="contained"
                                        fullWidth
                                        onClick={() => setModalEmployee('burn')}
                                    >
                                        {formik.isSubmitting ? 'Please wait...' : 'Next'}
                                    </Button>
                                </Stack>
                            </form>
                        </CardContent>
                    </Card>

                    <ModalManager
                        proceedFn={handleProceed} // move onto confirmation
                        children={<TokenConfirmation formik={formik}></TokenConfirmation>}
                        modal={modalEmployee}
                        title="Confirmation"
                        formik={formik}
                        closeFn={handleCloseModalEmployee}
                    />

                    <MiniModal
                        open={open}
                        handleClose={handleClose}
                        handleOpen={handleOpen}
                        header={
                            modalStatus === 'Success' ? 'Success!' : modalStatus === 'Pending' ? 'Pending' : 'Failed!'
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
    );
};

export default TokenCreation;
