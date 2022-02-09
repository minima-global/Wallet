import useBalance from '../minima/useBalance';
import { List, ListItemButton, Grid, Avatar, Typography, ListItemText, ListItemAvatar } from '@mui/material';
import MinimaIcon from '../assets/images/minimaLogoSquare200x200.png';

const Balance = () => {
    const balance = useBalance();

    console.log('balance', balance);

    return (
        <>
            <Grid container spacing={2} sx={{ marginTop: { xs: 0 } }}>
                <Grid item xs={0} md={2}></Grid>
                <Grid item xs={12} md={8}>
                    <List>
                        {balance && balance.length > 0 ? (
                            balance?.map((item, i) => (
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
                                            alt={item.token}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={item.token.name ? item.token.name : item.token}
                                        secondary={item.confirmed}
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
