import { Card, CardMedia, CardContent, Stack } from '@mui/material';
import { useAppDispatch } from '../../../../minima/redux/hooks';

import styles from './NFTCard.module.css';
import { useNavigate } from 'react-router-dom';
import { Token } from '../../../../@types/minima';
import { makeTokenImage } from '../../../../shared/functions';
import NFTImage from '../NFTImage';
import NFTWrapper from '../NFTWrapper';
import ViewButton from '../ViewButton';
import NFTImageWrapper from '../NFTImageWrapper';
import NFTDescription from '../NFTDescription';

interface IProps {
    NFT: Token;
}
const NFTCard = ({ NFT }: IProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    console.log('NFt', NFT);

    // const listOfFavourites = useAppSelector<MinimaToken[] | undefined>(selectFavouriteNFTs);

    // const isFavourite =
    //     typeof listOfFavourites !== 'undefined'
    //         ? listOfFavourites.findIndex((t: MinimaToken) => t.tokenid === NFT.tokenid)
    //         : -1;

    return (
        <NFTWrapper>
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

            <Stack spacing={3}>
                <NFTDescription>
                    <label>{NFT.name.name}</label>
                    <p>{'owner' in NFT.name && !!NFT.name.owner.length && 'by ' + NFT.name.owner}</p>
                </NFTDescription>
            </Stack>
        </NFTWrapper>
    );
};

export default NFTCard;
