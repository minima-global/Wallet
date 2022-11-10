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
    Skeleton,
    Chip,
} from '@mui/material';

import MinimaIcon from '../assets/images/minimaLogoSquare.png';
import { ReactComponent as MinimaSquareIcon } from '../assets/images/minimaLogoSquare.svg';

import GridLayout from '../layout/GridLayout';

import { useAppSelector } from '../minima/redux/hooks';
import { selectTokenWithID } from '../minima/redux/slices/balanceSlice';
import CustomListItem from '../shared/components/CustomListItem';
import Ticker from './components/tokens/Ticker';
import TokenAuthenticity from './components/tokens/NFTAuthenticity';
import { MiCustomToken, MiNFT } from '../minima/types/nft';

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
                                            avatar={
                                                token.tokenid === '0x00' ? (
                                                    <MinimaSquareIcon className="minima-icon" />
                                                ) : token.tokenid !== '0x00' &&
                                                  (isNFT(token.token) || isToken(token.token)) &&
                                                  imageUrl ? (
                                                    <Avatar variant="rounded" src={imageUrl} />
                                                ) : token.tokenid !== '0x00' &&
                                                  (isToken(token.token) || isNFT(token.token)) ? (
                                                    <Avatar
                                                        variant="rounded"
                                                        src={
                                                            !token?.token.url || token?.token.url.length === 0
                                                                ? `https://robohash.org/${token?.tokenid}`
                                                                : token?.token.url && token?.token.url.length > 0
                                                                ? token.token.url
                                                                : ''
                                                        }
                                                        alt={token?.token.name}
                                                    />
                                                ) : null
                                            }
                                            title={
                                                <Stack>
                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                        <Typography variant="body2">
                                                            {(token.tokenid !== '0x00' && isNFT(token.token)) ||
                                                            (token.tokenid !== '0x00' && isToken(token.token))
                                                                ? token?.token.name
                                                                : token?.token}
                                                        </Typography>
                                                        <TokenAuthenticity NFT={token} />
                                                    </Stack>

                                                    {token.tokenid !== '0x00' &&
                                                    isToken(token.token) &&
                                                    token.token.hasOwnProperty('ticker') &&
                                                    token.token.ticker ? (
                                                        <Ticker symbol={token.token.ticker} />
                                                    ) : token.tokenid === '0x00' ? (
                                                        <Ticker symbol={'MINIMA'} />
                                                    ) : null}
                                                </Stack>
                                            }
                                            subheader={
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                    justifyContent="flex-start"
                                                >
                                                    <Typography variant="body1" sx={{ fontSize: '0.8rem' }}>
                                                        {token?.token.description
                                                            ? token.token.description
                                                            : token.tokenid === '0x00'
                                                            ? 'Official Minima Coin'
                                                            : null}
                                                    </Typography>
                                                    {token.tokenid === '0x00' ? (
                                                        <Chip label="Testnet" size="small" color="secondary" />
                                                    ) : null}
                                                </Stack>
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
                                                    //  Minima -> MinimaIcon
                                                    // imageUrl -> imageUrl
                                                    // url -> url
                                                    // fallback robohash -> `https://robohash.org/${token?.tokenid}`
                                                    src={
                                                        token.tokenid === '0x00'
                                                            ? MinimaIcon
                                                            : imageUrl
                                                            ? imageUrl
                                                            : token.token.url
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
