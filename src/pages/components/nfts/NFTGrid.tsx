import { Grid } from '@mui/material';
const NFTGrid = ({ children }: any) => {
    return (
        <Grid container>
            <Grid xs={6} ml={12} item>
                {children}
            </Grid>
        </Grid>
    );
};

export default NFTGrid;
