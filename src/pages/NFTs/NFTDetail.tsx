import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Card,
    CardHeader,
    Link,
    CardMedia,
    Typography,
    CardContent,
    Stack,
    List,
    ListItem,
    Button,
} from '@mui/material';
import GridLayout from '../components/GridLayout';
import { useAppSelector } from '../../minima/redux/hooks';
import { selectNFTs } from '../../minima/redux/slices/balanceSlice';
import { MinimaToken } from '@minima-global/mds-api';
import CustomListItem from '../../shared/components/CustomListItem';

import VerifiedIcon from '@mui/icons-material/Verified';

import styles from '../../theme/cssmodule/Components.module.css';
import { callTokenValidate } from '../../minima/rpc-commands';

const NFTDetail = () => {
    const [isTokenValidated, setIsTokenValidated] = React.useState(false);
    const { tokenid } = useParams();
    const navigate = useNavigate();
    const NFTs = useAppSelector(selectNFTs);
    console.log(tokenid);
    const NFT: any = NFTs ? NFTs.find((n: MinimaToken) => n.tokenid === tokenid) : undefined;
    console.log(`NFT`, NFT);

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
        console.log(`run useFffect`);
        if (NFT && NFT.tokenid) {
            callTokenValidate(NFT.tokenid)
                .then((res: any) => {
                    console.log(`callTokenValidate`, res);
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
        <GridLayout
            children={
                <>
                    <Card>
                        {imageUrl ? <CardMedia image={imageUrl} component="img" height="auto" /> : null}

                        <CardContent>
                            <Stack>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography variant="h6" className={styles['nft-title']}>
                                        {NFT.token.name}
                                    </Typography>
                                    {isTokenValidated ? <VerifiedIcon color="primary" /> : null}
                                </Stack>
                                <Typography variant="caption">
                                    {NFT.token.owner && NFT.token.owner.length
                                        ? 'Created by ' + NFT.token.owner
                                        : 'Created by anonymous'}
                                </Typography>
                                <Typography mt={3} variant="body2" className={styles['nft-description']}>
                                    {NFT.token.description && NFT.token.description.length
                                        ? NFT.token.description
                                        : 'No description available.'}
                                </Typography>
                            </Stack>

                            <Stack mt={2} spacing={1}>
                                <CustomListItem title="Total Minted" value={NFT.total} />
                                <CustomListItem title="Token ID" value={NFT.tokenid} />
                                <CustomListItem
                                    title="External URL"
                                    value={
                                        NFT.token.external_url && NFT.token.external_url.length ? (
                                            <Link
                                                aria-label={NFT.token.name}
                                                href={NFT.token.external_url}
                                                target="_blank"
                                            >
                                                {NFT.token.external_url}
                                            </Link>
                                        ) : (
                                            'No external link available.'
                                        )
                                    }
                                />
                                <Button
                                    disableElevation
                                    variant="contained"
                                    onClick={() => navigate(`/send/${NFT.tokenid}`, { replace: true })}
                                    fullWidth
                                >
                                    Transfer
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </>
            }
        ></GridLayout>
    );
};
export default NFTDetail;
