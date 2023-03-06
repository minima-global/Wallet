import React from 'react';

type PermissionsCamera = PermissionName & 'camera';
type PermissionState = 'denied' | 'granted' | 'prompt' | undefined;
const useIsCameraEnabledPermissions = () => {
    const [cameraStatus, setCameraStatus] = React.useState<PermissionState>(undefined);

    React.useEffect(() => {
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
                    setCameraStatus(undefined);
                });
        }
    }, [navigator.permissions.query]);

    return { cameraStatus };
};

export default useIsCameraEnabledPermissions;
