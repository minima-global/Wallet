import { ListItemButton, ListItemAvatar, Avatar, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import MinimaIcon from '../../../assets/images/minimaLogoSquare.png';
import TokenAuthenticity from '../tokens/NFTAuthenticity';
import Ticker from './Ticker';
import styles from '../../../theme/cssmodule/Components.module.css';

const TokenListItem = ({ item, nav, mode }: any) => {
    let navigate = useNavigate();
    return (
        <ListItemButton
            className={styles['noWrap']}
            key={item.tokenid}
            onClick={() => (nav ? navigate(`${item.tokenid}`) : null)}
        >
            <ListItemAvatar>
                {/* <Avatar variant="rounded" src={item.tokenid === '0x00' ? MinimaIcon : null}>
                    {item.token.type && imageUrl ? (
                        <Avatar variant="rounded" src={imageUrl} />
                    ) : (
                        <img
                            className="MiniTokenListItem-img"
                            src={
                                item.tokenid !== '0x00' && !item.token.url
                                    ? `https://robohash.org/${item.tokenid}`
                                    : item.token.url && item.token.url.length > 0
                                    ? item.token.url
                                    : ''
                            }
                        />
                    )}
                </Avatar> */}
            </ListItemAvatar>
            <Stack className={styles['noWrap']}>
                <Stack className={styles['noWrap']} direction="row" alignItems="center" spacing={0.5}>
                    <Typography noWrap={true} variant="body2">
                        {item.token && typeof item.token === 'object' && item.token.hasOwnProperty('name')
                            ? item.token.name
                            : item.token && typeof item.token === 'string'
                            ? item.token
                            : 'Invalid name'}
                    </Typography>
                    <TokenAuthenticity NFT={item} />
                </Stack>
                {typeof item.token === 'object' && item.token.hasOwnProperty('ticker') && item.token.ticker ? (
                    <Ticker symbol={item.token.ticker} />
                ) : item.tokenid === '0x00' ? (
                    <Ticker symbol={'MINIMA'} />
                ) : null}
                <Typography noWrap={true} variant="subtitle2">
                    {mode === 1 || mode === undefined
                        ? item.sendable
                        : mode === 2
                        ? item.coins + ` ${item.coins > 1 ? 'coins' : 'coin'} available`
                        : null}
                </Typography>
            </Stack>
        </ListItemButton>
    );
};

export default TokenListItem;
