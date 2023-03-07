import React from 'react';
import styled from '@emotion/styled';

import { Avatar, Stack } from '@mui/material';
import { MinimaToken } from '../../../@types/minima';
import { useAppSelector } from '../../../minima/redux/hooks';
import { selectBalance } from '../../../minima/redux/slices/balanceSlice';
import { containsText } from '../../../shared/functions';
import MiCard from '../../../shared/components/layout/MiCard/MiCard';

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
    MiTokenNameWrapper,
    NoResults,
} from '../../../shared/components/layout/MiToken';
import MiSearch from '../../../shared/components/layout/svgs/MiSearch';
import { MINIMA__TOKEN_ID } from '../../../shared/constants';

import { useNavigate } from 'react-router-dom';
import NFTAuthenticity from '../tokens/NFTAuthenticity';

import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

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
                            <Stack width="100%" flexDirection="row" justifyContent="space-between">
                                <Stack flexDirection="row" gap={1}>
                                    {t.tokenid === '0x00' && (
                                        <Avatar
                                            className={styles['avatar']}
                                            variant="rounded"
                                            src="./assets/minimaLogoSquare.png"
                                        />
                                    )}
                                    {t.tokenid !== '0x00' && (
                                        <Avatar
                                            className={styles['avatar']}
                                            variant="rounded"
                                            src={
                                                t.token.url && t.token.url.length
                                                    ? t.token.url
                                                    : `https://robohash.org/${t.tokenid}`
                                            }
                                        />
                                    )}

                                    <Stack spacing={0.3} flexDirection="column" alignItems="flex-start">
                                        <MiTokenNameWrapper>
                                            <MiTokenName>
                                                {typeof t.token == 'string' ? t.token : t.token.name}
                                            </MiTokenName>

                                            {t.tokenid !== MINIMA__TOKEN_ID ? <NFTAuthenticity token={t} /> : null}
                                        </MiTokenNameWrapper>

                                        {t.tokenid === '0x00' && <MiTokenNameTicker>MINIMA</MiTokenNameTicker>}
                                        {t.tokenid !== '0x00' && 'ticker' in t.token && !!t.token.ticker.length && (
                                            <MiTokenNameTicker>{t.token.ticker}</MiTokenNameTicker>
                                        )}
                                        {t.tokenid !== '0x00' && 'ticker' in t.token && t.token.ticker.length === 0 && (
                                            <MiSkeleton></MiSkeleton>
                                        )}
                                        {t.tokenid !== '0x00' && 'ticker' in t.token === false && (
                                            <MiSkeleton></MiSkeleton>
                                        )}

                                        <MiTokenAmount>{t.sendable}</MiTokenAmount>
                                    </Stack>
                                </Stack>
                                {t.tokenid === '0x00' && <VerifiedUserIcon sx={{ fontSize: 16 }} color="primary" />}
                            </Stack>
                        </MiTokenListItem>
                    ))}
                </MiTokenContainer>
            </Scroller>
        </MiCard>
    );
};

export default Wallet;
