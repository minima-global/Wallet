import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Dialog, Stack, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

import styles from './CreateNFT.module.css';

import { buildCustomTokenCreation } from '../../../../minima/libs/nft';
import { isValidURLAll, isValidURLSecureOnly } from '../../../../shared/functions';
import { useAppSelector } from '../../../../minima/redux/hooks';
import FormImageUrlSelect from '../../../../shared/components/forms/FormImageUrlSelect';
import { MiNFT } from '../../../../@types/nft';
import Required from '../../../../shared/components/forms/Required';
import FormFieldWrapper from '../../../../shared/components/FormFieldWrapper';
import { selectBalance } from '../../../../minima/redux/slices/balanceSlice';

import Decimal from 'decimal.js';
import MiFunds from '../../forms/MiFunds';
import ReviewDialog from '../../forms/ReviewDialog';
import SuccessDialog from '../../forms/SuccessDialog';

/**
 * Minima scales up to 64 decimal places
 * tokens are scaled to 36 decimal places
 * 1 Minima === 1-e36
 */
Decimal.set({ precision: 64 });
Decimal.set({ toExpNeg: -36 });

const CreateNFTForm = () => {
    const mySchema = useMySchema();
    const wallet = useAppSelector(selectBalance);

    const [error, setError] = useState('');
    const [showReview, setReview] = useState(false);
    const [showSuccess, setSuccess] = useState(false);

    return (
        <Formik
            initialValues={{
                funds: wallet[0],
                url: '',
                amount: '',
                name: '',
                description: '',
                external_url: '',
                owner: '',
                creation_date: '',
                webvalidate: '',
                burn: '',
            }}
            onSubmit={async (data, { setStatus }) => {
                setSuccess(true);
                setStatus('ongoing');

                const cNFT: MiNFT = {
                    name: data.name.replaceAll(`"`, `'`),
                    url: data.url,
                    description: data.description.replaceAll(`"`, `'`) || '',
                    webvalidate: data.webvalidate.replaceAll(`"`, `'`) || '',
                    owner: data.owner.replaceAll(`"`, `'`) || '',
                    external_url: data.external_url.replaceAll(`"`, `'`) || '',
                };

                try {
                    // send rpc
                    await buildCustomTokenCreation(cNFT, data.amount, true);
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
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <FormFieldWrapper help="Your current Minima balance:" children={<MiFunds />} />
                            {/* Required field helper */}
                            <Required />

                            <Typography variant="h6" className={styles['form-image-title']}>
                                Image
                            </Typography>
                            <FormFieldWrapper
                                help="Enter your NFT's image URL"
                                children={
                                    <TextField
                                        disabled={isSubmitting}
                                        fullWidth
                                        placeholder="image url"
                                        {...getFieldProps('url')}
                                        error={touched.description && Boolean(errors.description)}
                                        FormHelperTextProps={{
                                            style: { display: 'flex', justifyContent: 'flex-end' },
                                        }}
                                    />
                                }
                            />

                            <FormFieldWrapper
                                required={true}
                                help="Enter a name for your custom NFT"
                                children={
                                    <TextField
                                        disabled={isSubmitting}
                                        fullWidth
                                        {...getFieldProps('name')}
                                        placeholder="name *"
                                        error={touched.name && Boolean(errors.name)}
                                        helperText={touched.name && errors.name}
                                        FormHelperTextProps={{ className: styles['form-helper-text'] }}
                                        InputProps={{
                                            style:
                                                touched.name && Boolean(errors.name)
                                                    ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                                    : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                                        }}
                                    />
                                }
                            />

                            <FormFieldWrapper
                                required={true}
                                help="NFT's are non-fungible tokens, and can only be sent or received as whole coins, never fractions"
                                children={
                                    <TextField
                                        disabled={isSubmitting}
                                        fullWidth
                                        placeholder="amount *"
                                        {...getFieldProps('amount')}
                                        error={touched.amount && Boolean(errors.amount)}
                                        helperText={touched.amount && errors.amount}
                                        FormHelperTextProps={{ className: styles['form-helper-text'] }}
                                        InputProps={{
                                            style:
                                                touched.amount && Boolean(errors.amount)
                                                    ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                                    : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                                        }}
                                    />
                                }
                            />

                            <Typography className={styles['form-help-caption']} variant="caption">
                                An external link can be provided so users can learn more about the NFT.
                            </Typography>
                            <TextField
                                disabled={isSubmitting}
                                fullWidth
                                placeholder="external url"
                                {...getFieldProps('external_url')}
                                error={touched.external_url && Boolean(errors.external_url)}
                                helperText={touched.external_url && errors.external_url}
                                FormHelperTextProps={{ className: styles['form-helper-text'] }}
                                InputProps={{
                                    style:
                                        touched.external_url && Boolean(errors.external_url)
                                            ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                            : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                                }}
                            />
                            <FormFieldWrapper
                                help="Enter a description about your NFT"
                                children={
                                    <TextField
                                        disabled={isSubmitting}
                                        fullWidth
                                        placeholder="description"
                                        {...getFieldProps('description')}
                                        error={touched.description && Boolean(errors.description)}
                                        helperText={
                                            values.description.length === 255
                                                ? values.description.length + '/255'
                                                : null
                                        }
                                        FormHelperTextProps={{
                                            style: { display: 'flex', justifyContent: 'flex-end' },
                                        }}
                                        InputProps={{
                                            style:
                                                touched.description && Boolean(errors.description)
                                                    ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                                    : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                                        }}
                                        rows={4}
                                        multiline
                                        inputProps={{ maxLength: 255 }}
                                    >
                                        <Box
                                            component="div"
                                            sx={{ position: 'absolute', right: '0', bottom: '0', color: '#fff' }}
                                        >{`'${values.description.length} / 255'`}</Box>
                                    </TextField>
                                }
                            />

                            <FormFieldWrapper
                                help="Enter a creator's address or name"
                                children={
                                    <TextField
                                        disabled={isSubmitting}
                                        fullWidth
                                        {...getFieldProps('owner')}
                                        placeholder="creator id/name"
                                        error={touched.owner && Boolean(errors.owner)}
                                        helperText={touched.owner && errors.owner}
                                        FormHelperTextProps={{ className: styles['form-helper-text'] }}
                                        InputProps={{
                                            style:
                                                touched.owner && Boolean(errors.owner)
                                                    ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                                    : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                                        }}
                                    />
                                }
                            />

                            <FormFieldWrapper
                                help="Validate your token by hosting a public .txt file containing the tokenid on your own server or website. Create the link to the .txt file in advance and add the tokenid after creating the token."
                                children={
                                    <TextField
                                        disabled={isSubmitting}
                                        fullWidth
                                        placeholder="web validation url"
                                        {...getFieldProps('webvalidate')}
                                        error={touched.webvalidate && Boolean(errors.webvalidate)}
                                        helperText={touched.webvalidate && errors.webvalidate}
                                        FormHelperTextProps={{ className: styles['form-helper-text'] }}
                                        InputProps={{
                                            style:
                                                touched.webvalidate && Boolean(errors.webvalidate)
                                                    ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                                    : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                                        }}
                                    />
                                }
                            />
                            {/* Choose a burn amount */}
                            <FormFieldWrapper
                                help="Prioritize your transaction by adding a burn. Burn amounts are denominated in Minima only."
                                children={
                                    <TextField
                                        disabled={isSubmitting}
                                        fullWidth
                                        placeholder="burn fee"
                                        {...getFieldProps('burn')}
                                        error={touched.burn && Boolean(errors.burn)}
                                        helperText={touched.burn && errors.burn}
                                        FormHelperTextProps={{
                                            className: styles['form-helper-text'],
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

                            <Button
                                disabled={!(isValid && dirty && !isSubmitting)}
                                onClick={() => {
                                    setReview(true);
                                    setStatus('ongoing');
                                }}
                                variant="contained"
                                fullWidth
                                disableElevation
                            >
                                Review
                            </Button>
                        </Stack>
                    </form>
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
                                <li className="flex gap-4 bg-core-grey-10 rounded-lg">
                                    {!!values.url.length && (
                                        <img
                                            alt="custom-token-image"
                                            src={values.url}
                                            className="w-[80px] h-[80px] rounded-l-lg"
                                        />
                                    )}
                                    {!values.url.length && (
                                        <svg
                                            className="w-[80px] h-[80px] rounded-l-lg bg-slate-200"
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24"
                                            viewBox="0 -960 960 960"
                                            width="24"
                                        >
                                            <path
                                                fill="white"
                                                d="M480-240q21 0 35.5-14.5T530-290q0-21-14.5-35.5T480-340q-21 0-35.5 14.5T430-290q0 21 14.5 35.5T480-240Zm-36-154h74q0-36 8-53t34-43q35-35 49.5-58.5T624-602q0-53-36-85.5T491-720q-55 0-93.5 27T344-618l66 26q7-27 28-43.5t49-16.5q27 0 45 14.5t18 38.5q0 17-11 36t-37 42q-33 29-45.5 55.5T444-394ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"
                                            />
                                        </svg>
                                    )}
                                    <div className="my-auto flex justify-center flex-col">
                                        <h6 className="truncate font-bold text-base">{values.name}</h6>
                                        <p className="truncate  text-base"> {values.amount}</p>
                                    </div>
                                </li>

                                {values.description.length > 0 && (
                                    <li>
                                        <h6>Description</h6>
                                        <p>{values.description}</p>
                                    </li>
                                )}
                                {values.owner.length > 0 && (
                                    <li>
                                        <h6>Owner</h6>
                                        <p>{values.owner}</p>
                                    </li>
                                )}

                                {values.webvalidate.length > 0 && (
                                    <li>
                                        <h6>Web Validation URL</h6>
                                        <p>{values.webvalidate}</p>
                                    </li>
                                )}
                                {values.external_url.length > 0 && (
                                    <li>
                                        <h6>External URL</h6>
                                        <p>{values.external_url}</p>
                                    </li>
                                )}
                                {values.burn.length > 0 && (
                                    <li>
                                        <h6>Burn Fee</h6>
                                        <p>{values.burn + ' Minima'}</p>
                                    </li>
                                )}
                            </ul>
                        }
                        transactionCreationStatus={status}
                        hideReview={() => setReview(false)}
                        submitForm={() => submitForm()}
                    />
                </>
            )}
        </Formik>
    );
};

export default CreateNFTForm;

const useMySchema = () => {
    const wallet = useAppSelector(selectBalance);
    return Yup.object().shape({
        funds: Yup.object().test('check-my-funds', 'Insufficient funds.', function (val: any) {
            const { createError, parent } = this;

            if (val === undefined || parent.amount === undefined) {
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
            .required('This field is required.')
            .matches(/^[^\\;]+$/, 'Invalid characters.'),
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
        amount: Yup.string()
            .required('This field is required')
            .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.')
            .test('check-my-amount', 'Invalid amount, NFTs cannot be divisible', function (val) {
                const { path, createError } = this;
                if (val === undefined) {
                    return false;
                }
                if (new Decimal(val).greaterThan(new Decimal(1000000000000))) {
                    return createError({
                        path,
                        message: `Invalid amount, cannot create more than 1 trillion of an NFT`,
                    });
                }
                if (new Decimal(val).lessThan(new Decimal(1))) {
                    return createError({
                        path,
                        message: `Invalid amount, must be 1 or greater`,
                    });
                }
                if (new Decimal(val).mod(1).greaterThan(0)) {
                    return createError({
                        path,
                        message: `Invalid amount, NFTs cannot have decimals`,
                    });
                }
                return true;
            }),
        description: Yup.string()
            .min(0)
            .max(255, 'Maximum 255 characters allowed.')
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
        ticker: Yup.string()
            .min(0)
            .max(5, 'Maximum 5 characters allowed.')
            .matches(/^[^\\;]+$/, 'Invalid characters.'),
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
        external_url: Yup.string().test('check-my-external-url', 'Invalid Url.', function (val) {
            const { path, createError, parent } = this;

            if (val === undefined) {
                return true;
            }

            if (!isValidURLAll(parent.external_url)) {
                return createError({
                    path,
                    message: `Invalid URL`,
                });
            }
            return true;
        }),
    });
};
