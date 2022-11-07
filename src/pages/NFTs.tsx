import { FC, useState, useMemo } from 'react';
import { Grid, Card, CardContent, TextField, Button, Stack, Typography, CardHeader, Tabs, Tab } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { containsText, isPropertyString, strToHex } from '../shared/functions';

import NFTCard from './components/nfts/NFTCard';
import GridLayout from '../layout/GridLayout';
import { useAppSelector } from '../minima/redux/hooks';
import { selectFavouriteNFTs, selectNFTs } from '../minima/redux/slices/balanceSlice';

import styles from '../theme/cssmodule/Components.module.css';
import { MinimaToken } from '../minima/types/minima2';

const NFTs: FC = () => {
    const navigate = useNavigate();
    const [tabsValue, setTabsValue] = useState('one');
    const [filterText, setFilterText] = useState('');
    let allNFTs = useAppSelector(selectNFTs);
    const favourited = useAppSelector(selectFavouriteNFTs);

    if (tabsValue === 'two') {
        allNFTs = allNFTs?.filter((t: MinimaToken) => favourited?.includes(t));
    }

    const getFilteredBalanceList = (arr: MinimaToken[], filterText: string) => {
        return arr.filter(
            (opt: MinimaToken) =>
                (isPropertyString(opt.token) && containsText(opt.token, filterText)) ||
                (!isPropertyString(opt.token) && containsText(opt.token.name, filterText)) ||
                (!isPropertyString(opt.token) && containsText(opt.token.owner, filterText)) ||
                (isPropertyString(opt.tokenid) && containsText(opt.tokenid, filterText))
        );
    };
    const displayedOptions = useMemo(
        () => getFilteredBalanceList(allNFTs ? allNFTs : [], filterText),
        [allNFTs, filterText]
    );

    const handleTabSelection = () => {
        setTabsValue(tabsValue === 'one' ? 'two' : 'one');
    };

    function handleInputChange(event: any) {
        const value = event.target.value;
        setFilterText(value);
        // when the component re-renders the updated filter text will create a new filteredBalance variable
    }

    return (
        <GridLayout
            children={
                <>
                    <Card variant="outlined" className={styles['nft-page-card']}>
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
                                <TextField
                                    fullWidth
                                    id="search"
                                    value={filterText}
                                    onChange={handleInputChange}
                                    placeholder="Search by name, creator name or tokenid"
                                />
                                <Grid justifyContent="space-around" container spacing={{ sm: 1, xs: 0 }}>
                                    {displayedOptions &&
                                    typeof displayedOptions !== 'undefined' &&
                                    displayedOptions.length > 0 ? (
                                        displayedOptions.map((n) => {
                                            return (
                                                <Grid key={n.tokenid} item xs={12} sm={5} mb={1}>
                                                    <NFTCard key={n.tokenid} NFT={n} />
                                                </Grid>
                                            );
                                        })
                                    ) : tabsValue === 'one' ? (
                                        <Typography variant="caption" className={styles['no-results-text-display']}>
                                            No NFTs collected yet.
                                        </Typography>
                                    ) : null}
                                    {allNFTs &&
                                    typeof allNFTs !== 'undefined' &&
                                    tabsValue === 'two' &&
                                    allNFTs.length === 0 ? (
                                        <Typography variant="caption">No favourites yet.</Typography>
                                    ) : null}
                                </Grid>
                            </Stack>
                        </CardContent>
                        
                    </Card>
                </>
            }
        />
    );
};

export default NFTs;
