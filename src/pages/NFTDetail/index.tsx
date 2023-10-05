import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Link, Stack, Button, styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import GridLayout from '../../layout/GridLayout';
import { useAppSelector } from '../../minima/redux/hooks';
import VerifiedIcon from '@mui/icons-material/Verified';

import { Token } from '../../@types/minima';
import { selectTokensWithDecimalZero } from '../../minima/redux/slices/tokenSlice';
import * as RPC from '../../minima/commands';
import { makeTokenImage } from '../../shared/functions';
import NFTImage from '../components/nfts/NFTImage';
import NFTImageWrapper from '../components/nfts/NFTImageWrapper';
import NFTDescription from '../components/nfts/NFTDescription';
import CustomListItem from '../../shared/components/CustomListItem';
// import styles from './NFTDetail.module.css';

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

const NFTDetail = () => {
    const { tokenid } = useParams();
    const navigate = useNavigate();
    const [NFT, setNFT] = useState<Token | undefined>(undefined);
    const tokensWithDecimalsZero = useAppSelector(selectTokensWithDecimalZero);
    const [tokenWebValidated, setTokenWebValidated] = useState(false);

    useEffect(() => {
        if (NFT) {
            RPC.tokenValidate(NFT.tokenid).then(() => {
                setTokenWebValidated(true);
            });
        }
    }, [NFT]);

    useEffect(() => {
        const token = tokensWithDecimalsZero.find((t) => t.tokenid === tokenid);
        setNFT(token);
    }, [tokenid, tokensWithDecimalsZero]);

    return (
        <GridLayout
            children={
                <>
                    {NFT && (
                        <Card>
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

                            <Stack spacing={5} p={1}>
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
                                <Stack spacing={5}>
                                    <Stack spacing={1}>
                                        <CustomListItem
                                            title="Description"
                                            value={
                                                'description' in NFT.name && NFT.name.description.length
                                                    ? NFT.name.description
                                                    : 'N/A'
                                            }
                                        />
                                        <CustomListItem title="Total Minted" value={NFT.total} />
                                        <CustomListItem title="Token ID" value={NFT.tokenid} />
                                        <CustomListItem title="Script" value={NFT.script} />
                                        <CustomListItem title="Decimals" value={NFT.decimals} />
                                        <CustomListItem title="Block Created" value={NFT.created} />
                                        <CustomListItem
                                            title="Web Validation"
                                            value={
                                                'webvalidate' in NFT.name && NFT.name.webvalidate
                                                    ? NFT.name.webvalidate
                                                    : 'N/A'
                                            }
                                        />
                                        <CustomListItem
                                            title="External URL"
                                            value={
                                                'external_url' in NFT.name && NFT.name.external_url ? (
                                                    <Link href={NFT.name.external_url} target="_blank">
                                                        {NFT.name.external_url}
                                                    </Link>
                                                ) : (
                                                    'N/A'
                                                )
                                            }
                                        />
                                    </Stack>

                                    <Button
                                        disableElevation
                                        variant="contained"
                                        onClick={() => navigate(`/send/${NFT.tokenid}`, { replace: true })}
                                        fullWidth
                                        // className={styles['transfer']}
                                    >
                                        Transfer
                                    </Button>
                                </Stack>
                            </Stack>
                        </Card>
                    )}
                </>
            }
        ></GridLayout>
    );
};
export default NFTDetail;
