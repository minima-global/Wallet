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
    CircularProgress,
} from '@mui/material';

import { useNavigate, Route, Routes, Outlet } from 'react-router-dom';
import MinimaIcon from '../assets/images/minimaLogoSquare200x200.png';
import { MinimaToken } from '../types/minima';

import { useEffect, useState } from 'react';
import { callBalance } from '../minima/rpc-commands';

import TokenDetails from './TokenDetails';

const Balance = () => {
    const [page, setPage] = useState<number>(1);
    const navigate = useNavigate();
    const [balance, setBalance] = useState<MinimaToken[]>([]);
    const [filteredBalance, setFilteredBalance] = useState<MinimaToken[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        callBalance()
            .then((data: any) => {
                setBalance(data.response);
                setFilteredBalance(data.response);
                setLoading(false);
            })
            .catch((err: Error) => {
                console.error(err);
                setFilteredBalance([]);
            });
        setLoading(false);
        return () => {};
    }, []);

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
            <Outlet />
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={0} md={2}></Grid>
                <Grid item xs={12} md={8}>
                    {loading ? (
                        <CircularProgress size={32} />
                    ) : (
                        <>
                            <Autocomplete
                                sx={{ marginBottom: 4 }}
                                freeSolo
                                id="token-search"
                                onInputChange={handleInputChange}
                                disableClearable
                                options={filteredBalance.map((option: MinimaToken) =>
                                    option.token.name ? option.token.name : option.token
                                )}
                                renderOption={(props, option) => {
                                    return (
                                        <li {...props} key={option + Math.random()}>
                                            {option}
                                        </li>
                                    );
                                }}
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
                                    filteredBalance?.map((item: MinimaToken, i) => (
                                        <ListItemButton
                                            key={item.tokenid}
                                            sx={{ marginBottom: 2 }}
                                            onClick={() => navigate('/tokendetails')}
                                        >
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
                                                            lineHeight: 1.3,
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
                        </>
                    )}

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

            {/* <Routes>
                <Route path=":id" element={<TokenDetails />}></Route>
            </Routes> */}
        </>
    );
};

export default Balance;
