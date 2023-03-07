import { useEffect, useState } from 'react';

import { Stack, Tooltip, styled, TooltipProps, tooltipClasses } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../minima/redux/hooks';

import styles from './NFTCard.module.css';
import { useNavigate } from 'react-router-dom';
import { Token } from '../../../../@types/minima';
import { makeTokenImage } from '../../../../shared/functions';
import NFTImage from '../NFTImage';
import NFTWrapper from '../NFTWrapper';
import NFTImageWrapper from '../NFTImageWrapper';
import NFTDescription from '../NFTDescription';
import VerifiedIcon from '@mui/icons-material/Verified';
import * as RPC from '../../../../minima/commands';
import {
    addFavoritesTableAndUpdate,
    removeFromFavoritesTableAndUpdate,
    selectFavouriteNFTs,
} from '../../../../minima/redux/slices/balanceSlice';
import { FavoriteOutlined } from '@mui/icons-material';
import { toggleNotification } from '../../../../minima/redux/slices/notificationSlice';

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
    },
}));

interface IProps {
    NFT: Token;
}
const NFTCard = ({ NFT }: IProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [tokenWebValidated, setTokenWebValidated] = useState(false);
    const [isFavorited, setFavorited] = useState(false);
    const myFavoritedNFTs = useAppSelector(selectFavouriteNFTs);

    useEffect(() => {
        RPC.tokenValidate(NFT.tokenid).then(() => {
            setTokenWebValidated(false);
        });
    }, []);

    useEffect(() => {
        const userHasFavorited = myFavoritedNFTs.findIndex((t) => t.tokenid === NFT.tokenid);

        if (userHasFavorited !== -1) {
            return setFavorited(true);
        }

        setFavorited(false);
    }, [myFavoritedNFTs]);

    return (
        <NFTWrapper onClick={() => navigate(NFT.tokenid)}>
            {'url' in NFT.name && !!NFT.name.url.length && (
                <NFTImageWrapper>
                    <NFTImage
                        src={
                            NFT.name.url.startsWith('<artimage>', 0)
                                ? makeTokenImage(NFT.name.url, NFT.tokenid)
                                : NFT.name.url
                        }
                    />
                </NFTImageWrapper>
            )}
            {'url' in NFT.name && !NFT.name.url.length && (
                <NFTImageWrapper>
                    <NFTImage src={`https://robohash.org/${NFT.tokenid}`} />
                </NFTImageWrapper>
            )}
            {'url' in NFT.name === false && (
                <NFTImageWrapper>
                    <NFTImage src={`https://robohash.org/${NFT.tokenid}`} />
                </NFTImageWrapper>
            )}

            <Stack spacing={3} flexDirection="row" justifyContent="space-between" alignItems="center">
                <NFTDescription>
                    <label>
                        {NFT.name.name}
                        {tokenWebValidated && (
                            <BootstrapTooltip
                                placement="top-end"
                                title={'NFT has been validated, ' + NFT.name.webvalidate}
                            >
                                <VerifiedIcon fontSize="inherit" color="primary" />
                            </BootstrapTooltip>
                        )}
                    </label>
                    <p>{'owner' in NFT.name && !!NFT.name.owner.length && 'by ' + NFT.name.owner}</p>
                </NFTDescription>
                {!!isFavorited && (
                    <FavoriteOutlined
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(removeFromFavoritesTableAndUpdate(NFT.tokenid));
                            dispatch(toggleNotification('Removed from favorites.', 'error', 'error'));
                        }}
                        className={styles['heart']}
                    />
                )}
                {!isFavorited && (
                    <FavoriteOutlined
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(addFavoritesTableAndUpdate(NFT.tokenid));
                            dispatch(toggleNotification('Added to favorites!', 'success', 'success'));
                        }}
                        className={styles['heart-not']}
                    />
                )}
            </Stack>
        </NFTWrapper>
    );
};

export default NFTCard;
