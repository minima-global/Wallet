/**
 * Select either an url or to upload an image for all token creation forms
 */
import React from 'react';
import AddImage from '../../../pages/_components/forms/AddImage';
import FormFieldWrapper from '../FormFieldWrapper';
import { useFormikContext } from 'formik';
import Input from '../../../components/UI/Input';
import { Box } from '@mui/material';
import Select from '../../../components/UI/Select';
const FormImageUrlSelect = () => {
    const [imageSelection, setMyImageSelection] = React.useState('Upload image');

    const formik: any = useFormikContext();

    const handleChange = (option: string) => {
        setMyImageSelection(option);
        formik.setFieldValue('url', '');
    };

    const [, setFile] = React.useState<File | null>(null);
    const [, setImageDataUrl] = React.useState('');

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
                current={imageSelection}
                setCurrent={handleChange}
                def="Upload image"
                options={['Upload image', 'Url']}
            />
            {imageSelection === 'Upload image' ? (
                <FormFieldWrapper
                    children={
                        <Box
                            component="label"
                            sx={{
                                borderColor:
                                    formik.touched.url && Boolean(formik.errors.url) ? '#FCBEBD!important' : 'none',

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
                        >
                            <AddImage formik={formik} onImageChange={onImageChange} />
                        </Box>
                    }
                    help=""
                />
            ) : (
                <Input
                    id="url"
                    type="text"
                    placeholder="Icon URL"
                    disabled={formik.isSubmitting}
                    {...formik.getFieldProps('url')}
                    error={formik.touched.url && formik.errors.url ? formik.errors.url : false}
                />
            )}
        </>
    );
};
export default FormImageUrlSelect;
