import React from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import styles from '../../../theme/cssmodule/Components.module.css';

import { buildCustomTokenCreation } from '../../../minima/libs/nft';
import { insufficientFundsError, isValidUrl, strToHex } from '../../../shared/functions';
import { useAppDispatch } from '../../../minima/redux/hooks';
import { toggleNotification } from '../../../minima/redux/slices/notificationSlice';
import ModalManager from '../managers/ModalManager';
import NFTConfirmation from '../forms/common/NFTConfirmation';
import MiniModal from '../../../shared/components/MiniModal';
import Pending from '../forms/Pending';
import FormImageUrlSelect from '../../../shared/components/forms/FormImageUrlSelect';
import { MiNFT } from '../../../minima/types/nft';

const validation = Yup.object().shape({
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

            if (!isValidUrl(parent.url)) {
                return createError({
                    path,
                    message: `Invalid URL`,
                });
            }
            return true;
        }),
    amount: Yup.string()
        .required('This field is required')
        .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.'),
    description: Yup.string()
        .min(0)
        .max(255, 'Maximum 255 characters allowed.')
        .matches(/^[^\\;]+$/, 'Invalid characters.'),
    burn: Yup.string().matches(/^[^a-zA-Z\\;"]+$/, 'Invalid characters.'),
    ticker: Yup.string()
        .min(0)
        .max(5, 'Maximum 5 characters allowed.')
        .matches(/^[^\\;]+$/, 'Invalid characters.'),
});

const CreateNFTForm = () => {
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

    const formik = useFormik({
        initialValues: {
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
                amount: data.amount,
                url: data.url,
                description: data.description.replaceAll(`"`, `'`),
                burn: data.burn,
                webvalidate: data.webvalidate.replaceAll(`"`, `'`),
                owner: data.owner.replaceAll(`"`, `'`),
                external_url: data.external_url.replaceAll(`"`, `'`),
                type: 'NFT',
            };

            buildCustomTokenCreation(cNFT)
                .then((result: any) => {
                    //console.log(`createNFTForm`, result);
                    if (!result.status && !result.pending) {
                        throw new Error(result.error ? result.error : result.message);
                    }

                    // Non-write minidapp
                    if (!result.status && result.pending) {
                        setModalStatus('Pending');
                        setOpen(true);
                    }
                    // write Minidapp
                    if (result.status && !result.pending) {
                        setModalStatus('Success');
                        setOpen(true);
                    }
                    // SENT
                    formik.resetForm();
                })
                .catch((err) => {
                    console.error('buildUserNFT', err);
                    formik.setSubmitting(false);
                    dispatch(toggleNotification(`${err}`, 'error', 'error'));

                    if (insufficientFundsError(err.message)) {
                        formik.setFieldError('amount', err.message);
                        dispatch(toggleNotification(`${err.message}`, 'error', 'error'));
                    }

                    if (err.message) {
                        dispatch(toggleNotification(`${err.message}`, 'error', 'error'));
                    }
                });
        },
        validationSchema: validation,
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack spacing={2}>
                <Typography variant="caption">
                    <Required /> required fields
                </Typography>
                <Typography variant="h6" className={styles['form-image-title']}>
                    Image <Required />
                </Typography>
                <FormImageUrlSelect formik={formik} />
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
                        formik.values.description.length === 255 ? formik.values.description.length + '/255' : null
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
                <Typography className={styles['form-help-caption']} variant="caption">
                    A creator address or name can be added as an identity.
                </Typography>
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
                <Typography variant="caption" className={styles['form-help-caption']}>
                    Add a text file to your website (https) which holds a copy of the tokenid (obtained after creation)
                    and it can be used as validation.
                </Typography>
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
            {/* closeFn, modal, title, children, formik  */}
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

const Required = () => {
    return <span className={styles['required']}>*</span>;
};

export default CreateNFTForm;
