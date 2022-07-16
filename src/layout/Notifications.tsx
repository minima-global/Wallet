import { useState, useEffect } from 'react';
import { Snackbar, Alert, Portal, Typography, Stack } from '@mui/material';
import { useAppSelector } from '../minima/redux/hooks';
import { selectNotificationState } from '../minima/redux/slices/notificationSlice';

import styles from '../theme/cssmodule/Components.module.css';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Notifications = () => {
    const [openNotification, setOpenNotification] = useState(false);
    const notificationStatus = useAppSelector(selectNotificationState);

    // console.log(`NOTIFICATIONSTATUS`, notificationStatus);

    useEffect(() => {
        setOpenNotification(notificationStatus.display ? notificationStatus.display : false);
    }, [notificationStatus]);
    return (
        <>
            <Portal>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    autoHideDuration={3000}
                    open={notificationStatus.display}
                >
                    <Alert
                        icon={false}
                        color={
                            notificationStatus.props !== undefined &&
                            notificationStatus.props.hasOwnProperty('severity')
                                ? notificationStatus.props.severity
                                : 'info'
                        }
                        className={styles['alert-toast']}
                    >
                        <Stack direction="row" spacing={1}>
                            {notificationStatus.props !== undefined &&
                            notificationStatus.props.hasOwnProperty('severity') ? (
                                notificationStatus.props.severity === 'success' ? (
                                    <ThumbUpIcon color="success" />
                                ) : notificationStatus.props.severity === 'error' ? (
                                    <BrokenImageIcon color="error" />
                                ) : notificationStatus.props.severity === 'info' ? (
                                    <BubbleChartIcon color="primary" />
                                ) : (
                                    'Icon goes here'
                                )
                            ) : (
                                'success'
                            )}
                            <Typography variant="body2" className={styles['message-toast']}>
                                {notificationStatus.props !== undefined &&
                                notificationStatus.props.hasOwnProperty('message')
                                    ? notificationStatus.props.message
                                    : 'Undefined Message'}
                            </Typography>
                        </Stack>
                    </Alert>
                </Snackbar>
            </Portal>
        </>
    );
};

export default Notifications;
