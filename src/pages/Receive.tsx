import React, { FC, useEffect, useState } from 'react';
import { Grid, Typography, Button, Card, CardContent } from '@mui/material';
import { callCommand } from '../minima/rpc-commands';
import { copyTextToClipboard } from '../shared/functions';

const Receive: FC = () => {
    const [address, setAddress] = useState<string>('');
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        callCommand('newaddress')
            .then((res: any) => {
                console.log(res);
                setAddress(res.response.address);
            })
            .catch((err) => {
                console.error(`${err}`);
            });
    }, []);

    const handleCopyClick = () => {
        copyTextToClipboard(address)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 1500);
            })
            .catch((err) => {
                console.error(`${err}`);
            });
    };

    return (
        <Grid container spacing={2} sx={{ marginTop: { xs: 0 } }}>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="subtitle1">Address: {address}</Typography>
                        <Button onClick={handleCopyClick}>{!isCopied ? 'Copy' : 'Copied'}</Button>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={0} md={2}></Grid>
        </Grid>
    );
};

export default Receive;
