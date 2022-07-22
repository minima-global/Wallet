import React from 'react';
import { MinimaToken } from '@minima-global/mds-api';
import { Box, Card, CardMedia, CardContent, Typography, CardActions, Stack, Button, Radio } from '@mui/material';
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
import { callTokenValidate } from '../../../minima/rpc-commands';

import VerifiedIcon from '@mui/icons-material/Verified';

const NFTCard = ({ NFT }: any) => {
    // console.log('NFT', NFT);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isTokenValidated, setIsTokenValidated] = React.useState(false);

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
    React.useEffect(() => {
        if (NFT && NFT.tokenid) {
            callTokenValidate(NFT.tokenid)
                .then((res: any) => {
                    // console.log(`callTokenValidate`, res);
                    if (res.status) {
                        if (res.response.web.valid) {
                            // is valid token
                            setIsTokenValidated(true);
                        }
                    }
                })
                .catch((err) => {
                    console.error(`callTokenValidate with ${NFT.tokenid}`, err);
                });
        }
    }, [NFT]);

    return (
        <Card variant="outlined" className={styles['nft-card']}>
            {/* <CardMedia src={hexToString(NFT.token.image)} component="img" /> */}
            {imageUrl ? <CardMedia image={imageUrl} component="img" height="194" /> : null}

            <CardContent>
                <ModalStackedRow
                    children={
                        <>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Typography variant="h6" className={styles['nft-title']}>
                                    {NFT.token.name}
                                </Typography>
                                {isTokenValidated ? <VerifiedIcon fontSize="inherit" color="primary" /> : null}
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
