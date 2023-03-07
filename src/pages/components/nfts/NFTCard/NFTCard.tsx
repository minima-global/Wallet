import { useEffect, useState } from 'react';

import { Card, CardMedia, CardContent, Stack, Tooltip, styled, TooltipProps, tooltipClasses } from '@mui/material';
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
import VerifiedIcon from '@mui/icons-material/Verified';
import { callTokenValidate } from '../../../../minima/rpc-commands';

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
    const [tokenWebValidated, setTokenWebValidated] = useState(false);

    useEffect(() => {
        callTokenValidate(NFT.tokenid).then(() => {
            setTokenWebValidated(false);
        });
    }, []);

    // const listOfFavourites = useAppSelector<MinimaToken[] | undefined>(selectFavouriteNFTs);

    // const isFavourite =
    //     typeof listOfFavourites !== 'undefined'
    //         ? listOfFavourites.findIndex((t: MinimaToken) => t.tokenid === NFT.tokenid)
    //         : -1;

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

            <Stack spacing={3} flexDirection="row">
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
            </Stack>
        </NFTWrapper>
    );
};

export default NFTCard;
