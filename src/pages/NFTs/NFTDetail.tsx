import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Link, CardMedia, Typography, CardContent, Stack, Button, Grid } from '@mui/material';
import GridLayout from '../components/GridLayout';
import { useAppSelector } from '../../minima/redux/hooks';
import { selectNFTs } from '../../minima/redux/slices/balanceSlice';
import CustomListItem from '../../shared/components/CustomListItem';

import VerifiedIcon from '@mui/icons-material/Verified';

import styles from '../../theme/cssmodule/Components.module.css';
import NFTAuthenticity from '../components/tokens/NFTAuthenticity';

const NFTDetail = () => {
    const { tokenid } = useParams();
    const navigate = useNavigate();
    const NFTs = useAppSelector(selectNFTs);
    const NFT: any = NFTs ? NFTs.find((n: MinimaToken) => n.tokenid === tokenid) : undefined;
    // console.log(NFT);
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
        <GridLayout
            children={
                <>
                    {tokenid && NFT ? (
                        <Card>
                            {imageUrl ? (
                                <CardMedia image={imageUrl} component="img" height="auto" />
                            ) : typeof imageUrl === 'undefined' &&
                              typeof NFT.token === 'object' &&
                              NFT.token.hasOwnProperty('url') &&
                              NFT.token.url.length > 0 ? (
                                <CardMedia component="img" aria-label="NFT-url-image" src={NFT.token.url} />
                            ) : (
                                <CardMedia
                                    component="img"
                                    aria-label="NFT-url-image"
                                    src={`https://robohash.org/${NFT.tokenid}`}
                                />
                            )}

                            <CardContent>
                                <Stack>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Typography variant="h6" className={styles['nft-title']}>
                                            {NFT.token.hasOwnProperty('name') ? NFT.token.name : 'Undefined'}
                                        </Typography>
                                        <NFTAuthenticity NFT={NFT} />
                                    </Stack>
                                    <Typography className={styles['nft-owner']} variant="caption">
                                        {NFT.token.hasOwnProperty('owner') &&
                                        NFT.token.owner.length > 0 &&
                                        NFT.token.owner.length
                                            ? 'Created by ' + NFT.token.owner
                                            : 'Created by anonymous'}
                                    </Typography>
                                    <Typography mt={3} variant="body2" className={styles['nft-description']}>
                                        {NFT.token.hasOwnProperty('owner') &&
                                        NFT.token.owner.lenght > 0 &&
                                        NFT.token.description &&
                                        NFT.token.description.length
                                            ? NFT.token.description
                                            : 'No description available.'}
                                    </Typography>
                                </Stack>

                                <Stack mt={2} mb={3} spacing={1}>
                                    <CustomListItem title="Total Minted" value={NFT.total} />
                                    <CustomListItem title="Token ID" value={NFT.tokenid} />

                                    <CustomListItem
                                        title="Web Validation"
                                        value={
                                            NFT.token.hasOwnProperty('webvalidate') &&
                                            NFT.token.webvalidate.length > 0 &&
                                            NFT.token.webvalidate.length
                                                ? NFT.token.webvalidate
                                                : 'No web validation available.'
                                        }
                                    />
                                    <CustomListItem
                                        title="External URL"
                                        value={
                                            NFT.token.hasOwnProperty('external_url') &&
                                            NFT.token.external_url.length > 0 &&
                                            NFT.token.external_url &&
                                            NFT.token.external_url.length ? (
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
                                </Stack>
                                <Button
                                    disableElevation
                                    variant="contained"
                                    onClick={() => navigate(`/send/${NFT.tokenid}`, { replace: true })}
                                    fullWidth
                                >
                                    Transfer
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Grid
                            item
                            xs={12}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography variant="subtitle2">NFT not found</Typography>
                        </Grid>
                    )}
                </>
            }
        ></GridLayout>
    );
};
export default NFTDetail;
