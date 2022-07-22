import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    Avatar,
    Typography,
    Grid,
    CardMedia,
    Fade,
    Stack,
    Divider,
} from '@mui/material';

import MinimaIcon from '../../assets/images/minimaLogoSquare.png';
import { ReactComponent as MinimaSquareIcon } from '../../assets/images/minimaLogoSquare.svg';

import GridLayout from './GridLayout';

import { useAppSelector } from '../../minima/redux/hooks';
import { selectTokenWithID } from '../../minima/redux/slices/balanceSlice';
import CustomListItem from '../../shared/components/CustomListItem';

const TokenDetail = () => {
    const { tokenid } = useParams();

    const [enlargenCover, setEnlargenCover] = useState(false);

    // Copy Feature
    const [copy, setCopy] = useState<boolean>(false);

    // const token = balances.find((b: MinimaToken) => b.tokenid === tokenid);
    const token = useAppSelector(selectTokenWithID(typeof tokenid !== 'undefined' ? tokenid : ''));

    if (typeof token === 'undefined') {
        console.error('can not find token ' + tokenid);
    }
    const loading = typeof token === 'undefined';

    return (
        <>
            <GridLayout
                spacing={2}
                loading={loading}
                children={
                    typeof token !== 'undefined' ? (
                        <Grid container>
                            <Grid item xs={12}>
                                <Fade in={true}>
                                    <Card variant="outlined">
                                        <CardHeader
                                            avatar={
                                                token.tokenid === '0x00' ? (
                                                    <MinimaSquareIcon className="minima-icon" />
                                                ) : (
                                                    <Avatar
                                                        variant="rounded"
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
                                                )
                                            }
                                            title={token?.token.name ? token.token.name : token.token}
                                            subheader={
                                                token?.token.description
                                                    ? token.token.description
                                                    : token.tokenid === '0x00'
                                                    ? 'Official Minima Token'
                                                    : null
                                            }
                                        />
                                        {token.tokenid !== '0x00' ? (
                                            <div
                                                onClick={() =>
                                                    !enlargenCover ? setEnlargenCover(true) : setEnlargenCover(false)
                                                }
                                                className={
                                                    !enlargenCover ? 'resize-wrapper' : 'resize-wrapper flex-right'
                                                }
                                            >
                                                <CardMedia
                                                    component="img"
                                                    height={enlargenCover ? '100%' : '194'}
                                                    src={
                                                        token?.tokenid === '0x00'
                                                            ? MinimaIcon
                                                            : !token?.token.url || token?.token.url.length === 0
                                                            ? `https://robohash.org/${token?.tokenid}`
                                                            : token?.token.url && token?.token.url.length > 0
                                                            ? token.token.url
                                                            : ''
                                                    }
                                                    alt="Paella dish"
                                                />
                                                <Typography className="click-to-resize" variant="subtitle2">
                                                    Click to resize
                                                </Typography>
                                            </div>
                                        ) : null}
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <CustomListItem
                                                    title="Name"
                                                    value={token?.token.name ? token?.token.name : token?.token}
                                                />
                                                <CustomListItem
                                                    title="Total Minted"
                                                    value={token?.total ? token?.total : '0'}
                                                />
                                                <CustomListItem
                                                    title="Token ID"
                                                    value={token?.tokenid ? token?.tokenid : '0x00'}
                                                />
                                                <CustomListItem title="Coins" value={token.coins} />
                                            </Stack>

                                            <Divider sx={{ mt: 2 }}></Divider>
                                            <Stack mt={2} spacing={2}>
                                                <CustomListItem
                                                    title="Sendable"
                                                    value={token?.sendable ? token?.sendable : 0}
                                                />
                                                <CustomListItem
                                                    title="Confirmed"
                                                    value={token?.confirmed ? token?.confirmed : 0}
                                                />
                                                <CustomListItem
                                                    title="Unconfirmed"
                                                    value={token?.unconfirmed ? token?.unconfirmed : '0'}
                                                />
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>
                        </Grid>
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
                            <Typography variant="subtitle2">Token not found</Typography>
                        </Grid>
                    )
                }
            />
        </>
    );
};
export default TokenDetail;
