import styled from '@emotion/styled';
import { Avatar, CircularProgress, Stack } from '@mui/material';
import React from 'react';
import { MinimaToken } from '../../../minima/types/minima2';
import { useAppSelector } from '../../../minima/redux/hooks';
import { selectBalance } from '../../../minima/redux/slices/balanceSlice';
import { containsText, numberWithCommas } from '../../../shared/functions';
import MiCard from '../../../shared/components/layout/MiCard';

import styles from './Wallet.module.css';
import {
    MiSearchBar,
    MiSearchBarWithIcon,
    MiSkeleton,
    MiTokenAmount,
    MiTokenContainer,
    MiTokenListItem,
    MiTokenName,
    MiTokenNameTicker,
    NoResults,
} from '../../../shared/components/layout/MiToken';
import MiSearch from '../../../shared/components/layout/svgs/MiSearch';
import { MINIMA__TOKEN_ID } from '../../../shared/constants';
import MinimaIcon from '../../../assets/images/minimaLogoSquare.png';
import { useNavigate } from 'react-router-dom';
const Scroller = styled('div')`
    overflow: auto;
    flex-grow: 1;
`;

const Wallet = () => {
    const navigate = useNavigate();
    const walletTokens = useAppSelector(selectBalance);
    const [filterText, setFilterText] = React.useState('');
    const [filterWallet, setFilterWallet] = React.useState<MinimaToken[]>([]);

    React.useEffect(() => {
        setFilterWallet(
            walletTokens.filter(
                (m: MinimaToken) =>
                    containsText(
                        typeof m.token == 'string' ? m.token : typeof m.token.name == 'string' ? m.token.name : null,
                        filterText
                    ) || containsText(m.tokenid, filterText)
            )
        );
    }, [walletTokens, filterText]);

    return (
        <MiCard>
            <MiSearchBarWithIcon>
                <MiSearchBar
                    value={filterText}
                    onChange={(v: any) => {
                        setFilterText(v.target.value);
                    }}
                    placeholder="Search by name or tokenid"
                />
                <MiSearch color="#fff" size={20} />
            </MiSearchBarWithIcon>
            <Scroller>
                {filterWallet.length === 0 ? (
                    <NoResults>
                        <h6>No results</h6>
                        <p>Please try your search again.</p>
                    </NoResults>
                ) : null}
                <MiTokenContainer>
                    {filterWallet.map((t: MinimaToken) => (
                        <MiTokenListItem onClick={() => navigate(t.tokenid)} key={t.tokenid}>
                            <Avatar
                                className={styles['avatar']}
                                variant="rounded"
                                src={
                                    t.tokenid === MINIMA__TOKEN_ID
                                        ? MinimaIcon
                                        : t.token.url && t.token.url.length
                                        ? t.token.url
                                        : `https://robohash.org/${t.tokenid}`
                                }
                            />
                            <Stack spacing={0.3} flexDirection="column" alignItems="flex-start">
                                <MiTokenName>{typeof t.token == 'string' ? t.token : t.token.name}</MiTokenName>

                                <MiTokenNameTicker>
                                    {t.tokenid == '0x00' ? (
                                        'MINIMA'
                                    ) : t.token.hasOwnProperty('ticker') ? (
                                        t.token.ticker
                                    ) : (
                                        <MiSkeleton />
                                    )}
                                </MiTokenNameTicker>
                                <MiTokenAmount>{t.sendable}</MiTokenAmount>
                            </Stack>
                        </MiTokenListItem>
                    ))}
                </MiTokenContainer>
            </Scroller>
        </MiCard>
    );
};

export default Wallet;
