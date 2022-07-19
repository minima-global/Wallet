import React from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import styles from '../../theme/cssmodule/Components.module.css';

import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { callCreateNFT } from '../../minima/rpc-commands';

const validation = Yup.object().shape({});

function isBlob(blob: null | Blob): blob is Blob {
    return (blob as Blob) !== null && (blob as Blob).type !== undefined;
}
const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const getDataUrlFromBlob = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
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
    const [myImage, setMyImage] = React.useState<File | null>(null);
    const inp = React.useRef<any>();

    console.log(`myImage `, myImage);

    const formik = useFormik({
        initialValues: {
            image: '',
            amount: '',
            name: '',
            description: '',
            external_url: '',
            owner: '',
            creation_date: '',
            webvalidate: '',
        },
        onSubmit: (data: any) => {
            console.log(data.image);

            if (isBlob(myImage)) {
                getDataUrlFromBlob(myImage)
                    .then((f) => {
                        data.image = f.slice(f.indexOf(',') + 1);
                        console.log(`image data object`, data.image);
                        callCreateNFT(data)
                            .then((res: any) => {
                                console.log(`callCreateNFT result`, res);
                                if (res.status) {
                                    console.log(`CREATED NFT SUJCCESSFULLY`);
                                    formik.resetForm();
                                }
                            })
                            .catch((err) => {
                                console.error(`callCreateNFT FAILED`, err);
                            });
                    })
                    .catch((err) => {});
            } else {
                console.error('not blob!');
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
                <Box component="label" className={styles['form-image-preview-box']}>
                    {myImage ? (
                        <img className={styles['form-image-preview-box-img']} src={URL.createObjectURL(myImage)} />
                    ) : null}
                    <input
                        ref={inp}
                        id="image"
                        name="image"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e: any) => {
                            setMyImage(e.target.files[0]);
                        }}
                    />

                    {myImage ? (
                        <>
                            <ClearIcon
                                color="inherit"
                                className={styles['clear-icon']}
                                onClick={() => setMyImage(null)}
                            />
                            <Box className={styles['info-label-image-upload']}>
                                <Typography variant="caption">{myImage.name}</Typography>
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
                    FormHelperTextProps={styles['form-helper-text']}
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
                    FormHelperTextProps={styles['form-helper-text']}
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
                    FormHelperTextProps={styles['form-helper-text']}
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
                    FormHelperTextProps={styles['form-helper-text']}
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
                    An address can be added as a parameter of ownership.
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
                    FormHelperTextProps={styles['form-helper-text']}
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
                    FormHelperTextProps={styles['form-helper-text']}
                    InputProps={{
                        style:
                            formik.touched.webvalidate && Boolean(formik.errors.webvalidate)
                                ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                                : { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                    }}
                />
                <Button type="submit" variant="contained" fullWidth disableElevation>
                    Mint
                </Button>
            </Stack>
        </form>
    );
};

const Required = () => {
    return <span className={styles['required']}>*</span>;
};

export default CreateNFTForm;
