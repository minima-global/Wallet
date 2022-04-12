import React, { FC, useEffect, useState } from 'react';
import {
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    Box,
    TextField,
    Chip,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import { callAddress } from '../minima/rpc-commands';
import { copyTextToClipboard } from '../shared/functions';
import QRCode from 'react-qr-code';

const Receive: FC = () => {
    const [address, setAddress] = useState<string>('');
    const [isCopied, setIsCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        callAddress()
            .then((res: any) => {
                setAddress(res.miniaddress);
                setLoading(false);
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
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? (
                    <CircularProgress size={32} />
                ) : (
                    <Card variant="outlined">
                        <CardContent
                            sx={{
                                textAlign: 'center',
                            }}
                        >
                            <QRCode style={{ marginTop: 16 }} level="M" value={address} />

                            <Box sx={{ marginTop: 4 }}>
                                <Tooltip title="Wallet Address">
                                    <TextField
                                        sx={{ textOverflow: 'ellipsis' }}
                                        aria-readonly
                                        InputProps={{
                                            // endAdornment: (
                                            //     <Chip
                                            //         color="primary"
                                            //         label={!isCopied ? 'Copy' : 'Copied'}
                                            //         sx={button}
                                            //         onClick={handleCopyClick}
                                            //     />
                                            // ),
                                            startAdornment: (
                                                <Typography sx={hexAddressText} variant="h6">
                                                    Wallet
                                                </Typography>
                                            ),
                                            style: { color: '#91919D', fontWeight: '800', textOverflow: 'ellipsis' },
                                        }}
                                        value={`${address}`}
                                    />
                                </Tooltip>
                                <Typography sx={{ marginTop: 2 }} variant="subtitle1">
                                    Use this address to receive any Minima or Minima tokens.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                )}
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
