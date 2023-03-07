import { useState } from 'react';
import { Tabs, TabButton } from '../components/MiCustom/MiTabs';
import { Card, CardContent, Button, Stack, CardHeader } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { containsText } from '../../shared/functions';

import NFTCard from '../components/nfts/NFTCard/NFTCard';
import GridLayout from '../../layout/GridLayout';
import { useAppSelector } from '../../minima/redux/hooks';

import styles from './NFT.module.css';
import { MiSearchBar, MiSearchBarWithIcon, NoResults } from '../../shared/components/layout/MiToken';
import { selectTokensWithDecimalZero } from '../../minima/redux/slices/tokenSlice';
import MiSearch from '../../shared/components/layout/svgs/MiSearch';
import useTabs from '../../hooks/useTabs';
import { selectFavouriteNFTs } from '../../minima/redux/slices/balanceSlice';

const NFTs = () => {
    const navigate = useNavigate();
    const { tabs, toggleTab, tabStyles } = useTabs();
    const [filterText, setFilterText] = useState('');
    const tokenNFTsWithDecimalZero = useAppSelector(selectTokensWithDecimalZero);
    const myFavoritedNFTs = useAppSelector(selectFavouriteNFTs);

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
                                {tabs === 0 && (
                                    <Stack spacing={1}>
                                        {tokenNFTsWithDecimalZero
                                            .filter(
                                                (t) =>
                                                    containsText(t.name.name, filterText) ||
                                                    containsText(t.tokenid, filterText) ||
                                                    ('owner' in t.name && containsText(t.name.owner, filterText))
                                            )
                                            .map((token) => (
                                                <NFTCard key={token.coinid} NFT={token} />
                                            ))}
                                        {!!filterText.length &&
                                            tokenNFTsWithDecimalZero.filter(
                                                (t) =>
                                                    containsText(t.name.name, filterText) ||
                                                    containsText(t.tokenid, filterText) ||
                                                    ('owner' in t.name && containsText(t.name.owner, filterText))
                                            ).length === 0 && (
                                                <NoResults>
                                                    <h6>No results</h6>
                                                    <p>Please try your search again.</p>
                                                </NoResults>
                                            )}
                                        {tokenNFTsWithDecimalZero.length === 0 && !filterText.length && (
                                            <NoResults>
                                                <h6>No NFTs in your collection yet</h6>
                                                <p>Click the create new button to create some</p>
                                            </NoResults>
                                        )}
                                    </Stack>
                                )}
                                {tabs === 1 && (
                                    <Stack spacing={1}>
                                        {myFavoritedNFTs
                                            .filter(
                                                (t) =>
                                                    containsText(t.name.name, filterText) ||
                                                    containsText(t.tokenid, filterText) ||
                                                    ('owner' in t.name && containsText(t.name.owner, filterText))
                                            )
                                            .map((token) => (
                                                <NFTCard key={token.coinid} NFT={token} />
                                            ))}
                                        {!!filterText.length &&
                                            myFavoritedNFTs.filter(
                                                (t) =>
                                                    containsText(t.name.name, filterText) ||
                                                    containsText(t.tokenid, filterText) ||
                                                    ('owner' in t.name && containsText(t.name.owner, filterText))
                                            ).length === 0 && (
                                                <NoResults>
                                                    <h6>No results</h6>
                                                    <p>Please try your search again.</p>
                                                </NoResults>
                                            )}
                                        {myFavoritedNFTs.length === 0 && !filterText.length && (
                                            <NoResults>
                                                <h6>No favorites saved</h6>
                                                <p>Click the heart on an NFT to favorite it</p>
                                            </NoResults>
                                        )}
                                    </Stack>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </>
            }
        />
    );
};

export default NFTs;
