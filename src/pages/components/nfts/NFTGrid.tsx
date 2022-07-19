import { Stack } from '@mui/material';
const NFTGrid = ({ children }: any) => {
    return (
        <Stack direction="column" spacing={2}>
            {children}
        </Stack>
    );
};

export default NFTGrid;
