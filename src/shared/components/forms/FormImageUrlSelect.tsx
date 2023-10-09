/**
 * Select either an url or to upload an image for all token creation forms
 */
import { Box } from '@mui/material';
import React from 'react';
import AddImage from '../../../pages/components/forms/AddImage';
import FormFieldWrapper from '../FormFieldWrapper';
import { useFormikContext } from 'formik';
import Input from '../../../components/UI/Input';

const FormImageUrlSelect = () => {
    const [imageSelection, setMyImageSelection] = React.useState<any>('CONTENTUPLOAD');

    const formik: any = useFormikContext();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMyImageSelection(e.target.value);
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
            <div className="relative">
                <select
                    defaultValue={imageSelection}
                    onChange={handleChange}
                    className="p-4 text-black hover:opacity-80 hover:cursor-pointer rounded-lg w-full hover:bg-slate-200"
                >
                    <option id="value" value="CONTENTUPLOAD">
                        Upload an icon
                    </option>
                    <option id="split" value="URL">
                        Use a link
                    </option>
                </select>
                <svg
                    className="my-auto absolute right-4 top-[10px]"
                    width="32"
                    height="33"
                    viewBox="0 0 32 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <mask id="mask0_2226_53255" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="33">
                        <rect y="0.550781" width="32" height="32" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_2226_53255)">
                        <path
                            d="M16.0004 20.6172L8.4668 13.0508L9.6668 11.8844L16.0004 18.2172L22.334 11.8844L23.534 13.0844L16.0004 20.6172Z"
                            fill="#08090B"
                        />
                    </g>
                </svg>
            </div>
            {imageSelection === 'CONTENTUPLOAD' ? (
                <FormFieldWrapper
                    children={
                        <Box
                            component="label"
                            sx={{
                                borderColor:
                                    formik.touched.url && Boolean(formik.errors.url) ? '#FCBEBD!important' : 'none',

                                marginBottom:
                                    formik.touched.url && Boolean(formik.errors.url) ? '30px!important' : '8px',
                                maxWidth: 'max-content',
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
