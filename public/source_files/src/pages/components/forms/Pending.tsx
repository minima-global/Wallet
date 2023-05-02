import React from 'react';
import { Box, Card, CardContent, Link, Stack, Typography, Tabs, Tab, Avatar } from '@mui/material';
import styles from '../../../theme/cssmodule/Components.module.css';

import UpdateIcon from '@mui/icons-material/Update';

// import { BrowserView, MobileView } from 'react-device-detect';

const Pending = () => {
    // console.log('Navigator User Agent', navigator.userAgent);
    const [pendingHelp, setPendingHelp] = React.useState(false);
    const toggleHelp = () => setPendingHelp(pendingHelp ? false : true);

    return (
        <>
            {!pendingHelp ? (
                <Stack>
                    <Typography variant="body1">This action is pending.</Typography>
                    <Typography variant="body1">
                        Learn more{' '}
                        <Link onClick={toggleHelp} className={styles['learn-more-link']}>
                            <b>here.</b>
                        </Link>
                    </Typography>
                </Stack>
            ) : (
                <PendingHelp />
            )}
        </>
    );
};

export default Pending;

const PendingHelp = () => {
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Stack>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="inherit"
                indicatorColor="primary"
                aria-label="pending tabs instructions"
            >
                <Tab label="Mobile" className={styles['nft-tabs-tab']} />
                <Tab label="Desktop" className={styles['nft-tabs-tab']} />
            </Tabs>

            {value == 0 ? (
                <Stack mt={1}>
                    <Typography variant="body1">
                        You can accept/deny pending transactions from the
                        <UpdateIcon className={styles['pending-icon']} />
                        icon on the Home Page in the app.
                    </Typography>
                </Stack>
            ) : (
                <>
                    <Stack spacing={1} mt={1}>
                        <Box component="div">
                            1. Open the Terminal MiniDapp and run{' '}
                            <code className={styles['code-edit']}>mds action:pending</code> to view your pending
                            transactions.
                        </Box>
                        <Box component="div">
                            2. Then <code className={styles['code-edit']}>mds action:accept/deny uid:$uid</code>.
                        </Box>
                    </Stack>
                </>
            )}
        </Stack>
    );
};
