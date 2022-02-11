import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import { Status as StatusType } from '../types/minima';
import { callCommand } from '../minima/rpc-commands';

const Status = () => {
    const [status, setStatus] = useState<StatusType | null>(null);

    useEffect(() => {
        callCommand('status').then((data: any) => {
            console.log(data);
        });
    }, []);

    return (
        <Grid container>
            <Grid item md={2}></Grid>
            <Grid item container md={8} spacing={2} mt={2}>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">{card}</Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">{card}</Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">{card}</Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">{card}</Card>
                </Grid>
            </Grid>
            <Grid item md={2}></Grid>
        </Grid>
    );
};

export default Status;

const bull = (
    <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
        •
    </Box>
);

const card = (
    <React.Fragment>
        <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Word of the Day
            </Typography>
            <Typography variant="h5" component="div">
                be{bull}nev{bull}o{bull}lent
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                adjective
            </Typography>
            <Typography variant="body2">
                well meaning and kindly.
                <br />
                {'"a benevolent smile"'}
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small">Learn More</Button>
        </CardActions>
    </React.Fragment>
);
