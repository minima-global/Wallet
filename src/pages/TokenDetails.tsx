import { FC, useEffect, useState } from 'react';
import { Card, CardContent, Grid } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { MinimaToken } from '../types/minima';
import { callBalance } from '../minima/rpc-commands';

const TokenDetails: FC = () => {
    useEffect(() => {
        console.log('Called TokenDetails useEffect');
    }, []);

    return (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8}>
                <Outlet />
            </Grid>
            <Grid item xs={0} md={2}></Grid>
        </Grid>
    );
};

export default TokenDetails;
