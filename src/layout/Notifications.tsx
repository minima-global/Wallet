import { useState, useEffect } from 'react';
import { Snackbar, Alert, Portal } from '@mui/material';

const Notifications = ({ showNewBalanceSnack }: { showNewBalanceSnack: boolean }) => {
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        showNewBalanceSnack && setShowToast(true);
    }, [showNewBalanceSnack]);

    return (
        <>
            <Portal>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    autoHideDuration={3000}
                    open={showToast}
                    onClose={(event, reason) => {
                        setShowToast(false);
                    }}
                >
                    <Alert severity="success" sx={{ backgroundColor: '#317AFF', width: '100%', color: '#fff' }}>
                        Your balance has changed.
                    </Alert>
                </Snackbar>
            </Portal>
        </>
    );
};

export default Notifications;
