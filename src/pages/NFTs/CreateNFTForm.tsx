import React from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import styles from '../../theme/cssmodule/Components.module.css';

import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import Burn from '../components/forms/Burn';
import { buildUserNFT } from '../../minima/libs/nft';
import { insufficientFundsError, strToHex } from '../../shared/functions';
import { useAppDispatch } from '../../minima/redux/hooks';
import { toggleNotification } from '../../minima/redux/slices/notificationSlice';
import ModalManager from '../components/managers/ModalManager';
import NFTConfirmation from '../components/forms/common/NFTConfirmation';

const validation = Yup.object().shape({
    name: Yup.string().required('This field is required.'),
    image: Yup.mixed().required('This field is required.'),
    amount: Yup.string()
        .required('Field Required')
        .matches(/^[^a-zA-Z\\;'"]+$/, 'Invalid characters.'),
});

function isBlob(blob: null | Blob): blob is Blob {
    return (blob as Blob) !== null && (blob as Blob).type !== undefined;
}
const getDataUrlFromBlob = (blob: Blob): Promise<string> => {
    const copy = blob;
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(copy);
        reader.onload = function () {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject('Error: could not get data url from image');
            }
        };
    });
};

const CreateNFTForm = () => {
    const inp = React.useRef<any>(undefined);
    const dispatch = useAppDispatch();
    const [modalEmployee, setModalEmployee] = React.useState('');
    const [previewImage, setPreviewImage] = React.useState(undefined);

    const handleClose = () => {
        setModalEmployee('');
    };
    const handleProceed = () => {
        setModalEmployee('confirmation');
    };

    const formik = useFormik({
        initialValues: {
            image: undefined,
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
            const COMPRESSION_FACTOR_LOW = 0.1;
            const COMPRESSION_FACTOR_MEDIUM = 0.5;
            const COMPRESSION_FACTOR_HIGH = 0.9;
            setModalEmployee('');

            const oNFT = {
                image: new File([data.image], 'imageData'),
                amount: data.amount,
                name: strToHex(data.name),
                description: strToHex(data.description),
                external_url: strToHex(data.external_url),
                owner: strToHex(data.owner),
                creation_date: data.creation_date,
                webvalidate: data.webvalidate,
                burn: '',
            };

            // check if is blob
            const _isBlob = isBlob(oNFT.image);
            if (_isBlob) {
                getDataUrlFromBlob(oNFT.image)
                    .then((dataUrl) => {
                        // time to compress & send to the blockchain
                        buildUserNFT(dataUrl, COMPRESSION_FACTOR_HIGH, oNFT)
                            .then((result: any) => {
                                if (result.status) {
                                    // success, reset form, set previewImage to undefined again
                                    formik.resetForm();
                                    setPreviewImage(undefined);
                                }

                                if (!result.status) {
                                    throw new Error(result.error ? result.error : result.message);
                                }
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
                    })
                    .catch((err) => {
                        console.error('getDataUrlFromBlob', err);
                        dispatch(toggleNotification(`${err}`, 'error', 'error'));
                        formik.setSubmitting(false);
                    });
            } else {
                console.error('Selected image is not of type Blob');
                dispatch(toggleNotification('Image is not of type Blob, please report bug to admin', 'error', 'error'));
                formik.setSubmitting(false);
            }
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
                    Image, Gif <Required />
                </Typography>
                <Typography className={styles['form-help-caption']} variant="caption">
                    File types supported: BMP, JPEG, PNG, SVG+XML, GIF.
                </Typography>
                <Box
                    component="label"
                    sx={{
                        borderColor:
                            formik.touched.image && Boolean(formik.errors.image) ? '#FCBEBD!important' : 'none',
                        padding: formik.touched.image && Boolean(formik.errors.image) ? '0!important' : '8px',
                        marginBottom: formik.touched.image && Boolean(formik.errors.image) ? '30px!important' : '8px',

                        '::after': {
                            display: formik.touched.image && Boolean(formik.errors.image) ? 'flex' : 'none',
                            content:
                                formik.touched.image && Boolean(formik.errors.image)
                                    ? `"${formik.errors.image}"`
                                    : '" "',
                            color: 'rgb(211, 47, 47)',
                            backgroundColor: '#FCBEBD',
                            width: '100%',
                            textAlign: 'center',
                            fontSize: '0.8rem',
                            fontFamily: 'Manrope-semibold',
                            padding: '5px',
                            borderBottomLeftRadius: '8px',
                            borderBottomRightRadius: '8px',
                            marginTop: '0.5px',
                        },
                    }}
                    className={styles['form-image-preview-box']}
                >
                    {previewImage ? (
                        <img src={URL.createObjectURL(previewImage)} className={styles['form-image-preview-box-img']} />
                    ) : null}
                    <input
                        ref={inp}
                        id="image"
                        name="image"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e: any) => {
                            if (previewImage) {
                                // console.log('revoking url object..');
                                URL.revokeObjectURL(previewImage);
                            }
                            if (e.target.files[0]) {
                                //console.log('setting FIle to subscribers');
                                setPreviewImage(e.target.files[0]);
                                formik.setFieldValue('image', e.target.files[0]);
                            }
                        }}
                    />

                    {previewImage ? (
                        <>
                            <ClearIcon
                                color="inherit"
                                className={styles['clear-icon']}
                                onClick={() => formik.setFieldValue('image', '')}
                            />
                            <Box className={styles['info-label-image-upload']}>
                                <Typography variant="caption">{previewImage ? previewImage['name'] : null}</Typography>
                            </Box>
                        </>
                    ) : (
                        <Stack className={styles['info-upload-overlay']} justifyContent="center" alignItems="center">
                            <CloudUploadIcon fontSize="large" color="inherit" />
                            <Typography variant="caption">Click here to upload</Typography>
                        </Stack>
                    )}
                </Box>
                <TextField
                    disabled={formik.isSubmitting}
                    fullWidth
                    id="name"
                    name="name"
                    placeholder="name *"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    // FormHelperTextProps={styles['form-helper-text']}
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
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                    helperText={formik.touched.amount && formik.errors.amount}
                    // FormHelperTextProps={styles['form-helper-text']}
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
                    value={formik.values.external_url}
                    onChange={formik.handleChange}
                    error={formik.touched.external_url && Boolean(formik.errors.external_url)}
                    helperText={formik.touched.external_url && formik.errors.external_url}
                    // FormHelperTextProps={styles['form-helper-text']}
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
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                    // FormHelperTextProps={styles['form-helper-text']}
                    InputProps={{
                        style:
                            formik.touched.description && Boolean(formik.errors.description)
                                ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                    }}
                    maxRows={4}
                    rows={4}
                    multiline
                />
                <Typography className={styles['form-help-caption']} variant="caption">
                    An address or name can be added as a parameter of ownership.
                </Typography>
                <TextField
                    disabled={formik.isSubmitting}
                    fullWidth
                    id="owner"
                    name="owner"
                    placeholder="owner address"
                    value={formik.values.owner}
                    onChange={formik.handleChange}
                    error={formik.touched.owner && Boolean(formik.errors.owner)}
                    helperText={formik.touched.owner && formik.errors.owner}
                    // FormHelperTextProps={styles['form-helper-text']}
                    InputProps={{
                        style:
                            formik.touched.owner && Boolean(formik.errors.owner)
                                ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                    }}
                />
                <Typography variant="caption" className={styles['form-help-caption']}>
                    Add a text file to your website which holds a copy of the tokenid (obtained after creation) and it
                    can be used as validation.
                </Typography>
                <TextField
                    disabled={formik.isSubmitting}
                    fullWidth
                    id="webvalidate"
                    name="webvalidate"
                    placeholder="web validation url"
                    value={formik.values.webvalidate}
                    onChange={formik.handleChange}
                    error={formik.touched.webvalidate && Boolean(formik.errors.webvalidate)}
                    helperText={formik.touched.webvalidate && formik.errors.webvalidate}
                    // FormHelperTextProps={styles['form-helper-text']}
                    InputProps={{
                        style:
                            formik.touched.webvalidate && Boolean(formik.errors.webvalidate)
                                ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                    }}
                />
                <Button
                    disabled={formik.isSubmitting}
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
        </form>
    );
};

const Required = () => {
    return <span className={styles['required']}>*</span>;
};

export default CreateNFTForm;
