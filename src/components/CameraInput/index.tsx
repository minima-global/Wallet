import { useEffect, useState } from 'react';

import { QrReader } from 'react-qr-reader';
import Button from '../Button';
import { MDS } from "@minima-global/mds";
import useTranslation from '../../hooks/useTranslation';

type PermissionsCamera = PermissionName & 'camera';
type PermissionState = 'denied' | 'granted' | 'prompt' | null;

const QrScanner = ({ open, callback, closeModal }: any) => {
    const { t } = useTranslation();
    const [cameraStatus, setCameraStatus] = useState<PermissionState | null>(null);
    const [error, setError] = useState<false | string>(false);

    const setAddressFieldValue = async (scannedMinimaAddress: string) => {
        setError(false);

        try {
            MDS.cmd.checkaddress({
                params: {
                    address: scannedMinimaAddress
                }
            }, (res) => {
                if (res.status) {
                    callback(scannedMinimaAddress);
                } else {
                    setError("Unable to scan Address QR code, please");
                }
            });
        } catch (error: any) {
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

    return (
        open && (
            <div className="z-[999999] fixed top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="bg-contrast1 text-white mb-4 fixed z-[60] rounded-lg max-w-[90%] md:max-w-[420px] w-full text-center text-white p-6 lg:p-8 transform transition-all duration-200 translate-y-[0%] opacity-100">
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
                                <div className="text-center bg-contrast1.5 border-l-2 border-red rounded-sm p-2 text-sm mt-4">
                                    <p className="text-red">{t("invalid_address_qr_code")}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {cameraStatus === 'denied' && (
                        <div className="mb-6">
                            <h1 className="text-xl font-semibold mb-4">
                                {t('camera_is_unavailable')}
                            </h1>
                            <p>
                                {t('denied_camera_permissions')}
                            </p>
                        </div>
                    )}

                    {cameraStatus === 'prompt' && (
                        <div className="mb-6">
                            <h1 className="text-xl font-semibold mb-4">
                                {t('wallet_is_requesting_camera')}
                            </h1>
                            <p className="max-w-[340px] mx-auto">
                                {t('please_accept_camera_permissions')}
                            </p>
                        </div>
                    )}

                    <div className="mt-5 relative flex items-center justify-center">
                        <Button onClick={closeModal}>
                            {t('cancel')}
                        </Button>
                    </div>
                </div>
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-80 animate-fadeIn z-10"></div>
            </div>
        )
    );
};

export default QrScanner;