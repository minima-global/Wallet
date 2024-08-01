import { FormikContextType, FormikValues, useFormikContext } from 'formik';
import React, { ReactNode, useRef } from 'react';
import UploadIcon from '../../../components/UI/Icons/UploadIcon';
import RubbishIcon from '../../../components/UI/Icons/RubbishIcon';
import PreviewToken from '../../../components/PreviewToken';

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
}

const AddImage = ({ onImageChange = () => {} }: IProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formik: FormikContextType<FormikValues> = useFormikContext();
    const [_, setSelectedFile] = React.useState<File | null>(null);

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


            <div
                onClick={() => fileInputRef.current?.click()}
                className="bg-neutral-200 hover:cursor-pointer hover:bg-neutral-300 hover:dark:bg-black text-[#1B1B1B] dark:bg-[#1B1B1B] gap-1 p-2 py-4 flex justify-center items-center dark:text-neutral-300 rounded"
            >
                <span>
                    <UploadIcon fill="currentColor" size={20} />
                </span>
                <p className="text-sm font-bold">{!formik.values.url.length && "Click here to upload"} {!!formik.values.url.length && "Upload another file"}</p>
            </div>

            <input
                disabled={formik.isSubmitting}
                id="url"
                name="url"
                type="file"
                key={formik.values.url}
                hidden
                accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                onChange={handleCapture}
                onBlur={formik.handleBlur}
                ref={fileInputRef}
            />

            <p className="text-[12px] dark:text-neutral-400 text-center">
                Image formats accepted are png, jpeg, jpg, svg (all files are compressed &{' '}
            </p>
        </>
    );
};

export default AddImage;
