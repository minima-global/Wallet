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

import NFTAuthenticity from '../tokens/NFTAuthenticity';
import { MinimaToken } from '../../../minima/types/minima2';

const NFTCard = ({ NFT }: any) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const listOfFavourites = useAppSelector<MinimaToken[] | undefined>(selectFavouriteNFTs);

    const isFavourite =
        typeof listOfFavourites !== 'undefined'
            ? listOfFavourites.findIndex((t: MinimaToken) => t.tokenid === NFT.tokenid)
            : -1;

    return (
        <Card variant="outlined" className={styles['nft-card']}>
            {NFT.token.url && NFT.token.url.length ? (
                <CardMedia
                    className={styles['fix-aspect-ratio']}
                    image={NFT.token.url}
                    component="img"
                    height="181px"
                />
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
                                <NFTAuthenticity token={NFT} />
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
