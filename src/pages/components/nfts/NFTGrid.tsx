import { Grid, Stack } from '@mui/material';
const NFTGrid = ({ children }: any) => {
    return (
        <Grid item xs={12} sm={6}>
            {children}
        </Grid>
    );
};

export default NFTGrid;
