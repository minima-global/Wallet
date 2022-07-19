import { MinimaToken } from '@minima-global/mds-api';
import { Card, CardMedia, CardContent, Typography, CardActions, Stack, Chip, Button, Box, Radio } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../minima/redux/hooks';
import {
    addFavouriteNFT,
    removeFromFavouriteNFT,
    selectFavouriteNFTs,
} from '../../../minima/redux/slices/balanceSlice';
import { ModalStackedCol, ModalStackedRow } from '../../../shared/components/modals/ModalWrappers';
import { hexToString } from '../../../shared/functions';
import styles from '../../../theme/cssmodule/Components.module.css';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { toggleNotification } from '../../../minima/redux/slices/notificationSlice';

const NFTCard = ({ NFT }: any) => {
    // console.log('NFT', NFT);
    const dispatch = useAppDispatch();

    const listOfFavourites = useAppSelector<MinimaToken[] | undefined>(selectFavouriteNFTs);

    // console.log(`ListOfFavourites`, listOfFavourites);

    const isFavourite =
        typeof listOfFavourites !== 'undefined'
            ? listOfFavourites.findIndex((t: MinimaToken) => t.tokenid === NFT.tokenid)
            : -1;
    // console.log(`IS FAVOURITED?`, isFavourite);

    let imageUrl = null; // populate with image if we have one, or keep null if we don't
    try {
        var parser = new DOMParser();
        const doc = parser.parseFromString(NFT.token.image, 'application/xml');
        const errorNode2 = doc.querySelector('parsererror');
        if (errorNode2) {
            console.error('Token does not contain an image: ' + NFT);
        } else {
            // console.log('parsing succeeded');
            var imageString = doc.getElementsByTagName('artimage')[0].innerHTML;
            imageUrl = `data:image/jpeg;base64,${imageString}`;
        }
    } catch (err) {
        console.error('Token does not contain an image: ' + NFT);
    }

    return (
        <Card variant="outlined" className={styles['nft-card']}>
            {/* <CardMedia src={hexToString(NFT.token.image)} component="img" /> */}
            {imageUrl ? <CardMedia image={imageUrl} component="img" height="194" /> : null}

            <CardContent>
                <ModalStackedRow
                    children={
                        <>
                            <Typography variant="body1">{NFT.token.name}</Typography>
                            <Typography variant="subtitle1">{NFT.total}</Typography>
                        </>
                    }
                />
            </CardContent>
            <CardActions className={styles['nft-card-actions']}>
                <Stack className={styles['nft-card-actions-buttons']} direction="row" spacing={1}>
                    <Box className={styles['nft-card-overlay']}>
                        <Stack justifyContent="flex-end" alignItems="flex-end" direction="row">
                            {isFavourite === -1 ? (
                                <FavoriteBorderIcon
                                    fontSize="large"
                                    color="inherit"
                                    onClick={() => {
                                        dispatch(addFavouriteNFT(NFT));
                                        dispatch(toggleNotification('Added to favorites!', 'success', 'success'));
                                    }}
                                />
                            ) : (
                                <FavoriteIcon
                                    fontSize="large"
                                    color="secondary"
                                    onClick={() => {
                                        dispatch(removeFromFavouriteNFT(NFT));
                                        dispatch(toggleNotification('Removed from favorites.', 'error', 'error'));
                                    }}
                                />
                            )}
                        </Stack>
                    </Box>
                    <Button
                        variant="outlined"
                        disableElevation
                        fullWidth
                        className={styles['nft-card-actions-buttons-btn']}
                    >
                        Details
                    </Button>
                    <Button
                        variant="contained"
                        disableElevation
                        color="primary"
                        fullWidth
                        className={styles['nft-card-actions-buttons-btn-trade']}
                    >
                        Trade
                    </Button>
                </Stack>
            </CardActions>
        </Card>
    );
};

export default NFTCard;
