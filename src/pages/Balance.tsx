import {
    List,
    ListItemButton,
    Grid,
    Avatar,
    Typography,
    ListItemText,
    ListItemAvatar,
    Autocomplete,
    TextField,
    Pagination,
} from '@mui/material';

import useBalance from '../minima/useBalance';
import MinimaIcon from '../assets/images/minimaLogoSquare200x200.png';
import { MinimaToken } from '../types/minima';

import { useEffect, useState } from 'react';

const Balance = () => {
    const balance = useBalance();
    const [page, setPage] = useState<number>(1);
    const [filteredBalance, setFilteredBalance] = useState<MinimaToken[]>([]);

    console.log('balance', balance);

    useEffect(() => {
        setFilteredBalance(balance);
    }, [balance]);

    function handleInputChange(event: React.SyntheticEvent, value: string, reason: string) {
        if (value.length > 0) {
            // console.log(value);
            const suggestedData = balance.filter(
                (opt: MinimaToken) =>
                    (typeof opt.token === 'string' && opt.token.includes(value) ? true : false) ||
                    (typeof opt.token.name === 'string' && opt.token.name.includes(value) ? true : false) ||
                    (typeof opt.tokenid === 'string' && opt.tokenid.includes(value) ? true : false)
            );
            setFilteredBalance(suggestedData);
        } else {
            setFilteredBalance(balance);
        }
    }
    /** Pagination postponed */
    // function paginate(array: MinimaToken[], page_size: number, page_number: number) {
    //     // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    //     return setFilteredBalance(array.slice((page_number - 1) * page_size, page_number * page_size));
    // }

    return (
        <>
            <Grid container spacing={2} sx={{ marginTop: { xs: 0 } }}>
                <Grid item xs={0} md={2}></Grid>
                <Grid item xs={12} md={8}>
                    <Autocomplete
                        freeSolo
                        id="token-search"
                        onInputChange={handleInputChange}
                        disableClearable
                        options={filteredBalance.map((option: MinimaToken) =>
                            option.token.name ? option.token.name : option.token
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Search token"
                                InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                }}
                            />
                        )}
                    />
                    <List>
                        {filteredBalance && filteredBalance.length > 0 ? (
                            filteredBalance?.map((item, i) => (
                                <ListItemButton key={i} sx={{ marginBottom: 2 }}>
                                    <ListItemAvatar>
                                        <Avatar
                                            src={
                                                item.tokenid === '0x00'
                                                    ? MinimaIcon
                                                    : !item.token.icon || item.token.icon.length === 0
                                                    ? `https://robohash.org/${item.tokenid}`
                                                    : item.token.icon && item.token.icon
                                                    ? item.token.icon
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
                            ))
                        ) : (
                            <Typography variant="h6">No tokens found</Typography>
                        )}
                    </List>

                    {/* {filteredBalance.length && filteredBalance.length > 0 ? (
                        <Pagination
                            count={Math.ceil(balance.length / 10)}
                            color="primary"
                            page={page}
                            onChange={(event, val) => {
                                console.log(val);
                                setPage(val);
                                paginate(balance, 10, page);
                            }}
                        />
                    ) : null} */}
                </Grid>
                <Grid item xs={0} md={2}></Grid>
            </Grid>
        </>
    );
};

export default Balance;

const BalanceItem = () => {};
