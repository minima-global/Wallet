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
    createFilterOptions,
    Input,
} from '@mui/material';

import useBalance from '../minima/useBalance';
import MinimaIcon from '../assets/images/minimaLogoSquare200x200.png';
import { MinimaToken } from '../types/minima';

import { useEffect, useState } from 'react';

const Balance = () => {
    const balance = useBalance();
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
                                        primary={item.token.name ? item.token.name : item.token}
                                        secondary={item.confirmed}
                                        primaryTypographyProps={{ variant: 'h2', noWrap: true }}
                                        secondaryTypographyProps={{ variant: 'subtitle1' }}
                                    />
                                </ListItemButton>
                            ))
                        ) : (
                            <Typography variant="h6">No tokens found</Typography>
                        )}
                    </List>
                </Grid>
                <Grid item xs={0} md={2}></Grid>
            </Grid>
        </>
    );
};

export default Balance;

const BalanceItem = () => {};
