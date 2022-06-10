import { CircularProgress, Grid } from '@mui/material';

const GridLayout = ({ children, loading }: any) => {
    return (
        <Grid container>
            <Grid item xs={0} md={2} />
            <Grid item xs={12} md={8} className="center">
                {!loading ? children : <CircularProgress size={32} />}
            </Grid>
            <Grid item xs={0} md={2} />
        </Grid>
    );
};

export default GridLayout;
