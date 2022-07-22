import { ListItemButton, ListItemAvatar, Avatar, ListItemText, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import MinimaIcon from '../../../assets/images/minimaLogoSquare.png';

const TokenListItem = ({ item, nav, mode }: any) => {
    let navigate = useNavigate();
    // console.log(item);
    let imageUrl = null; // populate with image if we have one, or keep null if we don't
    try {
        if (item.token.nft && item.token.image) {
            var parser = new DOMParser();
            const doc = parser.parseFromString(item.token.image, 'application/xml');
            const errorNode2 = doc.querySelector('parsererror');
            if (errorNode2) {
                console.error('Token does not contain an image: ' + item);
            } else {
                // console.log('parsing succeeded');
                var imageString = doc.getElementsByTagName('artimage')[0].innerHTML;
                imageUrl = `data:image/jpeg;base64,${imageString}`;
            }
        }
    } catch (err) {
        console.error('Token does not contain an image: ' + item);
    }

    return (
        <ListItemButton key={item.tokenid} onClick={() => (nav ? navigate(`${item.tokenid}`) : null)}>
            <ListItemAvatar>
                <Avatar
                    variant="rounded"
                    src={item.tokenid === '0x00' ? MinimaIcon : null}
                    alt={item.token.name ? item.token.name : item.token}
                >
                    {item.token.nft && imageUrl ? (
                        <CardMedia component="img" image={imageUrl} height={194} />
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
