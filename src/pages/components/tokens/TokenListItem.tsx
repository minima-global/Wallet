import { ListItemButton, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import MinimaIcon from '../../../assets/images/minimaLogoSquare.png';

const TokenListItem = ({ item, nav, mode }: any) => {
    let navigate = useNavigate();

    return (
        <ListItemButton key={item.tokenid} onClick={() => (nav ? navigate(`${item.tokenid}`) : null)}>
            <ListItemAvatar>
                <Avatar
                    variant="rounded"
                    src={item.tokenid === '0x00' ? MinimaIcon : null}
                    alt={item.token.name ? item.token.name : item.token}
                >
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
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                className="MiniListItem-typography"
                primary={item.token.name ? item.token.name : item.token}
                secondary={
                    mode === 1 || mode === undefined
                        ? item.sendable
                        : mode === 2
                        ? item.coins + ` ${item.coins > 1 ? 'coins' : 'coin'} available`
                        : null
                }
            />
        </ListItemButton>
    );
};

export default TokenListItem;
