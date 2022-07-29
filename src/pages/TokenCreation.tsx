import { FC, useState, useEffect } from 'react';
import { Card, CardContent, TextField, Button, Skeleton, Stack, Typography } from '@mui/material';
import MiniModal from '../shared/components/MiniModal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { callStatus, callToken } from '../minima/rpc-commands';
import { insufficientFundsError } from '../shared/functions';

import GridLayout from './components/GridLayout';

import { useAppDispatch, useAppSelector } from '../minima/redux/hooks';
import { toggleNotification } from '../minima/redux/slices/notificationSlice';
import { selectBalance } from '../minima/redux/slices/balanceSlice';
import TokenConfirmation from './components/forms/common/TokenConfirmation';
import ModalManager from './components/managers/ModalManager';

import styles from '../theme/cssmodule/Components.module.css';
import Pending from './components/forms/Pending';

const CreateTokenSchema = Yup.object().shape({
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
    url: Yup.string(),
    webvalidate: Yup.string(),
});

const TokenCreation: FC = () => {
    const dispatch = useAppDispatch();
    const [modalEmployee, setModalEmployee] = useState('');
    const handleCloseModalEmployee = () => {
        setModalEmployee('');
    };
    const handleProceed = () => {
        setModalEmployee('confirmation');
    };

    // Handle Modal
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalStatus, setModalStatus] = useState('Failed');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setModalStatus('Failed');
    };
    const balances = useAppSelector(selectBalance);

    useEffect(() => {
        callStatus()
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Formik
    const formik = useFormik({
        initialValues: {
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
            // console.log(`CreateToken formData`, formData);
            const customToken = {
                name: {
                    name: formData.name.replaceAll(`"`, `'`),
                    description: formData.description.replaceAll(`"`, `'`),
                    url: formData.url,
                    webvalidate: formData.webvalidate,
                    ticker: formData.ticker.replaceAll(`"`, `'`),
                },
                amount: formData.amount && formData.amount.length ? formData.amount : 0,
                burn: formData.burn && formData.burn.length ? formData.burn : 0,
            };
            callToken(customToken)
                .then((res: any) => {
                    //console.log(res);
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
                .catch((err: any) => {
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
                        dispatch(toggleNotification(err.message, 'error', 'error'));
                    }

                    if (typeof err.message !== 'undefined') {
                        console.error(err.message);
                        dispatch(toggleNotification(err.message, 'error', 'error'));
                    }

                    // setOpenConfirmationModal(false);
                })
                .finally(() => {
                    // NO MATTER WHAT
                    formik.setSubmitting(false);
                });
        },
    });

    return (
        <GridLayout
            // loading={loading}
            children={
                <>
                    <Card variant="outlined">
                        <CardContent>
                            <form onSubmit={formik.handleSubmit}>
                                {balances.length === 0 ? (
                                    <Stack spacing={2}>
                                        <Skeleton
                                            sx={{ borderRadius: '8px' }}
                                            variant="rectangular"
                                            width="100%"
                                            height={60}
                                        />
                                        <Skeleton
                                            sx={{ borderRadius: '8px' }}
                                            variant="rectangular"
                                            width="100%"
                                            height={60}
                                        />
                                        <Skeleton
                                            sx={{ borderRadius: '8px' }}
                                            variant="rectangular"
                                            width="100%"
                                            height={60}
                                        />
                                        <Skeleton
                                            sx={{ borderRadius: '8px' }}
                                            variant="rectangular"
                                            width="100%"
                                            height={170}
                                        />
                                    </Stack>
                                ) : (
                                    <Stack spacing={2}>
                                        <TextField
                                            disabled={formik.isSubmitting}
                                            fullWidth
                                            id="name"
                                            name="name"
                                            placeholder="name"
                                            value={formik.values.name}
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
                                        ></TextField>
                                        <TextField
                                            disabled={formik.isSubmitting}
                                            fullWidth
                                            id="amount"
                                            name="amount"
                                            placeholder="0.0"
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
                                        ></TextField>
                                        <TextField
                                            disabled={formik.isSubmitting}
                                            fullWidth
                                            id="url"
                                            name="url"
                                            placeholder="url"
                                            value={formik.values.url}
                                            onChange={formik.handleChange}
                                            error={formik.touched.url && Boolean(formik.errors.url)}
                                            helperText={formik.touched.url && formik.errors.url}
                                        ></TextField>
                                        <TextField
                                            disabled={formik.isSubmitting}
                                            fullWidth
                                            id="description"
                                            name="description"
                                            placeholder="description"
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
                                            multiline
                                            rows={4}
                                            inputProps={{ maxLength: 255 }}
                                        ></TextField>
                                        <TextField
                                            disabled={formik.isSubmitting}
                                            fullWidth
                                            id="ticker"
                                            name="ticker"
                                            placeholder="ticker"
                                            value={formik.values.ticker}
                                            onChange={formik.handleChange}
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
                                        ></TextField>
                                        <Typography variant="caption" className={styles['form-help-caption']}>
                                            Add a text file to your website (https) which holds a copy of the tokenid
                                            (obtained after creation) and it can be used as validation.
                                        </Typography>
                                        <TextField
                                            disabled={formik.isSubmitting}
                                            fullWidth
                                            id="webvalidate"
                                            name="webvalidate"
                                            placeholder="web validate url"
                                            value={formik.values.webvalidate}
                                            onChange={formik.handleChange}
                                            error={formik.touched.webvalidate && Boolean(formik.errors.webvalidate)}
                                            helperText={formik.touched.webvalidate && formik.errors.webvalidate}
                                        ></TextField>
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
                                )}
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
