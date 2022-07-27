import React from 'react';
import { MinimaToken } from '@minima-global/mds-api';
import { Box, Card, CardMedia, CardContent, Typography, CardActions, Stack, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../minima/redux/hooks';
import {
    addFavoritesTableAndUpdate,
    removeFromFavoritesTableAndUpdate,
    selectFavouriteNFTs,
} from '../../../minima/redux/slices/balanceSlice';
import { ModalStackedRow } from '../../../shared/components/modals/ModalWrappers';

import styles from '../../../theme/cssmodule/Components.module.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { toggleNotification } from '../../../minima/redux/slices/notificationSlice';
import { useNavigate } from 'react-router-dom';

import VerifiedIcon from '@mui/icons-material/Verified';
import NFTAuthenticity from '../tokens/NFTAuthenticity';

const NFTCard = ({ NFT }: any) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const listOfFavourites = useAppSelector<MinimaToken[] | undefined>(selectFavouriteNFTs);

    const isFavourite =
        typeof listOfFavourites !== 'undefined'
            ? listOfFavourites.findIndex((t: MinimaToken) => t.tokenid === NFT.tokenid)
            : -1;

    let imageUrl = undefined; // populate with image if we have one, or keep null if we don't
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
            {imageUrl ? (
                <CardMedia className={styles['fix-aspect-ratio']} image={imageUrl} component="img" height="181px" />
            ) : typeof imageUrl === 'undefined' &&
              typeof NFT.token === 'object' &&
              NFT.token.hasOwnProperty('url') &&
              NFT.token.url.length > 0 ? (
                <CardMedia component="img" aria-label="NFT-url-image" src={NFT.token.url} />
            ) : (
                <CardMedia component="img" aria-label="NFT-url-image" src={`https://robohash.org/${NFT.tokenid}`} />
            )}

            <CardContent>
                <ModalStackedRow
                    children={
                        <>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Typography variant="h6" className={styles['nft-title']}>
                                    {NFT.token.name}
                                </Typography>
                                <NFTAuthenticity NFT={NFT} />
                            </Stack>
                            <Typography className={styles['nft-owner']} variant="caption">
                                {NFT.token.owner && NFT.token.owner.length
                                    ? 'Created by ' + NFT.token.owner
                                    : 'Created by anonymous'}
                            </Typography>
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
                                    className={styles['heart']}
                                    fontSize="large"
                                    color="inherit"
                                    onClick={() => {
                                        dispatch(addFavoritesTableAndUpdate(NFT.tokenid));
                                        dispatch(toggleNotification('Added to favorites!', 'success', 'success'));
                                    }}
                                />
                            ) : (
                                <FavoriteIcon
                                    className={styles['heart']}
                                    fontSize="large"
                                    color="secondary"
                                    onClick={() => {
                                        dispatch(removeFromFavoritesTableAndUpdate(NFT.tokenid));
                                        dispatch(toggleNotification('Removed from favorites.', 'error', 'error'));
                                    }}
                                />
                            )}
                        </Stack>
                    </Box>
                    <Button
                        onClick={() => navigate(`${NFT.tokenid}`, { replace: false })}
                        variant="outlined"
                        disableElevation
                        fullWidth
                        className={styles['nft-card-actions-buttons-btn']}
                    >
                        Details
                    </Button>
                    <Button
                        onClick={() => navigate(`/send/${NFT.tokenid}`, { replace: false })}
                        variant="contained"
                        disableElevation
                        color="primary"
                        fullWidth
                        className={styles['nft-card-actions-buttons-btn-trade']}
                    >
                        Transfer
                    </Button>
                </Stack>
            </CardActions>
        </Card>
    );
};

export default NFTCard;
