import { FC, useState, useMemo, useEffect } from 'react';
import { Tabs, TabButton } from '../components/MiCustom/MiTabs';
import { Grid, Card, CardContent, TextField, Button, Stack, CardHeader } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { containsText, isPropertyString } from '../../shared/functions';

import NFTCard from '../components/nfts/NFTCard/NFTCard';
import GridLayout from '../../layout/GridLayout';
import { useAppSelector } from '../../minima/redux/hooks';
import { selectFavouriteNFTs, selectNFTs } from '../../minima/redux/slices/balanceSlice';

import styles from './NFT.module.css';
import { MinimaToken } from '../../@types/minima';
import { MiSearchBar, MiSearchBarWithIcon, NoResults } from '../../shared/components/layout/MiToken';
import { selectTokensWithDecimalZero } from '../../minima/redux/slices/tokenSlice';
import MiSearch from '../../shared/components/layout/svgs/MiSearch';
import CreateButton from '../components/nfts/CreateButton';
import useTabs from '../../hooks/useTabs';

const NFTs: FC = () => {
    const navigate = useNavigate();
    const { tabs, toggleTab, tabStyles } = useTabs();
    const [filterText, setFilterText] = useState('');
    const tokenNFTsWithDecimalZero = useAppSelector(selectTokensWithDecimalZero);

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
                                <Stack spacing={1}>
                                    <MiSearchBarWithIcon>
                                        <MiSearchBar
                                            value={filterText}
                                            onChange={(v: any) => {
                                                setFilterText(v.target.value);
                                            }}
                                            placeholder="Search by name, creator name or tokenid"
                                        />
                                        <MiSearch color="#fff" size={20} />
                                    </MiSearchBarWithIcon>
                                    <Stack direction="column" justifyContent="space-between" spacing={1}>
                                        {/* <CreateButton onClick={() => navigate('/createnft')}>Create New</CreateButton> */}
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            disableElevation
                                            color="inherit"
                                            onClick={() => navigate('/createnft')}
                                        >
                                            Create New
                                        </Button>
                                        <Tabs>
                                            <TabButton
                                                onClick={() => toggleTab(0)}
                                                className={tabs === 0 ? tabStyles['tab-open'] : undefined}
                                            >
                                                Collection
                                            </TabButton>
                                            <TabButton
                                                onClick={() => toggleTab(1)}
                                                className={tabs === 1 ? tabStyles['tab-open'] : undefined}
                                            >
                                                Favorited
                                            </TabButton>
                                        </Tabs>
                                    </Stack>
                                </Stack>
                            }
                        />
                        <CardContent>
                            <Stack spacing={3}>
                                <Stack spacing={1}>
                                    {tokenNFTsWithDecimalZero.map((token) => (
                                        <NFTCard key={token.coinid} NFT={token} />
                                    ))}
                                </Stack>

                                {/* <Grid justifyContent="space-around" container spacing={{ sm: 1, xs: 0 }}>
                                    {userIsSearching && displayedOptions && displayedOptions.length === 0 ? (
                                        <NoResults>
                                            <h6>No results</h6>
                                            <p>Please try your search again.</p>
                                        </NoResults>
                                    ) : (
                                        displayedOptions.map((n) => {
                                            return (
                                                <Grid key={n.tokenid} item xs={12} sm={5} mb={1}>
                                                    <NFTCard key={n.tokenid} NFT={n} />
                                                </Grid>
                                            );
                                        })
                                    )}
                                    {!userIsSearching && allNFTs && allNFTs.length === 0 ? (
                                        <NoResults>
                                            <h6>No results found</h6>
                                            {tabSelected === 1 ? (
                                                <p>Click create to create a new NFT.</p>
                                            ) : (
                                                <p>
                                                    Tap the heart button in the top-right corner of an NFT card to
                                                    favorite.
                                                </p>
                                            )}
                                        </NoResults>
                                    ) : null}
                                </Grid> */}
                            </Stack>
                        </CardContent>
                    </Card>
                </>
            }
        />
    );
};

export default NFTs;
