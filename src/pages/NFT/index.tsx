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

    useEffect(() => {
        tokenNFTsWithDecimalZero.filter(
            (t) =>
                containsText(t.name.name, filterText) ||
                containsText(t.tokenid, filterText) ||
                ('owner' in t.name && containsText(t.name.owner, filterText))
        );
    }, [filterText]);

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
                                    {filterText.length &&
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
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </>
            }
        />
    );
};

export default NFTs;
