/**
 * Select either an url or to upload an image for all token creation forms
 */
import { Box, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import React from 'react';
import AddImage from '../../../pages/components/forms/AddImage';
import FormFieldWrapper from '../FormFieldWrapper';
import styles from '../../../theme/cssmodule/Components.module.css';

interface IProps {
    // handleChange: (event: SelectChangeEvent) => void;
    formik: any;
}

type IFormSelection = 'URL' | 'CONTENTUPLOAD';
const FormImageUrlSelect = ({ formik }: IProps) => {
    const [imageSelection, setMyImageSelection] = React.useState<any>('CONTENTUPLOAD');

    const handleChange = (e: SelectChangeEvent) => {
        setMyImageSelection(e.target.value);
        formik.setFieldValue('url', '');
    };

    const [file, setFile] = React.useState<File | null>(null);
    const [imageDataUrl, setImageDataUrl] = React.useState('');

    /**
     * Handles the file input for when the user wants to select an image
     * @param {string} imageDataUrl
     * @param {File} file
     * creds to dynamitesushi & neil shah
     */
    const onImageChange = (imageDataUrl: string, file: File) => {
        setImageDataUrl(imageDataUrl);
        setFile(file);
    };

    // select whether to use an url or file upload for the forms that can create any type of tokens
    return (
        <>
            <Select
                fullWidth
                disabled={formik.isSubmitting}
                id="image-url-select"
                value={imageSelection}
                onChange={handleChange}
            >
                <MenuItem value={'URL'}>Image URL</MenuItem>
                <MenuItem value={'CONTENTUPLOAD'}>Upload an image file</MenuItem>
            </Select>
            {imageSelection === 'CONTENTUPLOAD' ? (
                <FormFieldWrapper
                    children={
                        <Box
                            component="label"
                            sx={{
                                borderColor:
                                    formik.touched.url && Boolean(formik.errors.url) ? '#FCBEBD!important' : 'none',
                                padding: formik.touched.url && Boolean(formik.errors.url) ? '0!important' : '8px',
                                marginBottom:
                                    formik.touched.url && Boolean(formik.errors.url) ? '30px!important' : '8px',

                                '::after': {
                                    display: formik.touched.url && Boolean(formik.errors.url) ? 'flex' : 'none',
                                    content:
                                        formik.touched.url && Boolean(formik.errors.url)
                                            ? `"${formik.errors.url}"`
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
                            <AddImage formik={formik} onImageChange={onImageChange} />
                        </Box>
                    }
                    help=""
                />
            ) : (
                <FormFieldWrapper
                    children={
                        <TextField
                            disabled={formik.isSubmitting}
                            fullWidth
                            id="url"
                            name="url"
                            placeholder="url *"
                            value={formik.values.url}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            error={formik.touched.url && Boolean(formik.errors.url)}
                            helperText={formik.touched.url && formik.errors.url}
                        />
                    }
                    help=""
                />
            )}
        </>
    );
};
export default FormImageUrlSelect;
