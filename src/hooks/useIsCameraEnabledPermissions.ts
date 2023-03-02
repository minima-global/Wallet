import React from 'react';

type PermissionsCamera = PermissionName & 'camera';
const useIsCameraEnabledPermissions = () => {
    const [cameraEnabled, setCameraEnabled] = React.useState(false);

    React.useEffect(() => {
        navigator.permissions.query({ name: 'camera' } as PermissionsCamera).then((v) => {
            if (v.state === 'granted') {
                setCameraEnabled(true);
            }
        });
    }, []);

    return cameraEnabled;
};

export default useIsCameraEnabledPermissions;
