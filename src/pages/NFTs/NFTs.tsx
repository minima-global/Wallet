import { FC, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    Stack,
    CardMedia,
    Typography,
    CardActions,
    Portal,
    Snackbar,
    Alert,
    InputAdornment,
    CardHeader,
    Chip,
    Tabs,
    Tab,
} from '@mui/material';
import MiniModal from '../../shared/components/MiniModal';

import { callCreateNFT } from '../../minima/rpc-commands';

/** form imports */
import { useFormik } from 'formik';
// import { BalanceUpdates } from '../App'; // balance context

import { MinimaToken } from '../../types/minima';
import AppPagination from '../components/AppPagination';

import * as Yup from 'yup';
import { INSUFFICIENT } from '../../minima/constants';

import { useNavigate } from 'react-router-dom';
import { strToHex } from '../../shared/functions';
import { hexToString } from '../../shared/functions';

import GridLayout from '../components/GridLayout';
import NFTGrid from '../components/nfts/NFTGrid';
import NFTCard from '../components/nfts/NFTCard';
import { useAppSelector } from '../../minima/redux/hooks';
import { selectFavouriteNFTs, selectNFTs } from '../../minima/redux/slices/balanceSlice';

import styles from '../../theme/cssmodule/Components.module.css';

const NFTs: FC = () => {
    const navigate = useNavigate();
    // const [page, setPage] = useState(1);
    const [tabsValue, setTabsValue] = useState('one');
    // const COUNT_PER_PAGE = 4;
    let allNFTs = useAppSelector(selectNFTs);

    const favourited = useAppSelector(selectFavouriteNFTs);
    // console.log('My NFTs', allNFTs);

    if (tabsValue === 'two') {
        allNFTs = allNFTs?.filter((t: MinimaToken) => favourited?.includes(t));
    }

    const handleTabSelection = () => {
        setTabsValue(tabsValue === 'one' ? 'two' : 'one');
    };

    // const currentPage = (page: number) => {
    //     // console.log(`Setting current page number to: ${page}`);
    //     setPage(page);
    // };

    return (
        <GridLayout
            children={
                <>
                    <Card variant="outlined">
                        <CardHeader
                            title={
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                                    <Tabs
                                        value={tabsValue}
                                        onChange={handleTabSelection}
                                        textColor="inherit"
                                        indicatorColor="primary"
                                        aria-label="secondary tabs example"
                                    >
                                        <Tab value="one" label="Collected" className={styles['nft-tabs-tab']} />
                                        <Tab value="two" label="Favorited" className={styles['nft-tabs-tab']} />
                                    </Tabs>
                                    <Button
                                        disableElevation
                                        variant="outlined"
                                        className={styles['create-nft-btn']}
                                        color="inherit"
                                        size="small"
                                        onClick={() => navigate('/createnft')}
                                    >
                                        Create
                                    </Button>
                                </Stack>
                            }
                        />
                        <CardContent>
                            <Stack spacing={3}>
                                <TextField fullWidth id="search" placeholder="Search by name" />

                                <NFTGrid
                                    children={
                                        <>
                                            {allNFTs && typeof allNFTs !== 'undefined' ? (
                                                allNFTs.map((n) => {
                                                    return <NFTCard key={n.tokenid} NFT={n} />;
                                                })
                                            ) : (
                                                <Typography variant="caption">No NFTs collected yet.</Typography>
                                            )}
                                        </>
                                    }
                                />

                                {allNFTs &&
                                typeof allNFTs !== 'undefined' &&
                                tabsValue === 'two' &&
                                allNFTs.length === 0 ? (
                                    <Typography variant="caption">No favourites yet.</Typography>
                                ) : null}
                            </Stack>
                        </CardContent>
                    </Card>
                </>
            }
        ></GridLayout>
    );
};

export default NFTs;
