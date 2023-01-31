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

import {
    MiTokenName,
    MiTokenNameTicker,
    MiSkeleton,
    MiTokenListItem,
    MiTokenNameWrapper,
    MiTestnet,
} from '../shared/components/layout/MiToken';

import MinimaIcon from '../assets/images/minimaLogoSquare.png';

import GridLayout from '../layout/GridLayout';

import { useAppSelector } from '../minima/redux/hooks';
import { selectTokenWithID } from '../minima/redux/slices/balanceSlice';
import CustomListItem from '../shared/components/CustomListItem';
import styles from './tokendetail/TokenDetail.module.css';

import { MiCustomToken, MiNFT } from '../@types/nft';
import { MINIMA__TOKEN_ID } from '../shared/constants';
import NFTAuthenticity from './components/tokens/NFTAuthenticity';

function isToken(obj: any): obj is MiCustomToken {
    return 'name' in obj && 'url' in obj && 'description' && 'type' in obj;
}

function isNFT(obj: any): obj is MiNFT {
    return (
        'name' in obj &&
        'url' in obj &&
        'description' in obj &&
        'type' in obj &&
        'webvalidate' in obj &&
        'owner' in obj &&
        'external_url' in obj
    );
}

// a token can be a Minima token, a customTokenJson or NFT
const TokenDetail = () => {
    const { tokenid } = useParams();
    const [enlargenCover, setEnlargenCover] = useState(false);

    // Fetch the right token w tokenid
    const token = useAppSelector(selectTokenWithID(tokenid ? tokenid : ''));
    // set loading to true if undefined..
    const loading = typeof token === 'undefined';

    return (
        <>
            <GridLayout
                spacing={2}
                loading={loading}
                children={
                    (token && token.tokenid !== '0x00' && isToken(token.token)) ||
                    (token && token.tokenid !== '0x00' && isNFT(token.token)) ||
                    (token && token.tokenid === '0x00') ? (
                        <Grid container>
                            <Grid item xs={12}>
                                <Fade in={true}>
                                    <Card variant="outlined">
                                        <CardHeader
                                            title={
                                                <MiTokenListItem>
                                                    <Avatar
                                                        sx={{
                                                            width: '56px',
                                                            height: '56px',
                                                            background: '#fff',
                                                        }}
                                                        className={styles['avatar']}
                                                        variant="rounded"
                                                        src={
                                                            token.tokenid === MINIMA__TOKEN_ID
                                                                ? MinimaIcon
                                                                : token.token.url && token.token.url.length
                                                                ? token.token.url
                                                                : `https://robohash.org/${token.tokenid}`
                                                        }
                                                    />
                                                    <Stack
                                                        spacing={0.3}
                                                        flexDirection="column"
                                                        alignItems="flex-start"
                                                        sx={{ textOverflow: 'ellipsis' }}
                                                    >
                                                        <MiTokenNameWrapper>
                                                            <MiTokenName>
                                                                {typeof token.token == 'string'
                                                                    ? token.token
                                                                    : token.token.name}
                                                            </MiTokenName>
                                                            {token.tokenid !== MINIMA__TOKEN_ID ? (
                                                                <NFTAuthenticity token={token} />
                                                            ) : null}
                                                            {/* {token.tokenid === MINIMA__TOKEN_ID ? (
                                                                <MiTestnet>Testnet</MiTestnet>
                                                            ) : null} */}
                                                        </MiTokenNameWrapper>
                                                        <MiTokenNameTicker>
                                                            {token.tokenid === '0x00' ? (
                                                                'MINIMA'
                                                            ) : token.token.ticker ? (
                                                                token.token.ticker
                                                            ) : (
                                                                <MiSkeleton />
                                                            )}
                                                        </MiTokenNameTicker>
                                                    </Stack>
                                                </MiTokenListItem>
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
                                                        token.tokenid === '0x00'
                                                            ? MinimaIcon
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

                                                {(token.tokenid !== '0x00' && isToken(token.token)) ||
                                                (token.tokenid !== '0x00' &&
                                                    isNFT(token.token) &&
                                                    token.token.hasOwnProperty('webvalidate')) ? (
                                                    <CustomListItem
                                                        title="Web Validation"
                                                        value={
                                                            token.token.webvalidate && token.token.webvalidate.length
                                                                ? token.token.webvalidate
                                                                : 'No web validation available.'
                                                        }
                                                    />
                                                ) : null}
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
                            <Typography variant="subtitle2">Token type is not supported.</Typography>
                        </Grid>
                    )
                }
            />
        </>
    );
};
export default TokenDetail;
