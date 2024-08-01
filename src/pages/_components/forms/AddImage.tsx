import { FormikContextType, FormikValues, useFormikContext } from 'formik';
import React, { useRef } from 'react';
import UploadIcon from '../../../components/UI/Icons/UploadIcon';
import { base64ToBlob, compressImage } from '../../../shared/utils';

const AddImage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formik: FormikContextType<FormikValues> = useFormikContext();
    const [_, setSelectedFile] = React.useState<File | null>(null);

    const handleChangeIcon = async (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = evt.target;

        if (!files || files.length === 0) {
            return;
        }

        if (files) {
            const imageSrc = await handleFileToBase64(files[0]);
            formik.setFieldValue('url', imageSrc);
            const blob = base64ToBlob(imageSrc as string);
            const compressedFile = new File([blob], 'test');
            setSelectedFile(compressedFile);
            if (compressedFile.size > 55000) {
                return formik.setFieldError('url', 'File too large');
            }
        }
    };

    const handleFileToBase64 = (file: File) => {
        return new Promise((resolve) => {
            const fileRead = new FileReader();
            fileRead.readAsDataURL(file);
            fileRead.onload = async () => {
                const base64 = fileRead.result as string;
                const compressedBase64 = await compressImage(base64);
                resolve(compressedBase64);
            };

            fileRead.onerror = () => {
                resolve(
                    'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIEdlbmVyYXRvcjogU1ZHIFJlcG8gTWl4ZXIgVG9vbHMgLS0+Cjxzdmcgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQogICAgPGcgY29sb3I9IiMwMDAwMDAiIGZvbnQtd2VpZ2h0PSI0MDAiIGZvbnQtZmFtaWx5PSJVYnVudHUiIGxldHRlci1zcGFjaW5nPSIwIiB3b3JkLXNwYWNpbmc9IjAiIHdoaXRlLXNwYWNlPSJub3JtYWwiIGZpbGw9ImdyYXkiPg0KICAgICAgICA8cGF0aCBkPSJNOCAyYTIuODQgMi44NCAwIDAgMC0xLjEyLjIyMWMtLjM0NS4xNDEtLjY1MS4zNDgtLjkwNi42MTV2LjAwM2wtLjAwMS4wMDJjLS4yNDguMjY5LS40NC41OTItLjU3NC45Ni0uMTM3LjM2Ny0uMjAzLjc2OS0uMjAzIDEuMiAwIC40MzUuMDY1Ljg0MS4yMDMgMS4yMDkuMTM1LjM2MS4zMjcuNjguNTc0Ljk1bC4wMDEuMDAyYy4yNTQuMjY3LjU1OC40NzcuOTAxLjYyNHYuMDAzYy4zNDYuMTQxLjcyMy4yMSAxLjEyLjIxLjM5NSAwIC43Ny0uMDY5IDEuMTE3LS4yMXYtLjAwMmMuMzQzLS4xNDcuNjQ0LS4zNTcuODkyLS42MjUuMjU1LS4yNjguNDUtLjU5LjU4Ni0uOTUyLjEzOC0uMzY4LjIwNC0uNzc0LjIwNC0xLjIxaC4wMWMwLS40My0uMDY1LS44MzEtLjIwMy0xLjE5OGEyLjc3MSAyLjc3MSAwIDAgMC0uNTg1LS45NjMgMi41IDIuNSAwIDAgMC0uODk3LS42MThBMi44MzUgMi44MzUgMCAwIDAgNy45OTkgMnpNOC4wMjQgMTAuMDAyYy0yLjMxNyAwLTMuNTYxLjIxMy00LjQ4Ni45MS0uNDYyLjM1LS43NjcuODI1LS45MzkgMS4zNzgtLjE3Mi41NTMtLjIyNi45NzUtLjIyOCAxLjcxTDggMTQuMDAyaDUuNjI5Yy0uMDAxLS43MzYtLjA1Mi0xLjE1OS0uMjI1LTEuNzEyLS4xNzItLjU1My0uNDc3LTEuMDI3LS45NC0xLjM3Ni0uOTIzLS42OTctMi4xMjQtLjkxMi00LjQ0LS45MTJ6IiBzdHlsZT0ibGluZS1oZWlnaHQ6MTI1JTstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidVYnVudHUsIE5vcm1hbCc7Zm9udC12YXJpYW50LWxpZ2F0dXJlczpub3JtYWw7Zm9udC12YXJpYW50LXBvc2l0aW9uOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1hbHRlcm5hdGVzOm5vcm1hbDtmb250LWZlYXR1cmUtc2V0dGluZ3M6bm9ybWFsO3RleHQtaW5kZW50OjA7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWRlY29yYXRpb24tbGluZTpub25lO3RleHQtZGVjb3JhdGlvbi1zdHlsZTpzb2xpZDt0ZXh0LWRlY29yYXRpb24tY29sb3I6IzAwMDAwMDt0ZXh0LXRyYW5zZm9ybTpub25lO3RleHQtb3JpZW50YXRpb246bWl4ZWQ7c2hhcGUtcGFkZGluZzowO2lzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbCIgb3ZlcmZsb3c9InZpc2libGUiLz4NCiAgICA8L2c+DQo8L3N2Zz4='
                );
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
                <p className="text-sm font-bold">
                    {!formik.values.url.length && 'Click here to upload'}{' '}
                    {!!formik.values.url.length && 'Upload another file'}
                </p>
            </div>

            {formik.errors && formik.errors.url && formik.touched && formik.touched.url && (
                <p className="text-sm mt-2 dark:text-neutral-300">{formik.errors.url}</p>
            )}

            <input
                disabled={formik.isSubmitting}
                id="url"
                name="url"
                type="file"
                key={formik.values.url}
                hidden
                accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                onChange={handleChangeIcon}
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
