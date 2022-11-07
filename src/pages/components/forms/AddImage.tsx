import React, { ReactNode } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styles from '../../../theme/cssmodule/Components.module.css';
import { Box, Stack, Typography } from '@mui/material';

function isString(myString: string | ArrayBuffer | null): myString is string {
    return (myString as string).length !== undefined; // ArrayBuffer has byteLength property not length
}

function isBlob(blob: undefined | Blob): boolean {
    return blob !== undefined;
}

interface IProps {
    image?: string;
    onImageChange?: any;
    children?: ReactNode;
    id?: string;
    formik: any;
}

const AddImage = ({ onImageChange = () => {}, formik }: IProps) => {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

    const handleCapture = ({ target }: any) => {
        setSelectedFile(target.files[0]);
        getDataUrlFromBlob(target.files[0]).then((imageDataUrl) => {
            onImageChange(imageDataUrl, target.files[0]);
            formik.setFieldValue('image', imageDataUrl);
        }, console.error);
    };

    const getDataUrlFromBlob = (blob: Blob): Promise<string> => {
        const _isBlob = isBlob(blob);
        if (!_isBlob) {
            return Promise.reject('Image is not a Blob');
        }

        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function () {
                if (isString(reader.result)) {
                    resolve(reader.result);
                } else {
                    reject('Error: could not get data url from image');
                }
            };
        });
    };
    return (
        <>
            {formik.values.image && selectedFile ? (
                <>
                    <img src={formik.values.image} className={styles['form-image-preview-box-img']} />
                    <ClearIcon
                        color="inherit"
                        className={styles['clear-icon']}
                        onClick={() => {
                            formik.setFieldValue('image', '');
                        }}
                    />
                    <Box className={styles['info-label-image-upload']}>
                        <Typography variant="caption">{selectedFile.name}</Typography>
                    </Box>
                </>
            ) : (
                <Stack className={styles['info-upload-overlay']} justifyContent="center" alignItems="center">
                    <CloudUploadIcon fontSize="large" color="inherit" />
                    <Typography variant="caption">Click here to upload</Typography>
                </Stack>
            )}
            <input id="image" name="image" type="file" hidden accept="image/*" onChange={handleCapture} />
        </>
    );
};

export default AddImage;
