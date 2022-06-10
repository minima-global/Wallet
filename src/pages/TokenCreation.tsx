import { FC, useState, useEffect } from 'react';
import { Card, CardContent, TextField, Button, Portal, Snackbar, Alert, InputAdornment } from '@mui/material';
import MiniModal from '../shared/components/MiniModal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { callStatus, callToken } from '../minima/rpc-commands';
import { INSUFFICIENT } from '../minima/constants';
import { useNavigate } from 'react-router-dom';
import { strToHex } from '../shared/functions';

import GridLayout from './components/GridLayout';

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
});

const TokenCreation: FC = () => {
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
                    // Open Modal
                    setOpen(true);
                })
                .catch((err: any) => {
                    console.log(err);

                    if (err === undefined || err.message === undefined) {
                        setErrMessage('Something went wrong!  Open a Discord Support ticket for assistance.');
                        // alert('Something went wrong, error message undefined.  Open a support ticket!');
                    }

                    if (err.message !== undefined && err.message.substring(0, 20) === INSUFFICIENT) {
                        formik.setFieldError('amount', err.message);
                    } else {
                        setErrMessage(err.message);
                    }
                })
                .finally(() => {
                    // NO MATTER WHAT
                    setTimeout(() => formik.setSubmitting(false), 2500);
                    // formik.setSubmitting(false);
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
                                    disabled={formik.isSubmitting && !formik.isValid}
                                    disableElevation
                                    color="primary"
                                    variant="contained"
                                    fullWidth
                                    type="submit"
                                >
                                    {formik.isSubmitting ? 'Creating...' : 'Create Token'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
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
