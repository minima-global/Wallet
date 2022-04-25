import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { callBalance } from '../../minima/rpc-commands';
import { MinimaToken } from '../../types/minima';
import {
    Box,
    Card,
    CardContent,
    Avatar,
    Typography,
    Grid,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Fade,
    Tooltip,
    styled,
    TooltipProps,
    tooltipClasses,
} from '@mui/material';

import MinimaIcon from '../../assets/images/minimaLogoSquare200x200.png';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { BalanceUpdates } from '../../App';

import { copy as copyText } from '../../shared/functions';

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

const TokenDetail = () => {
    const { tokenid } = useParams();

    const navigate = useNavigate();

    // Copy Feature
    const [copy, setCopy] = useState<boolean>(false);

    const [dimensions, setDimensions] = useState(128);

    // balances context
    const balances = useContext(BalanceUpdates);
    const token = balances.find((b: MinimaToken) => b.tokenid === tokenid);
    if (typeof token === 'undefined') {
        console.error('can not find token ' + tokenid);
    }
    const loading = balances.length === 0;

    const handleAvatarDimensions = () => {
        if (dimensions === 128) {
            setDimensions(256);
        } else {
            setDimensions(128);
        }
    };

    const handleCopyBtn = (text: string) => {
        copyText(text);
        setCopy(true);
        setTimeout(() => setCopy(false), 1000);
    };

    return (
        <Grid container spacing={0} mt={2} mb={2}>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8} container spacing={2}>
                {loading ? (
                    <CircularProgress size={32} />
                ) : !loading && token !== undefined ? (
                    <>
                        <Grid item xs={12}>
                            <Fade in={true}>
                                <Card variant="outlined">
                                    <CardContent
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Avatar
                                            sx={{ height: dimensions, width: dimensions }}
                                            onClick={handleAvatarDimensions}
                                            src={
                                                token?.tokenid === '0x00'
                                                    ? MinimaIcon
                                                    : !token?.token.url || token?.token.url.length === 0
                                                    ? `https://robohash.org/${token?.tokenid}`
                                                    : token?.token.url && token?.token.url.length > 0
                                                    ? token.token.url
                                                    : ''
                                            }
                                            alt={token?.token.name ? token?.token.name : token?.token}
                                        />

                                        <Typography variant="h2" sx={{ textAlign: 'center' }} mt={2}>
                                            {token?.token.name ? token?.token.name : token?.token}
                                        </Typography>
                                        <Divider sx={{ margin: 1 }} />
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                letterSpacing: 1,
                                            }}
                                        >
                                            {token?.token.description ? token?.token.description : ''}
                                        </Typography>
                                        {/* <Button variant="text">Show More</Button> */}
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>

                        <Grid item xs={12}>
                            <Fade in={true}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <List>
                                            <ListItem sx={start}>
                                                <Typography variant="h2" sx={{ pL: 2 }}>
                                                    Name
                                                </Typography>
                                                <ListItemText
                                                    sx={{ width: '100%' }}
                                                    disableTypography
                                                    secondary={
                                                        <Typography variant="subtitle1" sx={valueStyle}>
                                                            {token?.token.name ? token?.token.name : token?.token}
                                                        </Typography>
                                                    }
                                                ></ListItemText>
                                            </ListItem>
                                            <ListItem sx={start}>
                                                <Typography variant="h2" sx={{ pL: 2 }}>
                                                    Total Minted
                                                </Typography>
                                                <ListItemText
                                                    sx={{ width: '100%' }}
                                                    disableTypography
                                                    secondary={
                                                        <Typography variant="subtitle1" sx={valueStyle}>
                                                            {token?.total ? token?.total : '0'}
                                                        </Typography>
                                                    }
                                                ></ListItemText>
                                            </ListItem>
                                            <ListItem sx={start}>
                                                <Typography variant="h2" sx={{ pL: 2 }}>
                                                    Token ID
                                                </Typography>
                                                <Box sx={[copyRow, { width: '100%' }]}>
                                                    <ListItemText
                                                        sx={{
                                                            display: 'flex',
                                                            flex: '0 0 100%',
                                                            flexDirection: 'row-reverse',
                                                            width: '100%',
                                                        }}
                                                        disableTypography
                                                        secondary={
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={[
                                                                    valueStyle,
                                                                    {
                                                                        borderTopRightRadius: 0,
                                                                        borderBottomRightRadius: 0,
                                                                    },
                                                                ]}
                                                            >
                                                                {token?.tokenid ? token?.tokenid : '0x00'}
                                                            </Typography>
                                                        }
                                                    >
                                                        <BootstrapTooltip
                                                            placement="top-end"
                                                            title={!copy ? 'Copy TokenID' : 'Copied!'}
                                                        >
                                                            <ListItemIcon
                                                                onClick={() => {
                                                                    handleCopyBtn(token?.tokenid ? token?.tokenid : '');
                                                                }}
                                                                sx={[
                                                                    copyBtn,
                                                                    { backgroundColor: copy ? '#00B74A' : null },
                                                                ]}
                                                            >
                                                                {!copy ? (
                                                                    <ContentCopyIcon sx={{ color: '#fff' }} />
                                                                ) : (
                                                                    <FileCopyIcon sx={{ color: '#fff' }} />
                                                                )}
                                                            </ListItemIcon>
                                                        </BootstrapTooltip>
                                                    </ListItemText>
                                                </Box>
                                            </ListItem>
                                        </List>
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>

                        <Grid item xs={12}>
                            <Fade in={true}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <List>
                                            <ListItem sx={start}>
                                                <Typography variant="h2" sx={{ pL: 2 }}>
                                                    Confirmed
                                                </Typography>
                                                <ListItemText
                                                    sx={{ width: '100%' }}
                                                    disableTypography
                                                    secondary={
                                                        <Typography variant="subtitle1" sx={valueStyle}>
                                                            {token?.confirmed ? token?.confirmed : 0}
                                                        </Typography>
                                                    }
                                                ></ListItemText>
                                            </ListItem>
                                            <ListItem sx={start}>
                                                <Typography variant="h2" sx={{ pL: 2 }}>
                                                    Unconfirmed
                                                </Typography>
                                                <ListItemText
                                                    sx={{ width: '100%' }}
                                                    disableTypography
                                                    secondary={
                                                        <Typography variant="subtitle1" sx={valueStyle}>
                                                            {token?.unconfirmed ? token?.unconfirmed : '0'}
                                                        </Typography>
                                                    }
                                                ></ListItemText>
                                            </ListItem>
                                            <ListItem sx={start}>
                                                <Typography variant="h2" sx={{ pL: 2 }}>
                                                    Sendable
                                                </Typography>
                                                <ListItemText
                                                    sx={{ width: '100%' }}
                                                    disableTypography
                                                    secondary={
                                                        <Typography variant="subtitle1" sx={valueStyle}>
                                                            {token?.sendable ? token?.sendable : '0'}
                                                        </Typography>
                                                    }
                                                ></ListItemText>
                                            </ListItem>
                                        </List>
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>
                    </>
                ) : (
                    <Grid
                        item
                        xs={12}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <ThumbDownOffAltIcon sx={{ color: '#317AFF' }} />
                        <Typography variant="subtitle1">Token not found!</Typography>
                    </Grid>
                )}
            </Grid>
            <Grid item xs={0} md={2}></Grid>
        </Grid>
    );
};;
export default TokenDetail;

const copyRow = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 0,
};
const copyBtn = {
    backgroundColor: '#317AFF',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    cursor: 'pointer',
};

const valueStyle = {
    backgroundColor: '#fff',
    padding: 2,
    borderRadius: 1,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
};
const start = {
    flexDirection: 'column',
    alignItems: 'flex-start',
};
