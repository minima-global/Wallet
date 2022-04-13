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
    List,
    ListItem,
    ListItemText,
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
        <Grid container spacing={0} mt={2}>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? (
                    <CircularProgress size={32} />
                ) : (
                    <Card variant="outlined">
                        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                            <QRCode style={{ alignSelf: 'center' }} level="M" value={address} />

                            <List>
                                <ListItem>
                                    <ListItemText
                                        sx={{ wordBreak: 'break-word' }}
                                        primary="Wallet Address"
                                        secondary={address}
                                        primaryTypographyProps={{ fontWeight: 600 }}
                                    ></ListItemText>
                                </ListItem>
                            </List>
                            {/* disableHoverListener */}
                            <BootstrapTooltip placement="top-end" title={!isCopied ? 'Copy Address' : 'Copied!'}>
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
                            <Typography variant="caption">
                                Receive any Minima & network tokens with this address.
                            </Typography>
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
    padding: 0.5,
    cursor: 'pointer',
};
