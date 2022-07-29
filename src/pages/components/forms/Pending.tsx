import { Typography, Box, Stack } from '@mui/material';

import styles from '../../../theme/cssmodule/Components.module.css';

import { BrowserView, MobileView } from 'react-device-detect';

const Pending = () => {
    // console.log('Navigator User Agent', navigator.userAgent);
    return (
        <>
            <MobileView>Your transaction must be confirmed.</MobileView>
            <BrowserView>
                <Typography variant="caption">Your transaction must be confirmed in your Minima terminal.</Typography>
                <Stack spacing={1} mt={1}>
                    <Box component="div">
                        1. Run <code className={styles['code-edit']}>mds action:pending</code> to view your pending
                        transactions.
                    </Box>
                    <Box component="div">
                        2. Then <code className={styles['code-edit']}>mds action:accept/deny uid:minidapp_uid</code>
                    </Box>
                </Stack>
            </BrowserView>
        </>
    );
};

export default Pending;
