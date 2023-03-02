import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardContent, Avatar, Typography, Grid, CardMedia, Stack, Divider } from '@mui/material';

import {
    MiTokenName,
    MiTokenNameTicker,
    MiSkeleton,
    MiTokenListItem,
    MiTokenNameWrapper,
} from '../../shared/components/layout/MiToken';

import GridLayout from '../../layout/GridLayout';

import { useAppSelector } from '../../minima/redux/hooks';
import { selectTokenWithID } from '../../minima/redux/slices/balanceSlice';
import CustomListItem from '../../shared/components/CustomListItem';
import NFTAuthenticity from '../components/tokens/NFTAuthenticity';
import styles from './TokenDetail.module.css';

const TokenDetail = () => {
    const { tokenid } = useParams();
    const [enlargenCover, setEnlargenCover] = useState(false);

    const token = useAppSelector(selectTokenWithID(tokenid));
    const loading = typeof token === undefined;

    return (
        <>
            <GridLayout
                spacing={2}
                loading={loading}
                children={
                    <Grid container>
                        <Grid item xs={12}>
                            {token && (
                                <Card variant="outlined">
                                    <CardHeader
                                        title={
                                            <MiTokenListItem>
                                                {token.tokenid === '0x00' && (
                                                    <Avatar src="./assets/minimaLogoSquare.png" />
                                                )}
                                                {token.tokenid !== '0x00' && (
                                                    <Avatar
                                                        src={
                                                            token.token.url && token.token.url.length
                                                                ? token.token.url
                                                                : `https://robohash.org/${token.tokenid}`
                                                        }
                                                    />
                                                )}

                                                <Stack
                                                    spacing={0.3}
                                                    flexDirection="column"
                                                    alignItems="flex-start"
                                                    className={styles['token-name']}
                                                >
                                                    <MiTokenNameWrapper>
                                                        {token.tokenid === '0x00' && (
                                                            <MiTokenName>{token.token}</MiTokenName>
                                                        )}
                                                        {token.tokenid !== '0x00' && (
                                                            <MiTokenName>
                                                                {token.token.name ? token.token.name : 'N/A'}
                                                            </MiTokenName>
                                                        )}

                                                        {token.tokenid !== '0x00' && <NFTAuthenticity token={token} />}
                                                    </MiTokenNameWrapper>
                                                    {token.tokenid === '0x00' && (
                                                        <MiTokenNameTicker>MINIMA</MiTokenNameTicker>
                                                    )}
                                                    {token.tokenid !== '0x00' && (
                                                        <MiTokenNameTicker>
                                                            {token.token.ticker ? token.token.ticker : <MiSkeleton />}
                                                        </MiTokenNameTicker>
                                                    )}
                                                </Stack>
                                            </MiTokenListItem>
                                        }
                                    />

                                    {token.tokenid !== '0x00' && (
                                        <div
                                            onClick={() =>
                                                !enlargenCover ? setEnlargenCover(true) : setEnlargenCover(false)
                                            }
                                            className={!enlargenCover ? 'resize-wrapper' : 'resize-wrapper flex-right'}
                                        >
                                            <CardMedia
                                                component="img"
                                                height={enlargenCover ? '100%' : '194'}
                                                src={
                                                    token.tokenid === '0x00'
                                                        ? './assets/minimaLogoSquare.png'
                                                        : token.token.url && token.token.url.length > 0
                                                        ? token.token.url
                                                        : `https://robohash.org/${token?.tokenid}`
                                                }
                                                alt="Paella dish"
                                            />
                                            <Typography className="click-to-resize" variant="subtitle2">
                                                Click to resize
                                            </Typography>
                                        </div>
                                    )}

                                    <CardContent>
                                        <Stack spacing={2}>
                                            {token.tokenid === '0x00' && (
                                                <CustomListItem title="Name" value={token.token} />
                                            )}
                                            {token.tokenid !== '0x00' && (
                                                <CustomListItem
                                                    title="Name"
                                                    value={token.token.name ? token.token.name : 'N/A'}
                                                />
                                            )}

                                            {token.tokenid === '0x00' && (
                                                <CustomListItem title="Description" value="Minima's Official Token" />
                                            )}
                                            {token.tokenid !== '0x00' && (
                                                <CustomListItem
                                                    title="Description"
                                                    value={token.token.description ? token.token.description : 'N/A'}
                                                />
                                            )}

                                            <CustomListItem title="Total Minted" value={token.total} />

                                            <CustomListItem title="Token ID" value={token.tokenid} />

                                            <CustomListItem title="Coins" value={token.coins} />

                                            {token.tokenid !== '0x00' && (
                                                <CustomListItem
                                                    title="Web Validation"
                                                    value={
                                                        token.token.webvalidate && token.token.webvalidate.length
                                                            ? token.token.webvalidate
                                                            : 'N/A'
                                                    }
                                                />
                                            )}
                                        </Stack>

                                        <Divider sx={{ mt: 2 }}></Divider>
                                        <Stack mt={2} spacing={2}>
                                            <CustomListItem
                                                title="Sendable"
                                                value={token.sendable ? token.sendable : 'N/A'}
                                            />
                                            <CustomListItem
                                                title="Confirmed"
                                                value={token.confirmed ? token.confirmed : 'N/A'}
                                            />
                                            <CustomListItem
                                                title="Unconfirmed"
                                                value={token.unconfirmed ? token.unconfirmed : 'N/A'}
                                            />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}

                            {!token && (
                                <Stack m={2} textAlign="center">
                                    <p>
                                        Token details for <i>{tokenid}</i> not found
                                    </p>
                                    <p>Please go back and try again.</p>
                                </Stack>
                            )}
                        </Grid>
                    </Grid>
                }
            />
        </>
    );
};
export default TokenDetail;
