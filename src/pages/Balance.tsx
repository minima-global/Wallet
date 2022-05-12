import { useContext, useState, memo } from 'react';
import {
    List,
    ListItemButton,
    Grid,
    Avatar,
    Typography,
    ListItemText,
    ListItemAvatar,
    TextField,
    CircularProgress,
    Card,
    CardContent,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import MinimaIcon from '../assets/images/minimaLogoSquare200x200.png';
import { MinimaToken } from '../types/minima';
import { BalanceUpdates } from '../App';
import { hexToString } from '../shared/functions';

const Balance = () => {
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState('');

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

    const TokenListItem = ({ item }: { item: MinimaToken }) => {
        return (
            <ListItemButton key={item.tokenid} sx={{ marginBottom: 2 }} onClick={() => navigate(`${item.tokenid}`)}>
                <ListItemAvatar>
                    <Avatar
                        src={
                            item.tokenid === '0x00'
                                ? MinimaIcon
                                : !item.token.url || item.token.url.length === 0
                                ? `https://robohash.org/${item.tokenid}`
                                : item.token.url && item.token.url.length > 0
                                ? hexToString(item.token.url)
                                : ''
                        }
                        alt={item.token.name ? item.token.name : item.token}
                    />
                </ListItemAvatar>
                <ListItemText
                    disableTypography
                    primary={
                        <Typography
                            variant="h2"
                            sx={{
                                textOverflow: 'ellipsis',
                                overFlowX: 'hidden',
                                overflow: 'hidden',
                                lineHeight: 1.3,
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 1,
                            }}
                        >
                            {item.token.name ? item.token.name : item.token}
                        </Typography>
                    }
                    secondary={
                        <Typography
                            sx={{
                                textOverflow: 'ellipsis',
                                overFlowX: 'hidden',
                                overflow: 'hidden',
                            }}
                            variant="subtitle1"
                        >
                            {item.confirmed}
                        </Typography>
                    }
                />
            </ListItemButton>
        );
    };

    return (
        <>
            <Grid container spacing={0} mt={2} mb={2}>
                <Grid item xs={0} md={2}></Grid>
                <Grid item xs={12} md={8} sx={{ textAlign: 'center' }}>
                    {loading ? (
                        <CircularProgress size={32} />
                    ) : (
                        <Card variant="outlined">
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <TextField
                                    placeholder="Search by name or tokenid"
                                    sx={{ marginBottom: 4 }}
                                    id="token-search"
                                    value={filterText}
                                    onChange={handleInputChange}
                                />
                                <List>
                                    {filteredBalance?.map((item: MinimaToken, i) => (
                                        <TokenListItem item={item}></TokenListItem>
                                    ))}
                                </List>
                                {filteredBalance.length === 0 ? (
                                    <Typography sx={{ textAlign: 'left' }} variant="h6">
                                        Token not found
                                    </Typography>
                                ) : null}
                            </CardContent>
                        </Card>
                    )}
                </Grid>
                <Grid item xs={0} md={2}></Grid>
            </Grid>
        </>
    );
};

export default Balance;
