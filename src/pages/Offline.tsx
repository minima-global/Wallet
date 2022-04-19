import { Grid, Typography, Box } from '@mui/material';
import { FC } from 'react';

const Offline = () => {
    return (
        <Grid container mt={2} spacing={0}>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8} sx={{ textAlign: 'center' }}>
                <Typography variant="h6">
                    <Box component="div" sx={{ fontSize: 20 }}>
                        Oh no! 😥
                    </Box>{' '}
                    Your node is offline, please check its status and try reloading.
                </Typography>
                <Typography variant="h6">
                    Type{' '}
                    <Box
                        component="span"
                        sx={{ fontFamily: 'monospace', padding: '2.5px', backgroundColor: '#000', color: '#fff' }}
                    >
                        status
                    </Box>{' '}
                    command in your node's terminal, does it return true? If not, please open a ticket on discord.
                </Typography>
            </Grid>
        </Grid>
    );
};

export default Offline;
