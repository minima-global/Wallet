import { FC } from 'react';
import { Card, CardContent, TextField, Button, Stack } from '@mui/material';
import MiniModal from '../shared/components/MiniModal';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { isValidURLAll, isValidURLSecureOnly } from '../shared/functions';

import GridLayout from '../layout/GridLayout';

import { useAppSelector } from '../minima/redux/hooks';
import { selectBalance } from '../minima/redux/slices/balanceSlice';
import TokenConfirmation from './components/forms/common/TokenConfirmation';
import ModalManager from './components/managers/ModalManager';

import styles from '../theme/cssmodule/Components.module.css';
import FormFieldWrapper from '../shared/components/FormFieldWrapper';
import FormImageUrlSelect from '../shared/components/forms/FormImageUrlSelect';
import { buildCustomTokenCreation } from '../minima/libs/nft';
import { MiCustomToken } from '../@types/nft';
import Required from '../shared/components/forms/Required';
import Decimal from 'decimal.js';
import MiFunds from './components/forms/MiFunds';
import React from 'react';
import { useModalHandler } from '../hooks/useModalHandler';
import useIsVaultLocked from '../hooks/useIsVaultLocked';
import { NoResults } from '../shared/components/layout/MiToken';

/**
 * Minima scales up to 64 decimal places
 * tokens are scaled to 36 decimal places
 * 1 Minima === 1-e36
 */
Decimal.set({ precision: 64 });
Decimal.set({ toExpNeg: -36 });

const TokenCreation: FC = () => {
    const mySchema = useMySchema();
    const wallet = useAppSelector(selectBalance);

    const userLockedVault = useIsVaultLocked();

    const {
        statusModal,
        modalStatusMessage,
        handleSuccessState,
        handleErrorState,
        handleProceedButton,
        modalEmployee,
        handleCloseModalManager,
        handleCloseStatusModal,
        setModalEmployee,
    } = useModalHandler();

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
        validationSchema: mySchema,
        onSubmit: async (formData) => {
            setModalEmployee('');

            const cToken: MiCustomToken = {
                name: formData.name.replaceAll(`"`, `'`),
                url: formData.url, // upload image or normal url
                description: formData.description.replaceAll(`"`, `'`) || '',
                ticker: formData.ticker.replaceAll(`"`, `'`) || '',
                webvalidate: formData.webvalidate || '',
            };

            try {
                // send rpc
                await buildCustomTokenCreation(cToken, formData.amount, false);
                // success..
                handleSuccessState(`You have successfully created this token, it should arrive in your balance soon.`);
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
    });
    React.useEffect(() => {
        formik.setFieldValue('funds', wallet[0]);
    }, [formik, wallet]);

    return (
        <GridLayout
            children={
                <>
                    {userLockedVault && (
                        <NoResults>
                            <h6>You have locked your vault with a password.</h6>
                            <p>Unlock it so you can access this form.</p>
                        </NoResults>
                    )}
                    {!userLockedVault && (
                        <Card variant="outlined">
                            <CardContent>
                                <form onSubmit={formik.handleSubmit}>
                                    <Stack spacing={2}>
                                        <FormFieldWrapper
                                            help="Your current Minima balance:"
                                            children={<MiFunds formik={formik} funds={formik.values.funds} />}
                                        />
                                        {/* Asterisk required  */}
                                        <Required />
                                        <FormFieldWrapper
                                            required={false}
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
                                                    error={
                                                        formik.touched.description && Boolean(formik.errors.description)
                                                    }
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
                                                                formik.values.ticker.length > 0
                                                                    ? 'uppercase'
                                                                    : 'lowercase',
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
                                                    error={
                                                        formik.touched.webvalidate && Boolean(formik.errors.webvalidate)
                                                    }
                                                    helperText={formik.touched.webvalidate && formik.errors.webvalidate}
                                                />
                                            }
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

                                        <Button
                                            onClick={handleProceedButton}
                                            disabled={formik.isSubmitting || !formik.isValid}
                                            disableElevation
                                            color="primary"
                                            variant="contained"
                                            fullWidth
                                        >
                                            {formik.isSubmitting ? 'Please wait...' : 'Create'}
                                        </Button>
                                    </Stack>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    <ModalManager
                        formik={formik}
                        modal={modalEmployee}
                        closeFn={handleCloseModalManager}
                        children={<TokenConfirmation formik={formik} />}
                    />

                    <MiniModal
                        open={statusModal && statusModal.length > 0}
                        handleClose={handleCloseStatusModal}
                        header={statusModal && statusModal.length > 0 ? statusModal : ''}
                        status="Transaction Status"
                        subtitle={modalStatusMessage}
                    />
                </>
            }
        />
    );
};

export default TokenCreation;

const useMySchema = () => {
    const wallet = useAppSelector(selectBalance);
    return Yup.object().shape({
        funds: Yup.object().test('check-my-funds', 'Insufficient funds.', function (val: any) {
            const { createError } = this;

            if (val === undefined) {
                return false;
            }

            if (val.sendable !== undefined && new Decimal(val.sendable).equals(new Decimal(0))) {
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
            .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.')
            .test('check-my-amount', 'Invalid amount', function (val) {
                const { path, createError } = this;
                if (val === undefined) {
                    return false;
                }

                if (new Decimal(val).greaterThan(new Decimal(1000000000000))) {
                    return createError({
                        path,
                        message: `Invalid amount, cannot create more than 1 trillion tokens`,
                    });
                }

                if (new Decimal(val).lessThan(new Decimal(1))) {
                    return createError({
                        path,
                        message: `Invalid amount, must be 1 or greater`,
                    });
                }

                return true;
            }),
        description: Yup.string()
            .min(0)
            .max(255, 'Maximum 255 characters allowed.')
            .matches(/^[^\\;]+$/, 'Invalid characters.'),
        ticker: Yup.string()
            .min(0)
            .max(5, 'Maximum 5 characters allowed.')
            .matches(/^[^\\;]+$/, 'Invalid characters.'),
        burn: Yup.string()
            .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.')
            .test('check-my-burnamount', 'Invalid burn amount', function (val) {
                const { path, createError } = this;
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
        url: Yup.string()
            .trim()
            .test('check-my-url', 'Invalid Url.', function (val) {
                const { path, createError, parent } = this;

                if (val === undefined) {
                    return true;
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

            if (val === undefined) {
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
};
