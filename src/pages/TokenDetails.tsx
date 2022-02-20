import { FC } from 'react';
import { Card, CardContent, Grid } from '@mui/material';

const TokenDetails: FC = () => {
    return (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={0} md={2}></Grid>
            <Grid item xs={12} md={8}>
                <Card>
                    <CardContent>Token Details</CardContent>
                </Card>
            </Grid>
            <Grid item xs={0} md={2}></Grid>
        </Grid>
    );
};

export default TokenDetails;
