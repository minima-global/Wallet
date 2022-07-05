import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Portal,
    Snackbar,
    Alert,
    InputAdornment,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { insufficientFundsError, strToHex } from '../../../shared/functions';
import { callCreateNFT } from '../../../minima/rpc-commands';

import PreviewNFTModal from '../../../shared/components/PreviewNFTModal';
import MiniModal from '../../../shared/components/MiniModal';

const CreateTokenSchema = Yup.object().shape({
    name: Yup.string()
        .required('Field Required')
        .matches(/^[^\\;'"]+$/, 'Invalid characters.'),
    description: Yup.string().min(0).max(255, 'Maximum 255 characters allowed.'),
    // .matches(/^[^\\;'"]+$/, 'Invalid characters.'),
    url: Yup.string()
        // .matches(/^[^\\;'"]+$/, 'Invalid characters.')
        .required('Field Required'),
});

const CreateNFT = () => {
    const [openPreviewModal, setOpenPreviewModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState('Failed');
    const [errMessage, setErrMessage] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setModalStatus('Failed');
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            url: '',
            description: '',
            amount: '',
        },
        validationSchema: CreateTokenSchema,
        onSubmit: (data) => {
            console.log(`Minting NFT ${data.name}`);
            const customNFT = {
                name: data.name,
                url: strToHex(data.url),
                description: strToHex(data.description),
            };
            callCreateNFT(customNFT)
                .then((res: any) => {
                    if (!res.status) {
                        throw new Error(res.error ? res.error : res.message); // TODO.. consistent key value
                    }
                    formik.resetForm();
                    // Set Modal
                    setModalStatus('Success');
                    // Open Modal
                    setOpen(true);
                })
                .catch((err) => {
                    console.log(err);

                    if (err === undefined || err.message === undefined) {
                        setErrMessage('Something went wrong!  Open a Discord Support ticket for assistance.');
                        // alert('Something went wrong, error message undefined.  Open a support ticket!');
                    }

                    if (insufficientFundsError(err.message)) {
                        formik.setFieldError('amount', err.message);
                        console.error(err.message);
                        setErrMessage(err.message);
                    }
                })
                .finally(() => {
                    // NO MATTER WHAT
                    formik.setSubmitting(false);
                    setTimeout(() => setErrMessage(''), 2500);
                });
        },
    });

    return (
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
                    <Alert severity="error" sx={{ backgroundColor: 'rgb(211, 47, 47)', width: '100%', color: '#fff' }}>
                        {errMessage}
                    </Alert>
                </Snackbar>
            </Portal>

            <Card variant="outlined">
                <CardContent>
                    <Box>
                        <Typography variant="h6" pb={2}>
                            Mint New
                        </Typography>
                    </Box>
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
                            id="url"
                            name="url"
                            placeholder="url"
                            value={formik.values.url}
                            onChange={formik.handleChange}
                            error={formik.touched.url && Boolean(formik.errors.url)}
                            helperText={formik.touched.url && formik.errors.url}
                            sx={{ mb: 2 }}
                            InputProps={{
                                style:
                                    formik.touched.url && Boolean(formik.errors.url)
                                        ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                        : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                            }}
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
                            sx={{ marginBottom: 2 }}
                        >
                            {formik.isSubmitting ? 'Minting...' : 'Mint'}
                        </Button>
                        <Button
                            disabled={!formik.dirty || !formik.isValid}
                            disableElevation
                            color="primary"
                            variant="outlined"
                            fullWidth
                            onClick={() => setOpenPreviewModal(true)}
                        >
                            Preview
                        </Button>
                        <MiniModal
                            open={open}
                            handleClose={handleClose}
                            handleOpen={handleOpen}
                            header={modalStatus === 'Success' ? 'Success!' : 'Failed!'}
                            status="Transaction Status"
                            subtitle={modalStatus === 'Success' ? 'NFT minted.' : 'Please try again later.'}
                        />
                        <PreviewNFTModal
                            open={openPreviewModal}
                            handleClose={() => setOpenPreviewModal(false)}
                            name={formik.values.name}
                            url={formik.values.url}
                            description={formik.values.description}
                        />
                    </form>
                </CardContent>
            </Card>
        </>
    );
};

export default CreateNFT;

const styles = {
    helperText: {
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        color: '#D63110',
        fontWeight: '700',
        paddingLeft: 8,
    },
};
