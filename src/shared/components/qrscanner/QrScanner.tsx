import { useEffect, useState } from 'react';

import { useFormikContext } from 'formik';
import validateMinimaAddress from '../../../minima/commands/validateMinimaAddress/validateMinimaAddress';

type PermissionsCamera = PermissionName & 'camera';
type PermissionState = 'denied' | 'granted' | 'prompt' | null;
const QrScanner = ({ open, closeModal }: any) => {
    const [cameraStatus, setCameraStatus] = useState<PermissionState | null>(null);
    const formik: any = useFormikContext();

    const [error, setError] = useState<false | string>(false);

    const setAddressFieldValue = async (scannedMinimaAddress: string) => {
        setError(false);
        try {
            await validateMinimaAddress(scannedMinimaAddress);
            // it's valid so set input field
            formik.setFieldValue('address', scannedMinimaAddress);
            // close Modal
            closeModal();
        } catch (error: any) {
            console.error(error);
            // set error
            setError(error.message);
        }
    };

    const requestCamera = () => {
        navigator.permissions.query({ name: 'camera' } as PermissionsCamera).then((v) => {
            if (v.state === 'prompt') {
                setCameraStatus('prompt');
                navigator.mediaDevices
                    .getUserMedia({ audio: false, video: true })
                    .then((r) => {
                        if (r.active) {
                            setCameraStatus('granted');
                        }
                        if (!r.active) {
                            setCameraStatus('denied');
                        }
                    })
                    .catch((err) => {
                        console.error('Camera unavailable', err);
                        return setCameraStatus('denied');
                    });
            }
            if (v.state === 'denied') {
                setCameraStatus('denied');
            }
            if (v.state === 'granted') {
                setCameraStatus('granted');
            }
        });
    };

    useEffect(() => {
        if (open) {
            if (navigator && 'permissions' in navigator) {
                requestCamera();
            }
        }
    }, [open]);
return null;

};

export default QrScanner;
