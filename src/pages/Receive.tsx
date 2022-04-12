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
                        <CardContent>
                            <Grid container justifyContent="center" sx={{ mt: 5 }}>
                                <Grid item>
                                    <QRCode level="M" value={address} />
                                </Grid>
                            </Grid>

                            <Typography sx={{ mt: 3, mb: 1 }} variant="h2">
                                Wallet Address
                            </Typography>
                            <Typography variant="body1" sx={{ wordWrap: 'break-word', mb: 1 }}>
                                {address}
                            </Typography>
                            <Chip
                                color="primary"
                                label={!isCopied ? 'Copy' : 'Copied'}
                                onClick={handleCopyClick}
                            ></Chip>
                        </CardContent>
                    </Card>
                )}
            </Grid>
            <Grid item xs={0} md={2}></Grid>
        </Grid>
    );
};

export default Receive;
