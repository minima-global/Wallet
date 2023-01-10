import styled from '@emotion/styled';

import styles from './styling/sendpage/TokenSelect.module.css';
import { MinimaToken } from '../../../@types/minima2';
import React from 'react';
import MiDismiss from './svgs/MiDismiss/MiDismiss';
import { Stack, useMediaQuery, useTheme } from '@mui/material';
import MiSearch from './svgs/MiSearch';
import { Avatar } from '@mui/material';

import {
    MiSearchBar,
    MiSearchBarWithIcon,
    MiTokenName,
    MiTokenNameTicker,
    MiTokenAmount,
    MiSkeleton,
    MiTokenListItem,
    MiTokenError,
    MiNoTokenSelected,
    NoResults,
    MiTokenNameWrapper,
} from './MiToken';

import { containsText } from '../../functions';
import MiArrow from './svgs/MiArrow';
import { DRAWERWIDTH, MINIMA__TOKEN_ID } from '../../constants';
import MinimaIcon from '../../../assets/images/minimaLogoSquare.png';
import { FormikErrors, FormikState } from 'formik';
import Decimal from 'decimal.js';
import NFTAuthenticity from '../../../pages/components/tokens/NFTAuthenticity';

const DropDownContainer = styled('div')`
    width: 100%;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.5);
    border: none;
    border-radius: 8px;
`;
const DropDownHeader = styled('div')`
    min-height: 72px;
    background: #fff;
    margin: 0 auto;

    border: 1px solid #c3c1c0;
    border-radius: 8px;
    position: relative;
    :hover {
        border: 1px solid #000;
    }
    :focus {
        border: 1px solid #317aff;
    }
    * {
        margin: 0 !important;
        border: none !important;
    }
    > svg {
        position: absolute;
        right: 16px;
        top: 50%;
    }
`;
const DropDownListContainer = styled('div')`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 90vh;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 24px 24px 0px 0px;
    z-index: 1000;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding-bottom: 0;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);

    @media (min-width: 600px) {
        width: calc(100% - ${DRAWERWIDTH}px) !important;
        margin-left: ${DRAWERWIDTH}px!important;
    }
`;

const DropDownListContainerDesktop = styled('div')`
    position: relative;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 24px;
    width: 50vw;
    max-height: 85vh;
    overflow-y: hidden;
    overflow-x: hidden;

    display: flex;
    flex-direction: column;
    padding-bottom: 0;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
`;
const BackDrop = styled('div')`
    background: rgba(0, 0, 0, 0.6);
    height: 100%;
    z-index: 999;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    @media (min-width: 600px) {
        width: calc(100% - ${DRAWERWIDTH}px) !important;
        margin-left: ${DRAWERWIDTH}px!important;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
const DropDownList = styled('ul')`
    padding: 0;
    margin-top: 24px;
    list-style: none;

    > :last-of-type {
        margin-bottom: 0;
    }
`;

const Scroller = styled('div')`
    overflow: scroll;
    padding: 0 16px;
    flex-grow: 1;
`;

const DropDownListHeader = styled('h6')`
    font-family: Manrope-regular;
    font-size: 24px;
    font-weight: 700;
    line-height: 33px;
    letter-spacing: 0.02em;
    text-align: center;
    padding: 0;
    margin: 0;
    margin-bottom: 22px;
`;

interface IProps {
    value: MinimaToken;
    tokens: MinimaToken[];
    error?: FormikErrors<MinimaToken>;
    setFieldValue: (
        field: string,
        value: MinimaToken,
        shouldValidate?: boolean
    ) =>
        | Promise<void>
        | Promise<
              FormikErrors<{
                  token: MinimaToken;
                  amount: string;
                  address: string;
                  burn: string;
              }>
          >;
    resetForm: any;
    coinSplitMode: boolean;
}
const MiSelect = ({ value, tokens, error, setFieldValue, resetForm, coinSplitMode = false }: IProps) => {
    const theme = useTheme();
    const [isOpen, setOpen] = React.useState(false);
    const mobileView = useMediaQuery(theme.breakpoints.down('sm'));
    const [filterWallet, setFilterWallet] = React.useState<MinimaToken[]>([]);
    const [filterText, setFilterText] = React.useState('');

    // if (isOpen && mobileView) {
    //     document.body.style.overflow = 'hidden';
    // } else {
    //     document.body.style.overflow = 'auto';
    // }

    const toggling = () => setOpen(!isOpen);
    const onOptionClicked = (t: MinimaToken) => {
        resetForm();
        setFieldValue('token', t);
        setOpen(false);
    };

    React.useEffect(() => {
        setFilterWallet(
            tokens.filter(
                (m: MinimaToken) =>
                    containsText(
                        typeof m.token == 'string' ? m.token : typeof m.token.name == 'string' ? m.token.name : null,
                        filterText
                    ) || containsText(m.tokenid, filterText)
            )
        );
    }, [tokens, filterText]);

    return (
        <>
            <DropDownContainer>
                <DropDownHeader onClick={toggling}>
                    {value && (
                        <>
                            <MiTokenListItem>
                                <Avatar
                                    sx={{
                                        width: '56px',
                                        height: '56px',
                                        background: '#fff',
                                    }}
                                    className={styles['avatar']}
                                    variant="rounded"
                                    src={
                                        value.tokenid === MINIMA__TOKEN_ID
                                            ? MinimaIcon
                                            : value.token.url && value.token.url.length
                                            ? value.token.url
                                            : `https://robohash.org/${value.tokenid}`
                                    }
                                />
                                <Stack
                                    spacing={0.3}
                                    flexDirection="column"
                                    alignItems="flex-start"
                                    sx={{ textOverflow: 'ellipsis' }}
                                >
                                    <MiTokenNameWrapper>
                                        <MiTokenName>
                                            {typeof value.token == 'string' ? value.token : value.token.name}
                                        </MiTokenName>
                                        {value.tokenid !== MINIMA__TOKEN_ID ? <NFTAuthenticity token={value} /> : null}
                                    </MiTokenNameWrapper>
                                    <MiTokenNameTicker>
                                        {value.tokenid === '0x00' ? (
                                            'MINIMA'
                                        ) : value.token.ticker ? (
                                            value.token.ticker
                                        ) : (
                                            <MiSkeleton />
                                        )}
                                    </MiTokenNameTicker>
                                    {!coinSplitMode && <MiTokenAmount>{value.sendable}</MiTokenAmount>}
                                    {coinSplitMode && (
                                        <MiTokenAmount>{`${value.coins} available coin${
                                            new Decimal(value.coins).greaterThan(new Decimal(1)) ? 's' : ''
                                        }`}</MiTokenAmount>
                                    )}
                                </Stack>
                            </MiTokenListItem>
                            <MiArrow size={10} color="black" />
                        </>
                    )}
                    {!value && <MiNoTokenSelected>No token selected</MiNoTokenSelected>}
                    <MiArrow size={10} color="black" />
                    {error ? <MiTokenError>{error}</MiTokenError> : null}
                </DropDownHeader>
                {isOpen && mobileView ? (
                    <>
                        <BackDrop className={styles['fadeIn']}>
                            <DropDownListContainer className={isOpen ? styles['slideIn'] : styles['slideOut']}>
                                <Stack flexDirection="row" justifyContent="flex-end" sx={{ padding: '16px' }}>
                                    <MiDismiss size={16} onClick={toggling} className={styles['dismiss']} />
                                </Stack>
                                <DropDownListHeader>Select token</DropDownListHeader>
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
                                    <DropDownList>
                                        {filterWallet.length == 0 ? (
                                            <NoResults>
                                                <h6>No results</h6>
                                                <p>Please try your search again.</p>
                                            </NoResults>
                                        ) : null}
                                        {filterWallet.map((t: MinimaToken) => (
                                            <MiTokenListItem key={t.tokenid} onClick={() => onOptionClicked(t)}>
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
                                                    <MiTokenNameWrapper>
                                                        <MiTokenName>
                                                            {typeof t.token == 'string' ? t.token : t.token.name}
                                                        </MiTokenName>
                                                        {t.tokenid !== MINIMA__TOKEN_ID ? (
                                                            <NFTAuthenticity token={t} />
                                                        ) : null}
                                                    </MiTokenNameWrapper>

                                                    <MiTokenNameTicker>
                                                        {t.tokenid == '0x00' ? (
                                                            'MINIMA'
                                                        ) : t.token.hasOwnProperty('ticker') ? (
                                                            t.token.ticker
                                                        ) : (
                                                            <MiSkeleton />
                                                        )}
                                                    </MiTokenNameTicker>
                                                    {!coinSplitMode && <MiTokenAmount>{t.sendable}</MiTokenAmount>}
                                                    {coinSplitMode && (
                                                        <MiTokenAmount>{`${t.coins} available coin${
                                                            new Decimal(t.coins).greaterThan(new Decimal(1)) ? 's' : ''
                                                        }`}</MiTokenAmount>
                                                    )}
                                                </Stack>
                                            </MiTokenListItem>
                                        ))}
                                    </DropDownList>
                                </Scroller>
                            </DropDownListContainer>
                        </BackDrop>
                    </>
                ) : null}
                {isOpen && !mobileView ? (
                    <>
                        <BackDrop>
                            <DropDownListContainerDesktop>
                                <Stack flexDirection="row" justifyContent="flex-end" sx={{ padding: '16px' }}>
                                    <MiDismiss size={16} onClick={toggling} className={styles['dismiss']} />
                                </Stack>
                                <DropDownListHeader>Select token</DropDownListHeader>
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
                                    <DropDownList>
                                        {filterWallet.length == 0 ? (
                                            <NoResults>
                                                <h6>No results</h6>
                                                <p>Please try your search again.</p>
                                            </NoResults>
                                        ) : null}
                                        {filterWallet.map((t: MinimaToken) => (
                                            <MiTokenListItem key={t.tokenid} onClick={() => onOptionClicked(t)}>
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
                                                    <MiTokenNameWrapper>
                                                        <MiTokenName>
                                                            {typeof t.token == 'string' ? t.token : t.token.name}
                                                        </MiTokenName>
                                                        {t.tokenid !== MINIMA__TOKEN_ID ? (
                                                            <NFTAuthenticity token={t} />
                                                        ) : null}
                                                    </MiTokenNameWrapper>

                                                    <MiTokenNameTicker>
                                                        {t.tokenid == '0x00' ? (
                                                            'MINIMA'
                                                        ) : t.token.hasOwnProperty('ticker') ? (
                                                            t.token.ticker
                                                        ) : (
                                                            <MiSkeleton />
                                                        )}
                                                    </MiTokenNameTicker>
                                                    {!coinSplitMode && <MiTokenAmount>{t.sendable}</MiTokenAmount>}
                                                    {coinSplitMode && (
                                                        <MiTokenAmount>{`${t.coins} available coin${
                                                            new Decimal(t.coins).greaterThan(new Decimal(1)) ? 's' : ''
                                                        }`}</MiTokenAmount>
                                                    )}
                                                </Stack>
                                            </MiTokenListItem>
                                        ))}
                                    </DropDownList>
                                </Scroller>
                            </DropDownListContainerDesktop>
                        </BackDrop>
                    </>
                ) : null}
            </DropDownContainer>
        </>
    );
};

export default MiSelect;
