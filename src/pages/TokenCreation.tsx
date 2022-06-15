import { FC, useState, useEffect } from 'react';
import { Card, CardContent, TextField, Button, Portal, Snackbar, Alert, InputAdornment } from '@mui/material';
import MiniModal from '../shared/components/MiniModal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { callStatus, callToken } from '../minima/rpc-commands';
import { INSUFFICIENT } from '../minima/constants';
import { useNavigate } from 'react-router-dom';
import { insufficientFundsError, strToHex } from '../shared/functions';

import GridLayout from './components/GridLayout';
import TokenConfirmationModal from './components/forms/TokenConfirmationModal';

const CreateTokenSchema = Yup.object().shape({
    name: Yup.string()
        .required('Field Required')
        .matches(/^[^\\;'"]+$/, 'Invalid characters.'),
    amount: Yup.string()
        .required('Field Required')
        .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.'),
    description: Yup.string().min(0).max(255, 'Maximum 255 characters allowed.'),
    // .matches(/^[^\\;'"]+$/, 'Invalid characters.'),
    url: Yup.string(),
    // .matches(/^[^\\;'"]+$/, 'Invalid characters.'),
    burn: Yup.string().matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.'),
});

const TokenCreation: FC = () => {
    // Handle Confirmation Modal
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const handleCloseConfirmationModal = () => setOpenConfirmationModal(false);

    // Handle Modal
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalStatus, setModalStatus] = useState('Failed');
    const [errMessage, setErrMessage] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setModalStatus('Failed');
    };
    const navigate = useNavigate();

    useEffect(() => {
        callStatus()
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
                navigate('/offline');
            });
    }, []);

    // Formik
    const formik = useFormik({
        initialValues: {
            name: '',
            amount: 0,
            url: '',
            description: '',
            burn: '',
        },
        validationSchema: CreateTokenSchema,
        onSubmit: (formData) => {
            const customToken = {
                name: {
                    name: formData.name,
                    description: strToHex(formData.description),
                    url: strToHex(formData.url),
                },
                amount: formData.amount,
                burn: formData.burn && formData.burn.length ? formData.burn : 0,
            };
            callToken(customToken)
                .then((res: any) => {
                    if (!res.status) {
                        throw new Error(res.error ? res.error : res.message); // TODO.. consistent key value
                    }
                    // SENT
                    formik.resetForm();
                    // Set Modal
                    setModalStatus('Success');
                    // Close Modals
                    setOpenConfirmationModal(false);
                    // Open Modal
                    setOpen(true);
                })
                .catch((err: any) => {
                    if (err === undefined || err.message === undefined) {
                        setErrMessage('Something went wrong!  Open a Discord Support ticket for assistance.');
                    }

                    if (insufficientFundsError(err.message)) {
                        formik.setFieldError('amount', err.message);
                    }

                    if (err.message !== undefined) {
                        console.error(err.message);
                        setErrMessage(err.message);
                    }

                    setOpenConfirmationModal(false);
                })
                .finally(() => {
                    // NO MATTER WHAT
                    formik.setSubmitting(false);
                    setTimeout(() => setErrMessage(''), 2500);
                });
        },
    });

    return (
        <GridLayout
            loading={loading}
            children={
                <>
                    <Portal>
                        <Snackbar
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            autoHideDuration={3000}
                            onDurationChange={() => {
                                console.log('Closing...');
                            }}
                            open={errMessage.length ? true : false}
                        >
                            <Alert
                                severity="error"
                                sx={{ backgroundColor: 'rgb(211, 47, 47)', width: '100%', color: '#fff' }}
                            >
                                {errMessage}
                            </Alert>
                        </Snackbar>
                    </Portal>
                    <Card variant="outlined">
                        <CardContent>
                            <form onSubmit={formik.handleSubmit}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    name="name"
                                    placeholder="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                    sx={{ mb: 2 }}
                                    FormHelperTextProps={{
                                        style: styles.helperText,
                                    }}
                                    InputProps={{
                                        style:
                                            formik.touched.name && Boolean(formik.errors.name)
                                                ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                                : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                                    }}
                                ></TextField>
                                <TextField
                                    fullWidth
                                    id="amount"
                                    name="amount"
                                    placeholder="0.0"
                                    value={formik.values.amount}
                                    onChange={formik.handleChange}
                                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                                    helperText={formik.touched.amount && formik.errors.amount}
                                    sx={{ mb: 2 }}
                                    FormHelperTextProps={{
                                        style: styles.helperText,
                                    }}
                                    InputProps={{
                                        style:
                                            formik.touched.amount && Boolean(formik.errors.amount)
                                                ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                                : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                                    }}
                                ></TextField>
                                <TextField
                                    fullWidth
                                    id="url"
                                    name="url"
                                    placeholder="url"
                                    value={formik.values.url}
                                    onChange={formik.handleChange}
                                    error={formik.touched.url && Boolean(formik.errors.url)}
                                    helperText={formik.touched.url && formik.errors.url}
                                    sx={{ mb: 2 }}
                                ></TextField>
                                <TextField
                                    fullWidth
                                    id="description"
                                    name="description"
                                    placeholder="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                    multiline
                                    rows={4}
                                    sx={{ mb: 2 }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                {formik.values.description.length + '/255'}
                                            </InputAdornment>
                                        ),
                                    }}
                                ></TextField>
                                <Button
                                    disabled={!(formik.isValid && formik.dirty)}
                                    disableElevation
                                    color="primary"
                                    variant="contained"
                                    fullWidth
                                    onClick={() => setOpenConfirmationModal(true)}
                                >
                                    Next
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <TokenConfirmationModal
                        handleClose={handleCloseConfirmationModal}
                        open={openConfirmationModal}
                        formik={formik}
                    />

                    <MiniModal
                        open={open}
                        handleClose={handleClose}
                        handleOpen={handleOpen}
                        header={modalStatus === 'Success' ? 'Success!' : 'Failed!'}
                        status="Transaction Status"
                        subtitle={modalStatus === 'Success' ? 'Token created' : 'Please try again later.'}
                    />
                </>
            }
        />
    );
};

export default TokenCreation;

const styles = {
    helperText: {
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        color: '#D63110',
        fontWeight: '700',
        paddingLeft: 8,
    },
};
