import { useEffect, useState } from 'react';

import Button from '../../../components/UI/Button';
import Grid from '../../../components/UI/Grid';
import MiError from '../layout/MiError/MiError';
import { useFormikContext } from 'formik';
import validateMinimaAddress from '../../../minima/commands/validateMinimaAddress/validateMinimaAddress';
import { QrReader } from 'react-qr-reader';

type PermissionsCamera = PermissionName & 'camera';
type PermissionState = 'denied' | 'granted' | 'prompt' | undefined;
const QrScanner = ({ open, closeModal }: any) => {
    const [cameraStatus, setCameraStatus] = useState<PermissionState | false>(false);
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

    useEffect(() => {
        if (open) {
            if (navigator && 'permissions' in navigator) {
                navigator.permissions
                    .query({ name: 'camera' } as PermissionsCamera)
                    .then((v) => {
                        if (v.state === 'granted') {
                            navigator.mediaDevices.getUserMedia({ audio: false, video: true }).catch((err) => {
                                console.error('Camera unavailable', err);
                                return setCameraStatus('denied');
                            });
                        }

                        setCameraStatus(v.state);
                    })
                    .catch((err) => {
                        console.error('Camera permissions', err);
                        setCameraStatus(false);
                    });
            }
        }
    }, [open]);

    return (
        open && (
            <div className="z-20 absolute left-0 md:left-[240px] right-0 bottom-0 top-0 bg-black bg-opacity-80">
                <Grid variant="lg" title={<></>}>
                    <>
                        <div className="relative rounded bg-white mx-6 h-max">
                            {cameraStatus === 'granted' && open && (
                                <div>
                                    <QrReader
                                        videoContainerStyle={{
                                            paddingTop: '75%',
                                            borderBottomLeftRadius: '0',
                                            borderBottomRightRadius: '0',
                                            borderTopLeftRadius: '4px',
                                            borderTopRightRadius: '4px',
                                        }}
                                        videoStyle={{
                                            objectFit: 'content',
                                            height: '100%',
                                            width: '100%',
                                        }}
                                        scanDelay={500}
                                        onResult={(data: any) => {
                                            if (data) {
                                                setAddressFieldValue(data.text);
                                            }
                                        }}
                                        constraints={{ facingMode: 'environment' }}
                                    />
                                    {error && (
                                        <MiError>
                                            <h6>Invalid Minima Address</h6>
                                            <p>{error}</p>
                                        </MiError>
                                    )}
                                </div>
                            )}

                            {cameraStatus === 'denied' && (
                                <div className="flex flex-col items-center justify-center text-center p-8">
                                    <h1 className="text-black text-xl font-semibold mb-4">Camera is unavailable!</h1>
                                    <p className="text-black mb-4">
                                        You have denied camera permissions, please enable it and refresh this page.
                                    </p>
                                </div>
                            )}

                            {!cameraStatus && (
                                <div className="flex flex-col items-center justify-center text-center p-8">
                                    <h1 className="text-black text-xl font-semibold mb-4">
                                        Camera API is unavailable on this browser!
                                    </h1>
                                    <p className="text-black mb-4">
                                        Please consider using compatible and up to date browser. Try a later version of
                                        google chrome, firefox, brave or safari.
                                    </p>
                                </div>
                            )}

                            {cameraStatus === 'prompt' && (
                                <div className="flex flex-col items-center justify-center text-center p-8">
                                    <h1 className="text-black text-xl font-semibold mb-4">Camera is unavailable!</h1>
                                    <p className="text-black mb-4">Accept the camera permissions prompt and proceed.</p>
                                </div>
                            )}

                            <div className="relative flex items-center justify-center">
                                <Button onClick={closeModal} extraClass="text-white bg-[#0D0E10] rounded-t-none !p-6">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </>
                </Grid>
            </div>
        )
    );
};

export default QrScanner;
