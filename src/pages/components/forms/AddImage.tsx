import React, { ReactNode } from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import styles from '../../../theme/cssmodule/Components.module.css';
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
            formik.setFieldValue('url', imageDataUrl);
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
            {formik.values.url && selectedFile ? (
                <div className="relative">
                    <img alt="" src={formik.values.url} />

                    <div>
                        <p className="text-black text-sm">{selectedFile.name}</p>
                    </div>

                    <svg
                        onClick={() => formik.setFieldValue('url', '')}
                        className="absolute right-0 top-0"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                    >
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                    </svg>
                </div>
            ) : (
                <div className="bg-slate-200 bg-opacity-80 rounded max-w-max flex flex-col justify-center items-center py-12 px-12 hover:bg-opacity-50 hover:cursor-pointer">
                    <svg
                        className="fill-black"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                    >
                        <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                    </svg>
                    <p className="text-black text-sm">Click here to upload</p>
                </div>
            )}

            <input
                disabled={formik.isSubmitting}
                id="url"
                name="url"
                type="file"
                key={formik.values.url}
                hidden
                accept="image/*"
                onChange={handleCapture}
                onBlur={formik.handleBlur}
            />
        </>
    );
};

export default AddImage;
