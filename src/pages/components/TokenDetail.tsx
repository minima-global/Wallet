import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
} from '@mui/material';

import MinimaIcon from '../../assets/images/minimaLogoSquare200x200.png';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { BalanceUpdates } from '../../App';

import { copy as copyText } from '../../shared/functions';

const TokenDetail = () => {
    const { tokenid } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [failed, setFailed] = useState<boolean>(false);

    // Copy Feature
    const [copy, setCopy] = useState<boolean>(false);

    const [token, setToken] = useState<MinimaToken>();
    const [dimensions, setDimensions] = useState(128);

    const updates = useContext(BalanceUpdates); // balanceUpdates

    // handle description lines
    const [maxLines, setMaxLines] = useState<number>(3);

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
        // .then(() => {
        //     // If successful, update the isCopied state value
        //     setCopy(true);

        //     setTimeout(() => {
        //         setCopy(false);
        //     }, 1000);
        // })
        // .catch((err) => {
        //     console.log(err);
        // });
    };

    async function copyTextToClipboard(text: string) {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            alert('error');
            return document.execCommand('copy', true, text);
        }
    }

    useEffect(() => {
        // console.log('Run useEffect');

        if (updates && updates.length) {
            updates.forEach((b: MinimaToken) => {
                if (b.tokenid === tokenid) {
                    // console.log(b);
                    setToken(b);
                }
            });
        } else {
            callBalance()
                .then((data: any) => {
                    console.log('Balance', data);
                    {
                        data && data.length
                            ? data.forEach((b: MinimaToken) => {
                                  // console.log(`Running through balance`);
                                  if (b.tokenid === tokenid) {
                                      // console.log(b);
                                      setToken(b);
                                  }
                              })
                            : console.log(`Balance not found..`);
                    }
                    // setLoading(false);
                })
                .catch((err: Error) => {
                    setLoading(false);
                    setFailed(true);
                    console.error(err);
                });
        }

        setLoading(false);
        return () => {};
    }, [updates]);

    return (
        <Grid container spacing={2} sx={{ marginTop: 2, marginBottom: 2 }}>
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
                                            sx={{ height: dimensions, width: dimensions, margin: 3 }}
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

                                        <Typography variant="h2" sx={{ textAlign: 'center' }}>
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
                                                        <ListItemIcon
                                                            onClick={() => {
                                                                handleCopyBtn(token?.tokenid ? token?.tokenid : '');
                                                            }}
                                                            sx={[copyBtn, { backgroundColor: copy ? '#00B74A' : null }]}
                                                        >
                                                            {!copy ? (
                                                                <ContentCopyIcon sx={{ color: '#fff' }} />
                                                            ) : (
                                                                <FileCopyIcon sx={{ color: '#fff' }} />
                                                            )}
                                                        </ListItemIcon>
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
};
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
};

const valueStyle = {
    backgroundColor: '#fff',
    padding: 2,
    borderRadius: 1,
    overflowX: 'hidden',
    width: '100%',
};
const start = {
    flexDirection: 'column',
    alignItems: 'flex-start',
};
