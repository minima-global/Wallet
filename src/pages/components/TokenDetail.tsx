import { useEffect, useState } from 'react';
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
} from '@mui/material';

import MinimaIcon from '../../assets/images/minimaLogoSquare200x200.png';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileCopyIcon from '@mui/icons-material/FileCopy';

const TokenDetail = () => {
    const { tokenid } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [failed, setFailed] = useState<boolean>(false);

    // Copy Feature
    const [copy, setCopy] = useState<boolean>(false);

    const [token, setToken] = useState<MinimaToken>();
    const [dimensions, setDimensions] = useState(128);

    // handle description lines
    const [maxLines, setMaxLines] = useState<number>(3);

    const handleAvatarDimensions = () => {
        if (dimensions === 128) {
            setDimensions(256);
        } else {
            setDimensions(128);
        }
    };

    const handleCopyBtn = () => {
        setCopy(true);
        setTimeout(() => {
            setCopy(false);
        }, 1000);
    };

    console.log(`tokenid`, tokenid);

    useEffect(() => {
        console.log('Run useEffect');
        callBalance()
            .then((data: any) => {
                console.log('Run callBalance');

                data.response.forEach((b: MinimaToken) => {
                    console.log(`Running through balance`);
                    if (b.tokenid === tokenid) {
                        console.log(b);
                        setToken(b);
                    }
                });
                setLoading(false);
            })
            .catch((err: Error) => {
                setLoading(false);
                setFailed(true);
                console.error(err);
            });
        setLoading(false);
        return () => {};
    }, []);

    return (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8} container spacing={2}>
                {loading ? (
                    <CircularProgress size={32} />
                ) : (
                    <>
                        <Grid item xs={12}>
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
                                                : !token?.token.icon || token?.token.icon.length === 0
                                                ? `https://robohash.org/${token?.tokenid}`
                                                : token?.token.icon && token?.token.icon
                                                ? token.token.icon
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
                        </Grid>

                        <Grid item xs={12}>
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
                                                        width: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'row-reverse',
                                                    }}
                                                    disableTypography
                                                    secondary={
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={[
                                                                valueStyle,
                                                                { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
                                                            ]}
                                                        >
                                                            {token?.tokenid ? token?.tokenid : '0x00'}
                                                        </Typography>
                                                    }
                                                >
                                                    <ListItemIcon
                                                        onClick={() => {
                                                            setCopy(true);
                                                            setTimeout(() => {
                                                                setCopy(false);
                                                            }, 1000);
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
                        </Grid>
                    </>
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
};
const start = {
    flexDirection: 'column',
    alignItems: 'flex-start',
};
