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
import { callGetAddress } from '../minima/rpc-commands';
import { copy } from '../shared/functions';
import QRCode from 'react-qr-code';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { useNavigate } from 'react-router-dom';

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

    const navigate = useNavigate();

    useEffect(() => {
        callGetAddress()
            .then((res: any) => {
                // console.log('getaddress', res);
                setAddress(res.response.miniaddress);
                setLoading(false);
            })
            .catch((err: any) => {
                navigate('/offline');
                setLoading(false);

                console.error(`${err}`);
            });
    }, []);

    const handleCopyClick = () => {
        copy(address);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1500);
    };

    return (
        <Grid container spacing={0} mt={2}>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8} sx={{ textAlign: 'center' }}>
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
                                        <ContentCopyIcon sx={{ color: '#fff' }} />
                                    ) : (
                                        <FileCopyIcon sx={{ color: '#fff' }} />
                                    )}
                                </ListItemIcon>
                            </BootstrapTooltip>
                            <Typography sx={{ textAlign: 'left' }} variant="caption">
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
