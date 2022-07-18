import { useState, useMemo } from 'react';
import { List, Typography, TextField, Card, CardContent, CardActions, CardHeader, Skeleton } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { MinimaToken } from '../types/minima';
import AppPagination from './components/AppPagination';
import GridLayout from './components/GridLayout';

import { isPropertyString, containsText } from '../shared/functions';

import TokenListItem from './components/tokens/TokenListItem';
import { useAppSelector } from '../minima/redux/hooks';
import { selectBalance } from '../minima/redux/slices/balanceSlice';

const Balance = () => {
    const [filterText, setFilterText] = useState('');

    // pagination
    const [page, setPage] = useState(1);
    const COUNT_PER_PAGE = 5;

    const getFilteredBalanceList = (arr: MinimaToken[], filterText: string) => {
        return arr.filter(
            (opt: MinimaToken) =>
                (isPropertyString(opt.token) && containsText(opt.token, filterText)) ||
                (!isPropertyString(opt.token) && containsText(opt.token.name, filterText)) ||
                (isPropertyString(opt.tokenid) && containsText(opt.tokenid, filterText))
        );
    };

    // const balances = useContext(BalanceUpdates);
    const balances = useAppSelector(selectBalance);
    const displayedOptions = useMemo(() => getFilteredBalanceList(balances, filterText), [balances, filterText]);

    function handleInputChange(event: any) {
        const value = event.target.value;
        setFilterText(value);
        // when the component re-renders the updated filter text will create a new filteredBalance variable
    }

    const currentPage = (page: number) => {
        setPage(page);
    };

    return (
        <>
            <GridLayout
                // loading={loading}
                children={
                    <Card variant="outlined">
                        <CardHeader
                            disableTypography
                            title={
                                balances && balances.length > 0 ? (
                                    <TextField
                                        fullWidth
                                        placeholder="Search by name or tokenid"
                                        id="token-search"
                                        value={filterText}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <Skeleton
                                        sx={{ borderRadius: '8px' }}
                                        variant="rectangular"
                                        width="100%"
                                        height={60}
                                    />
                                )
                            }
                        />
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <List className="MiniList-balance">
                                {balances && balances.length > 0 ? (
                                    displayedOptions
                                        ?.slice((page - 1) * COUNT_PER_PAGE, page * COUNT_PER_PAGE)
                                        .map((item: MinimaToken, i) => (
                                            <TokenListItem key={item.tokenid} item={item} nav={true}></TokenListItem>
                                        ))
                                ) : (
                                    <>
                                        <Skeleton
                                            sx={{ borderRadius: '8px', mb: 1 }}
                                            variant="rectangular"
                                            width="100%"
                                            height={60}
                                        />
                                        <Skeleton
                                            sx={{ borderRadius: '8px', mb: 1 }}
                                            variant="rectangular"
                                            width="100%"
                                            height={60}
                                        />
                                        <Skeleton
                                            sx={{ borderRadius: '8px', mb: 1 }}
                                            variant="rectangular"
                                            width="100%"
                                            height={60}
                                        />
                                        <Skeleton
                                            sx={{ borderRadius: '8px', mb: 1 }}
                                            variant="rectangular"
                                            width="100%"
                                            height={60}
                                        />
                                        <Skeleton
                                            sx={{ borderRadius: '8px', mb: 1 }}
                                            variant="rectangular"
                                            width="100%"
                                            height={60}
                                        />
                                    </>
                                )}
                            </List>
                            {displayedOptions.length === 0 && filterText.length ? (
                                <Typography variant="caption">Token not found</Typography>
                            ) : null}
                        </CardContent>
                        {filterText.length === 0 && balances.length ? (
                            <CardActions
                                className="MiniBalanceActions"
                                sx={{ justifyContent: 'center', display: 'flex' }}
                            >
                                <AppPagination
                                    currentPage={currentPage}
                                    totalNFTs={balances.length}
                                    countPerPage={COUNT_PER_PAGE}
                                />
                            </CardActions>
                        ) : null}
                    </Card>
                }
            />
        </>
    );
};

export default Balance;
