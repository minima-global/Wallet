import { FC, useState } from 'react';
import { Grid, Card, CardContent, TextField, Button } from '@mui/material';
import MiniModal from '../shared/components/MiniModal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { callToken } from '../minima/rpc-commands';
import { INSUFFICIENT } from '../minima/constants';
import { RpcResponse } from '../types/minima';

const CreateTokenSchema = Yup.object().shape({
    name: Yup.string().required('Field Required'),
    amount: Yup.string().required('Field Required'),
    description: Yup.string().min(0).max(255, 'Maximum 255 characters allowed.'),
    url: Yup.string(),
});

const TokenCreation: FC = () => {
    // Handle Modal
    const [open, setOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState('Failed');
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setModalStatus('Failed');
    };
    // Formik
    const formik = useFormik({
        initialValues: {
            name: '',
            amount: '',
            url: '',
            description: '',
        },
        validationSchema: CreateTokenSchema,
        onSubmit: (data) => {
            const customToken = {
                name: {
                    name: data.name,
                    description: data.description,
                    url: data.url,
                },
                amount: data.amount,
            };
            callToken(customToken)
                .then((res: any) => {
                    // console.log(res);
                    // SENT
                    formik.resetForm();
                    // Set Modal
                    setModalStatus('Success');
                    // Open Modal
                    setOpen(true);
                })
                .catch((err: any) => {
                    console.log(err);
                    // console.error(err.message);
                    // FAILED
                    if (err.message !== undefined && err.message.substring(0, 20) === INSUFFICIENT) {
                        formik.setFieldError('amount', err.message);
                    } else {
                        console.error(`Err is undefined or not a string..`);
                    }
                })
                .finally(() => {
                    // NO MATTER WHAT
                    formik.setSubmitting(false);
                });
        },
    });

    return (
        <Grid container mt={2} spacing={0}>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8}>
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
                            ></TextField>
                            <Button
                                disabled={formik.isSubmitting && !formik.isValid}
                                disableElevation
                                color="primary"
                                variant="contained"
                                fullWidth
                                type="submit"
                            >
                                {formik.isSubmitting ? 'Minting...' : 'Mint'}
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
                    subtitle={
                        modalStatus === 'Success' ? 'Your token will be minted shortly' : 'Please try again later.'
                    }
                />
            </Grid>
            <Grid item xs={0} md={2}></Grid>
        </Grid>
    );
};

export default TokenCreation;

const styles = {
    helperText: {
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        color: '#363A3F',
        fontWeight: '400',
        paddingLeft: 8,
    },
};
