import React, { useState } from 'react';
import { Avatar, Box, Button, Dialog, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
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
    const [dialog, setDialog] = useState(false);

    const formik = useFormik({
        initialValues: {
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
        },
        onSubmit: async (data: any) => {
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
                setDialog(false);
                formik.setStatus(`Your NFT has been created.  It will arrive shortly.`);
            } catch (error: any) {
                setDialog(false);
                const isPending = error.message === 'pending';
                if (isPending) {
                    formik.setStatus('Transaction is pending, you can confirm it in your pending actions.');
                    return;
                }
                formik.setStatus('Failed, ' + error.message);
            }
        },
        validationSchema: mySchema,
    });

    React.useEffect(() => {
        formik.setFieldValue('funds', wallet[0]);
    }, [wallet]);

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack spacing={2}>
                <FormFieldWrapper
                    help="Your current Minima balance:"
                    children={<MiFunds formik={formik} funds={formik.values.funds} />}
                />
                {/* Required field helper */}
                <Required />

                <Typography variant="h6" className={styles['form-image-title']}>
                    Image
                </Typography>
                <FormFieldWrapper
                    required={false}
                    help="Use a public image URL ending in .png .jpg or .jpeg or upload your own content"
                    children={<FormImageUrlSelect formik={formik} />}
                />

                <FormFieldWrapper
                    required={true}
                    help="Enter a name for your custom NFT"
                    children={
                        <TextField
                            disabled={formik.isSubmitting}
                            fullWidth
                            id="name"
                            name="name"
                            placeholder="name *"
                            value={formik.values.name}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            FormHelperTextProps={{ className: styles['form-helper-text'] }}
                            InputProps={{
                                style:
                                    formik.touched.name && Boolean(formik.errors.name)
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
                            disabled={formik.isSubmitting}
                            fullWidth
                            id="amount"
                            name="amount"
                            placeholder="amount *"
                            onBlur={formik.handleBlur}
                            value={formik.values.amount}
                            onChange={formik.handleChange}
                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                            helperText={formik.touched.amount && formik.errors.amount}
                            FormHelperTextProps={{ className: styles['form-helper-text'] }}
                            InputProps={{
                                style:
                                    formik.touched.amount && Boolean(formik.errors.amount)
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
                    disabled={formik.isSubmitting}
                    fullWidth
                    id="external_url"
                    name="external_url"
                    placeholder="external url"
                    onBlur={formik.handleBlur}
                    value={formik.values.external_url}
                    onChange={formik.handleChange}
                    error={formik.touched.external_url && Boolean(formik.errors.external_url)}
                    helperText={formik.touched.external_url && formik.errors.external_url}
                    FormHelperTextProps={{ className: styles['form-helper-text'] }}
                    InputProps={{
                        style:
                            formik.touched.external_url && Boolean(formik.errors.external_url)
                                ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                    }}
                />
                <FormFieldWrapper
                    help="Enter a description about your NFT"
                    children={
                        <TextField
                            disabled={formik.isSubmitting}
                            fullWidth
                            id="description"
                            name="description"
                            placeholder="description"
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={
                                formik.values.description.length === 255
                                    ? formik.values.description.length + '/255'
                                    : null
                            }
                            FormHelperTextProps={{
                                style: { display: 'flex', justifyContent: 'flex-end' },
                            }}
                            InputProps={{
                                style:
                                    formik.touched.description && Boolean(formik.errors.description)
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
                            >{`'${formik.values.description.length} / 255'`}</Box>
                        </TextField>
                    }
                />

                <FormFieldWrapper
                    help="Enter a creator's address or name"
                    children={
                        <TextField
                            disabled={formik.isSubmitting}
                            fullWidth
                            id="owner"
                            name="owner"
                            placeholder="creator id/name"
                            value={formik.values.owner}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            error={formik.touched.owner && Boolean(formik.errors.owner)}
                            helperText={formik.touched.owner && formik.errors.owner}
                            FormHelperTextProps={{ className: styles['form-helper-text'] }}
                            InputProps={{
                                style:
                                    formik.touched.owner && Boolean(formik.errors.owner)
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
                            disabled={formik.isSubmitting}
                            fullWidth
                            id="webvalidate"
                            name="webvalidate"
                            placeholder="web validation url"
                            value={formik.values.webvalidate}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            error={formik.touched.webvalidate && Boolean(formik.errors.webvalidate)}
                            helperText={formik.touched.webvalidate && formik.errors.webvalidate}
                            FormHelperTextProps={{ className: styles['form-helper-text'] }}
                            InputProps={{
                                style:
                                    formik.touched.webvalidate && Boolean(formik.errors.webvalidate)
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
                    disabled={formik.isSubmitting || !formik.isValid}
                    onClick={() => setDialog(true)}
                    variant="contained"
                    fullWidth
                    disableElevation
                >
                    Review
                </Button>
            </Stack>

            <Dialog open={dialog && !formik.status}>
                <Stack className={styles['modal__wrapper']}>
                    <h6>Confirm NFT Creation?</h6>
                    <Stack
                        className={styles['modal__content']}
                        flexDirection="column"
                        justifyContent="space-between"
                        alignItems="space-between"
                        gap={8}
                    >
                        <ul>
                            <li>
                                <div className={styles['token__wrapper']}>
                                    <Avatar variant="rounded">
                                        {formik.values.url && <img alt="custom-token-image" src={formik.values.url} />}
                                        {!formik.values.url && (
                                            <img
                                                alt="custom-token-image"
                                                src="https://robohash.org/0x00?gravatar=hashed"
                                            />
                                        )}
                                    </Avatar>
                                    <div>
                                        <h6>{formik.values.name}</h6>
                                        <p>{formik.values.amount}</p>
                                    </div>
                                </div>
                            </li>

                            {formik.values.description.length > 0 && (
                                <li>
                                    <h6>Description</h6>
                                    <p>{formik.values.description}</p>
                                </li>
                            )}
                            {formik.values.owner.length > 0 && (
                                <li>
                                    <h6>Owner</h6>
                                    <p>{formik.values.owner}</p>
                                </li>
                            )}

                            {formik.values.webvalidate.length > 0 && (
                                <li>
                                    <h6>Web Validation URL</h6>
                                    <p>{formik.values.webvalidate}</p>
                                </li>
                            )}
                            {formik.values.external_url.length > 0 && (
                                <li>
                                    <h6>External URL</h6>
                                    <p>{formik.values.external_url}</p>
                                </li>
                            )}
                            {formik.values.burn.length > 0 && (
                                <li>
                                    <h6>Burn Fee</h6>
                                    <p>{formik.values.burn + ' Minima'}</p>
                                </li>
                            )}
                        </ul>
                        <Stack
                            className={styles['modal__btn_wrapper']}
                            flexDirection="row"
                            alignItems="flex-end"
                            gap={1}
                            justifyContent="flex-end"
                        >
                            <button disabled={formik.isSubmitting} type="button" onClick={() => setDialog(false)}>
                                Cancel
                            </button>
                            <button disabled={formik.isSubmitting} type="submit" onClick={() => formik.handleSubmit()}>
                                Confirm
                            </button>
                        </Stack>
                    </Stack>
                </Stack>
            </Dialog>
            <Dialog open={formik.status}>
                <Stack className={styles['modal__wrapper']}>
                    <h6>Transaction Status</h6>
                    <Stack
                        className={styles['modal__content']}
                        flexDirection="column"
                        justifyContent="space-between"
                        alignItems="space-between"
                    >
                        <p>{formik.status}</p>

                        <Stack
                            className={styles['modal__btn_wrapper']}
                            flexDirection="row"
                            alignItems="flex-end"
                            gap={1}
                            justifyContent="flex-end"
                        >
                            <button disabled={formik.isSubmitting} type="button" onClick={() => formik.resetForm()}>
                                Dismiss
                            </button>
                        </Stack>
                    </Stack>
                </Stack>
            </Dialog>
        </form>
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
