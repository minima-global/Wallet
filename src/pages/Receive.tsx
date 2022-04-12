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
    Stack,
    styled,
    TooltipProps,
    tooltipClasses,
    ListItemIcon,
} from '@mui/material';
import { callAddress } from '../minima/rpc-commands';
import { copy, copyTextToClipboard } from '../shared/functions';
import QRCode from 'react-qr-code';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileCopyIcon from '@mui/icons-material/FileCopy';

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
    },
}));

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
        copy(address);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1500);
        // copyTextToClipboard(address)
        // .then(() => {
        //         setIsCopied(true);
        //         setTimeout(() => {
        //             setIsCopied(false);
        //         }, 1500);
        //     })
        //     .catch((err) => {
        //         console.error(`${err}`);
        //     });
    };

    return (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? (
                    <CircularProgress size={32} />
                ) : (
                    <Card variant="outlined">
                        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                            <QRCode style={{ marginTop: 16, alignSelf: 'center' }} level="M" value={address} />

                            <Stack>
                                <Typography sx={{ textAlign: 'left', mt: 3, pl: 2 }} variant="h2">
                                    Wallet Address
                                </Typography>
                                <Typography
                                    sx={{ mt: 3, pl: 2, wordBreak: 'break-word', textAlign: 'left' }}
                                    variant="caption"
                                >
                                    {address}
                                </Typography>
                                {/* <Button color="primary" variant="contained" sx={button} onClick={handleCopyClick}>
                                    {!isCopied ? 'Copy' : 'Copied'}
                                </Button> */}
                            </Stack>

                            <BootstrapTooltip placement="top-end" disableHoverListener open={isCopied} title="Copied!">
                                <ListItemIcon
                                    onClick={handleCopyClick}
                                    sx={[copyBtn, { backgroundColor: isCopied ? '#00B74A' : null }]}
                                >
                                    {!isCopied ? (
                                        <ContentCopyIcon sx={{ color: '#fff', fontSize: 16 }} />
                                    ) : (
                                        <FileCopyIcon sx={{ color: '#fff', fontSize: 16 }} />
                                    )}
                                </ListItemIcon>
                            </BootstrapTooltip>
                            {/* <Chip
                                label={!isCopied ? 'Copy' : 'Copied'}
                                color="primary"
                                sx={{
                                    alignSelf: 'flex-start',
                                    '&:hover': {
                                        opacity: 0.8,
                                    },
                                    textAlign: 'center',
                                    ml: 2,
                                }}
                                onClick={handleCopyClick}
                            /> */}

                            {/* <Box sx={{ marginTop: 4 }}>
                                <Tooltip title="Wallet Address">
                                    <TextField
                                        aria-readonly
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
                                            style: {
                                                color: '#91919D',
                                                fontWeight: '800',
                                            },
                                        }}
                                        value={address}
                                    />
                                </Tooltip>
                                <Typography sx={{ marginTop: 2 }} variant="subtitle1">
                                    Use this address to receive any Minima or Minima tokens.
                                </Typography>
                            </Box> */}
                        </CardContent>
                    </Card>
                )}
            </Grid>
            <Grid item xs={0} md={2}></Grid>
        </Grid>
    );
};

export default Receive;

const copyBtn = {
    backgroundColor: '#317AFF',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'baseline',
    borderRadius: 8,
    padding: 1,
    cursor: 'pointer',
    marginLeft: 1.5,
};
