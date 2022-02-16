import React, { FC, useEffect, useState } from 'react';
import { Grid, Typography, Button, Card, CardContent, Box, TextField, Chip, Tooltip } from '@mui/material';
import { callCommand } from '../minima/rpc-commands';
import { copyTextToClipboard } from '../shared/functions';
import QRCode from 'react-qr-code';

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
                    <CardContent
                        sx={{
                            textAlign: 'center',
                        }}
                    >
                        <QRCode level="M" value={address} />

                        <Box sx={{ marginTop: 2 }}>
                            <Tooltip title="Wallet Address">
                                <TextField
                                    aria-readonly
                                    maxRows={2}
                                    InputProps={{
                                        endAdornment: (
                                            <Chip
                                                color="primary"
                                                label={!isCopied ? 'Copy' : 'Copied'}
                                                sx={button}
                                                onClick={handleCopyClick}
                                            />
                                        ),
                                        startAdornment: (
                                            <Typography sx={hexAddressText} variant="h6">
                                                Wallet
                                            </Typography>
                                        ),
                                        style: { color: '#91919D', fontWeight: '800' },
                                    }}
                                    value={`(${address.substring(0, 8)}...${address.substring(58, 66)})`}
                                />
                            </Tooltip>
                            <Typography variant="subtitle1">
                                Use this address to receive any Minima or Minima tokens.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={0} md={2}></Grid>
        </Grid>
    );
};

export default Receive;

const button = {
    '&:hover': {
        opacity: 0.8,
    },
    letterSpacing: 1,
};
const hexAddressText = { color: '#000', fontSize: 14, fontWeight: '800', paddingLeft: 0 };
