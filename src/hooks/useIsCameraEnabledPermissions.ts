import React from 'react';

const useIsCameraEnabledPermissions = () => {
    const [cameraEnabled, setCameraEnabled] = React.useState(false);

    React.useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true }).catch(() => {
            return setCameraEnabled(false);
        });

        setCameraEnabled(true);
    }, []);

    return cameraEnabled;
};

export default useIsCameraEnabledPermissions;
