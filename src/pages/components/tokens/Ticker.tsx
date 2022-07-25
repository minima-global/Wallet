import { Typography } from '@mui/material';

const Ticker = ({ symbol }: any) => {
    return (
        <Typography variant="caption" sx={{ textTransform: 'uppercase' }}>
            <i>{symbol}</i>
        </Typography>
    );
};
export default Ticker;
