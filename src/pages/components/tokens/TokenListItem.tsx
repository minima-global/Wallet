import { ListItemButton, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MinimaToken } from '../../../types/minima';
import { hexToString } from '../../../shared/functions';

import MinimaIcon from '../../../assets/images/minimaLogoSquare.png';

const TokenListItem = ({ item, nav }: any) => {
    let navigate = useNavigate();

    return (
        <ListItemButton key={item.tokenid} onClick={() => (nav ? navigate(`${item.tokenid}`) : null)}>
            <ListItemAvatar>
                <Avatar
                    src={
                        item.tokenid === '0x00'
                            ? MinimaIcon
                            : !item.token.url || item.token.url.length === 0
                            ? `https://robohash.org/${item.tokenid}`
                            : item.token.url && item.token.url.length > 0
                            ? hexToString(item.token.url)
                            : ''
                    }
                    alt={item.token.name ? item.token.name : item.token}
                />
            </ListItemAvatar>
            <ListItemText
                className="MiniListItem-typography"
                primary={item.token.name ? item.token.name : item.token}
                secondary={item.sendable}
            />
        </ListItemButton>
    );
};

export default TokenListItem;
