import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import { Stack, Typography } from '@mui/material';
const MiningCog = ({ isMining }: any) => {
    return (
        <Stack
            sx={{ display: isMining ? 'flex' : 'none' }}
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={1}
        >
            <Typography className="fade-in-fade-out" color="inherit" variant="caption">
                Mining TxPoW
            </Typography>
            <OfflineBoltIcon className="fade-in-fade-out" fontSize="medium" color="secondary" />
        </Stack>
    );
};

export default MiningCog;
