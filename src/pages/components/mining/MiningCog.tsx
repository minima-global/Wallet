import EngineeringIcon from '@mui/icons-material/Engineering';
import { Stack, Typography } from '@mui/material';
const MiningCog = ({ isMining }: any) => {
    return (
        <Stack
            sx={{ display: isMining ? 'flex' : 'none' }}
            direction="column"
            alignItems="center"
            justifyContent="flex-end"
        >
            <EngineeringIcon fontSize="small" color="secondary" />
            <Typography className="fade-in-fade-out" color="inherit" variant="caption">
                Mining...
            </Typography>
        </Stack>
    );
};

export default MiningCog;
