import React from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import styles from '../../../theme/cssmodule/Components.module.css';

import { buildCustomTokenCreation } from '../../../minima/libs/nft';
import { isValidURLAll, isValidURLSecureOnly } from '../../../shared/functions';
import { useAppDispatch, useAppSelector } from '../../../minima/redux/hooks';
import { toggleNotification } from '../../../minima/redux/slices/notificationSlice';
import ModalManager from '../managers/ModalManager';
import NFTConfirmation from '../forms/common/NFTConfirmation';
import MiniModal from '../../../shared/components/MiniModal';
import Pending from '../forms/Pending';
import FormImageUrlSelect from '../../../shared/components/forms/FormImageUrlSelect';
import { MiNFT } from '../../../minima/types/nft';
import Required, { MiRequiredAsterisk } from '../../../shared/components/forms/Required';
import FormFieldWrapper from '../../../shared/components/FormFieldWrapper';
import { selectBalance } from '../../../minima/redux/slices/balanceSlice';

import Decimal from 'decimal.js';
import MiFunds from '../forms/MiFunds';

/**
 * Minima scales up to 64 decimal places
 * tokens are scaled to 36 decimal places
 * 1 Minima === 1-e36
 */
Decimal.set({ precision: 64 });
Decimal.set({ toExpNeg: -36 });

const validation = Yup.object().shape({
    funds: Yup.object().test('check-my-funds', 'Insufficient funds.', function (val: any) {
        const { createError, parent } = this;

        if (val === undefined || parent.amount === undefined) {
            return false;
        }

        if (parent.amount !== undefined && new Decimal(parent.amount).greaterThan(new Decimal(val.sendable))) {
            return createError({
                path: 'amount',
                message: `Insufficient funds, you do not have enough Minima.`,
            });
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
    amount: Yup.string()
        .required('This field is required')
        .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.')
        .test('check-my-amount', 'Invalid amount, NFTs cannot be divisible', function (val) {
            const { path, createError, parent } = this;
            if (val == undefined) {
                return false;
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
    burn: Yup.string().matches(/^[^a-zA-Z\\;"]+$/, 'Invalid characters.'),
    ticker: Yup.string()
        .min(0)
        .max(5, 'Maximum 5 characters allowed.')
        .matches(/^[^\\;]+$/, 'Invalid characters.'),
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
    external_url: Yup.string().test('check-my-external-url', 'Invalid Url.', function (val) {
        const { path, createError, parent } = this;

        if (val == undefined) {
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

const CreateNFTForm = () => {
    const wallet = useAppSelector(selectBalance);
    // Handle Modal
    const [open, setOpen] = React.useState(false);
    const [modalStatus, setModalStatus] = React.useState('Failed');
    const dispatch = useAppDispatch();
    const [modalEmployee, setModalEmployee] = React.useState('');

    const handleTransactionStatusModalOpen = () => setOpen(true);
    const handleTransactionStatusModalClose = () => {
        setOpen(false);
        setModalStatus('Failed');
    };

    const handleClose = () => {
        setModalEmployee('');
    };
    const handleProceed = () => {
        setModalEmployee('confirmation');
    };

    React.useEffect(() => {
        formik.setFieldValue('funds', wallet[0]);
    }, [wallet]);

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
        onSubmit: (data: any) => {
            setModalEmployee('');

            const cNFT: MiNFT = {
                name: data.name.replaceAll(`"`, `'`),
                url: data.url,
                description: data.description.replaceAll(`"`, `'`) || '',
                webvalidate: data.webvalidate.replaceAll(`"`, `'`) || '',
                owner: data.owner.replaceAll(`"`, `'`) || '',
                external_url: data.external_url.replaceAll(`"`, `'`) || '',
                type: 'NFT',
            };

            buildCustomTokenCreation(cNFT, data.amount, data.burn)
                .then((r) => {
                    console.log(r);

                    formik.resetForm();
                })
                .catch((err) => {
                    console.error('buildUserNFT', err);
                    dispatch(toggleNotification(`${err}`, 'error', 'error'));
                });
        },
        validationSchema: validation,
    });

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
                    Image <MiRequiredAsterisk>*</MiRequiredAsterisk>
                </Typography>
                <FormFieldWrapper
                    required={true}
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
                    help="Enter the total supply to create, By default NFTs are 1 to 1 with a Minima token and must not be fractions of a number but whole"
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

                <Button
                    disabled={!formik.isValid}
                    onClick={() => setModalEmployee('burn')}
                    variant="contained"
                    fullWidth
                    disableElevation
                >
                    {formik.isSubmitting ? 'Please wait...' : 'Mint'}
                </Button>
            </Stack>
            <ModalManager
                proceedFn={handleProceed} // move onto confirmation
                children={<NFTConfirmation formik={formik}></NFTConfirmation>}
                modal={modalEmployee}
                title="Confirmation"
                formik={formik}
                closeFn={handleClose}
            />

            <MiniModal
                open={open}
                handleClose={handleTransactionStatusModalClose}
                handleOpen={handleTransactionStatusModalOpen}
                header={modalStatus === 'Success' ? 'Success!' : modalStatus === 'Pending' ? 'Pending' : 'Failed!'}
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
        </form>
    );
};

export default CreateNFTForm;
