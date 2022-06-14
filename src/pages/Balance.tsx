import { useContext, useState } from 'react';
import { List, Typography, TextField, Card, CardContent, CardActions, CardHeader } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { MinimaToken } from '../types/minima';
import { BalanceUpdates } from '../App';
import AppPagination from './components/AppPagination';
import GridLayout from './components/GridLayout';

import TokenListItem from './components/tokens/TokenListItem';

const Balance = () => {
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState('');

    // pagination
    const [page, setPage] = useState(1);
    const COUNT_PER_PAGE = 5;

    const getFilteredBalanceList = (balanceList: any[], filter: string) => {
        const suggestedData = balanceList.filter(
            (opt: MinimaToken) =>
                (typeof opt.token === 'string' && opt.token.toLowerCase().includes(filter.toLowerCase())
                    ? true
                    : false) ||
                (typeof opt.token !== 'string' && opt.token.name.toLowerCase().includes(filter.toLowerCase())
                    ? true
                    : false) ||
                (typeof opt.tokenid === 'string' && opt.tokenid.toLowerCase().includes(filter.toLowerCase())
                    ? true
                    : false)
        );
        return suggestedData;
    };

    const balances = useContext(BalanceUpdates);
    const loading = balances.length === 0;
    let filteredBalance = getFilteredBalanceList(balances, filterText);
    if (loading) {
        navigate('/offline');
    }

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
                loading={loading}
                children={
                    <Card variant="outlined">
                        <CardHeader
                            disableTypography
                            title={
                                <TextField
                                    fullWidth
                                    placeholder="Search by name or tokenid"
                                    id="token-search"
                                    value={filterText}
                                    onChange={handleInputChange}
                                />
                            }
                        ></CardHeader>
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <List className="MiniList-balance">
                                {filteredBalance
                                    ?.slice((page - 1) * COUNT_PER_PAGE, page * COUNT_PER_PAGE)
                                    .map((item: MinimaToken, i) => (
                                        <TokenListItem key={item.tokenid} item={item} nav={true}></TokenListItem>
                                    ))}
                            </List>
                            {filteredBalance.length === 0 ? (
                                <Typography sx={{ textAlign: 'left' }} variant="h6">
                                    Token not found
                                </Typography>
                            ) : null}
                        </CardContent>
                        {filterText.length === 0 ? (
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
